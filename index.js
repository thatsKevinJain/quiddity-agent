require('dotenv').config()
var Queue = require('./lib/queue.js')

var sq = new Queue('SimpleQueue')

sq.execute((message, done) => {
	console.log(message)
	done()
})