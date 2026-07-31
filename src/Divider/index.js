import '../styles/components/divider.less';
import theme from '../theme';
import DividerTheme from './theme';
import Divider from './Divider';

Divider.install = function (app) {
  app.component(Divider.name, Divider);
};

theme.addCreateTheme(DividerTheme);
export default Divider;
