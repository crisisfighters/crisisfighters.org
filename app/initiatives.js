import {sortInitiatives} from './logic';
import {initiatives} from './data/initiatives';
import {tagLabels} from './data/tagLabels';

const invalidTags = [];

export function numberOfInitiatives() {
    return initiatives.length;
}

export function queryInitiatives(query) {
    return initiatives
        .filter(initiative => query(
            [...initiative.meta.tags],
            ))
        .sort(sortInitiatives);
}

export function labelToTag(label) {
    for(let tag in tagLabels) {
        if(tagLabels[tag] === label) {
            return tag;
        }
    }
    if(!invalidTags.includes("label: " + label)) {
        invalidTags.push("label: " + label);
    }
    return null;
}

export function tagToLabel(tag) {
    for(let tagEntry in tagLabels) {
        if(tagEntry === tag) {
            return tagLabels[tag];
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