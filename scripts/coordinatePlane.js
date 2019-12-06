class CoordinatePlane {
  constructor(canvas) {
    this.elem = canvas;
  }

  create(borders) {
    this.difX = borders.right - borders.left;
    this.xWidth = this.difX * 1.25;
    this.coordOY = this.xToPx(this.difX / 8 - borders.left);
    this.difY = borders.top < 0 ? -borders.bottom :
      borders.bottom > 0 ? borders.top : borders.top - borders.bottom;
    this.yWidth = this.difY * 1.25;
    this.coordOX = this.yToPx(this.difY / 8 + (borders.top < 0 ? 0 : borders.top));
    this.startX = -this.difX / 8 + borders.left;
  }

  xToPx(value) {
    return value / this.xWidth * this.elem.width;
  }

  yToPx(value) {
    return value / this.yWidth * this.elem.height;
  }

  calcIndents(step) {
    this.indX = this.coordOY % step;
    this.indY = this.coordOX % step;
  }
}