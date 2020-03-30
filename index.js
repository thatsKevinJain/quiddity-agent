//npm modules
const axios = require('axios')
const baseUrl = "http://localhost:3000"

function QuiddityAgent(queueName) {
	this.queueName = queueName
	this.agentId = "moksh1234"
}

QuiddityAgent.prototype.execute = async function(cb) {
	var obj = this
	try {
		let message = await this.fetchMessage()
		cb(message, function() {

			axios.get(`${baseUrl}/queue/delete?queueName=${obj.queueName}&agentId=${obj.agentId}&_id=${message._id}`)
			.then(res => {
				console.log(res.data)
			})
			.catch(err => console.log(err))
		})

	} catch (err) {
		console.log(err)
	}

}

QuiddityAgent.prototype.fetchMessage = async function() {
	let res = await axios.get(`${baseUrl}/queue/fetch?queueName=${this.queueName}&agentId=${this.agentId}`)
	return res.data
}

let agent = new QuiddityAgent('SimpleQueue')
agent.execute((message, done) => {
	console.log(message)
	done()
})