const Supplier = require('../models/Supplier');

exports.index = async(req, res) => {
    const suppliers = await Supplier.find().lean();
    res.render('suppliers/index', { suppliers, msg: req.query.msg || null });
};

exports.newForm = (req, res) => res.render('suppliers/new');

exports.create = async(req, res) => {
    const { name, phone, address } = req.body;
    await Supplier.create({ name, phone, address });
    res.redirect('/suppliers?msg=Supplier+created');
};

exports.editForm = async(req, res) => {
    const supplier = await Supplier.findById(req.params.id).lean();
    if (!supplier) return res.status(404).send('Not found');
    res.render('suppliers/edit', { supplier });
};

exports.update = async(req, res) => {
    const { name, phone, address } = req.body;
    await Supplier.findByIdAndUpdate(req.params.id, { name, phone, address });
    res.redirect('/suppliers?msg=Supplier+updated');
};

exports.delete = async(req, res) => {
    await Supplier.findByIdAndDelete(req.params.id);
    res.redirect('/suppliers?msg=Supplier+deleted');
};

// exports.index = async(req, res) => {
//     const suppliers = await Supplier.find();
//     res.render('suppliers/index', { suppliers });
// };

// exports.newForm = (req, res) => {
//     res.render('suppliers/new');
// };

// exports.create = async(req, res) => {
//     await Supplier.create(req.body);
//     res.redirect('/suppliers');
// };

// exports.editForm = async(req, res) => {
//     const supplier = await Supplier.findById(req.params.id);
//     res.render('suppliers/edit', { supplier });
// };

// exports.update = async(req, res) => {
//     await Supplier.findByIdAndUpdate(req.params.id, req.body);
//     res.redirect('/suppliers');
// };

// exports.delete = async(req, res) => {
//     await Supplier.findByIdAndDelete(req.params.id);
//     res.redirect('/suppliers');
// };