const tag = (tag, tagToLabel) => {
    const classes = [
        'tag',
        'tag-' + tag.substr(0, tag.indexOf('-')),
        'tag-' + tag
    ];
    return `
        <span class="${classes.join(' ')}">${tagToLabel(tag)}</span>
    `;
}
export default tag;