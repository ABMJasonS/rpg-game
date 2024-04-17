export type Vector = {
  x: number,
  y: number
}

export type Radians = number;

export function createVector(x: number, y: number): Vector {
  return { x: x, y: y }
}

export function createPolar(length: number, angle: Radians): Vector {
  return rotateVector({x: length, y: 0}, angle);
}

export function rotateVector(v: Vector, rotation: Radians): Vector {
  const sin = Math.sin(rotation);
  const cos = Math.cos(rotation);
  return {
    x: cos * v.x - sin * v.y,
    y: sin * v.x + cos * v.y
  }
}

export function addVectors(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function subVectors(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function vectorLength(v: Vector): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function vectorAngle(v: Vector): Radians {
  return Math.atan2(v.y, v.x);
}