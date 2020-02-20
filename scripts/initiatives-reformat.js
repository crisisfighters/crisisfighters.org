#!/usr/bin/env node
const { writeFileSync, readFileSync } = require('fs');
const { join } = require('path');

const path = join(__dirname, '..','static', 'initiatives-files', 'data', 'initiatives.js');

writeFileSync(
    path,
    'exports.initiatives = ' + JSON.stringify(
        JSON.parse(
            readFileSync(path)
            .toString()
            .replace(/^exports\.initiatives = /, '')
            .replace(/;$/, '')
        ),
        null,
        2
    ) + ';'
);