(function() {
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
    function SliderController() {
      var vm = this;

      /**
       * slides
       * @type {Array}
       */
      vm.items = [];
      /**
       * slider body styles
       * @type {{}}
       */
      vm.sliderStyles = {};
      /**
       * slider frame number
       * @type {number}
       */
      vm.frame = 0;


      vm.scrollToPrev = scrollToPrev;
      vm.scrollToNext = scrollToNext;
      vm.sliderStyle = sliderStyle;
      vm.slideStyle = slideStyle;
      vm.getFramesTotal = getFramesTotal;
      vm.recalculateScroll = recalculateScroll;


      /**
       * set width for slide
       * @return {{}}
       */
      function sliderStyle() {
        vm.sliderStyles.width = vm.slideWidth * vm.items.length + 2000 + 'px';

        return vm.sliderStyles;
      }

      /**
       * set width for slide
       * @return {{width: string}}
       */
      function slideStyle() {
        return {
          width: vm.slideWidth + 'px'
        };
      }

      /**
       *
       */
      function getFramesTotal() {

        return Math.ceil(vm.items.length / vm.itemsPerFrame)
      }

      /**
       * scroll frame backward
       */
      function scrollToPrev() {
        if(!vm.frame)
          return;

        var nextFrame = vm.frame - 1;

        vm.sliderStyles.transform = 'translateX(-' + nextFrame * vm.slideWidth * vm.itemsPerFrame + 'px)';

        vm.frame = nextFrame;
      }

      /**
       * scroll frame forward
       */
      function scrollToNext() {
        var nextFrame = vm.frame + 1;

        if(vm.getFramesTotal() == nextFrame)
          return;

        vm.sliderStyles.transform = 'translateX(-' + nextFrame * vm.slideWidth * vm.itemsPerFrame + 'px)';

        vm.frame = nextFrame;
      }

      /**
       * recalculate frames
       */
      function recalculateScroll() {
        var framesTotal = vm.getFramesTotal();

        if(vm.frame > framesTotal)
          vm.frame = framesTotal - 1;

        vm.sliderStyles.transform = 'translateX(-' + vm.frame * vm.slideWidth * vm.itemsPerFrame + 'px)';
      }
    }


    /**
     * linking
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

      scope.$watch(function() {
        return {
          windowWidth: window.innerWidth
        };
      }, function(newValue) {
        var sliderWidth = document.getElementById("x-slider__body").clientWidth;

        ctrl.itemsPerFrame = getSlidesPerScreen(newValue);
        ctrl.slideWidth = sliderWidth / ctrl.itemsPerFrame;

        ctrl.recalculateScroll();
      }, true);

      wdn.bind('resize', function() {
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