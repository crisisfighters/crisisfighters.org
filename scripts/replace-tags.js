#!/usr/bin/env node
const { writeFileSync, readFileSync } = require('fs');
const { join } = require('path');

const path = join(__dirname, '..','static', 'initiatives-files','data', 'initiatives.js');
const newTags = JSON.parse(readFileSync(join(__dirname, 'input.json')).toString());
const arrayDiff = (a, b) => a
    .filter(x => !b.includes(x))
    .concat(b.filter(x => !a.includes(x)));

const initiatives = JSON.parse(
    readFileSync(path)
    .toString()
    .replace(/^exports\.initiatives = /, '')
    .replace(/;$/, '')
);

const localNames = initiatives.map(i => i.meta.name);
const newNames = newTags.map(t => t.n);
const difference = arrayDiff(localNames, newNames);

if(difference.length !== 0) {
    throw new Error('Existing and new initiatives don\'t match. Differences: ' + difference.join(', '));
}

const logDiff = (a, b) => {
    
    const added = b
                 .filter(x => !a.includes(x));

    const removed = a
        .filter(x => !b.includes(x));

    return [
        ...added.map(e => '+' + e),
        ...removed.map(e => '-' + e)
    ].join(', ')
}

// console.log(logDiff(
//     [1, 2, 3, 4],
//     [2, 3, 4]
// ));
// process.exit(0);

const replaceTags = initiative => {
    for(let {n, t} of newTags) {
        if(n === initiative.meta.name) {
            const old = [...(initiative.meta.tags || [])];
            
            if(arrayDiff(old || [], t).length > 0) {
                console.log(initiative.meta.name + ': ' + logDiff(old, t));
            }
            return {
                ...initiative,
                meta: {
                    ...initiative.meta,
                    tags: t,
                }
            };
            return initiative;
        }
    }
    throw new Error(`Initiative ${initiative.meta.name} not found`);
}

writeFileSync(
    path,
    'exports.initiatives = ' + JSON.stringify(
        initiatives.map(replaceTags),
        null,
        2
    ) + ';'
);
