class Display {
  constructor(elem, caller) {
    this.htmlElem = elem;
    elem.obj = this;
    this.caller = caller;
    this.input = Input.create();
    this.output = new Output(elem.lastElementChild, this);
    elem.firstElementChild.appendChild(this.input.htmlElem);
  }

  insert(obj) {
    this.input.insert(obj);
  }

  getAnswer() {
    this.output.getAnswer(this.input);
  }

  erase() {
    this.input.erase();
  }
}