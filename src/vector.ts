export type Vector = {
  x: number,
  y: number
}

export function createVector(x: number, y: number): Vector {
  return {x: x, y: y}
}