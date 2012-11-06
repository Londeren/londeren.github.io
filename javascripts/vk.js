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
      VK = window.VK,
      $_vkAuthButton = $("#vk-auth-button"),
      userId = 0;

  var ALBUM_NAME_LOVED = 'Loved tracks',
      ALBUM_NAME_POPULAR = 'Most popular tracks';

  $_lastvk.on("lastvk.ready", function()
  {
    VK.init({
      apiId:3205923
    });

    VK.Auth.getLoginStatus(authInfo);


  });

  $_vkAuthButton.on('click', function(e)
  {
    e.preventDefault();
    VK.Auth.login(authInfo, VK.access.AUDIO);
  });

  /**
   * авторизовались в обеих соцсетях
   */
  $_lastvk.on('lastvk.initialized', function()
  {

  });


  /**
   * импорт выбранных Loved треков в vk
   */
  $_lastvk.on("click", ".x-tracklist__to-vk", function(e)
  {
    e.preventDefault();

    var $_selectedTracks = $_lastvk.find(".x-tracklist__to-vk__track:checked"),
        tracksToImport = [];

    if($_selectedTracks.length)
    {
      var vkTracks = [];

      VK.Api.call('audio.get', {uid:userId}, function(res)
      {
        if(res.response.length === 0)
          return;

        for(var t in res.response)
        {
          var trk = res.response[t];
          vkTracks.push({
            "artist":trk.artist,
            "title":trk.title
          });
        }

        $_selectedTracks.each(function()
        {
          var track = {
            "artist":$(this).data('artist'),
            "title":$(this).data('title')
          };

          if(isTrackInTrackList(track, vkTracks))
            return;

          tracksToImport.push(track);
        });

        if(tracksToImport.length)
          getAlbumIdByName(ALBUM_NAME_LOVED, importTracks, tracksToImport);
      });


    }
  });

  /**
   * авторизация
   * @param response
   */
  function authInfo(response)
  {
    if(response.session)
    {
      userId = response.session.mid;
      VK.Api.call('users.get', {uids:userId}, function(res)
      {
        var first_name = res.response.pop()['first_name'];
        var howdy = "VK.com: hi, " + first_name;
        $_vkAuthButton.html(howdy).removeClass("alert").addClass("success disabled").off();
        $_lastvk.trigger("lastvk.authorized", ['VK']);
      });
    }
    else
    {
      $_vkAuthButton.html("VK.com try again").removeClass("success disabled").addClass("alert");
    }
  }

  /**
   * присутствует ли трек в списке треков
   * @param track
   * @param trackList
   */
  function isTrackInTrackList(track, trackList)
  {
    if(trackList.length === 0)
      return false;

    for(var t in trackList)
    {
      var trk = trackList[t];

      if(trk.artist == track.artist && trk.title == track.title)
        return true;
    }
    return false;
  }

  /**
   * добавить данные треки в VK
   * TODO показывать прогрессбар
   * @param tracksToImport
   * @param albumId
   */
  function importTracks(tracksToImport, albumId)
  {

    if(tracksToImport.length === 0)
      return;

    albumId = parseInt(albumId) || 0;

    for(var t in tracksToImport)
    {
      if(!tracksToImport.hasOwnProperty(t))
        continue;

      var track = tracksToImport[t];

      (function(track){
        VK.Api.call('audio.search', {q:track.artist + " - " + track.title, count:20}, function(res)
        {
          if(res.response.length === 0)
            return;

          for(var tr in res.response)
          {
            if(!res.response.hasOwnProperty(tr) || tr == 0) // первый элемент - количество записей
              continue;

            var trk = res.response[tr];

            if(isTrackInTrackList(track, [trk])) // запись что надо
            {
              (function(trk){
                setTimeout(function(){
                  VK.Api.call('audio.add', {aid:trk.aid, oid:trk.owner_id}, function(res)
                  {
                    //moveTrackToAlbum(res.response, albumId);

                  });
                }, 1000);
              })(trk);

              break;
            }
          }

        });
      })(track);

    }

  }

  /**
   * ID альбома по его названию. если альбом отсутствует, то он создается
   * @param albumName
   * @param callback
   * @param callbackParam
   */
  function getAlbumIdByName(albumName, callback, callbackParam)
  {
    VK.Api.call('audio.getAlbums', {}, function(res)
    {
      if(res.response.length !== 0)
      {
        for(var al in res.response)
        {
          if(!res.response.hasOwnProperty(al) || al == 0) // первый элемент - количество альбомов
            continue;

          var album = res.response[al];
          if(album.title == albumName)
          {
            callback(callbackParam, album.album_id);
            return;
          }
        }
      }

      /**
       * добавить альбом
       */
      VK.Api.call('audio.addAlbum', {title: albumName}, function(res)
      {
        if(res.response.album_id > 0)
          callback(callbackParam, res.response.album_id);

      });

    });
  }

  /**
   * переместить трек в альбом
   * @param albumId
   * @param trackId
   */
  function moveTrackToAlbum(trackId, albumId)
  {
    VK.Api.call('audio.moveToAlbum', {aids: trackId, album_id: albumId}, function(res)
    {
      return res.response;
    });
  }

});