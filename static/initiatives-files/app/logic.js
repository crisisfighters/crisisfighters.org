exports.logic = {
    surveyLink: 'https://services342876.typeform.com/to/jkPJe0',
    sortOrder: ['good', 'is', 'goal', 'use', 'support'],
    possibleParams: ['role', 'company', 'contribution', 'time', 'investment-area'],
    questionToLabel: param => ({
        role: 'Role',
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
        && tag.indexOf('l-') !== 0
        && tag.indexOf('propagate-') !== 0,

    determineResultDescriptor: (userParams, location) => {

        const locationMatches = tags => tags.includes('l-global') || tags.includes('l-' + location.countryCode);

        const result = {
            locationMissing: !location.countryCode,

            result: [],
        };
        // clone non-atomic values to make mutable;
        const role = [...userParams.role];
        const company = [...userParams.company];
        let contribution = [...userParams.contribution];
        let time = [...userParams.time];
        const investmentArea = [...userParams['investment-area']];

        if(time.includes('user-time-none')) {
            // Because of possible logical jumps in between the question how the user wants to
            // spend their time doesn't come right after the user stated that they want to invest time
            // Therefore when asked how much time they want to spend, they can opt out off spending any
            // time at all. The following lines make the data consistent again
            contribution = contribution.filter(r => r !== 'user-contribution-time');
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
                query: tags => tags.some(tag => investmentArea.includes(tag)) && locationMatches(tags),
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
            result.result.push({
                type: 'initiatives',
                headline: 'Your Company should disclose and reduce its emissions.',
                description: company.includes('user-company-leadership')
                        ? 'TODO Reduce your carbon footprint and with support and certification from these organizations'
                        : 'TODO organize to',
                query: tags => 
                        (
                            tags.includes('consult-companies-disclose')
                            || tags.includes('consult-companies-reduce')
                        )
                        && (
                            !company.includes('user-company-building')
                            || tags.includes('consult-building-companies')
                        )
                        && locationMatches(tags),
            });
            result.result.push({
                type: 'initiatives',
                headline: 'Is your Company part of these networks?',
                description: 'These initiatives connect companies to support each other in realizing a more sustainable vision for the future.',
                query: tags => 
                    tags.includes('is-network')
                    && tags.includes('target-companies')
                    && locationMatches(tags),
            });
            result.result.push({ type: 'cf-b2b' });
        }
        if(role.includes('user-role-active-in-ngo')) {
            result.locationMissing = false;
            result.result.push({
                type: 'initiatives',
                headline: 'These Funds might support your NGO',
                description: 'Of course this depends on what kind of NGO you run and your financial needs. These funds try their best at providing resources to individuals or initiatives that fight the climate crisis.',
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
                headline: 'Here the members of your NGO can get training',
                description: 'Many initiatives offer training and educational resources for activists. Your NGO can benefit from these resources.',
                query: tags => tags.includes('support-train-activists'),
            });
        }
        if(role.includes('user-role-health-worker')) {
            result.result.push({
                type: 'initiatives',
                headline: 'Connect with Health Workers who raise awareness in their communities',
                description: 'TODO copy',
                query: tags => tags.includes('relevant-for-health-workers') && locationMatches(tags),
            });
        }
        if(role.includes('user-role-faith-leader')) {
            result.result.push({
                type: 'initiatives',
                headline: 'Connect with Faith Leaders who raise awareness in their communities',
                description: 'TODO copy',
                query: tags => tags.includes('relevant-for-faith-leaders') && locationMatches(tags),
            });
        }
    
        if(!role.includes('user-role-employed')
            && !role.includes('user-role-active-in-ngo')
            && !role.includes('user-role-city-official')
            && contribution.includes('user-contribution-time')) {

            const joinTags = time.map(t => ({
                'user-time-employment': 'join-paid',
                'user-time-internship': 'join-internship',
                'user-time-volunteer': 'join-unpaid',
            }[t]));

            result.result.push({
                type: 'initiatives',
                headline: 'Help Here',
                description: 'TODO If you fell something is wrong or missing, please reach out or contribute',
                query: tags => tags.some(tag => joinTags.includes(tag)) && locationMatches(tags),
            });

        }

        result.result.push({
            type: 'initiatives',
            headline: 'Stop High-Carbon Projects in your Area',
            description: 'In the [2016 Paris Agreement](https://en.wikipedia.org/wiki/Paris_Agreement), 194 states agreed bindingly to limit global heating to 1.5C. Do you know of a planned high-carbon project in your town or country? If the Paris agreement hasn\'t been considered during planning or the project or policy would make it much harder for your country to meet its commitment in the Paris Agreement, there\'s a realistic chance that you can stop it. The first successes include the fight against a [third runway for London Heathrow](https://www.theguardian.com/environment/2020/feb/27/heathrow-third-runway-ruled-illegal-over-climate-change) and a judgment in favor of [Urgenda](https://www.urgenda.nl) to [force the Dutch Government to abide by the Paris Agreement](https://www.urgenda.nl/en/themas/climate-case/).\n\nThis worked before. When 35 countries, including the USSR agreed to upholding human rights in the [1975 Helsinki Accord](https://en.wikipedia.org/wiki/Helsinki_Accords), that had [far-reaching political impact](https://en.wikipedia.org/wiki/Helsinki_Accords#Reception_and_impact) and contributed Glasnost and Perestroika.\n\nThe initiatives below succcessfully use litigation as a tool.',
            query: tags => tags.includes('use-litigation') && locationMatches(tags),
        });
        result.result.push({ type: 'ideas' });
        result.result.push({ type: 'contribute' });
        return result;
    },
};