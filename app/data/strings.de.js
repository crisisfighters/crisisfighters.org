import {tagLabels} from './tagLabels.en';
import welcome from './content-partials/recruiter/welcome.md';
import locationSelectorText from './content-partials/recruiter/select-country.md';
import aaa from './content-partials/recruiter/aaa.md';
import litigation from './content-partials/recruiter/litigation.md';

window.cfStrings = {
    tagLabels,
    recruiter: {
        welcome: {
            text: welcome,
            button: '**Crisis Recruiter** starten',
        },
        aaa: {
            headline: 'Mach deine Firma nachhaltig mit dem AAA framework',
            text: aaa,
            button: 'Zeig mir das **AAA Framework**',
        },
        companyNetworks: {
            headline: 'Ist deine Firma Teil dieser Netzwerke?',
            description: 'Diese Initiativen vernetzen Firmen und unterstützen sie dabei, nachhaltiger zu werden.',
        },
        litigation : {
            headline: 'Stoppe Fossile Projekte',
            description: litigation
        },
        receiveIndividualFunding: {
            headline: 'Could you do more with a little money?',
            description: 'These initiatives can support you with cash for projects or campaigns. Check them out!',
        },
    },
};