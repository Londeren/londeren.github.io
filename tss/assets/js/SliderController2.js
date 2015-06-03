(function(angular) {
  'use strict';

  angular.module('slider', []).controller('SliderController', SliderController);

  angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById('x-slider'), ['slider']);
  });

  SliderController.$inject = ['$scope', '$window'];

  function SliderController($scope, $window) {
    var vm = this;

    vm.items = [
      "http://dummyimage.com/500x500/B83616/ffffff.png&text=slide1",
      "http://dummyimage.com/500x500/B8690A/ffffff.png&text=slide2",
      "http://dummyimage.com/500x500/FF5500/ffffff.png&text=slide3",
      "http://dummyimage.com/500x500/00FF00/ffffff.png&text=slide4",
      "http://dummyimage.com/500x500/0000FF/ffffff.png&text=slide5",
      "http://dummyimage.com/500x500/4B0082/ffffff.png&text=slide6",
      "http://dummyimage.com/500x500/8B00FF/ffffff.png&text=slide7",
      "http://dummyimage.com/500x500/B8B305/ffffff.png&text=slide8"
    ];

    vm.sliderStyle = {};
    vm.sliderItem = 0;

    vm.addItem = function() {
      var min = 30,
          max = 99,
          random = Math.floor(Math.random() * (max - min + 1)) + min;

      vm.items.push('http://dummyimage.com/500x500/4B0082/ffffff.png&text=slide' + random);
    };


    vm.scrollTo = function(item) { console.log(item);
      if(item < 0 || item + 1 > vm.items.length)
        return;

      vm.sliderStyle.transform = 'translateX(-' + item * 500 + 'px)';

      vm.item = item;
    };



  }


})(window.angular);