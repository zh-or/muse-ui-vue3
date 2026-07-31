import '../styles/components/tooltip.less';
import Tooltip from './Tooltip';

Tooltip.install = function (app) {
  app.component(Tooltip.name, Tooltip);
};

export default Tooltip;
