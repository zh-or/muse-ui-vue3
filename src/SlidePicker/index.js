import '../styles/components/slide-picker.less';
import theme from '../theme';
import PickerTheme from './theme';
import Picker from './Picker';

Picker.install = function (app) {
  app.component(Picker.name, Picker);
};

theme.addCreateTheme(PickerTheme);
export default Picker;
