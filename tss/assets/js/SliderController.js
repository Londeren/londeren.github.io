(function(angular) {
  'use strict';

  angular.module('slider', ['slider.directive', 'slider.service']).controller('SliderController', SliderController);

  angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById('x-slider'), ['slider']);
  });

  SliderController.$inject = ['SliderService'];

  function SliderController(SliderService) {
    var vm = this;

    vm.getNextItems = getNextItems;

    SliderService.getFirstItems().then(function(data) {
      vm.items = data;
    });


    function getNextItems() {
      SliderService.getNextItems().then(function(data) {
        vm.items = vm.items.concat(data);
      });
    }

  }


})(window.angular);