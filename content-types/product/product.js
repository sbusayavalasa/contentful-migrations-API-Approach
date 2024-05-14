// Contentful Managment API (CMA) using SDK approach
const contentful = require('contentful-management');
const fs = require('fs');
const { spaceId, accessToken, environmentId } = require('../../config/contentful.json');
const { productJson } = require('./product.json');

const client = contentful.createClient({
    accessToken
});

module.exports = async function updateProduct() {

    try {
        const space = await client.getSpace(spaceId);
        const environment = await space.getEnvironment(environmentId);

        // Reads the local JSON file
        const contentTypeDefinition = JSON.parse(fs.readFileSync('./content-types/product/product.json', 'utf8'));
        // Check for the current state of the content type
        let existingContentType = (await environment.getContentTypes()).items.find((contentType) => contentType.name === contentTypeDefinition.name);

        if (!existingContentType) {
            console.log("Create a content type if content type doesnt exists");
            existingContentType = await environment.createContentType(contentTypeDefinition);
        } else { // update the content type if new fields are added in the local JSON file
            console.log("Update the content type ", existingContentType.fields);
            existingContentType.fields = mergeFields(existingContentType.fields, contentTypeDefinition.fields);
            await existingContentType.update();
        }

        // Reads editor interface local JSON - appearance settings
        const editorInterfaceDefinition = JSON.parse(fs.readFileSync('./content-types/product/editor-interface.json', 'utf8'));
        // Check for the current state of editor interface or custom settings
        let editorInterface = await existingContentType.getEditorInterface();

        // Loop through the controls array of local JSON
        for (const field of editorInterfaceDefinition.controls) {
            console.log("Check for Fields", field);
            const control = editorInterface.controls.find(c => c.fieldId === field.fieldId);
            console.log("Check for control", control);
            if (control && control.widgetId !== field.widgetId) {
                console.log("Update the fields if there are new changes", control);
                control.widgetId = field.widgetId;
                control.widgetNameSpace = field.widgetNameSpace;
            }
        }

        await editorInterface.update();
        await existingContentType.publish();
        console.log('Updated product content type');
    } catch (error) {
        console.error('Error', error.message);
    }
};

// This function checks and compares the current state fields and the new fields and will update the content type accordingly
function mergeFields(existingFields, newFields) {
    console.log("Merge fields", existingFields, newFields);
    const fieldMap = new Map(existingFields.map(field => [field.id, field]));
    
    newFields.forEach(field => {
        // Add new field if it doesn't exists
        if (!fieldMap.has(field.id)) {
            existingFields.push(field);
        } else {
            // Update existing fields
            let existingField = fieldMap.get(field.id);
            Object.assign(existingField, field);
        }
    });

    return existingFields;
}