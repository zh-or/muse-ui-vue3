import '../styles/components/avatar.less';
import theme from '../theme';
import AvatarTheme from './theme';
import Avatar from './Avatar';

Avatar.install = function (app) {
  app.component(Avatar.name, Avatar);
};

theme.addCreateTheme(AvatarTheme);
export default Avatar;
