#!/usr/bin/env node
const { writeFileSync, readFileSync } = require('fs');
const { join } = require('path');

const path = join(__dirname, '..','static', 'recruiter-files','data', 'initiatives.js');
const newTags = JSON.parse(readFileSync(join(__dirname, 'input.json')).toString());
const initiatives = JSON.parse(
    readFileSync(path)
    .toString()
    .replace(/^exports\.initiatives = /, '')
    .replace(/;$/, '')
);

const newNames = newTags.map(t => t.n);

const sort = ({meta: {name: a}}, b) => {
    if(newNames.includes(a) && newNames.includes(b.meta.name)) {
        return newNames.indexOf(a) - newNames.indexOf(b.meta.name);
    }
    if(newNames.includes(a) && !newNames.includes(b.meta.name)) {
        return -1;
    }
    if(!newNames.includes(a) && newNames.includes(b.meta.name)) {
        return 1;
    }
    return a.localeCompare(b.meta.name);
}

writeFileSync(
    path,
    'exports.initiatives = ' + JSON.stringify(
        initiatives.sort(sort),
        null,
        2
    ) + ';'
);
