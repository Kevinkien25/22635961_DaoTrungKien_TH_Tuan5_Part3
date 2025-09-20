const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

exports.index = async(req, res) => {
    const products = await Product.find().populate('supplier').lean();
    res.render('products/index', { products, msg: req.query.msg || null });
};

exports.newForm = async(req, res) => {
    const suppliers = await Supplier.find().lean();
    res.render('products/new', { suppliers });
};

exports.create = async(req, res) => {
    const { name, price, quantity, supplier } = req.body;
    await Product.create({ name, price: price || 0, quantity: quantity || 0, supplier: supplier || null });
    res.redirect('/products?msg=Product+created');
};

exports.editForm = async(req, res) => {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).send('Not found');
    const suppliers = await Supplier.find().lean();
    res.render('products/edit', { product, suppliers });
};

exports.update = async(req, res) => {
    const { name, price, quantity, supplier } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price: price || 0, quantity: quantity || 0, supplier: supplier || null });
    res.redirect('/products?msg=Product+updated');
};

exports.delete = async(req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products?msg=Product+deleted');
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