/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

enum ICON_CLASSLIST {
  warning = 'warning',
  error = 'error',
  success = 'success',
  info = 'info',
}

type DefaultParams = {
  type: ICON_CLASSLIST;
  icon: string;
  message: string;
};

let timer: NodeJS.Timeout[] | [] = [];

const checkPopupExist = (parent: Element | null) => {
  const textBox = document.querySelector('.toast__box');

  if (textBox) {
    textBox.remove();
    parent?.classList.toggle('show');
  }

  if (timer?.length) {
    timer.forEach((timeout) => clearTimeout(timeout));

    timer = [];
  }
};

const defaultToast = ({ message, icon, type }: DefaultParams) => {
  const toast = document.querySelector('.app_toast');

  checkPopupExist(toast);

  setTimeout(() => toast?.classList.add('show'));

  const toastBox = document.createElement('div');
  toastBox.classList.add('toast__box');

  const toastIcon = document.createElement('span');
  toastIcon.classList.add('toast__icon', type);
  toastIcon.innerHTML = icon.trim();

  const messageElement = document.createElement('p');
  messageElement.classList.add('toast__message');
  messageElement.textContent = message;

  toastBox.appendChild(toastIcon);
  toastBox.appendChild(messageElement);

  toast?.appendChild(toastBox);

  toast?.addEventListener('touchmove', (e) => {
    // @ts-expect-error
    const newTouch = e?.changedTouches?.[0];
    const posY = newTouch?.pageY;

    if (posY <= 0) {
      toast?.classList.remove('show');
    }
  });

  const _timeout = setTimeout(() => {
    toast?.classList.remove('show');
  }, 4000);

  // @ts-expect-error
  timer.push(_timeout);
};

export const toast = (message: string) => {
  const _params = {
    message,
    type: ICON_CLASSLIST.success,
    icon: '<i class="bi bi-cone"></i>',
  };

  defaultToast(_params);
};

toast.warning = function f(message: string) {
  const _params = {
    type: ICON_CLASSLIST.warning,
    icon: '<i class="bi bi-cone"></i>',
    message,
  };

  defaultToast(_params);
};

toast.error = function f(message: string) {
  const _params = {
    message,
    type: ICON_CLASSLIST.error,
    icon: '<i class="bi bi-exclamation-triangle-fill"></i>',
  };

  defaultToast(_params);
};

toast.info = function f(message: string) {
  const _params = {
    message,
    type: ICON_CLASSLIST.info,
    icon: '<i class="bi bi-info"></i>',
  };

  defaultToast(_params);
};

toast.success = function f(message: string) {
  const _params = {
    message,
    type: ICON_CLASSLIST.success,
    icon: '<i class="bi bi-check"></i>',
  };

  defaultToast(_params);
};
