const express = require('express');
const app = express();
const api = require('./api/v1/index');
const cors = require('cors');

app.set('port', (process.env.port || 3000));

app.use(cors());
app.use('/api/v1', api);

app.listen(app.get('port'), () => {
	console.log(`Express server listening on port ${app.get('port')}`);
});