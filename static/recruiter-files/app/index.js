var invalidTags = [];

function resultScreenApp() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const userParams = exports.logic.extractParams(urlParams);
   
    if(!userParams) {
        return renderStartPage();
    }

    const location = {
        locality: urlParams.get('locality'),
        country: urlParams.get('country'),
        countryCode: urlParams.get('countryCode'),
        economicArea: economicArea(urlParams.get('countryCode')),
    };
    const resultDescriptor = exports.logic.determineResultDescriptor(userParams, location);

    console.log(userParams);
    if(resultDescriptor.locationMissing) {
        renderLocationSelector(userParams, resultDescriptor);
    } else {
        renderResultScreen(userParams, resultDescriptor, location);
    }
    logInvalidTags();
}

function economicArea(code) {
    for(let area in exports.logic.economicAreas) {
        if(exports.logic.economicAreas[area].includes(code)) {
            return 'l-' + area;
        }
    }
    return null
}