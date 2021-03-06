const axios = require('axios')

const QUIDDITY_URL = process.env.QUIDDITY_URL || process.env.REACT_APP_QUIDDITY_URL || "http://localhost:3000"

module.exports = {

	// Add a single message to queue //
	add: async function(queueName, message) {
		if (message.constructor !== Object || Object.entries(message).length === 0) {
			throw new Error('Payload should not be an empty JSON Object')
		}

		const res = await axios({
			method: 'post',
			url: QUIDDITY_URL + "/queue/add",
			params: {
				queueName: queueName
			},
			data: message
		})
		return res.data
	},

	// Fetch single message from queue //
	fetch: async function(queueName, agentId, where = {}) {

		/**
			User can also pass a "where" clause which can filter queue
			messages based on query params passed.

			User can pass basic MongoDB "find" query parameters.
			Check the documentation to understand how you can use this feature.
			 - https://docs.mongodb.com/manual/reference/method/db.collection.find/#definition
		*/

		const res = await axios({
			method: 'post',
			url: QUIDDITY_URL + "/queue/fetch",
			params: {
				queueName: queueName,
				agentId: agentId
			},
			data: {
				where: where
			}
		})
		return res.data
	},

	// Delete single message from queue //
	delete: async function(queueName, agentId, _id) {
		
		const res = await axios({
			method: 'get',
			url: QUIDDITY_URL + "/queue/delete",
			params: {
				queueName: queueName,
				agentId: agentId,
				_id: _id
			}
		})
		return res.data
	},

	// Delete all messages from the queue //
	purge: async function(queueName) {
		
		const res = await axios({
			method: 'get',
			url: QUIDDITY_URL + "/queue/purge",
			params: {
				queueName: queueName
			}
		})
		return res.data
	},

	/*
		Fetch all dead messages from the queue

		Messages that are processed upto the allowed limit (MAX_PROCESS_COUNT) end up here,
		they are also those messages that are not acknowledged due to
		reasons like heavy processing time, failure of agent/worker, network failure, etc.
	*/
	fetchDeadQueue: async function(queueName) {
		
		const res = await axios({
			method: 'get',
			url: QUIDDITY_URL + "/queue/fetchDead",
			params: {
				queueName: queueName
			}
		})
		return res.data
	}
}