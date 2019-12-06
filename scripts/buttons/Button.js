class Button {
  constructor(value) {
    this.htmlElem = document.createElement('td');
    this.htmlElem.obj = this;
    this.htmlElem.innerHTML = this.value = value;
  }

  click(disp) {
    disp.insert(this);
    disp.input.htmlElem.focus();
    disp.input.htmlElem.dispatchEvent(new Event('input', {
      bubbles: true,
      cancelable: true
    }));
  }
}