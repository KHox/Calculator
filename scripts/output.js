class Output {
  constructor(elem, caller) {
    this.htmlElem = elem;
    elem.obj = this;
    this.caller = caller;
    this.content = document.createElement('div');
    this.content.className = 'content';
    elem.appendChild(this.content);
  }

  getAnswer(obj) {
    if (this._isValid(obj.value)) {
      let sqrt = Math.sqrt;
      let sin = Math.sin;
      let cos = Math.cos;
      let n = ('' + this.caller.caller.accuracy).length - 2;
      let tg = x => sin(x) / cos(x).toFixed(n);
      let ctg = x => cos(x) / sin(x).toFixed(n);
      let str = this._replace(obj.value);
      if (/x/.test(str)) this.caller.caller.canvas.drawGraph(x => eval(str))
      else this.content.innerHTML = eval(str);
    }
  }

  _isValid(str) {
    return str.length && !/[\*\+\-\/][\+\-\/\*]|\.{2}|\.\d+\./.test(str);
  }

  _replace(str) {
    let regexp = /([\d)])([a-z(])/;
    let regexp2 = /([a-z)])(\d)/;
    while (regexp.test(str)) str = str.replace(regexp, '$1*$2');
    while (regexp2.test(str)) str = str.replace(regexp2, '$1*$2');
    return str;
  }
}