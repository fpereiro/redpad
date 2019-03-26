/*
redpad - v2.0.0

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/

(function () {

   var fs     = require ('fs');
   var https  = require ('https');

   var dale   = require ('dale');
   var teishi = require ('teishi');
   var lith   = require ('lith');
   var a      = require ('astack');

   var CONFIG = require ('./config.js');
   var TARGET = process.argv [4] || 'en';

   var inter = exports;

   inter.translate = function (s, string) {
      var request = https.request ({
         host: 'translate.yandex.net',
         path: '/api/v1.5/tr.json/translate?key=' + CONFIG.key + '&lang=' + TARGET + '&text=' + encodeURIComponent (string),
         method: 'GET'
      }, function (response) {

         response.setEncoding ('utf8');
         response.body = '';

         response.on ('error', function (error) {
            console.log (error);
            a.return (s, false);
         });

         response.on ('data', function (chunk) {
            response.body += chunk;
         });

         response.on ('end', function () {
            var body = teishi.p (response.body);
            if (body === false || ! body.text) {
               console.log ('API error:', response.body);
               return a.return (s, false);
            }
            a.return (s, [string, body.text [0]]);
         });
      });

      request.on ('error', function (error) {
         console.log (error);
         a.return (s, false);
      });

      request.end ();
   }

   inter.generate = function (s) {

      var cssreset = [
         ['html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video', {
            'margin, padding, border': 0,
            'font-size': '100%',
            font: 'inherit',
            'vertical-align': 'baseline'
         }],
         ['article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section', {display: 'block'}],
         ['body', {'line-height': '1'}],
         ['ol, ul', {'list-style': 'none'}],
         ['blockquote, q', {quotes: 'none'}],
         ['blockquote:before, blockquote:after, q:before, q:after', {content: "''"}],
         ['blockquote:before, blockquote:after, q:before, q:after', {content: 'none'}],
         ['table', {
            'border-collapse': 'collapse',
            'border-spacing': 0
         }],
      ];

      a.return (s, lith.g ([
         ['!DOCTYPE HTML'],
         ['html', [
            ['head', [
               ['meta', {charset: 'utf-8'}],
               ['title', process.argv [2] + ' ' + TARGET],
               ['style', lith.css.g ([cssreset,
                  ['body', {
                     'padding-top, padding-bottom': '3vh',
                     'padding-left, padding-right': .03,
                     'background-color': 'black',
                     'font-family': 'serif',
                  }],
                  ['p', {'font-size': 20, 'color': 'white'}],
                  ['li', {'list-style-type': 'none', float: 'left', 'margin-right': 10, 'margin-bottom': 5}],
                  ['span.small', {position: 'absolute', top: 22, left: 0, 'font-size': 0.7, opacity: 0}],
                  ['p.large', {position: 'relative', float: 'left', 'margin-bottom': 25, 'margin-right': 5}],
                  ['div#left', {width: .84}],
                  ['div#text',   {width: '100%', height: '85vh', 'background-color': 'black'}],
                  ['div#bottom', {width: '100%', height: '5vh'}, ['li', {'line-height': '5vh', width: 1/10, border: 'solid 2px white', color: 'white', cursor: 'pointer', 'text-align': 'center'}]],
                  ['div#right',  {width: .15, height: '94vh', 'background-color': 'red', cursor: 'crosshair'}],
                  ['li#page', {'font-weight': 'bold', cursor: 'auto'}],
                  ['div#left, div#right, div#bottom', {float: 'left'}],
               ])],
            ]],
            ['body', [
               ['div', {id: 'left'}, [
                  ['div', {id: 'text'}],
                  ['div', {id: 'bottom'}, ['ul', dale.do ([-100, -10, -1, 0, 1, 10, 100], function (v) {
                     if (v === 0) return ['li', {id: 'page'}];
                     return ['li', {onclick: 'show (' + v + ')'}, 'Move ' + v];
                  })]],
               ]],
               ['script', "window.data = function () {return " + s.last + '}'],
               ['script', fs.readFileSync ('client.js', 'utf8')]
            ]]
         ]]
      ]));
   }

   inter.tokenize = function (s) {
      a.return (s, s.last.replace (/\t/g, ' ').replace (/\n{2,}/g, '\n').replace (/ {2,}/g, ' ').match (/[^.?!,;:\n]+[.?!,;:\n]+/g));
   }

   inter.main = function () {
      var source = process.argv [2];
      var output = process.argv [3] || 'both';
      if (teishi.stop (['output', process.argv [3], ['json', 'html', 'both'], 'oneOf', teishi.test.equal])) return process.exit (1);

      a.stop (false, [
         output === 'html' ? [] : [
            [a.convert (fs.readFile), source, 'utf8'],
            inter.tokenize,
            [a.fork, '@last', function (v, k) {
               console.log ('Translating token ' + (k + 1));
               return [inter.translate, v];
            }, {max: 5}],
            function (s) {
               var output = '[\n';
               dale.do (s.last, function (v) {
                  output += '   [' + JSON.stringify (v [0]) + ',   ' + JSON.stringify (v [1]) + '],\n';
               });
               output = output.slice (0, -2);
               output += '\n]';
               a.call (s, [a.convert (fs.writeFile), source.replace (/\..{3,4}$/, '-' + TARGET + '.json'), output, 'utf8']);
            }
         ],
         [a.convert (fs.readFile), source.replace (/\..{3,4}$/, '-' + TARGET + '.json'), 'utf8'],
         inter.generate,
         function (s) {
               a.call (s, [a.convert (fs.writeFile), source.replace (/\..{3,4}$/, '-' + TARGET + '.html'), s.last, 'utf8']);
         }
      ]);
   }

   inter.main ();

}) ();
