import './scss/styles.scss';
import { NavbarComponent } from './components/nav-bar/nav-bar';

customElements.define('nav-bar', NavbarComponent);

const navbar = document.querySelector('nav-bar') as NavbarComponent;
navbar.activePage = "/contact.html";

async function runEasyMathAsync() {
  
  const em = await import(/* webpackChunkName: "easymath" */'./utils/easymath');

  console.log(`Calculate 3 + 5: ${em.EasyMath.add(3, 5)}`);
}

setTimeout(async () => {await runEasyMathAsync();},2000);
