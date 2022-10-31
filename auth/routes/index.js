const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/register', (req, res) => {
	console.log('user from req.body', req.body);
	const newUser = new User(req.body);

	newUser.save((err, user) => {
		if (err) {
			return res.status(500).json(err);
		}

		req.login(req.body, (err) => {
			if (err) {
				console.log('err in register | req.login()', err);
			}

			res.status(201).json(user);
		});
	});
});
