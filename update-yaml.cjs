const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const dir = '/Users/khushishah/docs/src/contents/orchestration';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.yaml'));

let totalHrefRemoved = 0;
let totalLeadRemoved = 0;
let totalCodeRemoved = 0;
let totalPluginsRemoved = 0;
let totalFlowDiagramRemoved = 0;
let totalBlueprintPlaceholderRemoved = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const doc = yaml.parse(content);

    // Remove blueprints.lead
    if (doc.blueprints && doc.blueprints.lead) {
        delete doc.blueprints.lead;
        totalLeadRemoved++;
    }

    // Process blueprints.items
    if (doc.blueprints && doc.blueprints.items) {
        for (const item of doc.blueprints.items) {
            // Remove href
            if (item.href !== undefined) {
                delete item.href;
                totalHrefRemoved++;
            }
            // Remove code
            if (item.code !== undefined) {
                delete item.code;
                totalCodeRemoved++;
            }
            // Remove plugins
            if (item.plugins !== undefined) {
                delete item.plugins;
                totalPluginsRemoved++;
            }
            // Remove flowDiagram
            if (item.flowDiagram !== undefined) {
                delete item.flowDiagram;
                totalFlowDiagramRemoved++;
            }
            // Remove blueprintPlaceholder
            if (item.blueprintPlaceholder !== undefined) {
                delete item.blueprintPlaceholder;
                totalBlueprintPlaceholderRemoved++;
            }
        }
    }

    // Add missing blueprintId for "Multimodal extraction" in gemini.yaml
    if (file === 'gemini.yaml' && doc.blueprints && doc.blueprints.items) {
        for (const item of doc.blueprints.items) {
            if (item.name === 'Multimodal extraction' && !item.blueprintId) {
                item.blueprintId = 'gemini-multimodal-receipt-extraction';
            }
        }
    }

    // Write back with same formatting
    const newContent = yaml.stringify(doc, { 
        indent: 2,
        lineWidth: 0,
        nullStr: '',
    });
    fs.writeFileSync(filePath, newContent);
}

console.log('Done!');
console.log(`href removed: ${totalHrefRemoved}`);
console.log(`lead removed: ${totalLeadRemoved}`);
console.log(`code removed: ${totalCodeRemoved}`);
console.log(`plugins removed: ${totalPluginsRemoved}`);
console.log(`flowDiagram removed: ${totalFlowDiagramRemoved}`);
console.log(`blueprintPlaceholder removed: ${totalBlueprintPlaceholderRemoved}`);