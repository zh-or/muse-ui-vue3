export const routeProps = {
  href: String,
  target: String,
  to: {
    type: [String, Object]
  },
  tag: {
    type: String,
    default: 'a'
  },
  activeClass: String,
  event: {
    type: [String, Array],
    default: 'click'
  },
  exact: Boolean,
  exactActiveClass: String,
  append: Boolean,
  replace: Boolean
};

export function useRoute(props) {
  const generateRouteProps = () => {
    return {
      href: props.href,
      target: props.target,
      to: props.to,
      tag: props.tag,
      activeClass: props.activeClass,
      event: props.event,
      exact: props.exact,
      exactActiveClass: props.exactActiveClass,
      append: props.append,
      replace: props.replace
    };
  };

  return { generateRouteProps };
}
