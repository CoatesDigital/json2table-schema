// eg:
// node ./test/test.js ./example/eg1.json col1
// node ./test/test.js ./example/eg6.json "col3.[lets's get nested].[we have to go deeper].[deep enough?]"

const fs = require('fs').promises;
const get = require('lodash/get');

async function main() {
    const jsonString = await fs.readFile(process.argv[2], 'utf8');
    const jsonParsed = JSON.parse(jsonString);

    const selector = process.argv[3];
    
    for (record of jsonParsed) {
        console.log(get(record, selector));
    }
}

main();
