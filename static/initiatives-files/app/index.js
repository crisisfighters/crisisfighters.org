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
    const resultDescriptor = exports.logic.determineResultDescriptor(params, location);

    console.log(params);
    if(resultDescriptor.locationMissing) {
        renderLocationSelector(params, resultDescriptor);
    } else {
        renderResultScreen(params, resultDescriptor, location);
    }
    logInvalidTags();
}