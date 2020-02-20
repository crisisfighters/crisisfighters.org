var invalidTags = [];

function resultScreenApp() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const convert = name => urlParams
        .get(name)
        .split(', ')
        .filter(v=> v !== '_____')
        .map(labelToTag)
        .filter(tag => tag);

    if(!urlParams.has('role')
        || !urlParams.has('goals')
        || !urlParams.has('types')
        || !urlParams.has('skills')
        || !urlParams.has('investment')
    
    ) {
        return renderStartPage();
    }

    const params = {
        role: convert('role')[0],
        goals: convert('goals'),
        types: convert('types'),
        skills: convert('skills'),
        investment: convert('investment')[0],
    };
    const location = {
        locality: urlParams.get('locality'),
        country: urlParams.get('country'),
        countryCode: urlParams.get('countryCode'),
    }
    const resultDescriptor = determineResultDescriptor(params, location);

    console.log(params);
    if(resultDescriptor.locationMissing) {
        renderLocationSelector(params, resultDescriptor);
    } else {
        renderResultScreen(params, resultDescriptor);
    }
    logInvalidTags();
}

function renderStartPage() {
    document.getElementById('recruiter-screen').innerHTML = `
        <h4>Find where you can contribute</h4>
        <a href="https://services342876.typeform.com/to/H8DLJt">Show questions</a>
        `;
}

