$(function(){
  'use strict';


  var $_lastvk = $("#lastvk"),
          authorizedNetworks = ['VK', 'LASTFM'];

  $_lastvk.trigger("lastvk.ready");


  /**
   * авторизация в одной из соцсетей
   */
  $_lastvk.on("lastvk.authorized", function(e,sn){

    var snIndex = $.inArray(sn, authorizedNetworks);
    if(snIndex > -1)
      authorizedNetworks.splice(snIndex, 1);

    if(authorizedNetworks.length == 0)
      $_lastvk.trigger('lastvk.initialized');
  });


  /**
   * авторизовались в обеих соцсетях
   */
  $_lastvk.on('lastvk.initialized', function(){
    showNotice("Select tracks for import");
  });




});


function getURLParameter(name) {
  var param = decodeURI(
          (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
  return (param === "null" ? null : param);
}

function showNotice(text, type)
{
  type = type || 'information';

  noty({
    text: text,
    type: type,
    dismissQueue: true,
    layout: "topRight",
    theme: 'defaultTheme',
    timeout: 3000
  });
}

