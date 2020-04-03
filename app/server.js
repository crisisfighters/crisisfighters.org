const {readdirSync} = require('fs');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var requestLanguage = require('express-request-language');

app.use(cookieParser());

const defaultLang = 'en-us';
const languageCodes = readdirSync('./i18n').map(f => f.substr(0, f.length - 5));
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

// respond with "hello world" when a GET request is made to the homepage
app.get('*', function (req, res, next) {

  if(req.url.endsWith('/')) {
    console.log(req.url);
    middlewares[req.language.toLowerCase()](req, res, next);
  } else {
    defaultMiddleware(req, res, next);
  }
})

  
app.listen(process.env.PORT || 3000);

console.log('running')