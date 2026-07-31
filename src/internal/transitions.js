import { h, Transition } from 'vue';
import '../styles/transitions.less';
export { default as ExpandTransition } from './ExpandTransition';

function createTransition(name, mode) {
  return {
    name,
    setup(props, { slots }) {
      return () => h(Transition, { name, mode }, slots.default);
    }
  };
}

export const FadeTransition = createTransition('mu-fade-transition');
export const SlideTopTransition = createTransition('mu-slide-top-transition');
export const SlideBottomTransition = createTransition('mu-slide-bottom-transition');
export const SlideLeftTransition = createTransition('mu-slide-left-transition');
export const SlideRightTransition = createTransition('mu-slide-right-transition');
export const PopoverTransiton = createTransition('mu-popover-transition');
export const BottomSheetTransition = createTransition('mu-bottom-sheet-transition');
export const ScaleTransition = createTransition('mu-scale-transition');
