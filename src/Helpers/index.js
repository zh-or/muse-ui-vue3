import { h } from 'vue';
import TouchRipple from '../internal/TouchRipple';
import {
  ExpandTransition,
  FadeTransition,
  SlideTopTransition,
  SlideBottomTransition,
  SlideLeftTransition,
  SlideRightTransition,
  ScaleTransition
} from '../internal/transitions';
import clickOutside from '../internal/directives/click-outside';
import resize from '../internal/directives/resize';
import scroll from '../internal/directives/scroll';
import elevation from '../internal/directives/elevation';

export default {
  install(app) {
    app.component('mu-ripple', TouchRipple);
    [
      ExpandTransition,
      FadeTransition,
      SlideTopTransition,
      SlideBottomTransition,
      SlideLeftTransition,
      SlideRightTransition,
      ScaleTransition
    ].forEach(transition => app.component(transition.name, transition));
    app.directive(clickOutside.name, clickOutside);
    app.directive(resize.name, resize);
    app.directive(scroll.name, scroll);
    app.directive(elevation.name, elevation);
  }
};
