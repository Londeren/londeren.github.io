;
(function($, window, undefined)
{

  var pluginName = 'views',
          document = window.document,
          defaults = {
            viewsPath:"/views/",
            view:null,
            data:{}
          },
          viewHtml = '';

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
    if(this.options.view && this.options.view.length)
    {
      var url = this.options.viewsPath + this.options.view + ".html";

      this.viewGetter = $.ajax({
        url:url,
        dataType:"html",
        type:"GET"
      }).done(function(data)
              {
                viewHtml = data;
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
    this.viewGetter.done(function(){
      if(viewHtml.length === 0)
        return;

      elem[where](Mustache.to_html(viewHtml, self.options.data));
    });

  };


  $.views = function(options)
  {
    return new Plugin(this, options);
  };

}(jQuery, window));