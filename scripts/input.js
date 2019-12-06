class Input {
  constructor(elem) {
    this.htmlElem = elem;
    elem.obj = this;
    this.value = '';
    Object.defineProperty(this, 's', {
      get() {
        return this.htmlElem.selectionStart;
      },
      set(value) {
        this.htmlElem.selectionEnd = value;
      }
    });

    elem.oninput = () => {
      this.value = replace(elem.value, toCode);
    };

    elem.onclick = () => {
      let s = this.s;
      if (isFuncSymb(this.value[s - 1]) && (isFuncSymb(this.value[s]) || this.value[s] == '(')) {
        s = this._getLeftSlidePos(s);
        elem.setSelectionRange(s, s);
      }
    };

    elem.onkeydown = e => {
      console.log(e);
      if (e.keyCode == 37) {
        this.leftSlide();
      } else if (e.keyCode == 39) {
        this.rightSlide();
      }

      e.preventDefault();
    }
  }

  insert(obj) {
    let s = this.s;
    let e = this.htmlElem;
    e.value = this._ins(e.value, s, obj.htmlStr || obj.value);
    this.s = s + obj.value.length - (obj instanceof FunctionButton ? 1 : 0);
  }

  erase() {
    let s = this._getLeftSlidePos(this.s);
    this.htmlElem.value = this._ins(this.htmlElem.value, s, '', this.s);
    this.s = s;
  }

  leftSlide() {
    this.s = this._getLeftSlidePos(this.s);
  }

  _getLeftSlidePos(s) {
    let str = this.htmlElem.value;
    s--;
    if (s > 0 && (str[s] == '(' && isFuncSymb(str[s - 1]) || str[s] != '(' && isFuncSymb(str[s]))) {
      while (s > 0 && isFuncSymb(str[s - 1])) s--;
    }
    return s > 0 && s < str.length ? s : 0;
  }

  rightSlide() {
    let s = this._getRightSlidePos(this.s);
    this.htmlElem.setSelectionRange(s, s);
  }

  _getRightSlidePos(s) {
    let str = this.htmlElem.value;
    if (s < str.length - 1 && !isFuncSymb(str[s])) return s + 1;
    s++;
    while (s < str.length && (isFuncSymb(str[s]) || s > 0 && str[s] == '(' && isFuncSymb(str[s - 1]) && s++ && false)) s++;
    return s > 0 && s < str.length ? s : str.length;
  }

  _ins(val, l, text, r = l) {
    return val.slice(0, l) + text + val.slice(r);
  }

  static create() {
    return new Input(document.createElement('input'));
  }
}