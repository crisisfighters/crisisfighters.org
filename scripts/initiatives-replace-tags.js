#!/usr/bin/env node
const { writeFileSync, readFileSync } = require('fs');
const { join } = require('path');

const path = join(__dirname, '..','static', 'initiatives-files', 'initiatives.js');
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
    for(let {n, x, i} of newTags) {
        if(n === initiative.meta.name) {
            const oldX = initiative.meta.tagsRelevant || [];
            const oldI = initiative.meta.tagsInteresting || [];
            
            if(arrayDiff(oldI || [], i).length > 0
            || arrayDiff(oldX || [], x).length > 0) {
                console.log(
                    `${initiative.meta.name} : x (${logDiff(oldX, x)}). i (${logDiff(oldI, i)})`);
            }
            return {
                ...initiative,
                meta: {
                    ...initiative.meta,
                    tagsInteresting: i,
                    tagsRelevant: x,
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
