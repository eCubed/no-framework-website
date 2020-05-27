import './scss/styles.scss';
import { NavbarComponent } from './components/nav-bar/nav-bar';

customElements.define('nav-bar', NavbarComponent);

async function runEasyMathAsync() {
  
  const em = await import(/* webpackChunkName: "easymath" */'./utils/easymath');

  console.log(`Calculate 3 * 5: ${em.EasyMath.multiply(3, 5)}`);
}

runEasyMathAsync();