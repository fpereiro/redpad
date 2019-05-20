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
         ['copy', 'clipboard', function (x, string) {
            // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
            var el = document.createElement ('textarea');
            el.value = string;
            el.setAttribute ('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild (el);
            var selected = document.getSelection ().rangeCount > 0 ? document.getSelection ().getRangeAt (0) : false;
            el.select ();
            document.execCommand ('copy');
            document.body.removeChild (el);
            if (selected) {
               document.getSelection ().removeAllRanges ();
               document.getSelection ().addRange (selected);
            }
         }],
         ['copy', 'page', function () {
            var page = B.get ('State', 'currentpage') - 1, pages = B.get ('State', 'pages'), book = B.get ('Data', 'book');
            var text = '';
            var offset = pages [page - 1] || 0;
            while (offset <= pages [page]) {
               text += book [offset] [0];
               offset++;
            }
            B.do ('copy', 'clipboard', text);
         }],
         ['calculate', 'pages', function (x, howmany) {
            c.set ('#calculating', {opacity: 1}, true);
            var book = B.get ('Data', 'book');
            var text = c ('#text');
            var dims = text.getBoundingClientRect ();
            var pages = B.get ('State', 'pages') || [], counter = 0;
            var offset = pages.length ? (pages [pages.length - 1] + 1) : 0;
            text.innerHTML = '';
            var nextpage = function () {
               counter++;
               while (offset < book.length) {
                  var token = book [offset];
                  var newline = book [offset - 1] && book [offset - 1] [0].match (/\n/);
                  var output = '<p class="large' + (newline ? ' clear' : '') + '">' + token [0] + '<span class="small">' + token [1] + '</span></p>';
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
            c.set ('#calculating', {opacity: 0}, true);
         }],
         ['draw', 'page', function (x) {
            var page = B.get ('State', 'currentpage') - 1, pages = B.get ('State', 'pages');
            var from = page === 0 ? 0 : pages [Math.max (0, page - 1)] + 1;
            var offset = from;
            var output = '';
            while (offset <= pages [page]) {
               var token = B.get ('Data', 'book', offset);
               var newline = B.get ('Data', 'book', offset - 1) && B.get ('Data', 'book', offset - 1, 0).match (/\n/);
               output += '<p class="large' + (newline ? ' clear' : '') + '" offset="' + offset + '">' + token [0] + '<span class="small">' + token [1] + '</span></p>';
               offset++;
            }
            c ('#text').innerHTML = output;
            B.do ('copy', 'page');
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
         ['move', '*', function (x) {
            var offset = x.path [0], current = B.get ('State', 'currentpage'), pages = B.get ('State', 'pages');
            if (pages.length < current + offset) {
               B.do ('calculate', 'pages', current + offset + 1 - pages.length);
            }
            B.do ('set', ['State', 'currentpage'], Math.max (1, current + offset));
         }],
      ];

      return B.view (['Data', 'book'], {listen: routes, ondraw: function () {
         if (! B.get ('State', 'pages')) B.do ('calculate', 'pages', 20);
         if (! B.get ('State', 'currentpage')) B.do ('set', ['State', 'currentpage'], 1);

         document.body.addEventListener ('keydown', function (e) {
            var code = e.keyCode;
            if (code === 13 || code === 32) B.do ('toggle', '*');
            if (code === 34 || code === 39) B.do ('move', 1);
            if (code === 33 || code === 37) B.do ('move', -1);
         });

      }}, function (x, book) {
         if (! book) return;
         return [
            ['style', [
               ['body', {
                  'background-color': 'black',
                  'font-family': 'serif',
               }],
               ['div#calculating', {opacity: 0, 'background-color': 'white', color: 'black', position: 'absolute', width: 200, padding: 20, top: 50, left: 50}],
               ['p', {'font-size': 20, 'color': 'white'}],
               ['li', {'list-style-type': 'none', float: 'left', 'margin-right': 10, 'margin-bottom': 5}],
               ['span.small', {position: 'absolute', top: 22, left: 0, 'font-size': 0.7, opacity: 0}],
               ['p.clear', {clear: 'left'}],
               ['p.large', {position: 'relative', float: 'left', 'margin-right': 5, 'margin-bottom': 10}],
               ['div#text',   {width: '100%', height: '90%', 'background-color': 'black'}],
               ['div#bottom', {width: '100%', height: '5%'}, ['li', {'line-height': '5vh', width: 1/10, border: 'solid 2px white', color: 'white', cursor: 'pointer', 'text-align': 'center'}]],
               ['li.pagebox', {'font-weight': 'bold', cursor: 'auto'}],
            ]],
            ['div', {id: 'calculating'}, 'Calculating, please wait...'],
            ['div', B.ev ({class: 'opaque', id: 'text'}, ['onclick', 'toggle', '*'])],
            ['div', {id: 'bottom'}, ['ul', dale.do ([-100, -10, -1, 0, 1, 10, 100], function (v) {
               if (v === 0) return B.view (['State', 'currentpage'], {tag: 'li', attrs: {class: 'pagebox'}}, function (x, current) {
                  return B.view (['State', 'pages'], function (x, pages) {
                     if (! pages) return;
                     return 'Position ' + (pages [current - 2] || 1);
                  });
               });
               return ['li', B.ev (['onclick', 'move', v]), 'Move ' + v];
            })]],
         ];
      });
   }

   Views.library = function () {
      var SHA = 'cc7d88462e5cf68d88977c6ab85e739fca81ad42';
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
               if (data.body === false) return alert ('Error: the selected book is not valid JSON.');
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
