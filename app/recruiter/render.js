import {
    possibleParams,
    questionToLabel
} from './common/logic';
import {numberOfInitiatives, tagToLabel as convertTagToLabel, queryInitiatives} from './initiatives';
import {sortInitiatives} from './common/logic';
import {renderMd, renderMdParagraph} from './render/markdown';
import initiativeSet from './render/initiativeSet';
import tag from './render/tag';
import button from './render/button';
import {
    restartLink,
    nothingFound,
    crisisFightersB2B,
    ideas,
    contribute,
    creativeBrief,
    climatePledge,
    aaa,
} from './render/standardResultElements';

export function renderResultScreen(userParams, {result: elements}, location) {
    document.getElementById('recruiter-screen').innerHTML = renderResults(userParams, location, elements);
}

export function renderStartPage() {
    const tagCount = Object.keys(cfStrings.tagLabels).filter(t => !t.startsWith('l-')).length;

    document.getElementById('recruiter-screen').innerHTML = renderMdParagraph(
          cfStrings.recruiter.welcome.text
            .replace('{{numberOfInitiatives}}', numberOfInitiatives())
            .replace('{{numberOfTags}}', tagCount)
        )
        + button(cfStrings.recruiter.surveyLink, cfStrings.recruiter.welcome.button, {primary: true});
}

export function renderLocationSelector(params, resultDescriptor) {
    
    document.getElementById('recruiter-screen').innerHTML = 
    renderMdParagraph(cfStrings.recruiter.locationSelector.text) + `
        <input id="result-town-input" autofocus placeholder="${cfStrings.recruiter.locationSelector.placeholder}" type="text"/>
        <button id="result-town-submit" class="button button-primary" disabled>${renderMd(cfStrings.recruiter.locationSelector.button)}</button>
    `;
    const input = document.getElementById('result-town-input');
    const submit = document.getElementById('result-town-submit');
    let lastResult = null;
    
    const isUsable = () => lastResult
        // && lastResult.locality
        && lastResult.country
        && lastResult.countryCode;

    submit.onclick = () => isUsable()
        ? document.location.href= document.location.href + 
            `&locality=${lastResult.locality}&country=${lastResult.country}&countryCode=${lastResult.countryCode}`
        : true;

      const autocomplete = new google.maps.places.Autocomplete(
        input,
        {
            // types: ['(cities)'],
            types: ['(regions)'],
            fields: ['address_component'],
        });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const locality = place.address_components.filter(c => c.types.includes('locality'))[0];
        const country = place.address_components.filter(c => c.types.includes('country'))[0];
        lastResult = {
            locality : locality ? locality.short_name: null,
            country : country ? country.long_name: null,
            countryCode : country ? country.short_name.toLowerCase(): null,
        };
        
        if(isUsable()) {
            submit.removeAttribute('disabled');
        }
      });
}
const renderResults = (userParams, location, elements) => `
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