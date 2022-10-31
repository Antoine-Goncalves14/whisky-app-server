const express = require('express');
const app = express();
const api = require('./api/v1/index');
const auth = require('./auth/routes');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const connection = mongoose.connection;

app.set('port', process.env.port || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// passport
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Strategy = require('passport-local').Strategy;
const User = require('./auth/models/user');

app.use(cookieParser());
app.use(
	session({
		secret: 'my super secret',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((user, cb) => {
	cb(null, user);
});

passport.use(new Strategy({
	usernameField: 'username',
	passwordField: 'password',
}, (name, pwd, cb) => {
	User.findOne({ username: name }, (err, user) => {
		if (err) {
			console.error(`could not find ${name} in MongoDB`, err);
		}

		if (user.password !== pwd) {
			console.log(`wrong password for ${name}`);
		} else {
			console.log(`${name} found in MongoDB and authenticated`);
			cb(null, user);
		}
	});
}));

const uploadsDir = require('path').join(__dirname, '/uploads');
app.use(express.static(uploadsDir));

app.use('/api/v1', api);

app.use('/auth', auth);

app.use((req, res) => {
	const err = new Error('404 - Not Found !');
	err.status = 404;
	res.json({ msg: '404 - Not Found !!', err: err });
});

mongoose.connect('mongodb://localhost:27017/whiskyapp', {
	useNewUrlParser: true,
});
connection.on('error', (err) => {
	console.error(`connection to MongoDB error: ${err.message}`);
});

connection.once('open', () => {
	console.log('Connected to MongoDB');

	app.listen(app.get('port'), () => {
		console.log(`Express server listening on port ${app.get('port')}`);
	});
});
