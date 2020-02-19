function resultScreenApp() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const params = {
        role: labelToTag(urlParams.get('role')),
        goals: urlParams.get('goals').split(', ').map(labelToTag).filter(tag => tag),
        types: urlParams.get('types').split(', ').map(labelToTag).filter(tag => tag),
        skills: urlParams.get('skills').split(', ').map(labelToTag).filter(tag => tag),
        investment: labelToTag(urlParams.get('investment')),
    };
    const resultDescriptor = determineResultDescriptor(params);

    console.log(params);
    console.log(resultDescriptor);
    if(resultDescriptor.locationMissing) {
        renderLocationSelector(resultDescriptor.result);
    } else {
        renderResultScreen(resultDescriptor.result);
    }
}

function renderLocationSelector(result) {
    const template = Handlebars.compile(`
    {{#each element}}
        <li>{{this.type}}</li>
    {{/each}}
    `);
    document.getElementById('recruiter-screen').innerHTML = template({elements: result});
}

function renderResultScreen(elements) {

    const isPresentInCity = () => false;

    const renderResults = elements => `
        <h1>Result</h1>
        ${elements.map(renderElement).join()}
        `;

    const renderElement = (element) =>
        element.type === 'initiatives'
        ? initiativeSet(element)
        : `<p>Unknown: ${element.type}</p>`;

    const initiativeSet = ({copy, query}) =>`
        <div class="result-initiative-set">
            <h2>Initiatives</h2>
            <p>${copy}</p>
            <div class="result-initiatives-wrapper">
            ${queryInitiatives(query, isPresentInCity).map(initiative)}
            </div>
        </div>
        `;
    
    const initiative = initiative => `
        <div class="initiative">
            <h3><a href="${initiative.meta.link}" target="_blank">${initiative.meta.name}</a></h3>
            <div class="initiative-tag-wrapper">
                ${initiative.meta.keywords ? initiative.meta.keywords.map(tag).join() : ''}
            </div
            <p>${initiative.description ? initiative.description.content : ''}</p>
        </div>
        `;

    const tag = tag => `
        <span="result-tag result-tag-${tag}">${tagToLabel(tag)}</span>
        `;

    document.getElementById('recruiter-screen').innerHTML = renderResults(elements);
}
function queryInitiatives(query, isPresentInCity) {
    return exports.data.filter(initiative => query(initiative.meta.keywords || [], isPresentInCity));
}

function determineResultDescriptor(params) {
    if(params.role === 'user-special-city-official') {
        return {
            result: [
                {
                    type: 'initiatives',
                    copy: 'Collaborate with these organizations to improve energy efficiency and wellbeing',
                    query: tags => tags.includes('good-at-cities-and-housing'),
                },
                {
                    type: 'initiatives',
                    copy: 'If your cities holds stock in publicly traded companies',
                    query: tags => tags.includes('use-stock-voting-rights'),
                },
                {
                    type: 'initiatives',
                    copy: 'Provide event space and rooms for workshops of these initiatives',
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
                    copy: 'These organizations work with corporations. Wanna join?',
                    query: tags => tags.includes('lobby-corporations') && tags.includes('is-network'),
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
                    copy: 'These initiatives can provide you with funding',
                    query: tags => tags.includes('is-fund'),
                },
                {
                    type: 'initiatives',
                    copy: 'It might be interesting to join one of these networks',
                    query: tags => tags.includes('is-network'),
                },
                { type: 'restart-link' },
            ]
        };
    }

    // assuming user-special-none')

    // tags = [is-ngo, uses-civil-disobedience]
    // types = [is-ngo, is-fund]

    return {
        locationMissing: params.investment === 'user-investment-time',
        result: [
            {
                type: 'initiatives',
                copy: 'These initiatives are interesting for you',
                query: (tags, isPresentInCity) =>
                    tags.some(tag => params.types.includes(tag))
                    && tags.some(tag => params.goals.includes(tag))
                    && tags.some(tag => params.skills.includes(tag))
                    && (
                        tags.includes('is-grassroots')
                        ||
                        params.investment === 'user-investment-time'
                        && isPresentInCity()
                    ),
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
    return null;
}

function tagToLabel(tag) {
    for(let tagEntry in exports.tagLabels) {
        if(tagEntry === tag) {
            return exports.tagLabels[tag];
        }
    }
    return null;
}

