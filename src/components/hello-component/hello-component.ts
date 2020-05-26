const template = require('./hello-component.html');

export class HelloComponent extends HTMLElement {
  
  private _messageElement: HTMLElement;

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = template;

    this._messageElement = shadow.getElementById('p-message');
    this._messageElement.innerText = this.getAttribute('message');

    this._messageElement.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('messageTapped', { detail: 'You tapped me!' }))
    });
  }

  static get observedAttributes() {
    return ['message'];
  }

  set message(value: string) {
    this.setAttribute('message', value);
    this._messageElement.innerHTML = value;
  }

  get message() {
    return this.getAttribute('message');
  }
}