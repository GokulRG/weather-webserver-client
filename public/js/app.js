console.log('Client side JS is printed...');

fetch('http://puzzle.mead.io/puzzle').then((response) => {
	response.json().then((data) => {
		console.log(data);
	});
});

const weatherForm = document.querySelector('form');
const addressBar = document.querySelector('input');
const messageOne = document.querySelector('#messageOne');
const messageTwo = document.querySelector('#messageTwo');

resetFields = () => {
	messageOne.textContent = '';
	messageTwo.textContent = '';
};

weatherForm.addEventListener('submit', (event) => {
	event.preventDefault();
	resetFields();

	const address = addressBar.value;
	messageOne.textContent = 'Loading...';

	fetch(`/weather?address=${address}`).then((response) => {
		response.json().then((data) => {
			if (data.errors) {
				messageOne.textContent = data.errors[0];
				return;
			}

			messageOne.textContent = `Location : ${data.location}`;
			messageTwo.textContent = `Forecast: ${data.forecast} Weather Information : ${data.weather}`;
		});
	});
});
