
const template = require('./navbar-component.html');
export class NavbarComponent extends HTMLElement {

  private menuItems = [
    { label: 'Home', path: '/'},
    { label: 'About', path: '/about.html'},
    { label: 'Contact', path: '/contact.html'}
  ];

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open'});
    shadow.innerHTML = template;
    const navElement = shadow.getElementById('nav');
    console.log(JSON.stringify(this.menuItems));
    this.menuItems.forEach(menuItem => {
      navElement.appendChild(this.createMenuItemElement(menuItem));
    });
  }

  private createMenuItemElement(menuItem: any) {
    const div = document.createElement('div');
    const a = document.createElement('a');
    a.href = menuItem.path;
    a.innerText = menuItem.label;
    div.appendChild(a);
    return div;
  }
}