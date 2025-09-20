const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
//
exports.index = async(req, res) => {
    try {
        const products = await Product.find().populate('supplier');
        const msg = req.query.msg || null;
        res.render('products/index', { products, msg });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.newForm = async(req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.render('products/new', { suppliers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.create = async(req, res) => {
    try {
        const { name, price, supplier } = req.body;
        await Product.create({ name, price, supplier });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.editForm = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const suppliers = await Supplier.find();
        if (!product) return res.status(404).send('Not found');
        res.render('products/edit', { product, suppliers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.update = async(req, res) => {
    try {
        const { name, price, supplier } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, price, supplier });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.delete = async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        const referer = req.get('referer') || '/';
        const sep = referer.includes('?') ? '&' : '?';
        res.redirect(`${referer}${sep}msg=Product+deleted`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// exports.index = async(req, res) => {
//     const products = await Product.find().populate('supplierId');
//     res.render('products/index', { products });
// };

// exports.newForm = async(req, res) => {
//     const suppliers = await Supplier.find();
//     res.render('products/new', { suppliers });
// };

// exports.create = async(req, res) => {
//     await Product.create(req.body);
//     res.redirect('/products');
// };

// exports.editForm = async(req, res) => {
//     const product = await Product.findById(req.params.id);
//     const suppliers = await Supplier.find();
//     res.render('products/edit', { product, suppliers });
// };

// exports.update = async(req, res) => {
//     await Product.findByIdAndUpdate(req.params.id, req.body);
//     res.redirect('/products');
// };

// exports.delete = async(req, res) => {
//     await Product.findByIdAndDelete(req.params.id);
//     res.redirect('/products');
// };