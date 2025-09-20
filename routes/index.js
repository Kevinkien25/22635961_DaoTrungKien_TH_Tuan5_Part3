const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

router.get('/', async(req, res) => {
    const suppliers = await Supplier.find().lean();
    const products = await Product.find().populate('supplier').lean();
    res.render('index', { suppliers, products, msg: null, query: '' });
});

router.get('/search', async(req, res) => {
    const q = req.query.q || '';
    const supplierFilter = req.query.supplier || '';
    const query = { name: { $regex: q, $options: 'i' } };
    if (supplierFilter) query.supplier = supplierFilter;
    const suppliers = await Supplier.find().lean();
    const products = await Product.find(query).populate('supplier').lean();
    res.render('index', { suppliers, products, msg: null, query: q });
});

module.exports = router;