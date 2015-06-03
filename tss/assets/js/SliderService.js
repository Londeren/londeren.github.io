(function() {
  'use strict';

  angular.module('slider.service', []).service('SliderService', SliderService);

  SliderService.$inject = ['$http'];

  function SliderService($http) {

    return {
      getFirstItems: getFirstItems,
      getNextItems: getNextItems
    };

    function getNextItems() {
      var min = 0,
          max = 2,
          random = Math.floor(Math.random() * (max - min + 1)) + min;

      return $http.get('api/next_items' + random + '.json').then(function(res) {
        return res.data;
      });
    }

    function getFirstItems() {
      return $http.get('api/first_items.json').then(function(res) {
        return res.data;
      });
    }
  }
})();