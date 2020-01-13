class Graph {
  constructor(elem) {
    this.elem = elem;
    this.canvas = elem.querySelector('.graph__canvas');
    this.canvas.width = elem.clientWidth;
    this.ctx = this.canvas.getContext('2d');
    this.cps = {};
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

  drawCoordPlane(options) {
    this.cp = this.cps[this.objToString(options)] || this.createCP(options);
    this.drawGrid(options.gridStep, this.cp.pxIndX, this.cp.pxIndY);
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
    this.clear();

    console.log('cleared');

    this.drawCoordPlane(options);

    console.log('CP drawn');

    this.drawLine(this.cp.xAxis);
    this.drawLine(this.cp.yAxis, true);

    console.log('Axis drawn');

    this.accuracy = options.accuracy;
    this._drawGraph(func);
  }

  _drawGraph(func) {
    let accuracy = +this.accuracy;
    let cp = this.cp;
    let ctx = this.ctx;
    let self = this;
    ctx.save();
    ctx.lineWidth = '1';
    ctx.lineJoin = 'round';
    ctx.translate(cp.yAxis, cp.xAxis);
    ctx.beginPath();
    ctx.moveTo(-cp.yAxis, -cp.yToPx(func(cp.startX)));
    console.log('start');
    let x = cp.startX + accuracy;

    draw();

    function draw() {
      if (x < cp.startX + cp.difX - 1e3 * accuracy) {
        self.timerId = setTimeout(draw);
      } else {
        self.timerId = setTimeout(() => {
          ctx.stroke();
          ctx.restore();
          console.log('end');
        })
      }
      let notDrawn;

      for (let i = 0; i < 1000; x += accuracy, i++) {
        let y = +func(x);
        console.log(y);

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
    }
  }

  drawGrid(value, pxIndX = value, pxIndY = value) {
    this.ctx.save();

    this.ctx.strokeStyle = '#78a8db';
    this.ctx.lineWidth = '2';
    this.ctx.beginPath();
    for (let i = pxIndX; i < this.canvas.width; i += value) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
    }

    for (let i = pxIndY; i < this.canvas.height; i += value) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
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
        bottom: this.elem.querySelector('.from-y').value,
        top: this.elem.querySelector('.to-y').value,
        left: this.elem.querySelector('.from-x').value,
        right: this.elem.querySelector('.to-x').value,
        accuracy: this.elem.querySelector('.accuracy').value,
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