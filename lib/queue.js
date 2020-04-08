// npm modules
const { v1: uuidv1 } = require('uuid');
const Api = require('./api.js')


/*
	Class Queue - to perform quiddity actions

	@constructor 		queueName, options
	@return 			Queue object
*/
var Queue = function Queue(queueName, options) {
	this.queueName = queueName
	this.agentId = uuidv1()
	this.where = options != undefined ?  options.where : {}
}


/*
	Push the message into queue - 

	Function

	@param 		message	(payload)
	@return 	promise
*/
Queue.prototype.push = async function(message) {
	let res = await Api.addtoQueue(this.queueName, message)
	return res.data
}


/*
	Continuous polling from the queue (fetch and delete)- 

	Function

	@param 		callback	(function provided by user)
	@return 	promise
*/
Queue.prototype.pull = async function(cb) {
	
	try {
		let message = await Api.fetchOne(this.queueName, this.agentId, this.where)

		if (Object.entries(message).length === 0) {
			// start polling after 2 mins
			throw { err: "No more messages left in the queue" }
		}

		async function done(err) {
			try {
				if (!err)
					await Api.delete(this.queueName, this.agentId, message._id)
			}
			catch(error) {}
			finally {
				// next poll
				this.pull(cb)
			}
		}

		//execute callback
		cb(message.payload, done.bind(this))

	} catch(err) {
		console.log(err)

		let temp = function() { this.pull(cb) }
		setTimeout(temp.bind(this), 120000)
	}
}

module.exports = Queue