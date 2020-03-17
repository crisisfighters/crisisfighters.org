import {extractParams, determineResultDescriptor, economicAreas} from './logic';
import {renderStartPage, renderLocationSelector, renderResultScreen} from './render';
import {logInvalidTags} from './initiatives';

function resultScreenApp() {
    const urlParams = new URLSearchParams(window.location.search);
    const userParams = extractParams(urlParams);
   
    if(!userParams) {
        return renderStartPage();
    }

    const location = {
        locality: urlParams.get('locality'),
        country: urlParams.get('country'),
        countryCode: urlParams.get('countryCode'),
        economicArea: economicArea(urlParams.get('countryCode')),
    };
    const resultDescriptor = determineResultDescriptor(userParams, location);

    console.log(userParams);
    if(resultDescriptor.locationMissing) {
        renderLocationSelector(userParams, resultDescriptor);
    } else {
        renderResultScreen(userParams, resultDescriptor, location);
    }
    logInvalidTags();
}

function economicArea(code) {
    for(let area in economicAreas) {
        if(economicAreas[area].includes(code)) {
            return 'l-' + area;
        }
    }
    return null
}

window.onload = resultScreenApp;