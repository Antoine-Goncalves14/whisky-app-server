const express = require('express');
const app = express();
const api = require('./api/v1/index');
const cors = require('cors');

const mongoose = require('mongoose');
const connection = mongoose.connection;

app.set('port', (process.env.port || 3000));

app.use(cors());
app.use('/api/v1', api);

mongoose.connect('mongodb://localhost:27017/whiskyapp', { useNewUrlParser: true });
connection.on('error', (err) => {
	console.error(`connection to MongoDB error: ${err.message}`);
});

connection.once('open', () => {
	console.log('Connected to MongoDB');

	app.listen(app.get('port'), () => {
		console.log(`Express server listening on port ${app.get('port')}`);
	});
});