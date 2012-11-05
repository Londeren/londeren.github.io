;
(function($, window, undefined)
{

  var pluginName = 'views',
          document = window.document,
          defaults = {
            viewsPath:"/views/",
            view:null,
            data:{}
          };

  function Plugin(element, options)
  {
    this.element = element;
    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;
    this.viewGetter = null;

    this.init();
  }

  Plugin.prototype.init = function()
  {
    if(this.options.view && this.options.view.length && typeof Plugin.viewsHtml[this.options.view] === "undefined" || Plugin.viewsHtml[this.options.view].length === 0)
    {
      var self = this,
          url = this.options.viewsPath + this.options.view + ".html";
      Plugin.viewsHtml[this.options.view] = '';

      this.viewGetter = $.ajax({
        url:url,
        dataType:"html",
        type:"GET"
      }).done(function(data)
              {
                Plugin.viewsHtml[self.options.view] = data;
              })
        .fail(function(e)
        {
          console.log(e.status + ": " + e.statusText);
        });
    }
  };

  Plugin.prototype.render = function(elem, where)
  {
    var self = this;
    if(Plugin.viewsHtml[this.options.view].length === 0)
    {
      this.viewGetter.done(function(){
        if(Plugin.viewsHtml[self.options.view].length === 0)
          return;

        elem[where](Mustache.to_html(Plugin.viewsHtml[self.options.view], self.options.data));
      });
    }
    else
    {
      elem[where](Mustache.to_html(Plugin.viewsHtml[this.options.view], self.options.data));
    }

  };


  $.views = function(options)
  {
    if(typeof Plugin.viewsHtml === "undefined")
      Plugin.viewsHtml = {};
    return new Plugin(this, options);
  };

}(jQuery, window));