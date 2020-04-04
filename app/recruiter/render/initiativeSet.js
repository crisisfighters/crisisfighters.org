import {renderMd, renderMdParagraph} from './markdown';
import {
    sortTags,
    tagShouldBeVisibleInList
} from '../common/logic';
import suggestionHeadline from './suggestionHeadline';
import tag from './tag';

const initiativeSet = ({
    element,
    initiatives,
    index,
    tagToLabel,
    numberOfInitiatives,
}) => {
    const headline = renderMd(element.headline.replace('{{numberOfInitiatives}}', numberOfInitiatives));
    const description = renderMdParagraph(element.headline.replace('{{numberOfInitiatives}}', numberOfInitiatives));
    const {style} = element;
    return `
<div class="results-element results-initiative-set">
    ${suggestionHeadline(headline, index)}
    <div class="results-element-description">${description}</div>
    <div class="results-initiatives-wrapper">
    ${initiatives.map(i => initiative({initiative: i, style, tagToLabel})).join('')}
    </div>
</div>`};

const initiative = ({initiative, style, tagToLabel}) => {
    const {small} = style || {};
    return`
        <div class="initiative pa4">
            <h3><a href="${initiative.meta.link}" target="_blank">${initiative.meta.name}</a></h3>
            ${small
            ? ''
            : `
            <div class="initiative-tag-wrapper">
            ${initiative.meta.tags
                .sort(sortTags)
                .filter(tagShouldBeVisibleInList)
                .map(t => tag(t, tagToLabel))
                .join('')}
            </div>
            `}
            ${
                initiative.description && initiative.description.content
                ? `<div class="initiative-description">
                    ${renderMdParagraph(initiative.description.content)}
                    </div>`
                : ''
            }
        </div>`
    };

export default initiativeSet;