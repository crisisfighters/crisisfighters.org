import {surveyLink,
    possibleParams,
    questionToLabel,
    sortTags,
    tagShouldBeVisibleInList} from './logic';
import {numberOfInitiatives, tagToLabel, queryInitiatives} from './initiatives';
import {renderMd, renderMdParagraph} from './markdown';
import {tagLabels} from './data/tagLabels';
import welcomeMd from './content-partials/recruiter/welcome.md';
import selectCountryMd from './content-partials/recruiter/select-country.md';

export function renderResultScreen(userParams, {result: elements}, location) {
    document.getElementById('recruiter-screen').innerHTML = renderResults(userParams, location, elements);
}

export function renderStartPage() {
    const tagCount = Object.keys(tagLabels).filter(t => !t.startsWith('l-')).length;

    document.getElementById('recruiter-screen').innerHTML = renderMdParagraph(
          welcomeMd
            .replace('{{numberOfInitiatives}}', numberOfInitiatives())
            .replace('{{numberOfTags}}', tagCount)
        )
        + button(surveyLink, 'Launch **Crisis Recruiter**', {primary: true});
}

export function renderLocationSelector(params, resultDescriptor) {
    
    document.getElementById('recruiter-screen').innerHTML = 
    renderMdParagraph(selectCountryMd) + `
        <input id="result-town-input" autofocus placeholder="Region or country..." type="text"/>
        <button id="result-town-submit" class="button button-primary" disabled>Show <span style="font-weight: bold">Results</span></button>
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
        <h4>The data you entered
        (<a href="${surveyLink}">start over</a>)
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
                 ? [`Country: ${location.country}.`]
                : [])
        ]
        .join('. ')}
        </p>
        <p>In case you're interested how we came to our recommendations: We wrote an article on <a href="/what-else/how-we-recommend" target="_blank">how we recommend</a>.</p>
        ${renderElements(elements)}
        `;

function button(link, label, flags) {
    const {primary, blank}  = flags || {};
    return `<a href="${link}" ${blank ? 'target="_blank"' : ''}class="button ${primary ? 'button-primary' : ''}">${renderMd(label)}</a>`
};
        

const tag = tag => {
    const classes = [
        'tag',
        'tag-' + tag.substr(0, tag.indexOf('-')),
        'tag-' + tag
    ];
    return `
        <span class="${classes.join(' ')}">${tagToLabel(tag)}</span>
    `;
}

const renderInputTagGroup = (param, responseTags) => 
    `<span class="results-input-tag-group">
        <span class="results-input-tag-group-question">${questionToLabel(param)}: </span>
        ${responseTags
            .map(tag)
            .join('')}</span>`;

const renderElements = elements => {
    let gaps = 0;
    let showedNotFoundMessage = false;
    let showedInitiatives = false;
    return elements.map((element, index) => {
        const realIndex = index + 1  - gaps;
        switch(element.type){
            case 'initiatives': {
                const initiatives = queryInitiatives(element.query);
                if(initiatives.length === 0) {
                    console.log('Didn\'t find anything for query', element.query);
                    gaps++;
                    if(showedInitiatives || showedNotFoundMessage) {
                        return '';
                    }
                    showedNotFoundMessage = true;
                    return nothingFound();
                }
                showedInitiatives = true;
                return initiativeSet(element, initiatives, realIndex);
            }
            case 'restart-link': return restartLink(realIndex);
            case 'cf-b2b': return crisisFightersB2B(realIndex);
            case 'ideas': return ideas(realIndex);
            case 'contribute': return contribute(realIndex);
            case 'creative-brief': return creativeBrief(realIndex);
            case 'aaa': return aaa(realIndex);
            case 'climate-pledge': return climatePledge(realIndex);
            default: return `<p>Unknown: ${element.type}</p>`;
        }
    }).join('');
}

const suggestionHeadline = (caption, index) => 
    `<h1>${index ? `Suggestion ${index}: ` : ''}
      <span class="headline">${caption}</span>
    </h1>`;

const restartLink = () => `
<div class="results-element results-help-others">
    ${suggestionHeadline('Interested in other initiatives?')}
    <p>There are other, very interesting initiatives that you could join as an individual.</p>
    ${button(surveyLink, 'Start Over')}
</div>`;

const nothingFound = () => `
<div class="results-element results-help-others">
    ${suggestionHeadline('No Initiatives Match your Criteria')}
    <p>Don't worry. This happens. The easy solution is to select more options that could be relevant to you.</p>
    ${button(surveyLink, 'Start Over')}
</div>`;

const crisisFightersB2B = index => `
<div class="results-element results-crisisfighters-b2b">
    ${suggestionHeadline('Your Company can join CrisisFighters', index)}
    <p>Ask your employees to put one hour per month into improving CrisisFighters and talk about it to get more people to engage.</p>
    ${button('/b2b', '**CrisisFighters B2B**', {primary: true})}
</div>`;

const ideas = index => `
<div class="results-element results-ideas">
    ${suggestionHeadline('Start Your Own', index)}
    <p>There are many good ideas out there for how you can invest your time best. We collect some of them. Check them out, use them and add your own!</p>
    ${button('/what-else/ideas', 'Check out **Ideas**', {primary: true, blank: true})}
</div>`;

const contribute = index => `
<div class="results-element results-contribute">
    ${suggestionHeadline('Contribute to CrisisFighters.org!', index)}
    <p>We created CrisisFighters to help you and others to do something meaningful against the climate crisis. By contributing to this website you help others put their energy to the best possible use. And we need the wisdom of the many to keep content up-to-date and accurate!</p>
    ${button('/contribute', '**Improve** CrisisFighters', {primary: true, blank: true})}

</div>`;

const creativeBrief = index => `
<div class="results-element results-creative-brief">
    ${suggestionHeadline('Run Your Own Campaign!', index)}
    <p>Can you make time between projects? Maybe your team can even work together on this. We put together a creative brief with context, key facts, messages, do's and dont's for you to create your own campaign with your own branding.</p>
    <p>Please <a href="/contact" target="_blank">reach out</a> if you have questions - we're happy to help!</p>
    ${button(
        'https://docs.google.com/document/d/1gQAjdS_FU4Ijx4OTbiIhNngsR8haO9llvgHIMThwqiQ',
        'Show **Creative Brief** (draft)',
        {primary: true, blank: true}
    )}

</div>`;

const climatePledge = index => `
<div class="results-element results-creative-brief">
    ${suggestionHeadline('Sign the Climate Pledge!', index)}
    <p>This is a new initiative to mobilize current and future workers to urge companies to take a pro-climate policy stand.</p>
    <p>By signing this pledge you can state that <b>you will try hard to avoid working for companies that don't take bold steps</b> to become sustainable and advocate for pro-climate policies. This pledge has the power to put pressure on businesses worldwide to take meaningful action.</p>
    ${button('https://climatevoice.org/', 'Sign the **Climate Pledge**', {primary: true, blank: true})}

</div>`;

const aaa = index => `
<div class="results-element results-creative-brief">
    ${suggestionHeadline(window.cfStrings.recruiter.aaa.headline, index)}
    ${renderMdParagraph(window.cfStrings.recruiter.aaa.description)}
    ${button(
        'https://business.edf.org/insights/aaa-leadership-framework/',
        window.cfStrings.recruiter.aaa.cta,
        {primary: true, blank: true}
    )}

</div>`;

    const initiativeSet = ({headline, description, style}, initiatives, index) =>`
    <div class="results-element results-initiative-set">
        ${suggestionHeadline(renderMd(headline), index)}
        <div class="results-element-description">${renderMdParagraph(description)}</div>
        <div class="results-initiatives-wrapper">
        ${initiatives.map(i => initiative(i, style)).join('')}
        </div>
    </div>`;

const initiative = (initiative, style) => {
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
                .map(tag)
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

