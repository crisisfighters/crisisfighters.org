import {renderMd} from '../markdown';

export default function button(link, label, flags) {
    const {primary, blank}  = flags || {};
    return `<a href="${link}" ${blank ? 'target="_blank"' : ''}class="button ${primary ? 'button-primary' : ''}">${renderMd(label)}</a>`
};