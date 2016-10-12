import Dimension, { DimensionInterface } from './dimension';

enum Direction {
  Up = 0,
  Down,
  Left,
  Right
}

class DimensionMap {
  private map:Array<Array<number>>;
  private origin: Dimension;

  constructor(size:(Dimension|DimensionInterface), origin:Dimension = null) {
    this.map = (size instanceof Dimension ? size : Dimension.create(size))
      .generateArray();

    if (origin === null) {
      origin = new Dimension(Math.floor(size.x / 2), Math.floor(size.y / 2));
    } else {
      try {
        this.map[origin.y][origin.x];
      } catch (e) {
        throw(`Given origin (${origin.x}, ${origin.y}) is out of map range!`);
      }
    }

    this.origin = origin;
    this.set(new Dimension(), '+');
  }

  get(position:(Dimension|DimensionInterface)):any {
    const dim = (position instanceof Dimension ? position : Dimension.create(position));
    const keys = this.dimensionToKeys(dim);

    try {
      return this.map[keys.y][keys.x];
    } catch (e) {
      throw(`Given dimensions are out of map!`);
    }
  }

  dimensionToKeys(dim:(Dimension|DimensionInterface)) {
    dim = (dim instanceof Dimension ? dim : Dimension.create(dim));
    let keyX = dim.x, keyY = dim.y;

    if (dim.x <= 0) keyX = this.origin.x + Math.abs(keyX);
    else keyX = this.origin.x - Math.abs(keyX);
    if (dim.y <= 0) keyY = this.origin.y + Math.abs(keyY);
    else keyY = this.origin.y - Math.abs(keyY);

    return { x: keyX, y: keyY };
  }

  set(position:(Dimension|DimensionInterface), value:any) {
    const dim = (position instanceof Dimension ? position : Dimension.create(position));
    const keys = this.dimensionToKeys(dim);

    try {
      this.map[keys.y][keys.x] = value;
    } catch (e) {
      throw(`Given dimensions are out of map!`);
    }
  }

  move(position:(Dimension|DimensionInterface), destination:(Dimension|Direction)):Dimension {
    const dim = (position instanceof Dimension ? position : Dimension.create(position));
    const val = this.get(dim);
    let newPosition:Dimension = new Dimension(dim.x, dim.y);

    switch (destination) {
      case Direction.Up: newPosition.y--; break;
      case Direction.Down: newPosition.y++; break;
      case Direction.Left: newPosition.x--; break;
      case Direction.Right: newPosition.x++; break;
      default: newPosition = destination as Dimension; break;
    }

    this.set(newPosition, val);
    this.set(position, 0);

    return newPosition;
  }

  replace(pos1:(Dimension|DimensionInterface), pos2:(Dimension|DimensionInterface)) {
    const val1 = this.get(pos1);
    const val2 = this.get(pos2);

    this.set(pos1, val2);
    this.set(pos2, val1);
  }

  display() {
    var pad = ((width, string, padding) => (
      width <= string.length) ? string : pad(width, padding + string, padding)
    );

    console.log();

    /* X: Indexes */
    console.log('      ' + new Array(this.map[0].length).fill(1).map((v, i) => (
      (this.origin.x - i < 0 ? '-' : ' ')
    )).join(' '));
    console.log('      ' + new Array(this.map[0].length).fill(1).map((v, i) => (
      Math.abs(this.origin.x - i)
    )).join(' '));

    /* Map */
    let lines = this.map.map((row, i) => row.map((v) => v).join(' '));

    /* Y: Indexes */
    lines.map(((val, i) => {
      return `${pad(4, this.origin.y - i, ' ')} [${val}] `;
    }).bind(this)).map((line) => { console.log(line); });

    console.log();
  }

  expand(direction:Direction, unit:number = 1) {
    if (unit === 0) return;

    if (unit < 0) {
      direction = DimensionMap.reverseDirection(direction);
      unit = Math.abs(unit);
    }

    switch (direction) {
      case Direction.Up:
        this.map = [new Array(this.map[0].length).fill(0)].concat(this.map);
        this.origin.y++;
        break;
      case Direction.Down:
        this.map = this.map.concat([new Array(this.map[0].length).fill(0)]);
        break;
      case Direction.Left:
        this.map = this.map.map((row) => [0].concat(row));
        this.origin.x++;
        break;
      case Direction.Right:
        this.map = this.map.map((row) => row.concat([0]));
        break;
    }

    if ((--unit) > 0) return this.expand(direction, unit);
  }

  static reverseDirection(direction:Direction) {
    switch (direction) {
      case Direction.Up: return Direction.Down;
      case Direction.Left: return Direction.Right;
      case Direction.Down: return Direction.Up;
      case Direction.Right: return Direction.Left;
    }
  }
}

const map = new DimensionMap({ x: 7, y: 9 });
const pos1 = { x: 3, y: -3 };
const pos2 = { x: 2, y: -3 };

map.display();
map.expand(Direction.Left, 6);
map.display();
