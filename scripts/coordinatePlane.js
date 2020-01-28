class CoordinatePlane {
  constructor(canvas) {
    this.elem = canvas;
  }

  create(options) {
    //On axis
    this.difX = options.right - options.left;
    this.difY = options.top - options.bottom;
    this.startX = +options.left;
    this.startY = +options.bottom;
    //In pixels
    this.pxIndX = -this.xToPx(options.left) % options.gridStep;
    this.pxIndY = this.yToPx(options.top) % options.gridStep;
    this.xAxis = this.yToPx(options.top);
    this.yAxis = -this.xToPx(options.left);


    this.gridStep = +options.gridStep;
  }

  xToPx(value) {
    return value / this.difX * this.elem.width;
  }

  yToPx(value) {
    return value / this.difY * this.elem.height;
  }

  pxToX(value) {
    return value * this.difX / this.elem.width;
  }

  pxToY(value) {
    return value * this.difY / this.elem.height;
  }
}