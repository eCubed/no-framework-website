import * as moment from 'moment';

import './scss/styles.scss';
import { HelloComponent } from './components/hello-component/hello-component';
import { NavbarComponent } from './components/nav-bar/nav-bar';
import { ListComponent } from './components/list-c/list-c';
import { PopupSelectComponent } from './components/popup-select-c/popup-select-c';
import { TemplatedComponent } from './components/templated-c/templated-c';
import { openPopup, TestPopupContentElement, PopupSettings, PopupCase } from './components/popups/popups';


customElements.define('nav-bar', NavbarComponent);
customElements.define('ec-hello', HelloComponent);
customElements.define('list-c', ListComponent);
customElements.define('popup-select-c', PopupSelectComponent);
customElements.define('templated-c', TemplatedComponent);
customElements.define('popup-case', PopupCase);
customElements.define('test-popup-c', TestPopupContentElement);

const popupSettings = new PopupSettings(100,100, { name: 'Something'});
openPopup(TestPopupContentElement, popupSettings, (data?: any) => {
  console.log('Test Popup Closed!!!');
});

const items = [
  { number: 4, name: 'Jarret Stidham' },
  { number: 11, name: 'Julian Edelman' },
  { number: 32, name: 'Devin McCourty' },
  { number: 34, name: 'Rex Burkhead' },
  { number: 50, name: 'Chase Winovich'}
];

const popupSelectC = document.querySelector('popup-select-c') as PopupSelectComponent;
popupSelectC.items = items;
popupSelectC.selectedItem = items[1];
popupSelectC.addEventListener('onItemSelected', (e: CustomEvent) => {
  console.log(`Selected popup item: ${JSON.stringify(e.detail)}`);
});
/*
const listC = document.querySelector('list-c') as ListComponent;
listC.items = items;
listC.selectedItem = items[2];
*/
const navbar = document.querySelector('nav-bar') as NavbarComponent;
navbar.activePage = "/";


const helloC = document.querySelector('#the-hello') as HelloComponent;

helloC.addEventListener('messageTapped', onMessageTapped);

setTimeout(() => {
  helloC.message = "The New message after 2 seconds";
}, 2000);

function onMessageTapped(e: CustomEventInit<string>) {
  alert(e.detail);
}
const anotherHelloComponent = new HelloComponent();
anotherHelloComponent.message = 'I am another one!';
document.getElementById('mounter').appendChild(anotherHelloComponent);

console.log(`Today, per Moment is: ${moment().format('dddd, MMM DD, yyyy')}`);