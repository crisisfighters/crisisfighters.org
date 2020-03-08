var invalidTags = [];

function numberOfInitiatives() {
    return exports.initiatives.length;
}

function queryInitiatives(query) {
    return exports.initiatives
        .filter(initiative => query(
            [...initiative.meta.tags],
            ))
        .sort(exports.logic.sortInitiatives);
}

function labelToTag(label) {
    for(let tag in exports.tagLabels) {
        if(exports.tagLabels[tag] === label) {
            return tag;
        }
    }
    if(!invalidTags.includes("label: " + label)) {
        invalidTags.push("label: " + label);
    }
    return null;
}

function tagToLabel(tag) {
    for(let tagEntry in exports.tagLabels) {
        if(tagEntry === tag) {
            return exports.tagLabels[tag];
        }
    }
    if(!invalidTags.includes(tag)) {
        invalidTags.push(tag);
    }
    return null;
}

function logInvalidTags(){
    if(invalidTags.length) {
        console.log('Invalid Tags:', invalidTags);
    }
}