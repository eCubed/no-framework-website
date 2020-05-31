export function htmlToParentElement(htmlString: string): HTMLElement{
  const tempParent = document.createElement('div');
  tempParent.innerHTML = htmlString;
  return tempParent;
}

export function queryElementFromHtmltring(htmlString: string, queryString: string): HTMLElement {
  return htmlToParentElement(htmlString).querySelector(queryString);
}

export function queryElementHtmlStringFromHTMLString(htmlString: string, queryString: string): string {
  return queryElementFromHtmltring(htmlString, queryString).innerHTML;
}

export function loadHTMLToElement(htmlString: string, element: HTMLElement) {
  
}