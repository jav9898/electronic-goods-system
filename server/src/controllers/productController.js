// server/src/controllers/productController.js
/*
const model = require('../models/productModel');

const productController = {
  readAllProduct: (req, res) => {
    model.getAllProducts((error, results) => {
      if (error) {
        console.error('❌ Error fetching products:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      return res.status(200).json(results);
    });
  },

  deleteProductById: (req, res) => {
    const rawId = req.params.productId;
    console.log('👉 DELETE /api/product/:productId', rawId);

    const productId = parseInt(rawId, 10);
    if (!productId || Number.isNaN(productId)) {
      console.error('❌ Invalid productId:', rawId);
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    model.deleteProductById({ productId }, (error, results) => {
      if (error) {
        console.error('❌ Error deleting product:', error.sqlMessage || error);
        return res.status(500).json({ message: 'Failed to delete product' });
      }
      if (results.affectedRows === 0) {
        console.warn('⚠️ Product not found:', productId);
        return res.status(404).json({ message: 'Product not found' });
      }
      console.log('✅ Deleted product:', productId);
      return res.status(200).json({ message: 'Product deleted successfully' });
    });
  },
};

module.exports = productController;
*/
// server/src/controllers/productController.js
const model = require('../models/productModel');

const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : def;
};

const productController = {
  readAllProduct: (req, res) => {
    const q = (req.query.q || '').trim();
    const sort = (req.query.sort || '').trim();
    const page = toInt(req.query.page, 1);
    const pageSize = Math.min(Math.max(toInt(req.query.pageSize, 12), 1), 50);
    const offset = (page - 1) * pageSize;

    model.getProducts({ q, sort, limit: pageSize, offset }, (err, rows) => {
      if (err) {
        console.error('❌ getProducts:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      model.countProducts({ q }, (err2, countRows) => {
        if (err2) {
          console.error('❌ countProducts:', err2);
          return res.status(500).json({ message: 'Internal server error' });
        }
        const total = countRows[0]?.total ?? 0;
        res.status(200).json({ items: rows, total, page, pageSize });
      });
    });
  },

  deleteProductById: (req, res) => {
    const id = parseInt(req.params.productId, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid product ID' });

    model.deleteProductById({ productId: id }, (err, result) => {
      if (err) {
        console.error('❌ deleteProductById:', err);
        return res.status(500).json({ message: 'Failed to delete product' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted' });
    });
  },

  deleteProductsBulk: (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number).filter(Number.isFinite) : [];
    if (!ids.length) return res.status(400).json({ message: 'No IDs provided' });

    model.deleteProductsBulk({ ids }, (err, result) => {
      if (err) {
        console.error('❌ deleteProductsBulk:', err);
        return res.status(500).json({ message: 'Failed to delete products' });
      }
      res.status(200).json({ message: 'Products deleted', deleted: result.affectedRows });
    });
  },
};

module.exports = productController;
