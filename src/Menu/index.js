import '../styles/components/menu.less';
import Menu from './Menu';

Menu.install = function (app) {
  app.component(Menu.name, Menu);
};

export default Menu;
