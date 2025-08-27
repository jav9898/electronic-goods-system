const pool = require('../services/db');

const productModel = {
  // List with search/sort/pagination
  getProducts: ({ q, sort, limit, offset }, cb) => {
    const where = [];
    const params = [];

    if (q && q.trim()) {
      where.push('(p.name LIKE ? OR p.brand LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    const orderBy =
      sort === 'name_asc' ? 'p.name ASC' :
      sort === 'name_desc' ? 'p.name DESC' :
      sort === 'brand_asc' ? 'p.brand ASC' :
      sort === 'brand_desc' ? 'p.brand DESC' :
      sort === 'oldest' ? 'p.productID ASC' :
      'p.productID DESC'; // newest default

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const SQL = `
      SELECT
        p.productID AS id,
        p.name,
        p.brand,
        p.description,
        p.categoryID,
        p.imageURL
      FROM product p
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?;
    `;

    params.push(limit, offset);
    pool.query(SQL, params, cb);
  },

  countProducts: ({ q }, cb) => {
    const where = [];
    const params = [];
    if (q && q.trim()) {
      where.push('(name LIKE ? OR brand LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const SQL = `SELECT COUNT(*) AS total FROM product ${whereSql};`;
    pool.query(SQL, params, cb);
  },

  deleteProductById: ({ productId }, cb) => {
    const SQL = `DELETE FROM product WHERE productID = ?;`;
    pool.query(SQL, [productId], cb);
  },

  // Bulk delete
  deleteProductsBulk: ({ ids }, cb) => {
    if (!ids?.length) return cb(null, { affectedRows: 0 });
    const SQL = `DELETE FROM product WHERE productID IN (?);`;
    pool.query(SQL, [ids], cb);
  }
};

module.exports = productModel;
