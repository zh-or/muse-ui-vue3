import '../styles/components/expansion-panel.less';
import theme from '../theme';
import ExpansionPanelTheme from './theme';
import ExpansionPanel from './ExpansionPanel';

ExpansionPanel.install = function (app) {
  app.component(ExpansionPanel.name, ExpansionPanel);
};

theme.addCreateTheme(ExpansionPanelTheme);
export default ExpansionPanel;
