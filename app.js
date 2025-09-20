require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const Supplier = require('./models/Supplier'); // added
const Product = require('./models/Product'); // added

// Swagger setup (optional)
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
// load swagger yaml
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// DB connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.get('/', async(req, res) => {
    try {
        const suppliers = await Supplier.find();
        const products = await Product.find().populate('supplier');
        const msg = req.query.msg || null;
        res.render('index', { suppliers, products, msg });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));