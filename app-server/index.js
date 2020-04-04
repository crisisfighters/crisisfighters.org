const {readdirSync} = require('fs');
const {join} = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const requestLanguage = require('express-request-language');
const redirects = require('./redirects');

app.use(cookieParser());

const defaultLang = 'en-us';
const languageCodes = readdirSync(join(__dirname, '..', '/i18n')).map(f => f.substr(0, f.length - 5));
const otherLanguages = languageCodes.filter(c => c !== defaultLang)

app.use(requestLanguage({
  languages: [defaultLang, ...otherLanguages],
  cookie: {
    name: 'language',
    options: { maxAge: 24 * 3600 * 1000 },
    url: '/languages/{language}'
  }
}));

const defaultMiddleware = express.static('public');

const middlewares = otherLanguages.reduce(
  (acc, code) => ({
    ...acc,
    [code]: express.static('public/' + code),
  }),
  {
    [defaultLang]: defaultMiddleware,
  });

app.get('*', function (req, res, next) {

  const redirect = Object.keys(redirects).find(url => req.url === `/${url}/` || req.url === `/${url}`);
  if(redirect) {
    res.writeHead(302, {
      Location: redirects[redirect],
    });
    res.end();
    return;
  }

  if(req.url.endsWith('/')) {
    // console.log(req.language + ' - ' + req.url);
    res.set('Cache-Control', 'no-store, must-revalidate');
    middlewares[req.language.toLowerCase()](req, res, next);
  } else {
    defaultMiddleware(req, res, next);
  }
})

  
app.listen(process.env.PORT || 3000);

console.log('running');