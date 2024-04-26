import type { Vector } from "./vector";

export class Hitbox {
	collide(other: Hitbox) {
		switch (true) {
			case other instanceof Rectangle:
				return this.rectangle(other);
			case other instanceof Circle:
				return this.circle(other);
			case other instanceof Point:
				return this.point(other);
      default: return false
		}
	}
	rectangle(other: Rectangle): boolean {
    return false;
  }
	circle(other: Circle): boolean {
    return false
  }
	point(other: Point): boolean {
    return false
  }
  clone(): Hitbox {
    return this
  }
}

export class Rectangle extends Hitbox {
  min: Vector;
  max: Vector;
  constructor(min: Vector, max: Vector) {
    super()
    this.min = min
    this.max = max
  }
  override rectangle(other: Rectangle): boolean {
    return this.max.x >= other.min.x && this.min.x <= other.max.x && this.max.y >= other.min.y && this.min.y < other.max.y
  }
  override clone(): Hitbox {
      return new Rectangle(this.min, this.max)
  }
}
export class Circle extends Hitbox {}
export class Point extends Hitbox {}
