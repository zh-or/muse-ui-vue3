import '../styles/components/drawer.less';
import '../styles/components/elevation.less';
import theme from '../theme';
import DrawerTheme from './theme';
import Drawer from './Drawer';

Drawer.install = function (app) {
  app.component(Drawer.name, Drawer);
};

theme.addCreateTheme(DrawerTheme);
export default Drawer;
