import '../styles/components/alert.less';
import Alert from './Alert';

Alert.install = function (app) {
  app.component(Alert.name, Alert);
};

export default Alert;
