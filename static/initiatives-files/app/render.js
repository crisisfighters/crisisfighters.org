

function button(link, label, flags) {
    const {primary, blank}  = flags || {};
    return `<a href="${link}" ${blank ? 'target="_blank"' : ''}class="button ${primary ? 'button-primary' : ''}">${renderMd(label)}</a>`
};

function renderStartPage() {

    const tagCount = Object.keys(exports.tagLabels).filter(t => !t.startsWith('l-')).length;

    document.getElementById('recruiter-screen').innerHTML = `
    <div class="flex-l mw8 center">
    <article class="center cf pb5 mw7">

      <div class="nested-copy-line-height lh-copy f4 nested-img mid-gray">
      ${renderMdParagraph(`
      # How can you make a difference?
      We spent months talking to people, doing research and learning how people can have real impact against the climate crisis: Our **Crisis Recruiter** makes this knowledge available to you. It's free, open source and only takes a few minutes.

      ### It takes four steps.
      1. Get an update to the latest science by reading the [Must Reads](/must-reads).
      2. Read this page.
      3. We show you a quick survey that takes up to two minutes.
      4. We show you how can make a real difference.

      ## How Crisis Recruiter works
      * We collected ${numberOfInitiatives()} initiatives and matched them against ${tagCount} properties.
      * That allows us to make useful recommendations to you, just like in a real conversation.
      * To identify the most impactful initiatives, we rely on a study by the Potsdam Institute for Climate Impact. They identified key areas where your effort has the highest impact on stopping the crisis.
      * For the curious, we put an article together on [how we recommend](/what-else/how-we-recommend).
      `)}
        ${button(exports.logic.surveyLink, 'Launch **Crisis Recruiter**', {primary: true})}
      
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

    // input.onfocus = function geolocate() {
    //     if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(position => {
    //         const geolocation = {
    //           lat: position.coords.latitude,
    //           lng: position.coords.longitude
    //         };
    //         autocomplete.setBounds(new google.maps.Circle(
    //             {center: geolocation, radius: position.coords.accuracy}).getBounds());
    //       });
    //     }
    // };

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
        <p>In case you're interested how we came to our recommendations: We wrote an article on <a href="/what-else/how-we-recommend" target="_blank">how we recommend</a>.</p>
        ${renderElements(elements)}
        `;

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
        <span class="results-input-tag-group-question">${exports.logic.questionToLabel(param)}: </span>
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
    ${button('/what-else/ideas', 'Check out **Ideas**', {primary: true, blank: true})}
</div>`;

const contribute = index => `
<div class="results-element results-contribute">
    <h2>Suggestion ${index}: Contribute to CrisisFighters.org!</h2>
    <p>We created CrisisFighters to help you and others to do something meaningful against the climate crisis. By contributing to this website you help others put their energy to the best possible use. And we need the wisdom of the many to keep content up-to-date and accurate!</p>
    ${button('/contribute', '**Improve** CrisisFighters', {primary: true, blank: true})}

</div>`;

const creativeBrief = index => `
<div class="results-element results-creative-brief">
    <h2>Suggestion ${index}: Run Your Own Campaign!</h2>
    <p>Can you make time between projects? Maybe your team can even work together on this. We put together a creative brief with context, key facts, messages, do's and dont's for you to create your own campaign with your own branding.</p>
    <p>Please <a href="/contact" target="_blank">reach out</a> if you have questions - we're happy to help!</p>
    ${button(
        'https://docs.google.com/document/d/1xrc1t-8ps30AXfwR2cogCuFc3FBbfFTX-VOwJCkW5-4',
        'Show **Creative Brief** (draft)',
        {primary: true, blank: true}
    )}

</div>`;

const climatePledge = index => `
<div class="results-element results-creative-brief">
    <h2>Suggestion ${index}: Sign the Climate Pledge!</h2>
    <p>This is a new initiative to mobilize current and future workers to urge companies to take a pro-climate policy stand.</p>
    <p>By signing this pledge you can state that <b>you will try hard to avoid working for companies that don't take bold steps</b> to become sustainable and advocate for pro-climate policies. This pledge has the power to put pressure on businesses worldwide to take meaningful action.</p>
    ${button('https://climatevoice.org/', 'Sign the **Climate Pledge**', {primary: true, blank: true})}

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
                .map(tag)
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