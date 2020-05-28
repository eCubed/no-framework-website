
const scss = require('./nav-bar.scss');
const template = '<style>' + scss[0][1] + '</style>' + require('./nav-bar.html');

export class NavbarComponent extends HTMLElement {


  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open'});
    shadowRoot.innerHTML = template;    
  }

  set activePage(value: string) {
    const anchorTagToSetActive = this.shadowRoot.querySelector(`a[href="${value}"]`);

    if (anchorTagToSetActive != null) {
      anchorTagToSetActive.setAttribute('class', 'active');
    }
  }
}