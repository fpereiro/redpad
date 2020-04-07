/*
redpad - v2.3.4

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to readme.md to read the annotated source.
*/

(function () {

   var fs     = require ('fs');
   var https  = require ('https');

   var dale   = require ('dale');
   var teishi = require ('teishi');

   var CONFIG = require ('./config.js');

   var clog = console.log;

   var r = exports;

   // *** FUNCTIONS ***

   r.translateOne = function (string, tolang, cb) {
      var request = https.request ({
         host:   'translate.yandex.net',
         path:   '/api/v1.5/tr.json/translate?key=' + CONFIG.key + '&lang=' + tolang + '&text=' + encodeURIComponent (string),
         method: 'GET'
      }, function (response) {
         response.setEncoding ('utf8');
         response.body = '';
         response.on ('error', cb);
         response.on ('data', function (chunk) {
            response.body += chunk;
         });
         response.on ('end', function () {
            var body = teishi.parse (response.body);
            if (body === false || ! body.text) return cb ('API error:', response.body);
            cb (null, body.text [0]);
         });
      }).on ('error', cb);
      request.end ();
   }

   r.stringify = function (array) {
      var output = '[\n';
      dale.go (array, function (v) {
         output += '   [' + JSON.stringify (v [0]) + ',   ' + JSON.stringify (v [1]) + '],\n';
      });
      output = output.slice (0, -2);
      output += '\n]';
      return output;
   }

   r.json = function (from, to) {
       fs.writeFileSync (to, r.stringify (dale.go (fs.readFileSync (from, 'utf8').replace (/\t/g, ' ').replace (/\n{2,}/g, '\n').replace (/ {2,}/g, ' ').match (/[^.?!,;:\n]+[.?!,;:\n]+/g), function (token) {
          return [token, null];
       })));
   }

   r.translate = function (from, tolang) {
      var source = JSON.parse (fs.readFileSync (from));
      var index = dale.stopNot (source, undefined, function (pair, k) {
         if (pair [1] === null) return k;
      });
      if (index === undefined) return clog ('JSON already translated!');
      var translated = 0;
      var outro = function () {
         fs.writeFileSync (from, r.stringify (source));
         clog ('Saved', translated, 'translations successfully.');
         process.exit ();
      }
      var loop = function () {
         if (index + translated === source.length) return outro ();
         r.translateOne (source [index + translated] [0], tolang || 'en', function (error, translation) {
            if (error) {
               clog ('ERROR', error, translation);
               return outro ();
            }
            source [index + translated] [1] = translation;
            translated++;
            clog ('Translated', index + translated + '/' + source.length, (Math.round (10000 * (index + translated) / source.length) / 100) + '%');
            loop ();
         });
      }
      process.on ('SIGINT', outro);
      loop ();
   }

   // *** INTERFACE ***

   var ACTION = process.argv [2];
   if (['json', 'translate'].indexOf (ACTION) === -1) return clog ('USAGE: node redpad json|translate');

   if (ACTION === 'json') {
      var FROM = process.argv [3];
      var TO   = process.argv [4];
      if (! FROM || ! TO) return clog ('USAGE: node redpad json FROMPATH TOPATH');
      r.json (FROM, TO);
   }

   if (ACTION === 'translate') {
      var FROM   = process.argv [3];
      var TOLANG = process.argv [4];
      if (! FROM) return clog ('USAGE: node redpad translate FROM [TOLANG]');
      r.translate (FROM, TOLANG);
   }

}) ();
