const axios = require('axios')

module.exports = {

	// add message to queue
	addtoQueue: async function(name, message) {
		if (message.constructor !== Object || Object.entries(message).length === 0) {
			throw new Error('Invalid message provided')
		}

		let res = await axios({
			method: 'post',
			url: process.env.BASE_URL+"/queue/add",
			params: {
				queueName: name
			},
			data: {
				data: message
			}
		})
		return res.data
	},

	//fetch single message from queue
	fetchOne: async function(queueName, agentId) {

		let res = await axios({
			method: 'get',
			url: process.env.BASE_URL+"/queue/fetch",
			params: {
				queueName: queueName,
				agentId: agentId
			}
		})
		return res.data
	},

	//delete single message from queue
	delete: async function(queueName, agentId, _id) {
		
		let res = await axios({
			method: 'get',
			url: process.env.BASE_URL+"/queue/delete",
			params: {
				queueName: queueName,
				agentId: agentId,
				_id: _id
			}
		})
		return res.data
	}
}