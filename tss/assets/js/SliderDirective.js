(function(){
  'use strict';

  angular.module('slider.directive', []).directive('slider', SliderDirective);

  SliderDirective.$inject = ['$window'];

  function SliderDirective($window) {

    SliderController.$inject = ['$timeout'];


    return {
      scope: true,
      templateUrl: 'slider.tpl',
      bindToController: {
        items: '='
      },
      controllerAs: 'vm',
      controller: SliderController,
      link: SliderLink
    };


    /**
     * Controller
     * @constructor
     */
    function SliderController(){
      var vm = this;

      vm.scrollToPrev = scrollToPrev;
      vm.scrollToNext = scrollToNext;




      function scrollToPrev() {
        console.log('prev');
      }

      function scrollToNext() {
        console.log('next');

      }
    }

    /**
     * linking func
     * @param scope
     * @param element
     * @param attrs
     * @param ctrl
     * @constructor
     */
    function SliderLink(scope, element, attrs, ctrl) {

      calculateSizes(scope, ctrl);


      scope.$watch(attrs.items, function(value) {
        angular.forEach(angular.element(document.querySelectorAll("#x-slider__items")), function(el){
          console.log(el);
        });
      });
    }

    /**
     * window, container sizes
     * @param scope
     * @param ctrl
     */
    function calculateSizes(scope, ctrl) {
      var wdn = angular.element($window);

      scope.$watch(function () {
        return {
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth,
          sliderWidth: document.getElementById("x-slider__body").clientWidth
        };
      }, function (newValue) {
        ctrl.sliderWidth = getCalculatedSlideWidth(newValue);


        /**
         * set width for slide
         * @return {{width: string}}
         */
        ctrl.sliderStyle = function(){
          return {
            width: ctrl.sliderWidth * ctrl.items.length + 2000 + 'px'
          };
        };

        /**
         * set width for slide
         * @return {{width: string}}
         */
        ctrl.slideStyle = function(){
          return {
            width: ctrl.sliderWidth + 'px'
          };
        };

      }, true);

      wdn.bind('resize', function () {
        scope.$apply();
      });
    }

    /**
     * size of single slide
     * @param sizes
     * @return object
     */
    function getCalculatedSlideWidth(sizes) {
      if(sizes.windowWidth > 1000)
        return sizes.sliderWidth / 5;

      return sizes.sliderWidth / 4;
    }
  }
})();