export function prepareShowOnScroll(showOnScrollClassName: string) {
  
  const targets = document.querySelectorAll(`.${showOnScrollClassName}`);
  const observer = new IntersectionObserver(() => {
    targets.forEach(target => {
      target.classList.toggle('is-visible');
    });
  });

  targets.forEach(target => {
    observer.observe(target);
  })
}