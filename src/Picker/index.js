import '../styles/components/picker.less';
import theme from '../theme';
import PickerTheme from './theme';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import DateTimePicker from './DateTimePicker';

theme.addCreateTheme(PickerTheme);
export { DatePicker, TimePicker, DateTimePicker };
export default {
  install (app) {
    app.component(DatePicker.name, DatePicker);
    app.component(TimePicker.name, TimePicker);
    app.component(DateTimePicker.name, DateTimePicker);
  }
};
