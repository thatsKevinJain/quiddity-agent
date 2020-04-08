// All utility functions
module.exports = {

	// function to convert where object
	getWhereClause: function(obj) {
		var result = {}
		Object.keys(obj).forEach(ele => {
			result[`payload.${ele}`] = obj[ele]
		})

		return result
	},
	
}