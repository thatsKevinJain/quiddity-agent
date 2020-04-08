module.exports = {

	/**
		To filter the results based on user passed query,
		we need to format the query params so that they match the format in DB.

		Example (If the query looks something like below) -
		Input -
		{
			foo: "bar",
			count: {$gt: 10}
		}

		The function will map the input and return the below - 
		Output - 
		{
			"payload.foo": "bar",
			"payload.count": {$gt: 10}
		}

		This is done because user messages are stored in "payload" object.
	*/
	getQueryParams: function(where) {
		var result = {}

		Object.keys(where).map(key => {
			result[`payload.${key}`] = where[key]
			return key
		})

		return result
	}
}