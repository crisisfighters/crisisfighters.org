var invalidTags = [];

function numberOfInitiatives() {
    return exports.initiatives.length;
}

function queryInitiatives(query) {
    return exports.initiatives
        .filter(initiative => query(
            [...initiative.meta.tagsInteresting, ...initiative.meta.tagsRelevant],
            ))
        .sort((a, b) => 
            [...b.meta.tagsInteresting, ...b.meta.tagsRelevant]
            .filter(t => t.indexOf('good-') === 0)
            .length
            -
            [...a.meta.tagsInteresting, ...a.meta.tagsRelevant]
            .filter(t => t.indexOf('good-') === 0)
            .length
        );
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
    console.log('Invalid Tags:');
    console.log(invalidTags);
}