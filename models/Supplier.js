const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String
});

module.exports = mongoose.model('Supplier', supplierSchema);