import './scss/styles.scss';
import { HelloComponent } from './components/hello-component/hello-component';
import { NavbarComponent } from './components/navbar/navbar-component';

customElements.define('nav-bar', NavbarComponent);
customElements.define('ec-hello', HelloComponent);

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