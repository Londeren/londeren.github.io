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

  });

  $.getView('tracklist').render({basl:12});


});

function getURLParameter(name) {
  return decodeURI(
          (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}

;(function ( $, window, undefined ) {

  var pluginName = 'getView',
          document = window.document,
          defaults = {
            viewsPath: "/views/"
          };

  function Plugin( element, options ) {
    this.element = element;

    if(typeof options == 'string')
      options = {"view" : options};

    this.options = $.extend( {}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.init = function () {
    console.log(this);
  };

  Plugin.prototype.render = function (data) {
    console.log(this, data);
  };



  $[pluginName] = function ( options ) {
    return new Plugin( this, options );
  };

}(jQuery, window));