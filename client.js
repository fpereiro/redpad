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
      var output = '<ul>';
      for (var token in tokens) {
         output += '<li><p>' + tokens [token] [0] + '</p><p class="small">' + tokens [token] [1] + '</p></li>';
      }
      document.getElementById ('text').innerHTML = output + '</ul>';
   }

   window.show (0);

}) ();
