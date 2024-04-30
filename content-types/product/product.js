const contentful = require('contentful-management');
const { spaceId, accessToken } = require('../../config/contentful.json');

const client = contentful.createClient({
    accessToken
});

module.exports = async function createProductContentType() {
    const product = {
        name: 'Test Product',
        fields: [
            {id: 'name', name: 'Name', type: 'Symbol'},
            {id: 'title', name: 'Title', type: 'Symbol'},
            {id: 'description', name: 'Description', type: 'RichText'},
            {id: 'price', name: 'Price', type: 'Number'},
            {id: 'catalog', name: 'Catalog', type: 'Symbol'},
        ]
    };

    try {
        const space = await client.getSpace(spaceId);
        const env = await space.getEnvironment('dev');
        const contentTypes = await env.getContentTypes();
        const existingProductContentType = contentTypes.items.find(type => type.name === product.name);
        // Check if Test Product content type exists
        if (existingProductContentType) {
            console.log("Product content type already exists", existingProductContentType);
            return;
        } else {
            // create Test Product content type if doesn't exists
            const contentType = await env.createContentType(product);
            console.log('Test Product Content Type created', contentType);
        }
    } catch (error) {
        console.error('Error creating Test Product content type', error)
    }
}