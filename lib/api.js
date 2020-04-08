const axios = require('axios')
const utils = require('./utils.js')

module.exports = {

	// Add simgle message to queue
	addtoQueue: async function(name, message) {
		if (message.constructor !== Object || Object.entries(message).length === 0) {
			throw new Error('Payload provide should be Object')
		}

		let res = await axios({
			method: 'post',
			url: process.env.BASE_URL+"/queue/add",
			params: {
				queueName: name
			},
			data: {
				payload: message
			}
		})
		return res.data
	},

	// Fetch single message from queue
	fetchOne: async function(queueName, agentId, where) {

		where = utils.getWhereClause(where)

		let res = await axios({
			method: 'post',
			url: process.env.BASE_URL+"/queue/fetch",
			params: {
				queueName: queueName,
				agentId: agentId
			},
			data: {
				where: where ? where:{}
			}
		})
		return res.data
	},

	// Delete single message from queue
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
	},

	/*requeue: async function(queueName, _id) {

		let res = await axios({
			method: 'get',
			url: process.env.BASE_URL+"/queue/requeue",
			params: {
				queueName: queueName,
				_id: _id
			}
		})
		return res.data	
	}*/
}