class EraseButton extends Button {
  constructor(elem) {
    super();
    this.htmlElem = elem;
    elem.obj = this;
    elem.classList.add('del');
    elem.innerHTML = '<span>←</span>';
  }

  click(disp) {
    disp.erase();
  }

  static create(wrap) {
    let erase = new EraseButton(document.createElement('div'));
    wrap.append(erase.htmlElem);
    return erase;
  }
}