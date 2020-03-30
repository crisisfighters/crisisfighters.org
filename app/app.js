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

let navigatorLanguages = navigator.languages.map(l => l.toLowerCase()) || [navigator.language];
const availableLanguages = [
    window.cfLanguages.current,
    window.cfLanguages.available.map(l => l.lang),
];
if(!navigatorLanguages.some(l => availableLanguages.includes(l))) {
    // UA likes no language we have in store.
    // Let's pretend the UA likes our fallback language.

    navigatorLanguages = [window.cfLanguages.fallback];
}

if(!navigatorLanguages.includes(cfLanguages.current) && !hasCookie) {
    console.log('Switching language')
    let newLanguage = window.cfLanguages.available.filter(l => navigatorLanguages.includes(l.lang))[0];
    console.log(newLanguage);
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