

function button(link, label) {
    return `<a href="${link}" class="ba b--moon-gray bg-light-gray br2 color-inherit dib f7 hover-bg-moon-gray link mt2 ph2 pv1" style="font-size: 2.0rem; text-align: center;">${label}</a>`
};

function renderStartPage() {
    document.getElementById('recruiter-screen').innerHTML = `
    <div class="initiatives-welcome-wrapper">
    <h2>Initiatives</h2>
        <ul>
            <li>We are working hard to collect all relevant initiatives that fight the climate crisis.</li>
            <li>Today, we have 50+ initiatives in our databse.</li>
        </ul>
        <h3>The Crisis Recruiter</h3>
        <p>By anwswering a few quick questions, we can show you what initiatives you should invest your time or money into.</p>
        ${button(exports.logic.surveyLink, 'Where can I help?')}
        `;
}

function renderLocationSelector(params, resultDescriptor) {
    
    document.getElementById('recruiter-screen').innerHTML = `
    <div class="initiatives-country-wrapper">
    <h2>Please select a country</h2>
    <p>We will only suggest initiatives that are either global or present in your country.
    </p>
        <input id="result-town-input" placeholder="Region or country..." type="text"/>
        <button id="result-town-submit" disabled>Show me the results</button>
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

function setLinkTargetToBlank(md) {
    // Thanks to https://github.com/markdown-it/markdown-it/blob/bda94b0521f206a02427ec58cb9a848d9c993ccb/docs/architecture.md
    
    const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        // If you are sure other plugins can't add `target` - drop check below
        const aIndex = tokens[idx].attrIndex('target');
    
        if (aIndex < 0) {
            tokens[idx].attrPush(['target', '_blank']); // add new attribute
        } else {
            tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
        }
        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    };

}
function renderResultScreen(params, {result: elements}, location) {

    console.log(elements);

    const md = window.markdownit();
    setLinkTargetToBlank(md);
    
    const renderResults = elements => `
        <h4>The data you entered
        (<a href="${exports.logic.surveyLink}">start over</a>)
        </h4>
        <p>
        ${[
            ...['role', 'goals', 'types', 'skills', 'investment'].reduce((acc, p) => {
            const group = [].concat(params[p] || []);
            return group.length > 0
                ? [ ...acc, renderInputTagGroup(p, group)]
                : acc;
            }, []),
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
        <span class="results-input-tag-group-question">${questionToLabel(param)}: </span>
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
        return elements.map((element, index) => {
            const realIndex = index + 1  - gaps;
            switch(element.type){
                case 'initiatives': {
                    const initiatives = queryInitiatives(element.query);
                    if(initiatives.length === 0) {
                        gaps++;
                        if(showedNotFoundMessage) {
                            return '';
                        }
                        showedNotFoundMessage = true;
                        return nothingFound();
                    }
                    return initiativeSet(element.headline, element.description, initiatives, realIndex);
                }
                case 'restart-link': return restartLink(realIndex);
                case 'cf-b2b': return crisisFightersB2B(realIndex);
                case '': return ideas(realIndex);
                case 'contribute': return contribute(realIndex);
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
        <h2>Suggestion ${index}: Make your company part of the solution</h2>
        <p>Ask your employees to put one hour per month into improving CrisisFighters and talk about it to get more people to engage.</p>
        ${button('/b2b', 'CrisisFighters B2B')}
    </div>`;

    const ideas = index => `
    <div class="results-element results-ideas">
        <h2>Suggestion ${index}: Start Your Own</h2>
        <p>There are many good ideas out there for how you can invest your time best. We collect some of them. Check them out, use them and add your own!</p>
        ${button('/what-else/ideas', 'Ideas')}
    </div>`;

    const contribute = index => `
    <div class="results-element results-contribute">
        <h2>Suggestion ${index}: Help CrisisFighters.org!</h2>
        <p>TODO copy. Crowd-sourcing, talking about it</p>
        ${button('/contribute', 'Contribute')}

    </div>`;

    const initiativeSet = (headline, description, initiatives, index) =>`
        <div class="results-element results-initiative-set">
            <h2>Suggestion ${index}: ${md.renderInline(headline)}</h2>
            <p>${md.renderInline(description)}</p>
            <div class="results-initiatives-wrapper">
            ${initiatives.map(initiative).join('')}
            </div>
        </div>`;

        const {sortOrder} = exports.logic;
        const sortTags = (a, b) => {
            const posA = sortOrder.indexOf(a.substr(0, a.indexOf('-')));
            const posB = sortOrder.indexOf(b.substr(0, b.indexOf('-')));
            return  posA >= 0 && posB >=0
                ? posA - posB
                : posA === -1
                  ? 1
                  : -1;
        };
    const {tagShouldBeVisibleInList} = exports.logic;

    const initiative = initiative => `
        <div class="initiative">
            <h3><a href="${initiative.meta.link}" target="_blank">${initiative.meta.name}</a></h3>
            <div class="initiative-tag-wrapper">
            ${initiative.meta.tagsRelevant
                .sort(sortTags)
                .filter(tagShouldBeVisibleInList)
                .map(tag(true))
                .join('')}
            ${initiative.meta.tagsInteresting
                .sort(sortTags)
                .filter(tagShouldBeVisibleInList)
                .map(tag(false))
                .join('')}
            </div
            <p>${md.renderInline(initiative.description ? initiative.description.content : '')}</p>
        </div>
        `;
    
    document.getElementById('recruiter-screen').innerHTML = renderResults(elements);
}