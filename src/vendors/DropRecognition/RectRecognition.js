import ConnectedAreaRecognition from "./ConnectedAreaRecognition";
import rgb2hsv from "./rgb2hsv";
import Rectangle from "./Rectangle";
export default class RectRecognition {
  constructor(ImageData) {
    this.height = ImageData.height;
    this.width = ImageData.width;
    this.ImageData = ImageData.data;
    this.lowwh = this.width < 1000 || this.height < 480;
    this.Node = new Set();
    this.SpiltLineSearch();
    let BinarizationMatrix = this.Binarization();
    this.tstar();
    let ConnectedArea = new ConnectedAreaRecognition(BinarizationMatrix, this.Node);
    let mergedRects = this.AutomergeRect(
      ConnectedArea.GetAllConnectedArea(Result => {
        Result.update({
          top: Result.top + this.MiddleLine.top,
          bottom: Result.bottom + this.MiddleLine.top
        });
        if (Result.point > 100 || (Result.width > 50 && Result.width / Result.height > 3)) {
          delete Result.point;
          return Result;
        }
      })
    );
    this.Bound(mergedRects);
    this.GetDropType(mergedRects.Right);
    this.mergedRects = mergedRects;
    delete this.rawMatrix;
    delete this.DataAreaSpilt;
    delete this.Node;
    delete this.ImageData;
    delete this.MiddleLine;
  }
  Matrix(y, x) {
    let idx = (y * this.width + x) * 4;
    return [this.ImageData[idx], this.ImageData[idx + 1], this.ImageData[idx + 2]];
  }
  // 识别边界
  Bound(Rects) {
    this.Stage = Rects.Stage;
    this.Items = [];
    for (let Rect of Rects.Right) {
      if (
        Math.abs(Rect.height / Rect.width - 1) < 0.2 &&
        Rect.height > 50 &&
        Rect.width > 50 &&
        Rect.top > this.MiddleLine.top + 20
      ) {
        if (this.lowwh) {
          let w = Math.max(Rect.width, Rect.height) - 1;
          Rect.bottom = Rect.top + w;
          Rect.right = Rect.left + w;
        }
        this.Items.push(Rect);
      }
    }
    this.Items.sort((a, b) => a.left - b.left);
  }
  GetDropType(Rects) {
    let top = this.Items.reduce((a, b) => a + b.bottom, 0) / this.Items.length;
    let DropType = [];
    for (let Rect of Rects) {
      if (Rect.top > top && Rect.width / Rect.height > 3 && Rect.top) {
        DropType.push({
          left: Rect.left,
          right: Rect.right,
          top: Rect.top,
          bottom: Rect.bottom
        });
      }
    }
    let Middle =
      DropType.reduce((last, t) => {
        return last + t.top;
      }, 0) / DropType.length;
    let distance = DropType.map(a => Math.abs(a.top - Middle));
    let distancem = distance.reduce((a, b) => a + b) / DropType.length;
    DropType = DropType.filter((_a, i) => {
      return Math.abs(distance[i] - distancem) < 10;
    });
    this.DropType = DropType.sort((a, b) => a.left - b.left);
  }
  SpiltLineSearch() {
    let XAxis = [0, -1];
    let tXAxis = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!tXAxis[x]) {
          tXAxis[x] = [];
        }
        let [R, G, B] = this.Matrix(y, x);
        let color = (R + G + B) / 3;
        if (color > 230) {
          if (tXAxis[x].length == 0) {
            tXAxis[x] = [y, y];
          } else {
            tXAxis[x][1] = y;
          }
        } else {
          if (XAxis[1] - XAxis[0] <= tXAxis[x][1] - tXAxis[x][0]) {
            XAxis = tXAxis[x];
            XAxis.push(x);
          }
          tXAxis[x] = [];
        }
      }
    }
    this.MiddleLine = new Rectangle({
      top: XAxis[0],
      bottom: XAxis[1],
      left: XAxis[2],
      right: XAxis[2]
    });
  }
  Binarization() {
    let Matrix = [];
    this.rawMatrix = [];
    for (let y = this.MiddleLine.top, ry = 0; y < this.MiddleLine.bottom; y++) {
      Matrix.push([]);
      this.rawMatrix.push([]);
      for (let x = 0; x < this.width; x++) {
        let [R, G, B] = this.Matrix(y, x);
        this.rawMatrix[ry][x] = [R, G, B];
        if (x > this.MiddleLine.left) {
          Matrix[ry][x] = R > 80 || G > 80 || B > 80;
        } else {
          Matrix[ry][x] = (R + G + B) / 3 < 127 ? false : true;
        }
        if (Matrix[ry][x]) {
          this.Node.add(x * 10000 + ry);
        }
      }
      ry++;
    }
    return Matrix;
  }
  sortRect(Rect1, Rect2) {
    let y = Rect1.top - Rect2.top,
      x = Rect1.left - Rect2.left;
    if (y == 0) {
      return x;
    } else {
      return y;
    }
  }
  /**
   * 合并边界距离在一定范围内的连通区
   * @param {*} Rects
   */
  AutomergeRect(Rects) {
    // 搜索出中间的竖线 以它为参考
    let MiddleLine = this.MiddleLine;
    let MiddleX = (MiddleLine.right + MiddleLine.left) / 2;
    let LeftRect = [],
      RightRect = [];
    for (let Rect of Rects) {
      if (Rect.right < MiddleX) {
        if (!this.isStar(Rect)) {
          LeftRect.push(Rect);
        }
      }
      if (Rect.left > MiddleX) {
        RightRect.push(Rect);
      }
    }
    LeftRect.sort(this.sortRect);
    let StageRect = LeftRect.shift();
    for (let Rect of LeftRect) {
      let [left, right, top, bottom] = StageRect.direction(Rect);
      if ((right || left) && !top && !bottom) {
        StageRect.merge(Rect);
      } else {
        break;
      }
    }
    let Merge = (Rects, q) => {
      for (let a = 0; a < Rects.length; a++) {
        for (let b = a + 1; b < Rects.length; b++) {
          if (this.lowwh) {
            if ((Rects[b].width / Rects[b].height > 3) || (Rects[b].width > 70 && Rects[b].height < 30)) continue;
            if ((Rects[a].width / Rects[a].height > 3) || (Rects[a].width > 70 && Rects[a].width < 30)) break;
          }
          if (Rects[a].distance(Rects[b]) < q) {
            Rects[a].merge(Rects[b]);
            delete Rects.splice(b, 1);
            a--;
            break;
          }
        }
      }
      return Rects;
    };
    return {
      Stage: StageRect,
      Right: Merge(RightRect, 10),
      Middle: MiddleLine
    };
  }
  isStar(Rect) {
    return this.Star.some((starRect) => {
      return Math.min(Rect.right, starRect.right) - Math.max(Rect.left, starRect.left) > 5 && Math.max(Rect.bottom, starRect.bottom) - Math.min(Rect.top, starRect.top) > 5
    })
  }
  tstar() {
    let height = this.MiddleLine.height >> 1;
    let width = this.MiddleLine.right - 1;
    let XAxis = new Array(width).fill(0);
    let YAxis = new Array(height).fill(0);
    let dislimit = 2;
    let StarX = [];
    let StarY;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let [H, S, V] = rgb2hsv(...this.rawMatrix[y][x]);
        if (H >= 180 && H <= 192 && V >= 80 && S > 50) {
          XAxis[x]++;
          YAxis[y]++;
        }
      }
    }
    for (let [x, c] of XAxis.entries()) {
      if (c > 5) {
        if (StarX.length == 0) {
          StarX.push([x, x])
        } else {
          if (x - StarX[StarX.length - 1][1] < dislimit) {
            StarX[StarX.length - 1][1] = x;
          } else {
            StarX.push([x, x])
          }
        }
      }
    }
    for (let [y, c] of YAxis.entries()) {
      if (c > 5) {
        if (!StarY) {
          StarY = [y, y];
        } else {
          if (y - StarY[1] < dislimit) {
            StarY[1] = y;
          }
        }
      }
    }
    this.Star = StarX.map(a => {
      return new Rectangle({
        top: StarY[0],
        bottom: StarY[1],
        left: a[0],
        right: a[1]
      })
    })
  }
}
