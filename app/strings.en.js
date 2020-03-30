import welcome from './content-partials/recruiter/welcome.md';
import aaa from './content-partials/recruiter/aaa.md';
import litigation from './content-partials/recruiter/litigation.md';

window.cfStrings = {
    recruiter: {
        welcome: {
            text: welcome,
            button: 'Launch **Crisis Recruiter**',
        },
        municipalityNetwork: {
            headline: 'Is your municipality a member of these networks?',
            description: 'These networks connect and help cities to make housing more energy-efficient and move cities closer to the goal of net carbon neutrality.',
        },
        municipalityStock: {
            headline: 'Does your municipality own stock?',
            description: 'These initiatives let you transfer your stock voting rights. They then go to annual meetings to exercise these rights in the best interest of sustainable development, fighting the climate crisis and protecting human rights.',
        },
        supportGrassroots: {
            headline: 'Support Grassroots Initiatives',
            description: 'It\'s likely that one or more of these initiatives have local groups in your city. Grassroots initiatives often have a hard time finding space to do workshops or meet. Probably you know how to provide them with desperately needed space at no or small cost.',
        },
        investHere: {
            headline: 'Invest Here',
            description: 'Each of the these initiatives is effective in at least one of the areas you want to invest in. Check out their websites to find out more and donate.',
        },
        companyReduce: {
            headline: 'Your Company should disclose and reduce its emissions.',
            description: `
            In addition to using the AA framework at your company, we can recommend these resources:
            * TCFD provides a [knowledge hub](https://www.tcfdhub.org/) with tutorials, case studies and online courses about reporting emissions.
            * The American Energy Star initiative provides a [23 page guide to create fun competitions](https://www.energystar.gov/buildings/tools-and-resources/energy-efficiency-competition-guide) for sustainable energy and water use.
            The US Environmental Protection Agency [provides a lot of resources](https://www.epa.gov/climateleadership) to start yourself.
            
            There are many consultancies that help making companies sustainable. Most of them are not-for profit. They provide you with free resources and concrete help on how to get started. And if your company takes that path, they\'re experienced guides along the way. Check out their websites to find out more.
            `
        },
        buildingCompanyReduce: {
            headline: 'There are Special Certifications for the Building Industry',
            description: 'Building infrastructure to last is energy-intensive. These consultancies are specialized on the industry and are happy to help.'
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
        receiveInitiativeFunding: {
            headline: 'Get Financial Support for your Project',
            description: `
            Of course this depends on what kind of NGO you run and your financial needs. These initiatives run funds that try their best at providing resources to initiatives that fight the climate crisis.

            Check out their websites to find out which ones match your criteria and if they're currently making new grants.
            `,
        },
        ngoNetworks: {
            headline: 'Thought about joining a network?',
            description: 'The movement is stronger together. These networks connect initiatives and individuals to exchange ideas and coordinate.',
        },
        ngoTraining: {
            headline: 'Here your NGO\'s members can get training',
            description: 'Many initiatives offer training and educational resources for activists. Your NGO can benefit from these resources.',
        },
        healthWorker: {
            headline: 'Connect with Health Workers to Raise Awareness',
            description: 'These initiatives connect physicians and health workers who fight for protecting our environment.Check out their websites!',
        },
        faithLeader: {
            headline: 'Connect with Faith Leaders to Raise Awareness',
            description: 'These initiatives connect faith leaders who fight for protecting our environment. Check out their websites!',
        },
        join: {
            headline: 'Help Here',
            description: `From the {{numberOfInitiatives}} initiatives in our database, they best match your responses and have the highest impact. Please check out their websites to learn more!`,
        },
        receiveIndividualFunding: {
            headline: 'Could you do more with a little money?',
            description: 'These initiatives can support you with cash for projects or campaigns. Check them out!',
        },
    },
};