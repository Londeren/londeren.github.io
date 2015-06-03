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
      vm.sliderStyle = sliderStyle;
      vm.slideStyle = slideStyle;


      /**
       * set width for slide
       * @return {{width: string}}
       */
      function sliderStyle(){
        if(vm.items)
          return {
            width: vm.sliderWidth * vm.items.length + 2000 + 'px'
          };
      }

      /**
       * set width for slide
       * @return {{width: string}}
       */
      function slideStyle(){
        return {
          width: vm.sliderWidth + 'px'
        };
      }

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

    }

    /**
     * window, container sizes
     * @param scope
     * @param ctrl
     */
    function calculateSizes(scope, ctrl) {
      var wdn = angular.element($window),
          resize;

      scope.$watch(function () {
        return {
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth,
          sliderWidth: document.getElementById("x-slider__body").clientWidth
        };
      }, function (newValue) {
        ctrl.sliderWidth = newValue.sliderWidth / getSlidesPerScreen(newValue);
      }, true);

      wdn.bind('resize', function () {
        scope.$apply();

      });
    }

    /**
     * slides on screen
     * @param sizes
     * @return {number}
     */
    function getSlidesPerScreen(sizes) {
      if(sizes.windowWidth > 1000)
        return 5;

      return 4;
    }
  }
})();