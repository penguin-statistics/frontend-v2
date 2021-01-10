export default class Rectangle {
  constructor(data = {}) {
    this.left = data.left || 0;
    this.top = data.top || 0;
    this.right = data.right || 0;
    this.bottom = data.bottom || 0;
    for (let [key, value] of Object.entries(data)) {
      if (!(key in this)) {
        this[key] = value;
      }
    }
  }
  update(data) {
    return Object.assign(this, data);
  }
  direction(Rect2) {
    let left = Rect2.right < this.left;
    let right = Rect2.left > this.right;
    let top = Rect2.bottom < this.top;
    let bottom = Rect2.top > this.bottom;
    return [left, right, top, bottom];
  }
  merge(Rect2) {
    return this.update({
      left: Math.min(this.left, Rect2.left),
      right: Math.max(this.right, Rect2.right),
      top: Math.min(this.top, Rect2.top),
      bottom: Math.max(this.bottom, Rect2.bottom)
    });
  }
  /**
   * 计算矩形距离
   * https://stackoverflow.com/a/26178015
   * @param {*} Rect2
   */
  distance(Rect2) {
    let [left, right, top, bottom] = this.direction(Rect2);
    if (left && top) {
      return Math.hypot(this.left - Rect2.right, this.top - Rect2.bottom);
    } else if (right && top) {
      return Math.hypot(this.right - Rect2.left, this.top - Rect2.bottom);
    } else if (left && bottom) {
      return Math.hypot(this.left - Rect2.right, this.bottom - Rect2.top);
    } else if (right && bottom) {
      return Math.hypot(this.right - Rect2.left, this.bottom - Rect2.top);
    } else if (left) {
      return this.left - Rect2.right;
    } else if (right) {
      return Rect2.left - this.right;
    } else if (top) {
      return this.top - Rect2.bottom;
    } else if (bottom) {
      return Rect2.top - this.bottom;
    } else {
      return 0;
    }
  }
  get width() {
    return this.right - this.left + 1;
  }
  get height() {
    return this.bottom - this.top + 1;
  }
  get area(){
    return this.width * this.height;
  }
}
