const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { ensureAuth } = require('../middleware/auth');

router.get('/', supplierController.index);
router.get('/new', ensureAuth, supplierController.newForm);
router.post('/', ensureAuth, supplierController.create);
router.get('/:id/edit', ensureAuth, supplierController.editForm);
router.put('/:id', ensureAuth, supplierController.update);
router.delete('/:id', ensureAuth, supplierController.delete);

module.exports = router;