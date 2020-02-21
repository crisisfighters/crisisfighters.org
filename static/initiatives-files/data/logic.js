exports.logic = {
    surveyLink: 'https://services342876.typeform.com/to/H8DLJt',
    sortOrder: ['good', 'is', 'goal', 'use', 'support'],
    tagShouldBeVisibleInList: tag => tag.indexOf('skill-') !== 0
        && tag.indexOf('join-') !== 0
        && tag.indexOf('l-') !== 0
        && tag.indexOf('propagate-') !== 0,
    determineResultDescriptor: (params, location) => {
        if(params.role === 'user-special-city-official') {
            return {
                locationMissing: !location.countryCode,
                result: [
                    {
                        type: 'initiatives',
                        headline: 'Are you a member of these networks?',
                        description: 'These networks connect and help cities to make housing more energy-efficient and move cities closer to the goal of net carbon neutrality.',
                        query: tags => tags.includes('good-cities-and-housing')
                            && tags.includes('is-network')
                            && (
                                tags.includes('l-global')
                                ||
                                tags.includes('l-' + location.countryCode)
                            ),
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
                        query: tags => tags.includes('is-grassroots')
                            && (
                                tags.includes('l-global')
                                ||
                                tags.includes('l-' + location.countryCode)
                            ),
                    },
                    { type: 'restart-link' },
                ]
            };
    
        } else if(params.role === 'user-special-high-in-corporate') {
            return {
                locationMissing: !location.countryCode,
                result : [
                    {
                        type: 'initiatives',
                        headline: 'These Initiatives work with Corporations',
                        description: 'TODO tags',
                        query: tags => 
                            (
                                tags.includes('lobby-corporations')
                                ||
                                tags.includes('is-owned-by-companies')
                            )
                            && (
                                tags.includes('l-global')
                                ||
                                tags.includes('l-' + location.countryCode)
                            ),
                    },
                    {
                        type: 'initiatives',
                        headline: 'Is your Company part of these networks?',
                        description: 'These initiatives connect companies to support each other in realizing a more sustainable vision for the future.',
                        query: tags => 
                            tags.includes('is-network')
                            && tags.includes('target-corporations')
                            && (
                                tags.includes('l-global')
                                ||
                                tags.includes('l-' + location.countryCode)
                            ),
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
                        query: tags => tags.includes('is-network')
                            && tags.includes('support-connect-activists-or-initiatives'),
                    },
                    {
                        type: 'initiatives',
                        headline: 'Here the members of your NGO can get training?',
                        description: 'Many initiatives offer training and educational resources for activists. Your NGO can benefit from these resources.',
                        query: tags => tags.includes('support-train-activists'),
                    },
                    { type: 'restart-link' },
                ],
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
                    query: tags => {
                        // console.log(params.goals);
                        return tags.some(tag => params.types.includes(tag))
                        && tags.some(tag => params.goals.includes(tag))
                        && ( 
                             params.investment === 'user-investment-money'
                            || tags.some(tag => params.skills.includes(tag))
                        )
                        && (
                            params.investment === 'user-investment-money'
                            ||
                            (
                                // user-investment-time
                                tags.includes('l-global')
                                ||
                                tags.includes('l-' + location.countryCode)
                            )
                        )
                    },
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
    },
};