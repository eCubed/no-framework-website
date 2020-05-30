const scss = require('./list-c.scss');
const template = '<style>' + scss[0][1] + '</style>' + require('./list-c.html');

class ItemRegistration {
  uniqueId: string;
  object: any;
}

export class ListComponent extends HTMLElement {

  private _items: any[];
  private _selectedItem: any;

  private _localUniqueId = 17;
  private _itemRegistry: Array<ItemRegistration>;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open'});
    shadowRoot.innerHTML = template;    
  }

  set items(items: any[]) {
    this._items = items;
    this._itemRegistry = new Array<ItemRegistration>(); 
    this._items.forEach(item => {
      this._itemRegistry.push({uniqueId: `k-${this.getNextUniqueId()}`, object: item });
    })
    this.render();
  }

  set selectedItem(item: any) {
    this._selectedItem = item;
    this.highlightSelectedElementItem();
    //console.log(`selectedItem set for list-c: ${JSON.stringify(this._selectedItem)}`);
    //console.log(`Reg: ${JSON.stringify(this._itemRegistry)}`);
  }

  private getNextUniqueId() {
    this._localUniqueId++;
    return this._localUniqueId;
  }

  renderItem(itemRegistration: ItemRegistration, index: number): HTMLElement {
    const dummyParentElement = document.createElement('div');
    dummyParentElement.innerHTML = this.innerHTML;
    dummyParentElement.innerHTML = dummyParentElement.innerHTML.replace('{{ index }}', index.toString());
    
    Object.keys(itemRegistration.object).forEach(key => {
      dummyParentElement.innerHTML = dummyParentElement.innerHTML.replace(`{{ item.${key} }}`, itemRegistration.object[key]);
    });

    const itemElement = dummyParentElement.children[0] as HTMLElement;
    itemElement.setAttribute('key', itemRegistration.uniqueId);
    itemElement.style.cursor = 'pointer';
    itemElement.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('onItemSelected', { detail: itemRegistration.object }));
      this.selectedItem = itemRegistration.object;
    });

    return itemElement;
  }

  render() {
    const repeaterRoot = this.shadowRoot.querySelector('#repeater-root');
    repeaterRoot.innerHTML = '';
    this._itemRegistry.forEach((itemRegistration, index) => {
      repeaterRoot.appendChild(this.renderItem(itemRegistration, index));
    });

    this.highlightSelectedElementItem();
  }

  highlightSelectedElementItem() {
    if (this._selectedItem != null) {
      const registrationOfSelectedItem = this._itemRegistry.find(itemRegistry => itemRegistry.object === this._selectedItem);
      if (registrationOfSelectedItem != null) {        
       this.shadowRoot.querySelectorAll('[key]').forEach((element: HTMLElement) => {
        if (element.getAttribute('key') === registrationOfSelectedItem.uniqueId) {
          element.classList.add("selected");
        } else {
          element.classList.remove("selected");
        }
       })
      }
    }
  }
}