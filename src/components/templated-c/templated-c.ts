const scss = require('./templated-c.scss');
const template = '<style>' + scss[0][1] + '</style>' + require('./templated-c.html');

export class TemplatedComponent extends HTMLElement {
  
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open'});
    shadowRoot.innerHTML = template;

    this.getTemplatesFromFront();
  }

  private transferChildren(shadowIdSelector: string, templateName: string) {
    const tempParent = document.createElement('div');
    tempParent.innerHTML = this.innerHTML;
    const headingTemplateElement = tempParent.querySelector(templateName);
    if (headingTemplateElement != null) {
      const headingContainer = this.shadowRoot.querySelector(`#${shadowIdSelector}`);
      
      while(headingTemplateElement.children.length > 0) {
        headingContainer.appendChild(headingTemplateElement.children[0]);
      }
    }
  }

  private getTemplatesFromFront() {
    this.transferChildren('heading-container', 'heading-template');
    this.transferChildren('footer-container', 'footer-template');
  }
}