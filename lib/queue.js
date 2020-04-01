const Api = require('./api.js')

const Queue = function Queue(queueName) {
	this.queueName = queueName
	this.agentId = "moksh1234"
}

Queue.prototype.push = function(message) {
	Api.addtoQueue(this.queueName, message)
		.then(data => {
			return data
		})
		.catch(err => console.log(err))
}

Queue.prototype.execute = async function(cb) {
	
	try {
		let message = await Api.fetchOne(this.queueName, this.agentId)

		let done = async function() {
			let res = await Api.delete(this.queueName, this.agentId, message._id)

			//recursively call execute
			this.execute(cb)
		}

		//execute callback
		cb(message.data, done.bind(this))

	} catch(err) {
		let temp = function() { this.execute(cb) }
		setTimeout(temp.bind(this), 120000)
	}
}

module.exports = Queue