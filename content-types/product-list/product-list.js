const contentful = require('contentful-management');
const { spaceId, accessToken } = require('../../config/contentful.json');

const client = contentful.createClient({
    accessToken
});

module.exports = async function createProductListContentType() {
    const productList = {
        name: 'Test Product List',
        fields: [
            {id: 'sid', name: 'SID', type: 'Symbol'},
            {id: 'products', name: 'Products', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [
                {
                  linkContentType: [
                    'product'
                  ]
                }
              ]}},
        ]
    };

    try {
        const space = await client.getSpace(spaceId);
        const env = await space.getEnvironment('dev');
        const contentTypes = await env.getContentTypes();
        const existingProductContentType = contentTypes.items.find(type => type.name === productList.name);
        // Check if Test Product content type exists
        if (existingProductContentType) {
            console.log("Test Product List content type already exists", existingProductContentType);
            return;
        } else {
            // create Test Product List content type if doesn't exists
            const contentType = await env.createContentType(productList);
            console.log('Test Product List Content Type created', contentType);
        }
    } catch (error) {
        console.error('Error creating Test Product List content type', error)
    }
}