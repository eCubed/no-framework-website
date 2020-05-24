const template = `
  <div>
    <h1>Hello</h1>
    <p id="p-message"></p>
  </div>
`;

export class HelloComponent extends HTMLElement {
  
  private _messageElement: HTMLElement;

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = template;

    this._messageElement = shadow.getElementById('p-message');
    this._messageElement.innerText = this.getAttribute('message');
  }

  static get observedAttributes() {
    return ['message'];
  }

  set message(value: string) {
    this.setAttribute('message', value);
    // console.log(`Set message: ${value}`);
    this._messageElement.innerHTML = value;
  }

  get message() {
    return this.getAttribute('message');
  }
}