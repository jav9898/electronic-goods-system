const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');


router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/user", userRoutes);

module.exports = router;