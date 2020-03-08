exports.logic = {
    surveyLink: 'https://services342876.typeform.com/to/jkPJe0',
    sortOrder: ['good', 'is', 'goal', 'use', 'support', 'l'],
    sortTags: (a, b) => {
        const {sortOrder} = exports.logic;
        const aStart = a.substr(0, a.indexOf('-'));
        const bStart = b.substr(0, b.indexOf('-'));
        const posA = sortOrder.indexOf(aStart);
        const posB = sortOrder.indexOf(bStart);
        return aStart === bStart
        // Both tags have the same start: Sort based on locale
            ? a.localeCompare(b)
            : posA >= 0 && posB >=0
                // Both tags' starts are part of sortOrder: sort by SortOrder
                ? posA - posB
                : posA === -1 && posB === -1
                    // Both tags' starts are not part of sortOrder: sort based on locale
                    ? a.localeCompare(b)
                    : posA === -1
                        // start of b is part of sortOrder
                        ? 1
                        // start of a is part of sortOrder
                        : -1;
    },
    possibleParams: ['investment-area', 'role', 'company', 'contribution', 'time'],
    questionToLabel: param => ({
        role: 'You',
        company: 'Your Company',
        contribution: 'Your Contribution',
        time: 'Time Commitment',
        'investment-area': 'Areas',
    })[param],
    extractParams: urlParams => {
        
        const convert = (name, m) => urlParams
            .get(name)
            .split(', ')
            .filter(v => v !== '_____')
            .map(v => m ? m(v) : v)
            .map(labelToTag)
            .filter(tag => tag);

        return urlParams.has('role') && urlParams.has('contribution') && urlParams.has('time')
               ? {
                    role: convert('role'),
                    company: convert('company'),
                    contribution: convert('contribution'),
                    time: convert('time'),
                    'investment-area': convert('investment-area', label => 'Good at ' + label),
                }
               : null;
    },
    tagShouldBeVisibleInList: tag => tag.indexOf('skill-') !== 0
        && tag.indexOf('join-') !== 0
        && tag.indexOf('propagate-') !== 0
        && tag.indexOf('suggest-') !==0,

    determineResultDescriptor: (userParams, location) => {

        const locationMatches = tags => tags.includes('l-global')
                                        || (location.economicArea && tags.includes(location.economicArea))
                                        || tags.includes('l-' + location.countryCode);

        const result = {
            locationMissing: !location.countryCode,
            result: [],
        };
        // clone non-atomic values to make mutable and remove decorative options;
        const role = userParams.role.filter(r => r !== 'user-role-none');
        const company = [...userParams.company];
        let contribution = [...userParams.contribution];
        let time = [...userParams.time];
        const investmentArea = [...userParams['investment-area']];

        if(time.includes('user-time-none')) {
            if(time.length === 1) {
                // Because of possible logical jumps in between the question how the user wants to
                // spend their time doesn't come right after the user stated that they want to invest time
                // Therefore when asked how much time they want to spend, they can opt out off spending any
                // time at all. The following lines make the data consistent again.
                contribution = contribution.filter(r => r !== 'user-contribution-time');
                
            }
            // If the user selected multiple options, we can disregard user-time-none.
            time = time.filter(t => t !== 'user-time-none');
        }

        if(role.includes('user-role-city-official')) {
            result.result.push({
                type: 'initiatives',
                headline: 'Is your municipality a member of these networks?',
                description: 'These networks connect and help cities to make housing more energy-efficient and move cities closer to the goal of net carbon neutrality.',
                query: tags => tags.includes('good-cities-and-housing')
                                && tags.includes('is-network')
                                && locationMatches(tags),
            });
            result.result.push({
                type: 'initiatives',
                headline: 'Does your municipality own stock?',
                description: 'These initiatives let you transfer your stock voting rights. They then go to annual meetings to exercise these rights in the best interest of sustainable development, fighting the climate crisis and protecting human rights.',
                query: tags => tags.includes('use-stock-voting-rights'),
            });
            result.result.push({
                type: 'initiatives',
                headline: 'Support Grassroots Initiatives',
                description: 'It\'s likely that one or more of these initiatives have local groups in your city. Grassroots initiatives often have a hard time finding space to do workshops or meet. Probably you know how to provide them with desperately needed space at no or small cost.',
                query: tags => tags.includes('is-grassroots') && locationMatches(tags),
            });
        }

        if(contribution.includes('user-contribution-money')) {
            result.result.push({
                type: 'initiatives',
                headline: 'Invest Here',
                description: 'Each of the these initiatives is effective in at least one of the areas you want to invest in. Check out their websites to find out more and donate.',
                query: tags => tags.some(tag => investmentArea.includes(tag))
                                && tags.includes('suggest-money')
                                && locationMatches(tags),
            });
        }
        if(role.includes('user-role-creative')) {
            result.result.push({type: 'creative-brief'});
        }

        if(role.includes('user-role-employed')) {
            result.result.push({
                type: 'aaa',
                isInCompanyLeadership: company.includes('user-company-leadership'),
            });

            const description = [
                'In addition to using the AA framework at your company, we can recommend these resources:',
                '* CarbonNeutral.com [provides case studies](https://www.carbonneutral.com/examples) for companies of different sizes ($ 10M to $ 1B+ anual revenue) that go carbon neutral.',
                '* The American Energy Star initiative provides a [23 page guide to create fun competitions](https://www.energystar.gov/buildings/tools-and-resources/energy-efficiency-competition-guide) for sustainable energy and water use.',
                '* The US Environmental Protection Agency [provides a lot of resources](https://www.epa.gov/climateleadership) to start yourself.',
                
                // TODO find and add resource on how non-leadership members can organize
                company.includes('user-company-leadership')
                    ? ''
                    : '',
                
                'There are many consultancies that help making companies sustainable. Most of them are not-for profit. They provide you with free resources and concrete help on how to get started. And if your company takes that path, they\'re experienced guides along the way. Check out their websites to find out more.',
            ].join('\n');

            result.result.push({
                type: 'initiatives',
                headline: 'Your Company should disclose and reduce its emissions.',
                style: {small: true},
                description,
                query: tags => 
                        tags.includes('consult-companies-reduce') && locationMatches(tags),
            });

            if(company.includes('user-company-building')) {
                result.result.push({
                    type: 'initiatives',
                    headline: 'There are Special Certifications for the Building Industry',
                    style: {small: true},
                    description: 'Building infrastructure to last is energy-intensive. These consultancies are specialized on the industry and are happy to help.'
                    + // TODO find and add resource on how non-leadership members can organize
                    company.includes('user-company-leadership')
                        ? ''
                        : '',
                    query: tags => tags.includes('consult-building-companies') && locationMatches(tags),
                });
            }
            result.result.push({
                type: 'initiatives',
                headline: 'Is your Company part of these networks?',
                description: 'These initiatives connect companies to support each other in realizing a more sustainable vision for the future.',
                query: tags => 
                    tags.includes('is-network')
                    && tags.includes('target-companies')
                    && locationMatches(tags),
            });
            if(company.includes('user-company-less-than-1000-employees')) {
                result.result.push({ type: 'cf-b2b' });
            }
        }
        if(role.includes('user-role-active-in-ngo')) {
            result.locationMissing = false;
            result.result.push({
                type: 'initiatives',
                headline: 'Get Financial Support for your Project',
                description: 'Of course this depends on what kind of NGO you run and your financial needs. These initiatives run funds that try their best at providing resources to individuals or initiatives that fight the climate crisis.\nCheck out their websites to find out which ones match your criteria and if they\'re currently making new grants.',
                query: tags => tags.includes('is-fund'),
            });
            result.result.push({
                type: 'initiatives',
                headline: 'Thought about joining a network?',
                description: 'The movement is stronger together. These networks connect initiatives and individuals to exchange ideas and coordinate.',
                query: tags => tags.includes('is-network')
                    && tags.includes('support-connect-activists-or-initiatives'),
            });
            result.result.push({
                type: 'initiatives',
                headline: 'Here your NGO\'s members can get training',
                description: 'Many initiatives offer training and educational resources for activists. Your NGO can benefit from these resources.',
                query: tags => tags.includes('support-train-activists'),
            });
        }

        if(role.includes('user-role-health-worker')) {
            result.result.push({
                type: 'initiatives',
                headline: 'Connect with Health Workers to Raise Awareness',
                description: 'These initiatives connect physicians and health workers who fight for protecting our environment.Check out their websites!',
                query: tags => tags.includes('target-health-workers') && locationMatches(tags),
            });
        }
        if(role.includes('user-role-faith-leader')) {
            result.result.push({
                type: 'initiatives',
                headline: 'Connect with Faith Leaders to Raise Awareness',
                description: 'These initiatives connect faith leaders who fight for protecting our environment. Check out their websites!',
                query: tags => tags.includes('target-faith-leaders') && locationMatches(tags),
            });
        }

        if(!role.includes('user-role-employed')
            && !role.includes('user-role-city-official')
            && contribution.includes('user-contribution-time')) {

            const suggestTags = time.map(t => ({
                'user-time-employment': 'suggest-employment',
                'user-time-internship': 'suggest-internship',
                'user-time-volunteer': 'suggest-volunteer',
            }[t]));

            result.result.push({
                type: 'initiatives',
                headline: 'Help Here',
                description: `From the ${numberOfInitiatives()} initiatives in our databse, they best match your responnses and have the highest impact. Please check out their websites to learn more!`,
                query: tags => tags.some(tag => suggestTags.includes(tag))
                                && locationMatches(tags),
            });
        }
    
        if(!role.includes('user-role-employed') && !role.includes('user-role-faith-leader')) {
            result.result.push({type: 'climate-pledge'});
        }

        result.result.push({
            type: 'initiatives',
            headline: 'Stop High-Carbon Projects',
            description: 'In the [2016 Paris Agreement](https://en.wikipedia.org/wiki/Paris_Agreement), 194 states agreed bindingly to limit global heating to 1.5C. \n\n**Do you know of a planned high-carbon project in your town or country?**\n\nIf the Paris agreement hasn\'t been considered during planning or the project or policy would make it much harder for your country to meet its commitment in the Paris Agreement, **there\'s a chance that it can be stopped**. The first successes include the fight against a [third runway for London Heathrow](https://www.theguardian.com/environment/2020/feb/27/heathrow-third-runway-ruled-illegal-over-climate-change) and a judgment in favor of [Urgenda](https://www.urgenda.nl) to [force the Dutch Government to abide by the Paris Agreement](https://www.urgenda.nl/en/themas/climate-case/).\n\nHistoric Excourse: This worked before. When 35 countries, including the USSR agreed to upholding human rights in the [1975 Helsinki Accord](https://en.wikipedia.org/wiki/Helsinki_Accords), that had [far-reaching political impact](https://en.wikipedia.org/wiki/Helsinki_Accords#Reception_and_impact) and contributed Glasnost and Perestroika.\n\nThe initiatives below can help you challenge high-carbon projects:',
            query: tags => tags.includes('use-litigation') && locationMatches(tags),
        });
        result.result.push({ type: 'ideas' });
        result.result.push({ type: 'contribute' });
        return result;
    },
    economicAreas: {
        europe: [
            'al','ad','at', 'bg', 'ba', 'be', 'by', 'ch', 'cy', 'cz', 'ee', 'de', 'dk', 'es', 'fi', 'fr', 'gb', 'gf', 'hr', 'tf', 'gi', 'gr', 'gl', 'va', 'hu', 'is', 'ie', 'im', 'it', 'lv', 'li', 'lt', 'lu', 'md', 'mc', 'mn', 'ms', 'me', 'ma', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'rs', 'sk', 'si', 'se', 'pf', 'tr',
        ],
    },
};