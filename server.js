var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var CONFIG = {
	URL: 'localhost',
	PORT: 3000,
	ROOT: 'serverData'
};
Object.freeze(CONFIG);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min; 
}

var data = [
	{
		id: 't-1',
		value: random(0, 100),
		isWorking: true,
		isOn: true
	}, {
		id: 't-2',
		value: random(0, 100),
		isWorking: false,
		isOn: false
	}, {
		id: 't-3',
		value: random(0, 100),
		isWorking: true,
		isOn: false
	}
];

app.get('/api/temperatures', function (req, res) {
	res.send(data);
});

app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});

app.listen(CONFIG.PORT);

console.log('Sample API and data server is running on ' + CONFIG.URL + ':' + CONFIG.PORT);