import {initiatives} from '../data/initiatives';

const invalidTags = [];

export function numberOfInitiatives() {
    return initiatives.length;
}

export function queryInitiatives(query, sort) {
    return initiatives
        .filter(initiative => query(
            [...initiative.meta.tags],
            ))
        .sort(sort);
}

export function labelToTag(label) {
    for(let tag in cfStrings.tagLabels) {
        if(cfStrings.tagLabels[tag] === label) {
            return tag;
        }
    }
    if(!invalidTags.includes("label: " + label)) {
        invalidTags.push("label: " + label);
    }
    return null;
}

export function tagToLabel(tag) {
    for(let tagEntry in cfStrings.tagLabels) {
        if(tagEntry === tag) {
            return cfStrings.tagLabels[tag];
        }
    }
    if(!invalidTags.includes(tag)) {
        invalidTags.push(tag);
    }
    return null;
}

export function logInvalidTags(){
    if(invalidTags.length) {
        console.log('Invalid Tags:', invalidTags);
    }
}