import {
    possibleParams,
    questionToLabel
} from '../common/logic';
import {numberOfInitiatives, tagToLabel as convertTagToLabel, queryInitiatives} from '../initiatives';
import {sortInitiatives} from '../common/logic';
import initiativeSet from './initiativeSet';
import tag from './tag';
import {
    restartLink,
    nothingFound,
    crisisFightersB2B,
    ideas,
    contribute,
    creativeBrief,
    climatePledge,
    aaa,
} from './standardResultElements';

const resultPage = (userParams, location, elements) => `
        <h4>${cfStrings.recruiter.general.yourData}
        (<a href="${cfStrings.recruiter.surveyLink}">${cfStrings.recruiter.general.startOver}</a>)
        </h4>
        <p>
        ${[
            // For each possibleParam check if a userParam is set ...
            ...possibleParams.reduce((acc, p) => {
            const group = [].concat(userParams[p] || []);
            return group.length > 0
                ? [ ...acc, renderInputTagGroup(p, group)]
                : acc;
            }, []),
            // ... and add the Country if it has been selected
            ...(location && location.country
                 ? [`${cfStrings.recruiter.general.country}: ${location.country}.`]
                : [])
        ]
        .join('. ')}
        </p>
        ${cfStrings.recruiter.general.resultText}
        ${renderElements(elements)}
        `;


const renderInputTagGroup = (param, responseTags) => 
    `<span class="results-input-tag-group">
        <span class="results-input-tag-group-question">${questionToLabel(param)}: </span>
        ${responseTags
            .map(t => tag(t, convertTagToLabel))
            .join('')}</span>`;

const renderElements = elements => {
    let gaps = 0;
    let showedNotFoundMessage = false;
    let showedInitiatives = false;
    return elements.map((element, index) => {
        const realIndex = index + 1  - gaps;
        switch(element.type){
            case 'initiatives': {
                const initiatives = queryInitiatives(element.query, sortInitiatives);
                if(initiatives.length === 0) {
                    console.log('Didn\'t find anything for query', element.headline, element.query);
                    gaps++;
                    if(showedInitiatives || showedNotFoundMessage) {
                        return '';
                    }
                    showedNotFoundMessage = true;
                    return nothingFound();
                }
                showedInitiatives = true;
                return initiativeSet({
                    element,
                    initiatives,
                    index: realIndex,
                    tagToLabel: convertTagToLabel,
                    numberOfInitiatives: numberOfInitiatives(),
                });
            }
            case 'restart-link': return restartLink(realIndex);
            case 'cf-b2b': return crisisFightersB2B(realIndex);
            case 'ideas': return ideas(realIndex);
            case 'contribute': return contribute(realIndex);
            case 'creative-brief': return creativeBrief(realIndex);
            case 'aaa': return aaa(realIndex);
            case 'climate-pledge': return climatePledge(realIndex);
            default: return `<p>${cfStrings.recruiter.general.unknown}: ${element.type}</p>`;
        }
    }).join('');
}

export default resultPage;