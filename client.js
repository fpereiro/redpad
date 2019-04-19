(function () {

   // *** SETUP ***

   var dale = window.dale, teishi = window.teishi, lith = window.lith, c = window.c, B = window.B;
   var type = teishi.t, clog = console.log;

   B.do ({from: {ev: 'initialize'}}, 'set', 'State', {});
   B.do ({from: {ev: 'initialize'}}, 'set', 'Data',  {});

   window.State = B.get ('State'), window.Data = B.get ('Data');

   B.prod = true;

   c.ready (function () {
      B.mount ('body', Views.main ());
   });

   // *** VIEWS ***

   var Views = {};

   Views.main = function () {
      return B.view (['State', 'view'], {ondraw: function () {
         if (! B.get ('State', 'view')) B.do ('set', ['State', 'view'], 'library');
      }}, function (x, view) {
         if (! view) return;
         return [
            ['style', [
               ['body', {
                  margin: 0,
                  'padding-left, padding-right': 0.05,
                  'padding-top, padding-bottom': 0.02,
               }],
               ['span.action', {
                  cursor: 'pointer',
                  color: 'blue',
                  'text-decoration': 'underline',
               }],
            ]],
            Views [view] (),
         ];
      });
   }

   Views.read = function () {

      var routes = [
         ['calculate', 'pages', function (x, howmany) {
            var book = B.get ('Data', 'book');
            var text = c ('#text');
            var dims = text.getBoundingClientRect ();
            var pages = B.get ('State', 'pages') || [], counter = 0;
            var offset = pages.length ? (pages [pages.length - 1] + 1) : 0;
            var nextpage = function () {
               counter++;
               while (offset < book.length) {
                  var token = book [offset];
                  var output = '<p class="large">' + token [0] + '<span class="small">' + token [1] + '</span></p>';
                  if (token [0].match (/\n/)) output += '<br><br><br>';
                  text.innerHTML = text.innerHTML + output;
                  var paragraphs = c ('#text p');
                  var last = paragraphs [paragraphs.length - 1];
                  var ldims = last.getBoundingClientRect ();
                  if (ldims.bottom > dims.bottom - 20) {
                     offset--;
                     break;
                  }
                  offset++;
               }
               text.innerHTML = '';
               pages.push (offset);
               if (counter === howmany) return;
               if (offset < book.length) {
                  offset++;
                  nextpage ();
               }
            }
            nextpage ();
            B.do ('set', ['State', 'pages'], pages);
         }],
         ['draw', 'page', function (x) {
            var page = B.get ('State', 'currentpage') - 1, pages = B.get ('State', 'pages');
            var from = page === 0 ? 0 : pages [Math.max (0, page - 1)] + 1;
            var offset = from;
            var output = '';
            while (offset <= pages [page]) {
               var token = B.get ('Data', 'book', offset);
               output += '<p class="large" offset="' + offset + '">' + token [0] + '<span class="small">' + token [1] + '</span></p>';
               if (token [0].match (/\n/)) output += '<br><br><br>';
               offset++;
            }
            c ('#text').innerHTML = output;
         }],
         ['toggle', '*', function () {
            var elements = document.getElementsByClassName ('small');
            for (var i in elements) {
               try {
                  if (elements.hasOwnProperty (i)) elements [i].style.opacity = B.get ('State', 'showtranslation') ? 0 : 1;
               }
               catch (error) {}
            }
            B.do ('set', ['State', 'showtranslation'], ! B.get ('State', 'showtranslation'));
         }],
         ['change', ['State', 'currentpage'], function () {
            B.do ('draw', 'page');
         }],
         ['show', '*', function () {
            B.do ('calculate', 'pages', 10);
         }],
      ];

      return B.view (['Data', 'book'], {listen: routes, ondraw: function () {
         if (! B.get ('State', 'pages')) B.do ('calculate', 'pages', 20);
         if (! B.get ('State', 'currentpage')) B.do ('set', ['State', 'currentpage'], 1);

         document.body.addEventListener ('click', function () {B.do ('toggle', '*')});

         document.body.addEventListener ('keydown', function (e) {
            var code = e.keyCode;
            var page = B.get ('State', 'currentpage');
            if (code === 13 || code === 32) B.do ('toggle', '*');
            if (code === 34 || code === 39) B.do ('set', ['State', 'currentpage'], page + 1);
            if (code === 33 || code === 37) B.do ('set', ['State', 'currentpage'], Math.max (1, page - 1));
         });

      }}, function (x, book) {
         if (! book) return;
         return [
            ['style', [
               ['body', {
                  'background-color': 'black',
                  'font-family': 'serif',
               }],
               ['p', {'font-size': 20, 'color': 'white'}],
               ['li', {'list-style-type': 'none', float: 'left', 'margin-right': 10, 'margin-bottom': 5}],
               ['span.small', {position: 'absolute', top: 22, left: 0, 'font-size': 0.7, opacity: 0}],
               ['p.large', {position: 'relative', float: 'left', 'margin-right': 5, 'margin-bottom': 10}],
               ['div#text',   {width: '100%', height: '90%', 'background-color': 'black'}],
               ['div#bottom', {width: '100%', height: '5%'}, ['li', {'line-height': '5vh', width: 1/10, border: 'solid 2px white', color: 'white', cursor: 'pointer', 'text-align': 'center'}]],
               ['li#pagebox', {'font-weight': 'bold', cursor: 'auto'}],
            ]],
            ['div', {class: 'opaque', id: 'text'}],
            ['div', {id: 'bottom'}, ['ul', dale.do ([-100, -10, -1, 0, 1, 10, 100], function (v) {
               if (v === 0) return ['li', {id: 'pagebox'}];
               return ['li', B.ev (['onclick', 'show', v]), 'Move ' + v];
            })]],
         ];
      });
   }

   Views.library = function () {
      var SHA = 'eb2bceed3d87cd2d16eb5d05a27036d33a4082b9';
      var routes = [
         ['retrieve', 'library', function () {
            c.ajax ('get', 'https://cdn.jsdelivr.net/gh/fpereiro/redpad@' + SHA + '/books/readme.md', {}, '', function (error, data) {
               if (error) return alert ('There was an error accessing the library.');
               var books = [];
               dale.do (data.body.split ('\n'), function (line) {
                  if (! line || line.match (/^#/)) return;
                  line = line.split (':');
                  var title = line [0];
                  books.push ([title, line.join (':').replace (title + ': ', '')]);
               });
               B.do ('set', ['Data', 'library'], books);
            });
         }],
         ['load', 'book', function (x, link) {
            var last = function (a) {return a [a.length - 1]}
            c.ajax ('get', link, {}, '', function (error, data) {
               if (error) return alert ('There was an error accessing the library.');
               B.do ('set', ['Data', 'book'], data.body);
               B.do ('set', ['Data', 'source'], link);
               B.do ('set', ['State', 'view'], 'read');
            });
         }],
         ['load', 'bookfile', function (x) {
            var file = c ('#bookfile').files [0];
            if (! file) return alert ('No file selected.');
            var reader = new FileReader ();
            reader.readAsText (file, 'UTF-8');
            reader.onload = function (e) {
               B.do ('set', ['Data', 'book'], JSON.parse (e.target.result));
               B.do ('set', ['Data', 'source'], file.name);
               B.do ('set', ['State', 'view'], 'read');
            }
            reader.onerror = function () {
               alert ('There was an error reading the file.');
            }
         }],
      ];
      return B.view (['Data', 'library'], {listen: routes, ondraw: function () {B.do ('retrieve', 'library')}}, function (x, library) {
         return [
            ['h4', {style: 'position: absolute; top: 0; right: 30px'}, ['a', {target: '_blank', href: 'https://github.com/fpereiro/redpad'}, 'Redpad project home']],
            ['h2', ['Redpad Library (', ['a', {target: '_blank', href: 'https://github.com/fpereiro/redpad/tree/' + SHA + '/books/readme.md'}, 'link'], ')']],
            dale.do (library, function (book) {
               return [
                  ['span', B.ev ({style: 'font-size: 1.1em', class: 'action'}, ['onclick', 'load', 'book', book [1]]), book [0]],
                  ['br'],
                  ['br'],
               ];
            }),
            ['br'],
            ['h4', ['Or load file from your computer: ', ['input', B.ev ({value: 'Choose file', id: 'bookfile', type: 'file'}, ['onchange', 'load', 'bookfile'])]]],
         ];
      });
   }

}) ();
