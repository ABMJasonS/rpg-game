import { type Vector, addVectors, scale, subVectors } from "./vector";

export class Hitbox {
  /**
   * Checks if two hitboxes are colliding
   * @param other Other hitbox to collide with
   * @returns True if colliding
   */
  collide(other: Hitbox) {
    switch (true) {
      case other instanceof Rectangle:
        return this.rectangle(other);
      case other instanceof Circle:
        return this.circle(other);
      case other instanceof Point:
        return this.point(other);
      default:
        return false;
    }
  }
  rectangle(other: Rectangle): boolean {
    return false;
  }
  circle(other: Circle): boolean {
    return false;
  }
  point(other: Point): boolean {
    return false;
  }
  clone(): Hitbox {
    return this;
  }
  translate(translation: Vector): void {}
}

export class Rectangle extends Hitbox {
  min: Vector;
  max: Vector;
  constructor(min: Vector, max: Vector) {
    super();
    this.min = min;
    this.max = max;
  }
  override rectangle(other: Rectangle): boolean {
    return this.max.x >= other.min.x && this.min.x <= other.max.x && this.max.y >= other.min.y && this.min.y < other.max.y;
  }
  override clone(): Hitbox {
    return new Rectangle(this.min, this.max);
  }
  override translate(translation: Vector) {
    this.min = addVectors(this.min, translation);
    this.max = addVectors(this.max, translation);
  }

  static create(size: Vector) {
    return new Rectangle(scale(size, -0.5), scale(size, 0.5));
  }
}
export class Circle extends Hitbox {}
export class Point extends Hitbox {}
