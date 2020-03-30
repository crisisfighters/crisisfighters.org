let md;

function init() {
    if(!md) {
        md = markdownit();
        setLinkTargetsToBlank(md);
    }
}

export function renderMd(input) {
    init();
    return md.renderInline(input);
}

export function renderMdParagraph(input) {

    // To keep the code more readable some literal markdown blocks have indentation.
    // This removes that indentation, using indendation in the first line as signal.
    const spaceMatches = input.match(/ +/);
    if(spaceMatches && spaceMatches[0]) {
        input = input.replace(new RegExp('\n' + spaceMatches[0], 'g'), '\n');
    }
    init();
    return md.render(input);
}

function setLinkTargetsToBlank(md) {
    // Thanks to https://github.com/markdown-it/markdown-it/blob/bda94b0521f206a02427ec58cb9a848d9c993ccb/docs/architecture.md
    
    const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        // If you are sure other plugins can't add `target` - drop check below
        const aIndex = tokens[idx].attrIndex('target');
        const href = tokens[idx].attrs.find(a => a[0] ==='href')[1];
    
        if(href.startsWith('http')) {
            if (aIndex < 0) {
                tokens[idx].attrPush(['target', '_blank']); // add new attribute
            } else {
                tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
            }
        }
        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    };

}
