# json2table-schema

CLI tool to generate a table-schema provided a path to some sample JSON.

The sample JSON should be an array of objects.

It will loop thru each object, flatten them down into a tabular format, and produce a schema compliant with this spec: https://frictionlessdata.io/docs/table-schema/

The "name" property will be alphanumeric with underscores -- this is compatible with Google BigQuery's tables, as well as likely every database under the sun.

In addition to the "name" field, it will also add a "jsonPath" property to each field.

This jsonPath is compliant with `lodash/get` for getting data from json blobs of the same shape.

It does NOT automatically fill in the "type" and "description" fields, but it does produce them as empty placeholders.

---

## Installation

```sh
npm i -g json2table-schema
```

## Usage

```sh
json2table-schema /path/to/example.json
```

## Example

```sh
$ node src/json2schema.js ./example/eg6.json | jq
{
  "fields": [
    {
      "name": "col1",
      "type": "string",
      "description": "",
      "jsonPath": "col1"
    },
...
```

