exports.logic = {
    surveyLink: 'https://services342876.typeform.com/to/H8DLJt',
    sortOrder: ['good', 'is', 'goal', 'use', 'support'],
    possibleParams: ['role', 'employer', 'investment', 'time'],
    questionToLabel: param => ({
        role: 'Role',
        employer: 'Your Company',
        investment: 'Your Contribution',
        time: 'Your Involvement',
    })[param],
    extractParams: urlParams => {
        const convert = name => urlParams
            .get(name)
            .split(', ')
            .filter(v=> v !== '_____')
            .map(labelToTag)
            .filter(tag => tag);

        return urlParams.has('role') && urlParams.has('investment') && urlParams.has('time')
               ? {
                    role: convert('role')[0],
                    employer: convert('employer')[0],
                    investment: convert('investment')[0],
                    time: convert('time'),
                }
               : null;
    },
    tagShouldBeVisibleInList: tag => tag.indexOf('skill-') !== 0
        && tag.indexOf('join-') !== 0
        && tag.indexOf('l-') !== 0
        && tag.indexOf('propagate-') !== 0,
    determineResultDescriptor: (userParams, location) => {

        const locationMatches = tags => tags.includes('l-global') || tags.includes('l-' + location.countryCode);

        if(userParams.role === 'user-role-city-official') {
            return {
                locationMissing: !location.countryCode,
                result: [
                    {
                        type: 'initiatives',
                        headline: 'Are you a member of these networks?',
                        description: 'These networks connect and help cities to make housing more energy-efficient and move cities closer to the goal of net carbon neutrality.',
                        query: tags => tags.includes('good-cities-and-housing')
                                        && tags.includes('is-network')
                                        && locationMatches(tags),
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
                        query: tags => tags.includes('is-grassroots') && locationMatches(tags),
                    },
                    { type: 'restart-link' },
                ]
            };
    
        } else if(userParams.role === 'user-role-employed') {
            return {
                locationMissing: !location.countryCode,
                result : [
                    {
                        type: 'aaa',
                        headline: 'AAA',
                        description: userParams.employer.includes('user-employer-high-ranking')
                                ? 'TODO manager'
                                : 'TODO organize',
                    }, {
                        type: 'initiatives',
                        headline: 'Have your company reduce and disclose its emissions',
                        description: userParams.employer.includes('user-employer-high-ranking')
                                ? 'TODO Reduce your carbon footprint and with support and certification from these organizations'
                                : 'TODO organize to',
                        query: tags => 
                                (
                                    tags.includes('consult-companies-disclose')
                                    || tags.includes('consult-companies-reduce')
                                )
                                && (
                                    userParams.employer !== 'user-employer-building'
                                    || tags.includes('consult-building-companies')
                                )
                                && locationMatches(tags),
                    }, {
                        type: 'initiatives',
                        headline: 'Have your company disclose its emissions',
                        description: userParams.employer.includes('user-employer-high-ranking')
                                ? 'TODO Reduce your carbon footprint and with support and certification from these organizations'
                                : 'TODO organize to',
                        query: tags => 
                                tags.includes('consult-companies-disclose')
                                && (
                                    userParams.employer !== 'user-employer-building'
                                    || tags.includes('consult-building-companies')
                                )
                                && locationMatches(tags),
                    }, {
                        type: 'initiatives',
                        headline: 'Get Certified for going Net Zero',
                        description: 'TODO Reduce your carbon footprint and with support and certification from these organizations',
                        query: tags => tags.includes('certify-companies') && locationMatches(tags),
                    }, {
                        type: 'initiatives',
                        headline: 'Is your Company part of these networks?',
                        description: 'These initiatives connect companies to support each other in realizing a more sustainable vision for the future.',
                        query: tags => 
                            tags.includes('is-network')
                            && tags.includes('target-companies')
                            && locationMatches(tags),
                    },
                    { type: 'cf-b2b' },
                    { type: 'restart-link' },
                ],
            };
    
        } else if(userParams.role === 'user-role-active-in-ngo') {
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
                        headline: 'Here the members of your NGO can get training',
                        description: 'Many initiatives offer training and educational resources for activists. Your NGO can benefit from these resources.',
                        query: tags => tags.includes('support-train-activists'),
                    },
                    { type: 'restart-link' },
                ],
            };
        } else if(userParams.role === 'user-role-health-worker') {
            return {
                result: [
                    {
                        type: 'initiatives',
                        headline: 'Connect with Health Workers who raise awareness in their communities',
                        description: 'TODO copy',
                        query: tags => tags.includes('relevant-for-health-workers') && locationMatches(tags),
                    },
                    { type: 'restart-link' },
                ],
            };
        } else if(userParams.role === 'user-role-faith-leader') {
            return {
                result: [
                    {
                        type: 'initiatives',
                        headline: 'Connect with Faith Leaders who raise awareness in their communities',
                        description: 'TODO copy',
                        query: tags => tags.includes('relevant-for-faith-leaders') && locationMatches(tags),
                    },
                    { type: 'restart-link' },
                ],
            };
        }
    
        // assuming user-role-none'

        const joinTags = userParams.time.map(t => ({
            'user-time-employment': 'join-paid',
            'user-time-internship': 'join-internship',
            'user-time-volunteer': 'join-unpaid',
        }[t]));

        return {
            locationMissing: userParams.investment === 'user-investment-time'
                            && !location.countryCode,
            result: [
                {
                    type: 'initiatives',
                    headline: 'Help Here',
                    description: 'If you fell something is wrong or missing, please reach out or contribute',
                    query: tags => {
                        // console.log(userParams.goals);
                        return  ( 
                            userParams.investment === 'user-investment-money'
                                    || tags.some(tag => joinTags.includes(tag))
                                ) && (
                                    userParams.investment === 'user-investment-money'
                                    ||
                                    // user-investment-time
                                    locationMatches(tags)
                                )
                    },
                }, 
                ...(
                    userParams.role === 'user-role-creative'
                    ? [{
                        type: 'creative-brief'
                    }]
                    : []
                ),
                {
                    type: 'initiatives',
                    headline: 'Do you know of any high-carbon projects?',
                    description: 'In the [2016 Paris Agreement](https://en.wikipedia.org/wiki/Paris_Agreement), 194 states agreed bindingly to limit global heating to 1.5C. Do you know of a planned high-carbon project in your town or country? If the Paris agreement hasn\'t been considered during planning or the project or policy would make it much harder for your country to meet its commitment in the Paris Agreement, there\'s a realistic chance that you can stop it. The first successes include the fight against a [third runway for London Heathrow](https://www.theguardian.com/environment/2020/feb/27/heathrow-third-runway-ruled-illegal-over-climate-change) and a judgment in favor of [Urgenda](https://www.urgenda.nl) to [force the Dutch Government to abide by the Paris Agreement](https://www.urgenda.nl/en/themas/climate-case/).\n\nThis worked before. When 35 countries, including the USSR agreed to upholding human rights in the [1975 Helsinki Accord](https://en.wikipedia.org/wiki/Helsinki_Accords), that had [far-reaching political impact](https://en.wikipedia.org/wiki/Helsinki_Accords#Reception_and_impact) and contributed Glasnost and Perestroika.\n\nThe initiatives below succcessfully use litigation as a tool.',
                    query: tags => tags.includes('use-litigation') && locationMatches(tags),
                }, 
                { type: 'ideas' },
                { type: 'contribute' },
            ]
        };
        throw new Error('Could not determine');
    },
};