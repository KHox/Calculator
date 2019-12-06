class Canvas {
  constructor(parent, caller) {
    this.elem = document.createElement('canvas');
    this.elem.className = 'canv';
    this.ctx = this.elem.getContext('2d');
    this.drawnLines = [];
    this.cps = {};
    this.caller = caller;
    parent.appendChild(this.elem);
  }

  drawCoordPlane(borders) {
    if (borders) this.cp = this.cps[this.objToString(borders)] || this.createCP(borders);
    this.drawGrid(this.gridStep, this.cp.indX, this.cp.indY);
    this.drawLine(this.cp.coordOY, true);
    this.drawLine(this.cp.coordOX);
  }

  createCP(borders) {
    let cp = new CoordinatePlane(this.elem);
    cp.create(borders);
    cp.calcIndents(this.gridStep);
    this.cps[this.objToString(borders)] = cp;
    return cp;
  }

  objToString(obj) {
    return Object.values(obj).join(';');
  }

  drawGraph(func) {
    this.clear();
    this.drawCoordPlane();
    this._drawGraph(func);
  }

  _drawGraph(func) {
    let accuracy = this.caller.accuracy;
    let cp = this.cp;
    this.ctx.save();
    this.ctx.lineWidth = '2';
    this.ctx.translate(cp.coordOY, cp.coordOX);
    this.ctx.beginPath();
    this.ctx.moveTo(-cp.coordOY, -cp.yToPx(func(cp.startX)));
    for (let x = cp.startX + accuracy; x < cp.startX + cp.xWidth; x += accuracy) {
      let y = func(x);
      if (isNumeric(y)) {
        this.ctx.lineTo(cp.xToPx(x), -cp.yToPx(y))
      } else {
        this.ctx.stroke();
        this.ctx.beginPath();
      }
    }
    this.ctx.stroke();
    this.ctx.restore();

    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }

  drawGrid(value, indX = value, indY = value) {
    this.ctx.save();

    this.ctx.strokeStyle = '#78a8db';
    this.ctx.lineWidth = '2';

    this.ctx.beginPath();
    for (let i = indX; i < this.elem.width; i += value) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.elem.height);
    }

    for (let i = indY; i < this.elem.height; i += value) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.elem.width, i);
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
      this.ctx.lineTo(coord, this.elem.height);
    } else {
      this.ctx.moveTo(0, coord);
      this.ctx.lineTo(this.elem.width, coord);
    }
    this.ctx.stroke();
    this.ctx.restore();
    this.drawnLines.push({
      coord,
      v
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.elem.width, this.elem.height);
  }

  setMetrix() {
    this.elem.width = this.elem.clientWidth;
    this.elem.height = this.elem.clientHeight;
    this.gridStep = this.elem.clientHeight / 10;
  }
}