import {renderMdParagraph} from '../markdown';
import button from './button';
import suggestionHeadline from './suggestionHeadline';

const standardElement = ({strings: {headline, text, button: buttonLabel}, index, link, options}) => `
<div class="results-element">
    ${suggestionHeadline(headline, index)}
    ${renderMdParagraph(text)}
    ${button(link, buttonLabel, options)}
    
</div>`;

export const restartLink = () => standardElement({
    strings: cfStrings.recruiter.restart,
    link: surveyLink
});

export const nothingFound = () => standardElement({
    strings: cfStrings.recruiter.noInitiativesFound,
    link: surveyLink
});

export const crisisFightersB2B = index => standardElement({
    strings: cfStrings.recruiter.cfb12b,
    index,
    link: '/b2b',
    options: {primary: true, blank: true},
});

export const ideas = index => standardElement({
    strings: cfStrings.recruiter.ideas,
    index,
    link: '/what-else/ideas',
    options: {primary: true, blank: true},
});

export const contribute = index => standardElement({
    strings: cfStrings.recruiter.contribute,
    index,
    link: '/contribute',
    options: {primary: true, blank: true},
});

export const creativeBrief = index => standardElement({
    strings: cfStrings.recruiter.creativeBrief,
    index,
    link: 'https://docs.google.com/document/d/1gQAjdS_FU4Ijx4OTbiIhNngsR8haO9llvgHIMThwqiQ',
    options: {primary: true, blank: true}, 
});

export const climatePledge = index => standardElement({
    strings: cfStrings.recruiter.climatePledge,
    index,
    link: 'https://climatevoice.org/',
    options: {primary: true, blank: true},
});

export const aaa = index => standardElement({
    strings: cfStrings.recruiter.aaa,
    index,
    link: 'https://business.edf.org/insights/aaa-leadership-framework/',
    options: {primary: true, blank: true},
});