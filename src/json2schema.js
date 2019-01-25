#!/usr/bin/env node

// const fs = require('fs').promises;
const fs = require('fs.promised');
const json2csv = require('json2csv').parse;
const camelcase = require('lodash.camelcase');

const arr2obj = function (array) {
    let thisEleObj = new Object();
    if (typeof array == "object") {
        for (let i in array) {
            let thisEle = arr2obj(array[i]);
            thisEleObj[i] = thisEle;
        }
    } else {
        thisEleObj = array;
    }
    return thisEleObj;
}

async function main() {
    const jsonString = await fs.readFile(process.argv[2], 'utf8');
    const jsonParsed = JSON.parse(jsonString);

    // TODO: deal with keynames with dots (if you're data's in mongo, you'll be right.)
    // TODO: deal with keynames with commas

    // the json2csv drops arrays out. that's no good.
    // this changes arrays to objects where the key is the array index
    let jsonNoArrays = [];
    for(let deviceIndex in jsonParsed) {
        let device = jsonParsed[deviceIndex]
        let newDevice = {};
        for(let key in device) {
            newDevice[key] = arr2obj(device[key]);
        }
        jsonNoArrays.push(newDevice);
    }

    // this will loop thru all of the json objects, and grab all the unique keys from each of them.
    // this is good 'cause not all objects have all keys, so the bigger the dataset, the more comprehensive
    // the list of columns this will generate
    // I want the result to have each json keyname in camelCase, and the separator to be underscores
    // but because underscores will get camelcased
    // const TEMP_SEPARATOR = '@@@'
    const TEMP_SEPARATOR = '@@@'
    const csv = json2csv(jsonNoArrays, { flatten: true, flattenSeparator: TEMP_SEPARATOR})

    // TODO: get "example" from sample data
    // TODO: get "type" from sample data

    // get header row
    const headerRow = csv.split('\n')[0];
    let fields = [];

    // I want dots to be underscores, but everything else in camelCase
    // so ill replace dots with tildes, then underscores
    const columnHeaders = headerRow.split(',')
    for (let columnHeader of columnHeaders){



        let jsonPath = columnHeader;
        jsonPath = jsonPath.replace(/"/g, '');              // strip out doublequotes
        let pathParts = jsonPath.split(TEMP_SEPARATOR);
        // wrap any parts that have spaces in them in [bracers]
        for (pathPartIndex in pathParts) {
            let pathPart = pathParts[pathPartIndex];
            if (pathPart.includes(' ') || pathPart.includes('.')) {
                pathPart = '[' + pathPart + ']';
            }
            pathParts[pathPartIndex] = pathPart;
        }
        jsonPath = pathParts.join('.');
        jsonPath = jsonPath.replace(/\.([\d]+)/g, '[$1]');     // replace dot-number with openbrace-number-closebrace


        let name = columnHeader;
        name = name.replace(/"/g, '');              // strip out doublequotes
        let nameParts = name.split(TEMP_SEPARATOR);
        for (namePartIndex in nameParts) {
            let namePart = nameParts[namePartIndex];
            nameParts[namePartIndex] = camelcase(namePart);
        }
        name = nameParts.join('_');
        name = name.replace(/[^0-9a-zA-Z_]/g, '');
        

        let description = ''; // TODO: you have to add these manually
        let type = 'string'; // TODO: you have to change these manually to either: string, number, integer, boolean, or something else https://frictionlessdata.io/specs/table-schema/

        fields.push({name, type, description, jsonPath});
    }

    const output = {fields};
    console.log(JSON.stringify(output, null, 2));
    // TODO: warn if any key is over 155 chars (Google BigQuery's limit)
    // TODO: warn if any keys are the same as other keys. (potentially possible as I'm stripping out illegal chars)
}

main();
