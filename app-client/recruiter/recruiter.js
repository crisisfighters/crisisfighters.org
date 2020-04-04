import {extractParams, determineResultDescriptor, economicAreas} from './common/logic';
import {labelToTag, logInvalidTags} from './initiatives';
import showStartPage from './render/showStartPage';
import showLocationSelector from './render/showLocationSelector';
import showResultScreen from './render/showResultScreen';

function resultScreenApp() {
    const urlParams = new URLSearchParams(window.location.search);
    const userParams = extractParams(urlParams, labelToTag);
   
    if(!userParams) {
        showStartPage();
        return;
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
        showLocationSelector(userParams, resultDescriptor);
    } else {
        showResultScreen(userParams, resultDescriptor, location);
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