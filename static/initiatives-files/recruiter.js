function renderInitiatives(tableId, {data, fields}) {
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
        renderResult(resultDescriptor.result);
    }
};
function determineResultDescriptor(params) {}
    if(params.role === 'user-special-city-official') {
        return {
            result: [
                {
                    type: 'initiatives',
                    copy: 'Collaborate with these organizations to improve energy efficiency and wellbeing',
                    query: 'good-at-cities-and-housing',
                },
                {
                    type: 'initiatives',
                    copy: 'If your cities holds stock in publicly traded companies',
                    query: 'use-stock-voting-rights',
                },
                {
                    type: 'initiatives',
                    copy: 'Provide event space and rooms for workshops of these initiatives',
                    query: 'is-grassroots',
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
                    query: 'lobby-corporations && is-network',
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
                    query: 'is-fund',
                },
                {
                    type: 'initiatives',
                    copy: 'It might be interesting to join one of these networks',
                    query: 'is-network',
                },
                { type: 'restart-link' },
            ]
        };
    }

    // assuming user-special-none')
    return {
        locationMissing: params.investment === 'user-investment-time',
        result: [
            {
                type: 'initiatives',
                copy: 'These initiatives are interesting for you',
                query: '(' + [
                    params.types.join(' || '),
                    params.goals.join(' || '),
                    params.skills.join(' || '),
                    params.investment === 'user-investment-time'
                    ? 'is-grassroots || {{LOCATION_CONDITION}}'
                    : 'is-grassroots'
                ].filter(e => e)
                .join(') && (') + ')',
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

