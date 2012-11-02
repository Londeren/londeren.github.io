$(function(){
  'use strict';


  var $_lastvk = $("#lastvk");

  $_lastvk.trigger("lastvk.ready");

  

});

function getURLParameter(name) {
  return decodeURI(
          (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}