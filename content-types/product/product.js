const contentful = require('contentful-management');
const { spaceId, accessToken } = require('../../config/contentful.json');

const client = contentful.createClient({
    accessToken
});

module.exports = async function createorUpdateProductContentType() {
    // Define all new fields
    const createFields = [
        { id: 'name', name: 'Name', type: 'Symbol' },
        { id: 'title', name: 'Title', type: 'Symbol' },
        { id: 'description', name: 'Description', type: 'RichText' },
        { id: 'price', name: 'Price', type: 'Number' },
        { id: 'catalog', name: 'Catalog', type: 'Symbol' },
    ]

    const product = {
        name: 'Test Product',
        fields: createFields
    };

    try {
        const space = await client.getSpace(spaceId);
        const env = await space.getEnvironment('dev');
        const contentTypes = await env.getContentTypes();
        // Check if the content type already exists
        const productContentTypeExits = contentTypes.items.find(type => type.name === product.name);

        // Check if Test Product content type exists
        if (!productContentTypeExits) {
            // create Test Product content type if doesn't exists
            const productContentType = await env.createContentType(product);
            console.log('Test Product Content Type created', productContentType);
        } else {
            // If Test Product content type exists update the field if its not existing
            console.log("Product content type already exists", productContentTypeExits);
            const getContentType = await env.getContentType('2LAWdvh5aKn7BZagpehJJ0');

            // Define all new updated fields
            const updateFields = [
                { id: 'newField', name: 'New Field', type: 'Symbol' }
            ]

            updateFields.forEach(async (updateField) => {
                // Check if the field already exits in the Test Product content type
                const fieldExists = getContentType.fields.some(field => field.id === updateField.id);
                // Add the new field if field doesnt exists
                if (!fieldExists) {
                    getContentType.fields.push(updateField);
                } else {
                    console.log(`Field "${updateField.id}" already exists`);
                }
            });
            const updateContentType = await getContentType.update();
            console.log("Test Product content type updated", updateContentType);
        }
    } catch (error) {
        console.error('Error creating Test Product content type', error)
    }
}