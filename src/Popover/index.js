import '../styles/components/popover.less';
import theme from '../theme';
import PopoverTheme from './theme';
import Popover from './Popover';

Popover.install = function (app) {
  app.component(Popover.name, Popover);
};

theme.addCreateTheme(PopoverTheme);
export default Popover;
