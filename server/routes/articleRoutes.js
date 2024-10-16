const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/articleController');

router.post('/', ArticleController.createArticle);
router.get('/', ArticleController.getArticles);
router.get('/:id', ArticleController.getArticleById);
router.put('/:id', ArticleController.updateArticle);
router.delete('/:id', ArticleController.deleteArticle);

module.exports = router;
