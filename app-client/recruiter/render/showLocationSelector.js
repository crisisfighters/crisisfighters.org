import {renderMd, renderMdParagraph} from './markdown';

// ! This directly updates the DOM and registers events.
export default function showLocationSelector() {
    
    document.getElementById('recruiter-screen').innerHTML = 
    renderMdParagraph(cfStrings.recruiter.locationSelector.text) + `
        <input id="result-town-input" autofocus placeholder="${cfStrings.recruiter.locationSelector.placeholder}" type="text"/>
        <button id="result-town-submit" class="button button-primary" disabled>${renderMd(cfStrings.recruiter.locationSelector.button)}</button>
    `;
    const input = document.getElementById('result-town-input');
    const submit = document.getElementById('result-town-submit');
    let lastResult = null;
    
    const isUsable = () => lastResult
        // && lastResult.locality
        && lastResult.country
        && lastResult.countryCode;

    submit.onclick = () => isUsable()
        ? document.location.href= document.location.href + 
            `&locality=${lastResult.locality}&country=${lastResult.country}&countryCode=${lastResult.countryCode}`
        : true;

    const autocomplete = new google.maps.places.Autocomplete(
        input,
        {
            // types: ['(cities)'],
            types: ['(regions)'],
            fields: ['address_component'],
        });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const locality = place.address_components.filter(c => c.types.includes('locality'))[0];
        const country = place.address_components.filter(c => c.types.includes('country'))[0];
        lastResult = {
            locality : locality ? locality.short_name: null,
            country : country ? country.long_name: null,
            countryCode : country ? country.short_name.toLowerCase(): null,
        };
        
        if(isUsable()) {
            submit.removeAttribute('disabled');
        }
    });
}