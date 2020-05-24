import './scss/styles.scss';
import { HelloComponent } from './components/hello-component/hello-component';

customElements.define('ec-hello', HelloComponent);

const helloC = document.querySelector('ec-hello');
console.log(`helloC attribute: ${helloC.getAttribute('message')}`);