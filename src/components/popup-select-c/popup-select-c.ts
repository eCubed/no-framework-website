import { ListComponent } from '../list-c/list-c';
import { queryElementHtmlStringFromHTMLString } from '../../utils/domtools';

const scss = require('./popup-select-c.scss');
const template = '<style>' + scss[0][1] + '</style>' + require('./popup-select-c.html');


export class PopupSelectComponent extends HTMLElement {

  _popupListElement: ListComponent;
  _selectedItemDisplayElement: HTMLElement;
  _componentContainer: HTMLElement;
  _isPopupOpen = false;
  _selectedItem: any;
  _items: any[];

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = template;

    this._componentContainer = shadow.querySelector('#component-container');    
    this._selectedItemDisplayElement = shadow.querySelector('#selected-item-display');
    this._selectedItemDisplayElement.addEventListener('click', (e) => {
      this.resolvePopupListElement();
      if (this._isPopupOpen) {
        this._popupListElement.classList.remove('visible');
        setTimeout(() => {          
          this._componentContainer.removeChild(this._popupListElement);
        }, 500);
        this._isPopupOpen = false;
      } else {          
        this._componentContainer.appendChild(this._popupListElement);
        this._isPopupOpen = true;
        setTimeout(() => {          
          this._popupListElement.classList.add('visible');
        },50);         
      }
    });
  }

  private resolvePopupListElement() {
    if (this._popupListElement == null) {
      const {y, height} = this._selectedItemDisplayElement.getBoundingClientRect();
      console.log(height);
      this._popupListElement = document.createElement('list-c') as ListComponent;
      this._popupListElement.style.position = 'absolute';
      this._popupListElement.style.top = `${height}px`;
      this._popupListElement.innerHTML = queryElementHtmlStringFromHTMLString(this.innerHTML, 'item-template');
      this._popupListElement.items = this._items;
      this._popupListElement.addEventListener('onItemSelected', (e: CustomEvent) => {
        this._selectedItem = e.detail;
        this.resolveSelectedItemDisplay();
        // Maybe rerender the selected item
        
        // Close the popup
        this._popupListElement.classList.remove('visible');
        setTimeout(() => {          
          this._componentContainer.removeChild(this._popupListElement);
        }, 500);
        this._isPopupOpen = false;

        this.dispatchEvent(new CustomEvent('onItemSelected', { detail: e.detail}));
      });
    }
    if (this._selectedItem != null) {
      this._popupListElement.selectedItem = this._selectedItem;
    }
  }

  private resolveSelectedItemDisplay() {
    const selectedItemDisplay = this.shadowRoot.querySelector('#selected-item-display');

    selectedItemDisplay.innerHTML = queryElementHtmlStringFromHTMLString(this.innerHTML, 'selected-item-template');

    Object.keys(this._selectedItem).forEach(key => {
      selectedItemDisplay.innerHTML = selectedItemDisplay.innerHTML.replace(`{{ item.${key} }}`, this._selectedItem[key]);
    });
  }

  set items(value: any[]) {
    this._items = value;
    console.log(`set items popup select`);
    this.resolvePopupListElement();
  }

  set selectedItem(selectedItem: any) {
    this._selectedItem = selectedItem;
    this.resolvePopupListElement();
    this.resolveSelectedItemDisplay();
  }
}