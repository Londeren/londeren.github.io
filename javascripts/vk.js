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
          $_vkAuthButton = $("#vk-auth-button");

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

  function authInfo(response)
  {
    if(response.session)
    {
      VK.Api.call('users.get', {uids: response.session.mid}, function(res) {
        var first_name = res.response.pop()['first_name'];
        var howdy = "VK.com: hi, " + first_name;
        $_vkAuthButton.html(howdy).removeClass("alert").addClass("success disabled").off();
      });
    }
    else
    {
      $_vkAuthButton.html("VK.com try again").removeClass("success disabled").addClass("alert");
    }
  }
});