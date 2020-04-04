import {numberOfInitiatives} from '../initiatives';
import {renderMdParagraph} from './markdown';
import button from './button';

export default function showStartPage() {
    const tagCount = Object.keys(cfStrings.tagLabels).filter(t => !t.startsWith('l-')).length;

    document.getElementById('recruiter-screen').innerHTML = renderMdParagraph(
          cfStrings.recruiter.welcome.text
            .replace('{{numberOfInitiatives}}', numberOfInitiatives())
            .replace('{{numberOfTags}}', tagCount)
        )
        + button(cfStrings.recruiter.surveyLink, cfStrings.recruiter.welcome.button, {primary: true});
}
