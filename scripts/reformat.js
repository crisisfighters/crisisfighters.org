#!/usr/bin/env node
const { writeFileSync, readFileSync } = require('fs');
const { join } = require('path');

const path = join(__dirname, '..','app', 'data', 'initiatives.js');

writeFileSync(
    path,
    'export const initiatives = ' + JSON.stringify(
        JSON.parse(
            readFileSync(path)
            .toString()
            .replace(/^export const initiatives = /, '')
            .replace(/;$/, '')
        ),
        null,
        2
    ) + ';'
);