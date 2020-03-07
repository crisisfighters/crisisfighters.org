

function button(link, label, flags) {
    const {primary, blank}  = flags || {};
    return `<a href="${link}" ${blank ? 'target="_blank' : ''}class="button ${primary ? 'button-primary' : ''}">${renderMd(label)}</a>`
};

function renderStartPage() {
    document.getElementById('recruiter-screen').innerHTML = `
    <div class="flex-l mw8 center">
    <article class="center cf pb5 mw7">
      <header>
      <div class="nested-copy-line-height lh-copy f4 nested-img mid-gray">
        <h1>Find Initiatives with Crisis Recruiter</h1>
        <ul>
            <li>So far, we've collected and tagged ${numberOfInitiatives()} initiatives that fight the climate crisis.</li>
            <li><b>This page is a technical preview.</b> The designer is on their way to save the day.</li>
        </ul>
        
        <p>By answering a few quick questions, we can show you what initiatives you should invest your time or money into.</p>
        ${button(exports.logic.surveyLink, 'Launch **Crisis Recruiter**', {primary: true})}
      </header>
    </article>
  </div>
        `;
}

function renderLocationSelector(params, resultDescriptor) {
    
    document.getElementById('recruiter-screen').innerHTML = `
    <div class="flex-l mw8 center">
      <article class="center cf pb5 mw7">
        <header>
          <div class="nested-copy-line-height lh-copy f4 nested-img mid-gray">
            <h1>Please select a country</h1>
            <p>This allows us to only suggest initiatives that are either global or present in your country.
            </p>
            <input id="result-town-input" autofocus placeholder="Region or country..." type="text"/>
            <button id="result-town-submit" class="button button-primary" disabled>Show <span style="font-weight: bold">Results</span></button>
        </header>
      </article>
    </div>
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

    input.onfocus = function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            autocomplete.setBounds(new google.maps.Circle(
                {center: geolocation, radius: position.coords.accuracy}).getBounds());
          });
        }
      };

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
        (<a href="${exports.logic.surveyLink}">start over</a>)
        </h4>
        <p>
        ${[
            // For each possibleParam check if a userParam is set ...
            ...exports.logic.possibleParams.reduce((acc, p) => {
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
        ${renderElements(elements)}
        `;

const tag = relevant => tag => {
    const classes = [
        'tag',
        ...(relevant ? ['tag-relevant'] : []),
        'tag-' + tag.substr(0, tag.indexOf('-')),
        'tag-' + tag
    ];
    return `
        <span class="${classes.join(' ')}">${tagToLabel(tag)}</span>
    `;
}

const renderInputTagGroup = (param, responseTags) => 
    `<span class="results-input-tag-group">
        <span class="results-input-tag-group-question">${exports.logic.questionToLabel(param)}: </span>
        ${responseTags
            .map(tag => {
                const classes = [
                    'tag',
                    'tag-' + tag.substr(0, tag.indexOf('-')),
                    'tag-' + tag
                ];
                return `<span class="${classes.join(' ')}">${tagToLabel(tag)}</span>`
            })
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

const restartLink = () => `
<div class="results-element results-help-others">
    <h2>Interested in other initiatives?</h2>
    <p>There are other, very interesting initiatives that you could join as an individual.</p>
    ${button(exports.logic.surveyLink, 'Start Over')}
</div>`;

const nothingFound = () => `
<div class="results-element results-help-others">
    <h2>No Initiatives Match your Criteria</h2>
    <p>Don't worry. This happens. The easy solution is to select more options that could be relevant to you.</p>
    ${button(exports.logic.surveyLink, 'Start Over')}
</div>`;

const crisisFightersB2B = index => `
<div class="results-element results-crisisfighters-b2b">
    <h2>Suggestion ${index}: Your Company can join CrisisFighters</h2>
    <p>Ask your employees to put one hour per month into improving CrisisFighters and talk about it to get more people to engage.</p>
    ${button('/b2b', '**CrisisFighters B2B**', {primary: true})}
</div>`;

const ideas = index => `
<div class="results-element results-ideas">
    <h2>Suggestion ${index}: Start Your Own</h2>
    <p>There are many good ideas out there for how you can invest your time best. We collect some of them. Check them out, use them and add your own!</p>
    ${button('/what-else/ideas', 'Check out **Ideas**', {primary: true})}
</div>`;

const contribute = index => `
<div class="results-element results-contribute">
    <h2>Suggestion ${index}: Contribute to CrisisFighters.org!</h2>
    <p>We created CrisisFighters to help you and others to do something meaningful against the climate crisis. By contributing to this website you help others put their energy to the best possible use. And we need the wisdom of the many to keep content up-to-date and accurate!</p>
    ${button('/contribute', '**Improve** CrisisFighters', {primary: true})}

</div>`;

const creativeBrief = index => `
<div class="results-element results-creative-brief">
    <h2>Suggestion ${index}: Run your own campaign!</h2>
    <p>TODO copy. Crowd-sourcing, talking about it</p>
    ${button('https://docs.google.com/document/d/1xrc1t-8ps30AXfwR2cogCuFc3FBbfFTX-VOwJCkW5-4', 'Check out our **Creative Brief** (draft)')}

</div>`;

const climatePledge = index => `
<div class="results-element results-creative-brief">
    <h2>Suggestion ${index}: Sign the Climate Pledge!</h2>
    <p>This is a new initiative to mobilize current and future workers to urge companies to take a pro-climate policy stand.</p>
    <p>By signing this pledge you can state that <b>you will try hard to avoid working for companies that don't take bold steps</b> to become sustainable and advocate for pro-climate policies. This pledge has the power to put pressure on businesses worldwide to take meaningful action.</p>
    ${button('https://climatevoice.org/', 'Sign the **Climate Pledge**', {primary: true})}

</div>`;

const aaa = index => `
<div class="results-element results-creative-brief">
    <h2>Suggestion ${index}: Transform your company with the AAA framework</h2>
    <p>The Environmental Defense Fund created a powerful but easy 3-step framework to allow your company to execute a <b>science-based climate policy agenda</b>.</p>

    <img align="right" src="https://business.edf.org/wp-content/uploads/AAA_GFX_1500.jpg" width="353" height="212">
    
    <p>Climate change poses an unprecedented threat to companies’ operations, value chains, employees and communities. The economic costs of climate change – from damage to facilities, disrupted operations and supply chains and lost productivity – are already in the hundreds of millions of dollars and expected to reach trillions. While voluntary actions to reduce emissions are important, only public policy can deliver reductions at the speed and scale needed to limit the worst impacts of climate change.<br><strong><em>That’s why climate policy advocacy is an essential element of corporate sustainability leadership.</em></strong></p><p><strong>As a company, your political influence is a critical tool in the fight against climate change</strong>.</p>

    ${button(
        'https://business.edf.org/insights/aaa-leadership-framework/',
        'Check out the **AAA Framework**',
        {primary: true, blank: true}
    )}

</div>`;

    const initiativeSet = ({headline, description, style}, initiatives, index) =>`
    <div class="results-element results-initiative-set">
        <h2>Suggestion ${index}: ${renderMd(headline)}</h2>
        <div class="results-element-description">${renderMdParagraph(description)}</div>
        <div class="results-initiatives-wrapper">
        ${initiatives.map(i => initiative(i, style)).join('')}
        </div>
    </div>`;

const initiative = (initiative, style) => {
    const {tagShouldBeVisibleInList} = exports.logic;
    const {small} = style || {};
    return`
        <div class="initiative">
            <h3><a href="${initiative.meta.link}" target="_blank">${initiative.meta.name}</a></h3>
            ${small
            ? ''
            : `
            <div class="initiative-tag-wrapper">
            ${initiative.meta.tags
                .sort(exports.logic.sortTags)
                .filter(tagShouldBeVisibleInList)
                .map(tag(true))
                .join('')}
            </div>
            `}
            <div class="initiative-description">
            ${renderMdParagraph(initiative.description ? initiative.description.content : '')}
            </div>
        </div>`
    };

function renderResultScreen(userParams, {result: elements}, location) {
    
    document.getElementById('recruiter-screen').innerHTML = renderResults(userParams, location, elements);
}