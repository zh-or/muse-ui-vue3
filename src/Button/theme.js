import { fade, darken } from '../utils/colorManipulator';

export default (theme) => {
  return `
  .mu-raised-button {
    background-color: ${theme.background.paper};
    color: ${theme.text.primary};
  }
  .mu-raised-button.mu-primary-color {
    background-color: ${theme.primary};
  }
  .mu-raised-button.mu-secondary-color {
    background-color: ${theme.secondary};
  }
  .mu-raised-button.mu-success-color {
    background-color: ${theme.success};
  }
  .mu-raised-button.mu-warning-color {
    background-color: ${theme.warning};
  }
  .mu-raised-button.mu-info-color {
    background-color: ${theme.info};
  }
  .mu-raised-button.mu-error-color {
    background-color: ${theme.error};
  }
  .mu-raised-button.mu-inverse {
    color: ${theme.text.alternate};
  }
  .mu-raised-button.disabled{
    color: ${fade(theme.text.primary, 0.3)};
    background-color: ${darken(theme.text.alternate, 0.1)};
  }
  .mu-flat-button {
    color: ${theme.text.primary};
  }
  .mu-flat-button.mu-primary-text-color {
    color: ${theme.primary};
  }
  .mu-flat-button.mu-secondary-text-color {
    color: ${theme.secondary};
  }
  .mu-flat-button.mu-success-text-color {
    color: ${theme.success};
  }
  .mu-flat-button.mu-warning-text-color {
    color: ${theme.warning};
  }
  .mu-flat-button.mu-info-text-color {
    color: ${theme.info};
  }
  .mu-flat-button.mu-error-text-color {
    color: ${theme.error};
  }
  .mu-flat-button.disabled {
    color: ${theme.text.disabled};
  }
  .mu-icon-button {
    color: ${theme.text.primary};
  }
  .mu-icon-button.mu-primary-text-color {
    color: ${theme.primary};
  }
  .mu-icon-button.mu-secondary-text-color {
    color: ${theme.secondary};
  }
  .mu-icon-button.mu-success-text-color {
    color: ${theme.success};
  }
  .mu-icon-button.mu-warning-text-color {
    color: ${theme.warning};
  }
  .mu-icon-button.mu-info-text-color {
    color: ${theme.info};
  }
  .mu-icon-button.mu-error-text-color {
    color: ${theme.error};
  }
  .mu-icon-button.disabled {
    color: ${theme.text.disabled};
  }
  .mu-fab-button {
    background-color: ${theme.primary};
    color: ${theme.text.alternate};
  }
  .mu-fab-button.mu-primary-color {
    background-color: ${theme.primary};
  }
  .mu-fab-button.mu-secondary-color {
    background-color: ${theme.secondary};
  }
  .mu-fab-button.mu-success-color {
    background-color: ${theme.success};
  }
  .mu-fab-button.mu-warning-color {
    background-color: ${theme.warning};
  }
  .mu-fab-button.mu-info-color {
    background-color: ${theme.info};
  }
  .mu-fab-button.mu-error-color {
    background-color: ${theme.error};
  }
  .mu-fab-button.disabled {
    color: ${fade(theme.text.primary, 0.3)};
    background-color: ${darken(theme.text.alternate, 0.1)};
  }
  `;
};
