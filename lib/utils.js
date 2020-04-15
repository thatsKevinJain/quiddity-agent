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

			/* 
				If the key contains special characters like "$" at index 0, pass them as is
				This is done to ensure that special MongoDB operators ($or, $and, etc.) work as expected
			*/
			const special = key.match(/\$/,"i")
			if(special && special.index == 0){
				result[key] = where[key]
				return key
			}
			
			result[`payload.${key}`] = where[key]
			return key
		})

		return result
	}
}