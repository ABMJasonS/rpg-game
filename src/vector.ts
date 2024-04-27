/**
 * A 2D vector
 */
export type Vector = {
  x: number;
  y: number;
};

/**
 * A unit for measuring angles. 2 * Math.PI = 360 degrees
 */
export type Radians = number;

/**
 * Creates a vector
 * @param x X component
 * @param y Y component
 * @returns A vector
 */
export function createVector(x: number, y: number): Vector {
  return { x: x, y: y };
}

/**
 * Creates a vector from a length and angle
 * @param length Length
 * @param angle Angle in radians
 * @returns A vector
 */
export function createPolar(length: number, angle: Radians): Vector {
  return rotateVector({ x: length, y: 0 }, angle);
}

/**
 * Rotates a vector
 * @param v Vector
 * @param rotation Angle in radians
 * @returns The vector but rotated
 */
export function rotateVector(v: Vector, rotation: Radians): Vector {
  const sin = Math.sin(rotation);
  const cos = Math.cos(rotation);
  return {
    x: cos * v.x - sin * v.y,
    y: sin * v.x + cos * v.y,
  };
}

/**
 * Adds two vectors
 * @param a Vector a
 * @param b Vector b
 * @returns Both vectors added
 */
export function addVectors(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * Subtracts two vectors
 * @param a Vector a
 * @param b Vector b
 * @returns Vector a subtracted to Vector b
 */
export function subVectors(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}

/**
 * Gets a vector's length
 * @param v Vector
 * @returns Vector length
 */
export function vectorLength(v: Vector): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * Gets a vector's angle in radians
 * @param v Vector
 * @returns Vector angle in radians
 */
export function vectorAngle(v: Vector): Radians {
  return Math.atan2(v.y, v.x);
}

/**
 * Changes the length of a vector
 * @param v Vector
 * @param length Length to set to
 * @returns A vector with the new length
 */
export function setLength(v: Vector, length: number): Vector {
  if (v.x === 0 && v.y === 0) return v;
  const len = vectorLength(v);
  return {
    x: (v.x / len) * length,
    y: (v.y / len) * length,
  };
}

/**
 * Scales the length of a vector
 * @param v Vector
 * @param scale The scale to multiply to the vector's length
 * @returns A vector with the new length
 */
export function scale(v: Vector, scale: number): Vector {
  return {
    x: v.x * scale,
    y: v.y * scale,
  };
}

/**
 * Clones a vector (because JS does pass by reference)
 * @param v Vector to clone
 * @returns Cloned vector
 */
export function cloneVector(v: Vector): Vector {
  return { x: v.x, y: v.y };
}
