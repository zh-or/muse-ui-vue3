import '../styles/components/bottom-sheet.less';
import theme from '../theme';
import BottomSheetTheme from './theme';
import BottomSheet from './BottomSheet';

BottomSheet.install = function (app) {
  app.component(BottomSheet.name, BottomSheet);
};

theme.addCreateTheme(BottomSheetTheme);
export default BottomSheet;
