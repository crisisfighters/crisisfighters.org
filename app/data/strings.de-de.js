import {tagLabels} from './tagLabels.de-de';
import welcome from './content-partials/recruiter/welcome.de-de.md';
import locationSelectorText from './content-partials/recruiter/select-country.de-de.md';
import aaa from './content-partials/recruiter/aaa.de-de.md';
import litigation from './content-partials/recruiter/litigation.de-de.md';

window.cfStrings = {
    tagLabels,
    recruiter: {
        surveyLink: 'https://services342876.typeform.com/to/jkPJe0',
        general: {
            yourData: 'Was du eingegeben hast',
            startOver: 'Von vorn beginnen',
            country: 'Land',
            resultText: `
            <p>In case you're interested how we came to our recommendations:
              We wrote an article on <a href="/what-else/how-we-recommend" target="_blank">how we recommend</a>.
            </p>`,
            suggestionHeadlinePrefix: 'Vorschlag',
            unknown: 'unknown',
        },
        tags: {
            role: 'Du',
            company: 'Deine Firma',
            contribution: 'Dein Beitrag',
            time: 'Zeitinvestition',
            investmentArea: 'Bereiche',
        },
        welcome: {
            text: welcome,
            button: '**Crisis Recruiter** starten',
        },
        locationSelector: {
            text: locationSelectorText,
            placeholder: 'Region or country...',
            button: 'Show **Results**',
        },
        restart: {
            headline: 'Interested in different results?',
            text: 'There are other, very interesting initiatives that you could join as an individual.',
            button: 'Start Over',
        },
        noInitiativesFound: {
            headline: 'No Initiatives Match your Criteria',
            text: "Don't worry. This happens. The easy solution is to select more options that could be relevant to you.",
            button: 'Start Over',        
        },
        cfb2b: {
            headline: 'Your Company can join CrisisFighters',
            text: "Ask your employees to put one hour per month into improving CrisisFighters and talk about it to get more people to engage.",
            button: '**CrisisFighters B2B**',
        },
        ideas: {
            headline: 'Start Your Own',
            text: 'There are many good ideas out there for how you can invest your time best. We collect some of them. Check them out, use them and add your own!',
            button: 'Check out **Ideas**',
        },
        contribute: {
            headline: 'Contribute to CrisisFighters.org',
            text: 'We created CrisisFighters to help you and others to do something meaningful against the climate crisis. By contributing to this website you help others put their energy to the best possible use. And we need the wisdom of the many to keep content up-to-date and accurate!',
            button: '**Improve** CrisisFighters',
        },
        creativeBrief: {
            headline: 'Run Your Own Campaign!',
            text: `
            Can you make time between projects? Maybe your team can even work together on this. We put together a creative brief with context, key facts, messages, do's and dont's for you to create your own campaign with your own branding.
        `,
            button: 'Show **Creative Brief**',
        },
        climatePledge: {
            headline: 'Sign the Climate Pledge!',
            text: `
            This is a new initiative to mobilize current and future workers to urge companies to take a pro-climate policy stand.

            By signing this pledge you can state that **you will try hard to avoid working for companies that don't take bold steps** to become sustainable and advocate for pro-climate policies. This pledge has the power to put pressure on businesses worldwide to take meaningful action.
        `,
            button: 'Sign the **Climate Pledge**',
        },
        aaa: {
            headline: 'Mach deine Firma nachhaltig mit dem AAA framework',
            text: aaa,
            button: 'Zeig mir das **AAA Framework**',
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
            headline: 'Ist deine Firma Teil dieser Netzwerke?',
            description: 'Diese Initiativen vernetzen Firmen und unterstützen sie dabei, nachhaltiger zu werden.',
        },
        litigation : {
            headline: 'Stoppe Fossile Projekte',
            description: litigation
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