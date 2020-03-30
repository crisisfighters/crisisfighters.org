import Cookies from 'js-cookie';

// console.log(
//     navigator.language,
//     navigator.languages,
//     Cookies.get(),
// );

const pathFromPermalink = p => p.replace(/^https?:\/\/[^\/]+(\/.*)$/, '$1');

// Very weirdly, Cookies.get('language') returns '' even if the cookie is set.
const cookieContent = Cookies.get().language;
const hasCookie = typeof cookieContent === "string" && cookieContent.length > 0;

if(!navigator.languages.includes(cfLanguages.current) && !hasCookie) {
    console.log('Switching language')
    const newLanguage = window.cfLanguages.available.filter(l => navigator.languages.includes(l.lang))[0] || 0;
    const href = pathFromPermalink(newLanguage.permalink);
    document.location.href = href;
}

window.addEventListener('load', e => {
    for(let a of document.getElementsByClassName('language-link')) {
        // Remove protocol, host and port to ease local testing
        a.setAttribute('data-href', pathFromPermalink(a.getAttribute('href')));
        a.setAttribute('href', "javascript:void(0);");

        a.addEventListener('click', e => {
            const target = e.target.nodeName === 'a'
                ? e.target
                : e.target.parentElement;

            Cookies.set(
                'language',
                target.getAttribute('data-lang'),
                { expires: 30 }
            );
            document.location.href = target.getAttribute('data-href');
        });
    }
});