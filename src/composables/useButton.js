export const buttonProps = {
  disabled: Boolean,
  type: {
    type: String,
    default: 'button'
  },
  keyboardFocused: Boolean
};

export function useButton(props, { emit }) {
  const handleClick = (e) => {
    emit('click', e);
  };

  const handleKeyboardFocus = (isFocus) => {
    emit('keyboard-focus', isFocus);
  };

  const handleHover = (e) => {
    emit('hover', e);
  };

  const handleHoverExit = (e) => {
    emit('hover-exit', e);
  };

  return {
    handleClick,
    handleKeyboardFocus,
    handleHover,
    handleHoverExit
  };
}
