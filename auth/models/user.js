const mongoose = require('mongoose');

const userSchema = new mongoose.userSchema({
	username: { type: String, require: true },
	password: { type: String, require: true },
	createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
