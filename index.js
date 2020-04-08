// export agent
var Queue = require('./lib/queue.js')

var fifo = new Queue("fifo", { 
	where: {
		email: "moksh@gmail.com"
	} 
})	

fifo.pull((message, done) => {
	console.log(message)
	done()
})

module.exports = Queue