export class PopupSettings {
  x: number;
  y: number;
  startData: any;

  constructor(x: number, y: number, startData: any) {
    this.x = x;
    this.y = y;
    this.startData = startData;
  }
}

export class PopupRef {  
  onClose: (data?:any) => void;
  close(data?: any) {
    this.onClose(data);
  }
}

const scss = require('./popup-case.scss');
const template = '<style>' + scss[0][1] + '</style>' + require('./popup-case.html');

export class PopupCase extends HTMLElement {

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open'});
    shadowRoot.innerHTML = template; 
    
  }

  set contentElement(value: PopupContentElementBase) {    
    const caseElement = this.shadowRoot.querySelector('#case');
    caseElement.appendChild(value);
  }
}

export abstract class PopupContentElementBase extends HTMLElement {
  protected _popupRef: PopupRef;
  protected _startData?: any;

  constructor() {
    super();    
  }

  set popupRef(value: PopupRef) {
    this._popupRef = value;
  }

  set startData(value: any) {
    this._startData = value;
  }
}

export class TestPopupContentElement extends PopupContentElementBase {
  constructor() {
    super();
    
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <div>
        This is Test Popup Ref! <span id="close">X</span>
      </div>
    `;

    const closeElement = shadow.querySelector('#close');
    closeElement.addEventListener('click', (e) => {
      this._popupRef.close();
    });

  }
}

export function openPopup<PCE extends PopupContentElementBase>(popupContentElementClass: { new(): PCE}, 
  settings: PopupSettings, onCloseCallback: (data?: any) => void): void {

  const popupRef = new PopupRef();
  const contentInstance = new popupContentElementClass();
  contentInstance.popupRef = popupRef;
  contentInstance.startData = settings.startData;
  const newPopupCase = new PopupCase();
  newPopupCase.contentElement = contentInstance;
  newPopupCase.style.position = 'absolute';
  newPopupCase.style.top = `${settings.y}px`;
  newPopupCase.style.left = `${settings.x}px`;

  document.body.appendChild(newPopupCase);

  popupRef.onClose = (data?: any) => {
    onCloseCallback(data);
    document.body.removeChild(newPopupCase);
  };
}