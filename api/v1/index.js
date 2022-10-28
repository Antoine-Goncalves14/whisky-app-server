const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogpost');
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

router.get('/blog-posts', (req, res) => {
	BlogPost.find()
		.sort({ createdOn: -1 })
		.exec()
		.then((blogPost) => res.status(200).json(blogPost))
		.catch((err) =>
			res.status(500).json({
				message: 'blog posts not found :(',
				error: err,
			})
		);
});

// file upload configuration
const storage = multer.diskStorage({
	destination: './uploads/',
	filename: function(req, file, callback) {
		crypto.pseudoRandomBytes(16, function(err, raw) {
			if (err) return callback(err);
			callback(null, raw.toString('hex') + path.extname(file.originalname));
		});
	}
});

const upload = multer({storage: storage });

// file upload
router.post('/blog-posts/images', upload.single('blogimage'), (req, res) => {
	if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return res.status(400).json({ msg: 'only image files please !' });
	}
	res.status(201).send({ filename: req.file.filename, file: req.file });
});

router.get('/blog-posts/:id', (req, res) => {
	const id = req.params.id;
	BlogPost.findById(id)
		.then((blogPost) => res.status(200).json(blogPost))
		.catch((err) =>
			res.status(500).json({
				message: `blog post with id ${id} not found`,
				error: err,
			})
		);
});

router.post('/blog-posts', (req, res) => {
	console.log('req.body', req.body);
	const blogPost = new BlogPost(req.body);

	blogPost.save((err, blogPost) => {
		if (err) {
			return res.status(500).json(err);
		}

		res.status(201).json(blogPost);
	});
});

router.delete('/blog-posts/:id', (req, res) => {
	const id = req.params.id;
	BlogPost.findByIdAndDelete(id, (err, blogPost) => {
		if (err) {
			return res.status(500).json(err);
		}
		res.status(202).json({ msg: `blog post with id ${blogPost._id} deleted` });
	});
});

router.delete('/blog-posts', (req, res) => {
	const ids = req.query.ids;

	const allIds = ids.split(',').map((id) => {
		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			return mongoose.Types.ObjectId(id);
		} else {
			console.log('id is not valid', id);
		}
	});

	const condition = {
		_id: { $in: allIds },
	};
	BlogPost.deleteMany(condition, (err, result) => {
		if (err) {
			return res.status(500).json(err);
		}
		res.status(202).json(result);
	});
});

module.exports = router;
