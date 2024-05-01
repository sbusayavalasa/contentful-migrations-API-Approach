const createorUpdateProductContentType = require('./content-types/product/product');
const createProductListContentType = require('./content-types/product-list/product-list');

// Run content type creation scripts
createorUpdateProductContentType();
createProductListContentType();