
const scss = require('./nav-bar.scss');
const template = '<style>' + scss[0][1] + '</style>' + require('./nav-bar.html');

export class NavbarComponent extends HTMLElement {

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open'});
    shadow.innerHTML = template;    
  }
}