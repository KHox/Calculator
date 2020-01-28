class Graph {
  constructor(elem) {
    this.elem = elem;
    this.canvas = elem.querySelector('.graph__canvas');
    this.canvas.width = elem.clientWidth;
    this.ctx = this.canvas.getContext('2d');
    this.cps = {};
    this.functions = [];
    this.calculator = new Calculator(elem.querySelector('.graph__calculator'));
    this.elem.onclick = e => {
      if (e.target.classList.contains('settings__draw__button')) {
        let options;
        try {
          options = this.getOptions();
        } catch (err) {
          alert(err);
          return;
        }

        console.log('optinos received');

        let func;
        try {
          func = this.getFunc();
        } catch (err) {
          alert(err);
          return;
        }

        console.log('function received');

        this.canvas.scrollIntoView(false);
        this.drawGraph(func, options);
      } else if (e.target.classList.contains('settings__clear__button')) {
        Array.from(this.elem.querySelectorAll('.settings_params input')).forEach(inp => {
          inp.classList.remove('errored');
        })
      }
    }
  }

  setCoordPlane(options) {
    this.cp = this.cps[this.objToString(options)] || this.createCP(options);
  }

  createCP(options) {
    let cp = new CoordinatePlane(this.canvas);
    cp.create(options);
    this.cps[this.objToString(options)] = cp;
    return cp;
  }

  objToString(obj) {
    return Object.values(obj).join(';');
  }

  drawGraph(func, options) {
    let cp = this.cp;
    this.setCoordPlane({
      bottom: options.bottom,
      top: options.top,
      left: options.left,
      right: options.right,
      gridStep: options.gridStep
    });
    if (!options.multi || cp != this.cp) {
      this.clear();

      console.log('cleared');

      this.drawGrid(options.gridStep, this.cp.pxIndX, this.cp.pxIndY);

      console.log('CP drawn');

      this.drawLine(this.cp.xAxis);
      this.drawLine(this.cp.yAxis, true);

      console.log('Axis drawn');
    } else {
      this.functions = [];
    }

    if (!options.multi) {
      this.functions = [];
    }

    this.functions.push(func);
    this.accuracy = options.accuracy;
    this._drawGraph();
  }

  _drawGraph() {
    let accuracy = +this.accuracy;
    let cp = this.cp;
    let ctx = this.ctx;
    let self = this;
    let i = 0;
    let func;
    let x;
    ctx.save();
    ctx.lineWidth = '1';
    ctx.lineJoin = 'round';
    ctx.translate(cp.yAxis, cp.xAxis);

    draw('Done');

    function draw(result) {
      if (result == 'Done') {
        func = self.functions[i++];
        if (!func) return ctx.restore();
        ctx.moveTo(-cp.yAxis, -cp.yToPx(func(cp.startX)));
        ctx.beginPath()
        console.log('start');
        x = cp.startX + accuracy;
      }
      new Promise(smallDraw).then(draw);
    }

    function smallDraw(resolve) {
      let notDrawn;

      for (let i = 0; i < 1000; x += accuracy, i++) {
        let y = +func(x);

        if (isNumeric(y)) {
          if (notDrawn) {
            ctx.moveTo(cp.xToPx(x), -cp.yToPx(y));
            notDrawn = false;
          } else {
            ctx.lineTo(cp.xToPx(x), -cp.yToPx(y));
          }
        } else {
          notDrawn = true;
          continue;
        }
      }
      ctx.stroke();

      if (x >= cp.startX + cp.difX) {
        setTimeout(() => resolve('Done'));
      } else {
        setTimeout(resolve);
      }
    }
  }

  drawGrid(value, pxIndX = value, pxIndY = value) {
    this.ctx.save();

    this.ctx.strokeStyle = '#78a8db';
    this.ctx.lineWidth = '2';
    this.ctx.font = '10px Arial';
    this.ctx.beginPath();
    for (let i = pxIndX; i < this.canvas.width; i += value) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.fillText(+(this.cp.pxToX(i) + this.cp.startX).toFixed(2), i + 3, 10);
    }

    for (let i = pxIndY; i < this.canvas.height; i += value) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
      if (i >= this.cp.gridStep) this.ctx.fillText(+(this.cp.pxToY(i) + this.cp.startY).toFixed(2), 3, i + 10);
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  drawLine(coord, v = false) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineWidth = '4';
    if (v) {
      this.ctx.moveTo(coord, 0);
      this.ctx.lineTo(coord, this.canvas.height);
    } else {
      this.ctx.moveTo(0, coord);
      this.ctx.lineTo(this.canvas.width, coord);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  clear() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    clearTimeout(this.timerId);
  }

  getOptions() {
    let inputs = this.elem.querySelectorAll('.settings_params input');
    let isValid = true;
    for (let input of inputs) {
      if (input.hasAttribute('type')) continue;
      if (!isNumeric(input.value)) {
        input.classList.add('errored');
        input.onfocus = function() {
          this.classList.remove('errored');
          this.onfocus = null;
        }
        isValid = false;
      }
    }

    if (isValid) {
      return {
        bottom: +this.elem.querySelector('.from-y').value,
        top: +this.elem.querySelector('.to-y').value,
        left: +this.elem.querySelector('.from-x').value,
        right: +this.elem.querySelector('.to-x').value,
        accuracy: +this.elem.querySelector('.accuracy').value,
        multi: this.elem.querySelector('.multi').checked,
        gridStep: 40
      }
    } else {
      throw new Error('Invalid data');
    }
  }

  getFunc() {
    let input = this.elem.querySelector('.display__input');
    let func = replaceAll(input.value, toCode);

    if (isValidFunction(func)) {
      return function(x) {
        return eval(func);
      }
    } else {
      input.classList.add('errored');
      input.onfocus = function() {
        this.classList.remove('errored');
        this.onfocus = null;
      }
      throw new Error('Invalid function');
    }
  }
}