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
          viewHtml = '',
          viewGetter,
          self;

  function Plugin(element, options)
  {
    this.element = element;
    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();

    self = this;
  }

  Plugin.prototype.init = function()
  {
    if(this.options.view && this.options.view.length)
    {
      var url = this.options.viewsPath + this.options.view + ".html";
      viewGetter = $.ajax({
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
    viewGetter.done(function(){
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