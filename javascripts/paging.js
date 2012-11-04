;
(function($, window, undefined)
{

  var pluginName = 'paging',
      document = window.document,
      defaults = {
        page:1,
        perPage:50,
        total:0
      };

  function Plugin(element, options)
  {
    this.element = element;
    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;
  }

  Plugin.prototype.getPagingParams = function()
  {
    var UNAVAILABLE_PAGE = -1;

    var pagingParams = {
      pages:[],
      hasPrev:false,
      hasNext:false
    };
    if(this.options.total > 0)
    {
      var pages = Math.ceil(this.options.total / this.options.perPage);

      pagingParams.hasPrev = (this.options.page > 1 ? this.options.page - 1 : false);
      pagingParams.hasNext = (this.options.page < pages ? this.options.page + 1 : false);

      var shownPages = [],
          shownPagesFromBegin = 2,
          shownPagesFromEnd = 2,
          shownPagesFromActive = 2,
          prevShown = 0;
      for(var j = 1; j <= pages; j++)
      {
        if(shownPagesFromBegin >= j
            || j > pages - shownPagesFromEnd
            || (this.options.page - j <= shownPagesFromActive && this.options.page - j >= 0 || j - this.options.page <= shownPagesFromActive && j - this.options.page >= 0)
          )
        {
          shownPages.push(j);
          prevShown = j;
        }
        if(prevShown !== j && j - prevShown == 2)
          shownPages.push(UNAVAILABLE_PAGE);

      }

      for(var i = 0; i < shownPages.length; i++)
      {
        var p = shownPages[i];
        var page = {
          page: p,
          isCurrent: (p == this.options.page)
        };
        if(p == UNAVAILABLE_PAGE)
        {
          page.isUnavailable = true;
          page = $.extend(page, {
            isUnavailable: true,
            page: ""
          });
        }
        pagingParams.pages.push(page);
      }
    }

    return pagingParams;
  };

  $.paging = function(options)
  {
    return new Plugin(this, options);
  };

}(jQuery, window));