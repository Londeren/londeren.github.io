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
    var storageToken = $.Storage.get("lastfmToken");
    if(t || storageToken)
    {
      var lastfmToken = getURLParameter(t);

      if(!lastfmToken)
        lastfmToken = storageToken;


      if(lastfmToken)
      {
        lastfm.auth.getSession({token:lastfmToken}, {success:function(data)
        {
          userId = data.session.name;
          $_lastfmAuthButton.html("Last.fm: hi, " + userId).addClass("success disabled").off();
          $_lastvk.trigger("lastvk.authorized", ['LASTFM']);

          $.Storage.set("lastfmToken", lastfmToken);
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
   * получить список любимых треков на данной странице
   * @param page
   */
  var getLovedList = function(page)
  {
    page = page || 1;
    page = parseInt(page);

    lastfm.user.getLovedTracks({user: userId, page: page}, {success:function(data)
    {
      if(data.lovedtracks["@attr"].total > 0)
      {
        var trackList = [];
        for(var t in data.lovedtracks.track)
        {
          var track = data.lovedtracks.track[t];

          trackList.push({
            "artist": track.artist.name,
            "title": track.name,
            "label": md5(track.artist.name + track.name)
          });
        }
        var tracklistView = $.views({view: 'tracklist', data: {tracks:trackList}});
        tracklistView.render($("#tracklist"), 'html');


        var pagingView = $.views({view: 'paging', data: {paging: $.paging({
          page:data.lovedtracks["@attr"].page,
          perPage:data.lovedtracks["@attr"].perPage,
          total:data.lovedtracks["@attr"].total
        }).getPagingParams()}});

        pagingView.render($("#paging"), 'html');

      }
    },
      error:function(code, message)
      {

      }});
  };

  /**
   * авторизовались в обеих соцсетях
   */
  $_lastvk.on('lastvk.initialized', function()
  {
    getLovedList();
  });

  $_lastvk.on("click", ".x-page-link", function(){
    var page = $(this).attr('href').substr(1); // #12 to 12
    getLovedList(page);
  });


});