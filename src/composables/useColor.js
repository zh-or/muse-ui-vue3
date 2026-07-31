import { computed } from 'vue';
import { convertClass, getColor } from '../utils';

export function useColor(props) {
  const getNormalColorClass = (color, text = false, addInverse = true) => {
    const classObj = {};
    const themes = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
    themes.forEach((theme) => {
      classObj[`mu-${theme}${text ? '-text' : ''}-color`] = color === theme;
    });
    if (!text && addInverse) classObj['mu-inverse'] = !!color;
    return convertClass(classObj).join(' ');
  };

  const getColorClass = (addInverse = true) => {
    return getNormalColorClass(props.color, false, addInverse);
  };

  const getTextColorClass = () => {
    return getNormalColorClass(props.textColor, true, true);
  };

  const getColorValue = (color, disabled) => {
    if (disabled || props.disabled) return;
    return getColor(color);
  };

  return {
    getNormalColorClass,
    getColorClass,
    getTextColorClass,
    getColor: getColorValue
  };
}
