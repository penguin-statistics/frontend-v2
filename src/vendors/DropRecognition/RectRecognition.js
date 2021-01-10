import ConnectedAreaRecognition from "./ConnectedAreaRecognition";
export default class RectRecognition {
  constructor(ImageData) {
    let height = ImageData.length;
    let width = ImageData[0].length;
    this.ImageData = ImageData;
    this.lowwidth = width < 1000;
    this.Node = new Set();
    this.SpiltLineSearch(width, height, ImageData)
    if (this.DataAreaSpilt < 0) throw Error("SplitLine NotFound");
    let BinarizationMatrix = this.Binarization(width, height, ImageData);
    let ConnectedArea = new ConnectedAreaRecognition(BinarizationMatrix, this.Node);
    let mergedRects = this.AutomergeRect(
      ConnectedArea.GetAllConnectedArea(Result => {
        Result.update({
          top: Result.top + this.DataAreaSpilt,
          bottom: Result.bottom + this.DataAreaSpilt
        });
        if (Result.point > 100 || (this.lowwidth && Result.width > 50 && Result.width / Result.height > 3)) {
          delete Result.point;
          return Result;
        }
      })
    );
    this.Bound(mergedRects);
    this.GetDropType(mergedRects.Right, ImageData);
    this.mergedRects = mergedRects;
    delete this.DataAreaSpilt;
    delete this.Node;
    delete this.ImageData;
    delete this.MiddleLine;
  }
  // 识别边界
  Bound(Rects) {
    this.Stage = Rects.Stage;
    this.Items = [];
    for (let Rect of Rects.Right) {
      if (Math.abs(Rect.height / Rect.width - 1) < 0.2 && Rect.height > 50 && Rect.width > 50) {
        if (this.lowwidth) {
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
      if (Rect.top > top && Rect.width / Rect.height > 3) {
        DropType.push({
          left: Rect.left,
          right: Rect.right,
          top: Rect.top,
          bottom: Rect.bottom
        });
      }
    }
    this.DropType = DropType.sort((a, b) => a.left - b.left);
  }
  SpiltLineSearch(width, height, ImageData){
    let XAxis=[0,-1];
    let tXAxis=[];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if(!tXAxis[x]){
          tXAxis[x]=[];
        }
          let color=(ImageData[y][x][0] + ImageData[y][x][1] + ImageData[y][x][2]) / 3
          if(color > 230){
            if(tXAxis[x].length==0){
              tXAxis[x]=[y,y]
            } else {      
              tXAxis[x][1]=y;
            }
          } else {
            if(XAxis[1]-XAxis[0]<=tXAxis[x][1]-tXAxis[x][0]) {
              XAxis=tXAxis[x];
              XAxis.push(x);
            }
            tXAxis[x]=[];
          }
      }
    }
    this.DataAreaSpilt=XAxis[0];
    this.MiddleLine={
      top:XAxis[0],
      bottom:XAxis[1],
      left:XAxis[2],
      right:XAxis[2]
    }
  }
  Binarization(width, height, ImageData) {
    let Matrix = [];
    for (let y = this.DataAreaSpilt, ry = 0; y < height; y++) {
      Matrix.push([]);
      for (let x = 0; x < width; x++) {
        Matrix[ry][x] =
          ((ImageData[y][x][0] + ImageData[y][x][1] + ImageData[y][x][2]) / 3 < (this.lowwidth ? 70 : 75)) ? false : true;
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
        if (this.ISChar(Rect)) {
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
          if (this.lowwidth) {
            if (Rects[b].width / Rects[b].height > 3) continue;
            if (Rects[a].width / Rects[a].height > 3) break;
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
  ISChar(Rect) {
    let C = 0;
    for (let y = 0; y < Rect.height; y++) {
      for (let x = 0; x < Rect.width; x++) {
        let [R, G, B] = this.ImageData[y + Rect.top][x + Rect.left];
        let A = 255;
        let D = (Math.abs(R - A) + Math.abs(G - A) + Math.abs(B - A)) / 3;
        if (D < 30) {
          C++;
        }
      }
    }
    return C / (Rect.width * Rect.height) > 0.1;
  }
}
