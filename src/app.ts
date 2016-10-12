interface Dimension {
  x: number,
  y: number
}

enum Direction {
  Up = 0,
  Down,
  Left,
  Right
}

class DimensionMap {
  private map:Array<Array<number>>;
  private origin: Dimension;

  constructor(size:Dimension = {x: 0, y: 0}, origin:Dimension = null) {
    this.map = new Array(size.y).fill(1).map(() => new Array(size.x).fill(0));

    if (origin === null) {
      origin = { x: Math.floor(size.x / 2), y: Math.floor(size.y / 2) };
    } else {
      try {
        this.map[origin.y][origin.x];
      } catch (e) {
        throw(`Given origin (${origin.x}, ${origin.y}) is out of map range!`);
      }
    }

    this.origin = origin;
    this.set({ x: 0, y: 0 }, '+');
  }

  get(position:Dimension):any {
    const keys = this.dimensionToKeys(position);

    try {
      return this.map[keys.y][keys.x];
    } catch (e) {
      throw(`Given dimensions are out of map!`);
    }
  }

  dimensionToKeys(dim:Dimension):Dimension {
    let keyX = dim.x, keyY = dim.y;

    if (dim.x <= 0) keyX = this.origin.x + Math.abs(keyX);
    else keyX = this.origin.x - Math.abs(keyX);
    if (dim.y <= 0) keyY = this.origin.y + Math.abs(keyY);
    else keyY = this.origin.y - Math.abs(keyY);

    return { x: keyX, y: keyY };
  }

  set(position:Dimension, value:any) {
    const keys = this.dimensionToKeys(position);

    try {
      this.map[keys.y][keys.x] = value;
    } catch (e) {
      throw(`Given dimensions are out of map!`);
    }
  }

  move(position:Dimension, destination:(Dimension|Direction)):Dimension {
    const val = this.get(position);
    let newPosition:Dimension = { x: position.x, y: position.y };

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

  replace(positionX:Dimension, positionY:Dimension) {
    const valX = this.get(positionX);
    const valY = this.get(positionY);

    this.set(positionX, valY);
    this.set(positionY, valX);
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

  reverseDirection(direction:Direction) {
      switch (direction) {
        case Direction.Up: return Direction.Down;
        case Direction.Left: return Direction.Right;
        case Direction.Down: return Direction.Up;
        case Direction.Right: return Direction.Left;
      }
  }

  expand(direction:Direction, unit:number = 1) {
    if (unit === 0) return;

    if (unit < 0) {
      direction = this.reverseDirection(direction);
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
}

const map = new DimensionMap({ x: 7, y: 9 });
const pos1 = { x: 3, y: -3 };
const pos2 = { x: 2, y: -3 };

map.display();
map.expand(Direction.Left, 6);
map.display();