function renderLocationSelector(params, resultDescriptor) {
    
    document.getElementById('recruiter-screen').innerHTML = `
        <input id="result-town-input" placeholder="Enter your address" type="text"/>
        <button id="result-town-submit" disabled>Show me the results</button>
    `;
    const input = document.getElementById('result-town-input');
    const submit = document.getElementById('result-town-submit');
    let lastResult = null;
    
    const isUsable = () => lastResult
        && lastResult.locality
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
            types: ['(cities)'],
            fields: ['address_component'],
        });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const locality = place.address_components.filter(c => c.types.includes('locality'))[0];
        const country = place.address_components.filter(c => c.types.includes('country'))[0];
        lastResult = {
            locality : locality ? locality.short_name: null,
            country : country ? country.long_name: null,
            countryCode : country ? country.short_name: null,
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
function renderResultScreen(params, {result: elements, location}) {

    console.log(location);
    console.log(elements);
    const isPresentInCity = () => false;

    const md = window.markdownit();
    setLinkTargetToBlank(md);
    
    const renderResults = elements => `
        <h4>The data you entered
        (<a href="https://services342876.typeform.com/to/H8DLJt">start over</a>)
        </h4>
        <p>
        ${['role', 'goals', 'types', 'skills', 'investment'].reduce((acc, p) => {
            const group = [].concat(params[p] || []);
            return group.length > 0
                ? [ ...acc, renderInputTagGroup(p, group)]
                : acc;
        }, [])
        .join('. ')}
        </p>
        ${elements.map(renderElement).join('')}
        `;

    const renderInputTagGroup = (param, responseTags) => 
    `<span class="results-input-tag-group">
        <span class="results-input-tag-group-question">${questionToLabel(param)}: </span>
        ${responseTags
            .map(tag => `<span class="results-tag input-tag-${tag}">${tagToLabel(tag)}</span>`)
            .join('')}</span>`;

    const renderElement = (element, index) => {
        switch(element.type){
            case 'initiatives': return initiativeSet(element, index + 1)
            case 'restart-link': return restartLink(index + 1);
            case 'cf-b2b': return crisisFightersB2B(index + 1);
            case 'ideas': return ideas(index + 1);
            case 'contribute': return contribute(index + 1);
            default: return `<p>Unknown: ${element.type}</p>`;
        }
    }
    
    const restartLink = () => `
    <div class="results-element results-help-others">
        <h2>Interested in other initiatives?</h2>
        <p>There are other, very interesting initiatives that you could join as an individual.</p>
        <button>Find Interesting Initiatives</button>
    </div>`;

    const crisisFightersB2B = index => `
    <div class="results-element results-crisisfighters-b2b">
        <h2>Suggestion ${index}: Make your company part of the solution</h2>
        <p>Ask your employees to put one hour per month into improving CrisisFighters and talk about it to get more people to engage.</p>
        <button>CrisisFighters B2B</button>
    </div>`;

    const ideas = index => `
    <div class="results-element results-ideas">
        <h2>Suggestion ${index}: Start Your Own</h2>
        <p>There are many good ideas out there for how you can invest your time best. We collect some of them. Check them out, use them and add your own!</p>
        <button>Show Ideas</button>
    </div>`;

    const contribute = index => `
    <div class="results-element results-contribute">
        <h2>Suggestion ${index}: Help CrisisFighters.org!</h2>
        <p>TODO copy. Crowd-sourcing, talking about it</p>
        <button>Contribute</button>
    </div>`;

    const initiativeSet = ({headline, description, query}, index) =>`
        <div class="results-element results-initiative-set">
            <h2>Suggestion ${index}: ${md.renderInline(headline)}</h2>
            <p>${md.renderInline(description)}</p>
            <div class="results-initiatives-wrapper">
            ${queryInitiatives(query, isPresentInCity).map(initiative).join('')}
            </div>
        </div>`;

        const sortOrder = ['good', 'is', 'use', 'support'];
        const sortTags = (a, b) => {
            return sortOrder.indexOf(a.substr(0, a.indexOf('-')))
            - sortOrder.indexOf(b.substr(0, b.indexOf('-')))
            ;
        };
        const tagShouldBeInList = tag => tag.indexOf('skill-') !== 0
            && tag.indexOf('join-') !== 0;

    const initiative = initiative => `
        <div class="initiative">
            <h3><a href="${initiative.meta.link}" target="_blank">${initiative.meta.name}</a></h3>
            <div class="initiative-tag-wrapper">
            ${initiative.meta.tagsRelevant.sort(sortTags).filter(tagShouldBeInList).map(tag(true)).join('')}
            ${initiative.meta.tagsInteresting.sort(sortTags).filter(tagShouldBeInList).map(tag(false)).join('')}
            </div
            <p>${md.renderInline(initiative.description ? initiative.description.content : '')}</p>
        </div>
        `;

    const tag = relevant => tag => {
        const classes = [
            'results-tag',
            ...(relevant ? ['results-tag-relevant'] : []),
            'results-tag-' + tag.substr(0, tag.indexOf('-')),
            'results-tag-' + tag
        ];
        return `
            <span class="${classes.join(' ')}">${tagToLabel(tag)}</span>
        `;
    }
    
    document.getElementById('recruiter-screen').innerHTML = renderResults(elements);
}
function queryInitiatives(query, isPresentInCity) {
    return exports.initiatives
        .filter(initiative => query(
            [...initiative.meta.tagsInteresting, ...initiative.meta.tagsRelevant],
            isPresentInCity))
        .sort((a, b) => 
            [...b.meta.tagsInteresting, ...b.meta.tagsRelevant]
            .filter(t => t.indexOf('good-') === 0)
            .legth
            -
            [...a.meta.tagsInteresting, ...a.meta.tagsRelevant]
            .filter(t => t.indexOf('good-') === 0)
            .length
        );
}

function determineResultDescriptor(params, location) {
    if(params.role === 'user-special-city-official') {
        return {
            result: [
                {
                    type: 'initiatives',
                    headline: 'Are you a member of these networks?',
                    description: 'These networks connect and help cities to make housing more energy-efficient and move cities closer to the goal of net carbon neutrality.',
                    query: tags => tags.includes('good-at-cities-and-housing')
                    && tags.includes('is-network'),
                },
                {
                    type: 'initiatives',
                    headline: 'Does your Municipality own stock?',
                    description: 'These initiatives let you transfer your stock voting rights. They then go to annual meetings to exercise these rights in the best interest of sustainable development, fighting the climate crisis and protecting human rights.',
                    query: tags => tags.includes('use-stock-voting-rights'),
                },
                {
                    type: 'initiatives',
                    headline: 'Support Grassroots Initiatives',
                    description: 'It\'s likely that one or more of these initiatives have local groups in your city. Grassroots initiatives often have a hard time finding space to do workshops or meet. Probably you know how to provide them with desperately needed space at no or small cost.',
                    query: tags => tags.includes('is-grassroots'),
                },
                { type: 'restart-link' },
            ]
        };

    } else if(params.role === 'user-special-high-in-corporate') {
        return {
            result : [
                {
                    type: 'initiatives',
                    headline: 'These Initiatives work with Corporations',
                    description: 'TODO tags',
                    query: tags => 
                    tags.includes('lobby-corporations')
                    || tags.includes('is-owned-by-companies'),
                },
                { type: 'cf-b2b' },
                { type: 'restart-link' },
            ],
        };

    } else if(params.role === 'user-special-high-in-ngo') {
        return {
            result: [
                {
                    type: 'initiatives',
                    headline: 'These Funds might support you',
                    description: 'Of course this depends on what kind of NGO you run and your financial needs. These funds try their best at providing resources to individuals or initiatives that fight the climate crisis.',
                    query: tags => tags.includes('is-fund'),
                },
                {
                    type: 'initiatives',
                    headline: 'Thought about joining a network?',
                    description: 'The movement is stronger together. These networks connect initiatives and individuals to exchange ideas and coordinate.',
                    query: tags => tags.includes('is-network'),
                },
                { type: 'restart-link' },
            ]
        };
    }

    // assuming user-special-none'
    return {
        locationMissing: params.investment === 'user-investment-time'
                        && !location.countryCode,
        result: [
            {
                type: 'initiatives',
                headline: 'These are your relevant initiatives',
                description: 'If you fell something is wrong or missing, please reach out or contribute',
                query: (tags, isPresentInCity) => {
                    // console.log(params.goals);
                    return tags.some(tag => params.types.includes(tag))
                    // && tags.some(tag => params.goals.includes(tag))
                    && ( 
                         params.investment === 'user-investment-money'
                        || tags.some(tag => params.skills.includes(tag))
                    )
                    && (
                        tags.includes('is-grassroots')
                        ||
                        params.investment === 'user-investment-time'
                        && isPresentInCity()
                    )
                    },
                // query: (tags, isPresentInCity) =>
                //     tags.some(tag => params.types.includes(tag))
                //     && tags.some(tag => params.goals.includes(tag))
                //     && tags.some(tag => params.skills.includes(tag))
                //     && (
                //         tags.includes('is-grassroots')
                //         ||
                //         params.investment === 'user-investment-time'
                //         && isPresentInCity()
                //     ),
                // query: '(' + [
                //     params.types.join(' || '),
                //     params.goals.join(' || '),
                //     params.skills.join(' || '),
                //     params.investment === 'user-investment-time'
                //     ? 'is-grassroots || {{LOCATION_CONDITION}}'
                //     : 'is-grassroots'
                // ].filter(e => e)
                // .join(') && (') + ')',
            }, 
            ...(
                params.skills.includes('skill-creative-media')
                ? [{
                    type: 'creative-brief'
                }]
                : []
            ),
            { type: 'ideas' },
            { type: 'contribute' },
        ]
    };
    throw new Error('Could not determine');
}

function labelToTag(label) {
    for(let tag in exports.tagLabels) {
        if(exports.tagLabels[tag] === label) {
            return tag;
        }
    }
    if(!invalidTags.includes("label: " + label)) {
        invalidTags.push("label: " + label);
    }
    return null;
}

function tagToLabel(tag) {
    for(let tagEntry in exports.tagLabels) {
        if(tagEntry === tag) {
            return exports.tagLabels[tag];
        }
    }
    if(!invalidTags.includes(tag)) {
        invalidTags.push(tag);
    }
    return null;
}

function logInvalidTags(){
    console.log('Invalid Tags:');
    console.log(invalidTags);
}

function questionToLabel(param){
    return ({
        role: 'Special Role',
        goals: 'Goals',
        types: 'Types of Initiative',
        skills: 'Skills',
        investment: 'Your Contribution',
    })[param];
}