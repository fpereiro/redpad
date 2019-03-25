(function () {

   var width  = Math.max (document.documentElement.clientWidth,  window.innerWidth || 0)  * .85;
   var height = Math.max (document.documentElement.clientHeight, window.innerHeight || 0) * .84;
   var inter  = false;
   var page   = 1;

   window.toggle = function () {
      var elements = document.getElementsByClassName ('small');
      for (var i in elements) {
         try {
            if (elements.hasOwnProperty (i)) elements [i].style.opacity = inter ? 0 : 1;
         }
         catch (error) {}
      }
      inter = ! inter;
   }

   window.show = function (offset) {
      inter = false;
      // For some reason, it is not unreasonable to consider that a token takes 20k square pixels. Go figure.
      var tokensPerPage = height * width / 20000;
      pages = Math.ceil (window.data ().length / tokensPerPage);
      if (offset < 0) page = Math.max (1,     page + offset);
      else            page = Math.min (pages, page + offset);
      document.getElementById ('page').innerHTML = page + ' / ' + pages;
      var tokens = window.data ().slice (tokensPerPage * (page - 1), tokensPerPage * page);
      var output = '<p>';
      for (var token in tokens) {
         var space = tokens [token] [0].match (/\n/);
         output += '<p class="large">' + tokens [token] [0] + '<span class="small">' + tokens [token] [1] + '</span></p>';
         if (space) output += '<br><br><br>';
      }
      document.getElementById ('text').innerHTML = output + '</p>';
   }

   window.show (0);

   document.body.addEventListener ('click', window.toggle);

   document.body.addEventListener ('keydown', function (e) {
      var code = e.keyCode;
      if (code === 13 || code === 32) window.toggle ();
      if (code === 34 || code === 39) window.show (1);
      if (code === 33 || code === 37) window.show (-1);
   });

}) ();
