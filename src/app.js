const express = require('express');
const path = require('path');
const hbs = require('hbs');
const getLatLongForAGivenLocation = require('./utils/geocode');
const getWeatherInformationForAGivenLatLong = require('./utils/weather');

const app = express();
const port = process.env.PORT || 3000;

// To serve up static files
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, './templates/views');

// Partials as the name suggests forms a part of a whole web-page. Something like a header/footer
// can be called as a partial.
const partialsPath = path.join(__dirname, './templates/partials');

// Set up handlebar view engine
app.set('view engine', 'hbs');

//If we wanted our views to be in another directory instead of 'views' we need to change the name of the
// directory and configure the path
app.set('views', viewsPath);

// Register partials
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

// Using hbs to render our view -- Root
app.get('', (req, res) => {
	// You can also pass in values from node to hbs
	res.render('index', {
		title: 'Weather App',
		author: 'Gokul'
	});
});

// About Page - HBS
app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Page',
		author: 'Gokul'
	});
});

// Help Page - HBS
app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help Page',
		author: 'Gokul',
		helpMessage: "Please fill in the location information in the search box. The application will return the weather of the topmost item that matched with your search term. If the weather information was returned for a location that you didn't intend to search for, try entering the complete address of the location."
	});
});

// app.com/weather -- Static JSON
app.get('/weather', (req, res) => {

	if (!req.query.address) {
		return res.send({errors: ['You must provide an address']});
	}

	getLatLongForAGivenLocation(req.query.address, ({ results, errors }) => {
		if (errors) {
			return res.send({ errors });
		}

		const location = results.placeName;

		getWeatherInformationForAGivenLatLong(results.latitude, results.longitude, ({ results, errors }) => {
			if (errors) {
				return res.send({ errors });
			}

			return res.send({
				location,
				forecast: results.summary,
				weather: `It is currently ${results.temperature}°C with ${results.precipProbability}% chance of rain with a high of ${results.dayHigh}°C and a low of ${results.dayLow}°C`
			});
		});
	});
});

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send('Please provide a query to search!');
	}
	res.send({
		products: []
	});
});

app.get('/help/*', (req, res) => {
	res.render('404page', {
		message: "The help section that you're looking for cannot be found",
		author: 'Gokul',
		title: '404 : Not Found'
	});
});

app.get('*', (req, res) => {
	res.render('404page', {
		message: 'Page Not Found',
		author: 'Gokul',
		title: '404 : Not Found'
	});
});

// The app.listen method actually starts the server and you can also pass in a callback method
// that runs when the server starts up
app.listen(port, () => {
	console.log(`Express server is up and running on port ${port}.....`);
});
