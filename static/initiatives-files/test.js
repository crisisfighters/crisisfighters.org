#!/usr/bin/env node

const {data} = require('./data');
const {fields} = require('./fields');
let assertions = 0;
const assert = (b, msg) => {
    if (!b) {
        throw new Error(msg);
    }
    assertions++;
};

assert(data.length > 5, 'expecting at least 5 initiatives');
assert(Object.keys(fields).length > 3, 'expecting at least 3 groups');

for (const row of data) {
    assert(row.meta, 'expecting field `meta` for ' + JSON.stringify(row));
    assert(row.meta.name, 'expecting field `meta.name` for ' + JSON.stringify(row.meta));
    assert(row.meta.label, 'expecting field `meta.label` for ' + row.meta.name);
    assert(row.meta.link, 'expecting field `meta.link` for ' + row.meta.name);
}

console.log(`Looks good. ${assertions} assertions met.`);