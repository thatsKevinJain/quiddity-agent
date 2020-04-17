const { v1: uuidv1 } = require('uuid')
const Api = require('./api.js')

const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 120000

class Queue{

	constructor(queueName, where = {}){
		this.queueName = queueName
		this.agentId = uuidv1()
		this.where = where
	}


	/*
		Push the payload into queue
	*/
	async push(payload = {}) {
		const res = await Api.add(this.queueName, payload)
		return res
	}



	/*
		Fetch a payload from queue, delete the message after done() is called.
		If there are no messages left in the queue, continuously poll the server after POLLING_INTERVAL (in ms)
	*/
	async pull(cb){
		try {
			const message = await Api.fetch(this.queueName, this.agentId, this.where)

			if (Object.entries(message).length === 0) {
				console.log({ message: "No more messages left in the queue" })
			}

			async function done(err) {
				try {
					/*
						Delete the message as it has finished processing,
						empty messages will not have _id thus will be skipped
					*/
					if (!err && message && message._id)
						await Api.delete(this.queueName, this.agentId, message._id)
				}
				catch(error) {
					console.log(error)
				}
				finally {
					/**
						If there are no messages left, wait for POLLING_INTERVAL
						and start polling for messages again
					*/
					if(message && Object.entries(message).length === 0){
						const poll = function() { this.pull(cb) }
						setTimeout(poll.bind(this), POLLING_INTERVAL)
					}
					else
						this.pull(cb)
				}
			}

			/**
				Attach the message payload and a callback function
				that will delete the message when it has done processing.
			*/
			cb((message && message.payload) ? message.payload : {}, done.bind(this))
		}
		catch(err) {

			console.log(err)
			/**
				If there are no messages left, wait for POLLING_INTERVAL
				and start polling for messages again
			*/
			if(message && Object.entries(message).length === 0){
				const poll = function() { this.pull(cb) }
				setTimeout(poll.bind(this), POLLING_INTERVAL)
			}
			else
				this.pull(cb)
		}

	/*
		Delete all messages from the queue
	*/
	async purge() {
		const res = await Api.purge(this.queueName)
		return res
	}

	/*
		Fetch dead messages from queue
	*/
	async fetchDeadQueue() {
		const res = await Api.fetchDeadQueue(this.queueName)
		return res
	}
}

module.exports = Queue