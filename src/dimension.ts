interface DimensionInterface {
  x: number,
  y: number
}

export default class Dimension {
  public x: number;
  public y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  generateArray() {
    return new Array(this.y).fill(0).map((v) => new Array(this.x).fill(0));
  }

  static create(coordinates:DimensionInterface) {
    return new Dimension(coordinates.x, coordinates.y);
  }
}

export { DimensionInterface };
