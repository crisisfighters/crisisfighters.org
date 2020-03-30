import welcome from './content-partials/recruiter/welcome.de.md';
import aaa from './content-partials/recruiter/aaa.de.md';
import litigation from './content-partials/recruiter/litigation.de.md';

window.cfStrings = {
    recruiter: {
        welcome: {
            text: welcome,
            button: '**Crisis Recruiter** starten',
        },
        companyNetworks: {
            headline: 'Ist deine Firma Teil dieser Netzwerke?',
            description: 'Diese Initiativen vernetzen Firmen und unterstützen sie dabei, nachhaltiger zu werden.',
        },
        litigation : {
            headline: 'Stoppe Fossile Projekte',
            description: litigation
        },
        aaa: {
            headline: 'Mach deine Firma nachhaltig mit dem AAA framework',
            description: aaa,
            cta: 'Zeig mir das **AAA Framework**',
        },
        receiveIndividualFunding: {
            headline: 'Could you do more with a little money?',
            description: 'These initiatives can support you with cash for projects or campaigns. Check them out!',
        },
    },
};