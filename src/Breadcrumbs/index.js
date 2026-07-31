import '../styles/components/breadcrumbs.less';
import theme from '../theme';
import BreadcrumbsTheme from './theme';
import Breadcrumbs from './Breadcrumbs.vue';
import BreadcrumbsItem from './BreadcrumbsItem.vue';

Breadcrumbs.install = function (Vue) {
  Vue.component(Breadcrumbs.name, Breadcrumbs);
  Vue.component(BreadcrumbsItem.name, BreadcrumbsItem);
};

theme.addCreateTheme(BreadcrumbsTheme);
export { Breadcrumbs, BreadcrumbsItem };
export default Breadcrumbs;
