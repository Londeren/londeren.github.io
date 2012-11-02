/**
 * Created by JetBrains PhpStorm.
 * User: Londeren
 * Date: 01.11.12
 * Time: 21:21
 */
$(function()
{
  'use strict';

  var $_lastvk = $("#lastvk"),
          $_lastfmAuthButton = $("#lastfm-auth-button"),
          lastfmSettings = {
            apiKey:'c2670cfb2e8ab9bcb83791ea0edcb733',
            apiSecret:'5f47ff5ad04e52e19693bb8195306640'
          },
          lastfm,
          userId = '';

  $_lastvk.on("lastvk.ready", function()
  {

    lastfm = new LastFM(lastfmSettings);


    $_lastvk.trigger('lastvk.lastfm.authorize');

  });

  /**
   * получение токена
   */
  $_lastfmAuthButton.on('click', function(e)
  {
    e.preventDefault();

    window.location.href = 'http://www.lastfm.ru/api/auth?api_key=' + lastfmSettings.apiKey;
  });

  /**
   * авторизация
   * http://habrahabr.ru/post/129246/
   */
  $_lastvk.on("lastvk.lastfm.authorize", function()
  {
    var t = getURLParameter('lastfm');
    if(t)
    {
      var lastfmToken = getURLParameter(t);
      if(lastfmToken)
      {
        lastfm.auth.getSession({token:lastfmToken}, {success:function(data)
        {
          userId = data.session.name;
          $_lastfmAuthButton.html("Last.fm: hi, " + userId).addClass("success disabled").off();
          $_lastvk.trigger("lastvk.authorized", ['LASTFM']);
        },
          error:function(code, message)
          {
            if(code == 4)
              $_lastfmAuthButton.html("Last.fm try again").addClass("alert");
          }});
      }
    }
  });

  /**
   * авторизовались в обеих соцсетях
   */
  $_lastvk.on('lastvk.initialized', function()
  {
    lastfm.user.getLovedTracks({user: userId}, {success:function(data)
    {
      console.log(data);
    },
      error:function(code, message)
      {

      }});
  });


});