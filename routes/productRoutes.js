const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { ensureAuth } = require('../middleware/auth');

router.get('/', productController.index);
router.get('/new', ensureAuth, productController.newForm);
router.post('/', ensureAuth, productController.create);
router.get('/:id/edit', ensureAuth, productController.editForm);
router.put('/:id', ensureAuth, productController.update);
router.delete('/:id', ensureAuth, productController.delete);

module.exports = router;