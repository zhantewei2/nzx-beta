const _addEventListener=HTMLElement.prototype.addEventListener;

(HTMLElement.prototype as any).cmAddEventListener=_addEventListener;

const _setInterval=setInterval;
(window as any).cmSetInterval=_setInterval;
