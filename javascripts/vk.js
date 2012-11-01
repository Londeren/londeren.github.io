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
    VK.Auth.login(authInfo, 8);
  });

  function authInfo(response)
  {
    if(response.session)
    {
      $_vkAuthButton.html("VK.com authorized").addClass("success disabled").off();
    }
    else
    {
      $_vkAuthButton.html("VK.com try again").addClass("alert");
    }
  }
});