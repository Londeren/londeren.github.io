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
      "http://dummyimage.com/400x400/B83616/ffffff.png&text=slide1",
      "http://dummyimage.com/400x400/B8690A/ffffff.png&text=slide2",
      "http://dummyimage.com/400x400/FF5500/ffffff.png&text=slide3",
      "http://dummyimage.com/400x400/00FF00/ffffff.png&text=slide4",
      "http://dummyimage.com/400x400/0000FF/ffffff.png&text=slide5",
      "http://dummyimage.com/400x400/4B0082/ffffff.png&text=slide6",
      "http://dummyimage.com/400x400/8B00FF/ffffff.png&text=slide7",
      "http://dummyimage.com/400x400/B8B305/ffffff.png&text=slide8"
    ];

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

    calculateSizes($scope, vm);


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

      if(!framesTotal)
        return;

      if(vm.frame + 1 > framesTotal)
        vm.frame = framesTotal - 1;

      vm.sliderStyles.transform = 'translateX(-' + vm.frame * vm.slideWidth * vm.itemsPerFrame + 'px)';
    }

    function calculateSizes(scope, ctrl) {
      var wdn = angular.element($window),
          resize;

      scope.$watch(function() {
        return {
          windowWidth: window.innerWidth
        };
      }, function(newValue) {
        var sliderWidth = document.getElementById("x-slider__body").clientWidth;

        ctrl.itemsPerFrame = getItemsPerFrame(newValue);
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
    function getItemsPerFrame(sizes) {
      if(sizes.windowWidth > 1000)
        return 5;

      return 4;
    }

  }


})(window.angular);