const request = require('request');

const getWeatherInformationForAGivenLatLong = (latitude, longitude, callback) => {
	const url = `https://api.darksky.net/forecast/aff8899e754ded694777c24ab2f114f8/${latitude},${longitude}?units=si`;

	request(url, { json: true }, (error, {body}) => {
		if (error) {
			callback({ errors: [ 'Unable to fetch weather information' ], results: null });
			return;
		}

		if (body.error) {
			callback({ errors: [ `${body.error}` ], results: null });
			return;
        }
        
        const {currently, daily} = body;

		callback({
			results: {
				summary: daily.data[0].summary,
				temperature: currently.temperature,
				precipProbability: currently.precipProbability
			},
			errors: null
		});
	});
};

module.exports = getWeatherInformationForAGivenLatLong;
