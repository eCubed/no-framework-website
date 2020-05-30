import { ListComponent } from '../list-c/list-c';

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
        this._componentContainer.removeChild(this._popupListElement);
        this._isPopupOpen = false;
      } else {
        this._componentContainer.appendChild(this._popupListElement);
        this._isPopupOpen = true;
      }
    });
  }

  private resolvePopupListElement() {
    if (this._popupListElement == null) {
      const {y, height} = this._selectedItemDisplayElement.getBoundingClientRect();
      this._popupListElement = document.createElement('list-c') as ListComponent;
      this._popupListElement.style.position = 'absolute';
      this._popupListElement.style.top = `${y + height}px`;
      this._popupListElement.innerHTML = this.innerHTML;
      this._popupListElement.items = this._items;
      this._popupListElement.addEventListener('onItemSelected', (e: CustomEvent) => {
        this._selectedItem = e.detail;
        // Maybe rerender the selected item
        
        // Close the popup
        this._componentContainer.removeChild(this._popupListElement);
        this._isPopupOpen = false;

        this.dispatchEvent(new CustomEvent('onItemSelected', { detail: e.detail}));
      });
    }
    if (this._selectedItem != null) {
      this._popupListElement.selectedItem = this._selectedItem;
    }
  }

  set items(value: any[]) {
    this._items = value;
    console.log(`set items popup select`);
    this.resolvePopupListElement();
  }

  set selectedItem(selectedItem: any) {
    this._selectedItem = selectedItem;
    this.resolvePopupListElement();
  }
}