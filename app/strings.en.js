import welcome from './content-partials/recruiter/welcome.md';
import aaa from './content-partials/recruiter/aaa.md';
import litigation from './content-partials/recruiter/litigation.md';

window.cfStrings = {
    recruiter: {
        welcome: {
            text: welcome,
            button: 'Launch **Crisis Recruiter**',
        },
        companyNetworks: {
            headline: 'Is your Company part of these networks?',
            description: 'These initiatives connect companies and support them to become more sustainable.',
        },
        litigation : {
            headline: 'Stop High-Carbon Projects',
            description: litigation
        },
        aaa: {
            headline: 'Transform your company with the AAA framework',
            description: aaa,
            cta: 'Check out the **AAA Framework**',
        },
    },
};