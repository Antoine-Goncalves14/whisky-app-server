const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogpost');

router.get('/blog-posts', (req, res) => {
	const posts = [
		{
			id: 1,
			title: 'Etre programmeur ça pique parfois !',
			subTitle: 'ce cactus est pas là pour rien',
			image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
			content: 'Je n\'ai rien à dire pour l\'instant.',
		},
		{
			id: 2,
			title: 'Un nouveau framework JS',
			subTitle: 'encore ?!',
			image: 'https://fakeimg.p1/300/?text-frameworks',
			content: 'Ca en fait 1 par semaine. On va pas tenir le rythme.',
		},
		{
			id: 3,
			title: 'Vive le vanilla JavaScript',
			subTitle: 'encore ?!',
			image: 'https://fakeimg.p1/300/?text=JS',
			content: 'Là au moins, on est sûr que ça va durer',
		}
	];
	res.status(200).json(posts);
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

module.exports = router;