export const sortOrder = ['good', 'is', 'goal', 'use', 'support', 'l'];
export const sortTags = (a, b) => {
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
};

export const possibleParams = ['investment-area', 'role', 'company', 'contribution', 'time'];
export const questionToLabel = param => ({
    role: cfStrings.recruiter.tags.role,
    company: cfStrings.recruiter.tags.company,
    contribution: cfStrings.recruiter.tags.contribution,
    time: cfStrings.recruiter.tags.time,
    'investment-area': cfStrings.recruiter.tags.investmentArea,
})[param];

export const extractParams = (urlParams, labelToTag) => {
    
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
};

export const tagShouldBeVisibleInList = tag => !tag.startsWith('skill-')
    && !tag.startsWith('join-')
    && !tag.startsWith('propagate-')
    && !tag.startsWith('suggest-');

export const determineResultDescriptor = (userParams, location) => {

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
            ...cfStrings.recruiter.municipalityNetwork,
            query: tags => tags.includes('good-cities-and-housing')
                    && tags.includes('is-network')
                    && locationMatches(tags),
        });
        result.result.push({
            type: 'initiatives',
            ...cfStrings.recruiter.municipalityStock,
            query: tags => tags.includes('use-stock-voting-rights'),
        });
        result.result.push({
            type: 'initiatives',
            ...cfStrings.recruiter.supportGrassroots,
            query: tags => tags.includes('is-grassroots') && locationMatches(tags),
        });
    }

    if(contribution.includes('user-contribution-money')) {
        result.result.push({
            type: 'initiatives',
            ...cfStrings.recruiter.investHere,
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

        /*TODO find and add resource on how non-leadership members can organize*/
        result.result.push({
            type: 'initiatives',
            style: {small: true},
            ...cfStrings.recruiter.companyReduce,
            query: tags => tags.includes('consult-companies-reduce') && locationMatches(tags),
        });

        if(company.includes('user-company-building')) {
            result.result.push({
                type: 'initiatives',
                style: {small: true},
                // TODO find and add resource on how non-leadership members can organize
                ...cfStrings.recruiter.buildingCompanyReduce,
                query: tags => tags.includes('consult-building-companies') && locationMatches(tags),
            });
        }
        result.result.push({
            type: 'initiatives',
            ...cfStrings.recruiter.companyNetworks,
            query: tags => 
                tags.includes('is-network')
                && tags.includes('target-companies')
                && locationMatches(tags),
        });
        // if(company.includes('user-company-less-than-1000-employees')) {
            // result.result.push({ type: 'cf-b2b' });
        // }
    }
    if(role.includes('user-role-active-in-ngo')) {
        // Only change locationMissing if this is the only selected role
        if(role.length === 1) {
            result.locationMissing = false;
        }
        result.result.push({
            type: 'initiatives',
            ...(cfStrings.recruiter.receiveInitiativeFunding),
            query: tags => tags.includes('support-funds-initiatives'),
        });
        result.result.push({
            type: 'initiatives',
            ...cfStrings.recruiter.ngoNetworks,
            query: tags => tags.includes('is-network')
                && tags.includes('support-connect-activists-or-initiatives'),
        });
        result.result.push({
            type: 'initiatives',
            ...cfStrings.recruiter.ngoTraining,
            query: tags => tags.includes('support-train-activists'),
        });
    }

    if(role.includes('user-role-health-worker')) {
        result.result.push({
            type: 'initiatives',
            ...cfStrings.recruiter.healthWorker,
            query: tags => tags.includes('target-health-workers') && locationMatches(tags),
        });
    }
    if(role.includes('user-role-faith-leader')) {
        result.result.push({
            type: 'initiatives',
            ...cfStrings.recruiter.faithLeader,
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
            ...cfStrings.recruiter.join,
            query: tags => tags.some(tag => suggestTags.includes(tag))
                            && locationMatches(tags),
        });
    }

    if(!role.includes('user-role-employed') && !role.includes('user-role-faith-leader')) {
        result.result.push({type: 'climate-pledge'});
        result.result.push({
            type: 'initiatives',
            ...cfStrings.recruiter.receiveIndividualFunding,
            query: tags => 
                tags.includes('support-funds-individuals')
                && locationMatches(tags),
        });
    }

    result.result.push({
        type: 'initiatives',
        ...cfStrings.recruiter.litigation,
        query: tags => tags.includes('use-litigation') && locationMatches(tags),
    });
    result.result.push({ type: 'ideas' });
    result.result.push({ type: 'contribute' });
    return result;
};

export const scoreInitiative = ({meta: {tags}}) =>
    100 * tags.filter(t => t.startsWith('good-') || t === 'good-high-momentum').length
    + 10 * tags.length;
    
export const sortInitiatives = (a, b) => scoreInitiative(b) - scoreInitiative(a);
    // b.meta.tags
    // .filter(t => t.startsWith('good-'))
    // .length
    // -
    // a.meta.tags
    // .filter(t => t.startsWith('good-'))
    // .length,

export const economicAreas = {
    europe: [
        'al','ad','at', 'bg', 'ba', 'be', 'by', 'ch', 'cy', 'cz', 'ee', 'de', 'dk', 'es', 'fi', 'fr', 'gb', 'gf', 'hr', 'tf', 'gi', 'gr', 'gl', 'va', 'hu', 'is', 'ie', 'im', 'it', 'lv', 'li', 'lt', 'lu', 'md', 'mc', 'mn', 'ms', 'me', 'ma', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'rs', 'sk', 'si', 'se', 'pf', 'tr',
    ],
};
