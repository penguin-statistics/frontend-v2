/* eslint-disable */
class Rectangle {
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

class ConnectedAreaRecognition {
  constructor(Matrix, Node, GetMatrix) {
    this.Matrix = Matrix;
    if (Node) this.Node = Node;
    if (GetMatrix) {
      this.GetMatrix = GetMatrix;
    }
  }
  GetConnectedArea(Vertex, Callback) {
    let Result = this.BFS(this.Matrix, Vertex);
    if (this.GetMatrix) {
      let Matrix = [];
      for (let y = 0; y < Result.height; y++) {
        Matrix.push(new Array(Result.width).fill(false));
      }
      for (let aVertex of Result.matrix) {
        Matrix[aVertex[1]-Result.top][aVertex[0]-Result.left] = true;
      }
      Result.matrix = Matrix;
    }
    if (Callback) Result = Callback(Result);
    return Result;
  }
  GetAllConnectedArea(Callback) {
    let Queue = this.Node.values();
    let Ret = [];
    for (let Vertex of Queue) {
      let Result = Callback
        ? this.GetConnectedArea([Math.floor(Vertex / 10000), Vertex % 10000], Callback)
        : this.GetConnectedArea([Math.floor(Vertex / 10000), Vertex % 10000]);
      if (Result) {
        Ret.push(Result);
      }
    }
    return Ret;
  }
  BFS(Matrix, Vertex) {
    let Rect = new Rectangle({
      left: Infinity,
      right: -Infinity,
      top: Infinity,
      bottom: -Infinity,
      point: 0
    });
    if (this.GetMatrix) {
      Rect.matrix = [];
    }
    let Queue = [];
    let Direction = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0]
    ];
    Rect.update({
      left: Math.min(Rect.left, Vertex[0]),
      right: Math.max(Rect.right, Vertex[0]),
      top: Math.min(Rect.top, Vertex[1]),
      bottom: Math.max(Rect.bottom, Vertex[1])
    });
    Matrix[Vertex[1]][Vertex[0]] = false;
    if (this.Node) this.Node.delete(Vertex[0] * 10000 + Vertex[1]);
    Queue.push(Vertex);
    while (Queue.length != 0) {
      Rect.point++;
      let NowVertex = Queue.shift();
      if (this.GetMatrix) {
        Rect.matrix.push(NowVertex);
      }
      for (let d = 0; d < Direction.length; d++) {
        let NextVertex = [NowVertex[0] + Direction[d][0], NowVertex[1] + Direction[d][1]];
        if (
          NextVertex[0] < 0 ||
          NextVertex[1] < 0 ||
          NextVertex[0] >= Matrix[0].length ||
          NextVertex[1] >= Matrix.length
        )
          continue;
        if (Matrix[NextVertex[1]][NextVertex[0]]) {
          Rect.update({
            left: Math.min(Rect.left, NextVertex[0]),
            right: Math.max(Rect.right, NextVertex[0]),
            top: Math.min(Rect.top, NextVertex[1]),
            bottom: Math.max(Rect.bottom, NextVertex[1])
          });
          Matrix[NextVertex[1]][NextVertex[0]] = false;
          if (this.Node) this.Node.delete(NextVertex[0] * 10000 + NextVertex[1]);
          Queue.push(NextVertex);
        }
      }
    }
    return Rect;
  }
}

class RectRecognition {
  constructor(ImageData) {
    let height = ImageData.length;
    let width = ImageData[0].length;
    this.ImageData = ImageData;
    this.Node = new Set();
    /* 粗检测关卡掉落信息区域 */
    let YAxis = Array(height).fill(0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        YAxis[y] += ImageData[y][x][0] + ImageData[y][x][1] + ImageData[y][x][2];
      }
      YAxis[y] /= 3;
    }
    let DataAreaSpilt = -1;
    for (let y = 1; y < height; y++) {
      if (YAxis[y - 1] - YAxis[y] > 20000) {
        let cancel = false;
        for (let x = 0; x < width; x++) {
          if (ImageData[y][x].reduce((a, b) => a + b) / 3 > 100) {
            cancel = true;
            break;
          }
        }
        if (cancel) continue;
        DataAreaSpilt = y;
        break;
      }
    }
    this.DataAreaSpilt = DataAreaSpilt;
    let BinarizationMatrix = this.Binarization(width, height, ImageData);
    let ConnectedArea = new ConnectedAreaRecognition(BinarizationMatrix, this.Node);
    let mergedRects = this.AutomergeRect(
      ConnectedArea.GetAllConnectedArea(Result => {
        Result.update({
          top: Result.top + DataAreaSpilt,
          bottom: Result.bottom + DataAreaSpilt
        });
        if (Result.point > 100) {
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
  }
  // 识别边界
  Bound(Rects) {
    this.Stage = Rects.Stage;
    this.Items = [];
    for (let Rect of Rects.Right) {
      if (Math.abs(Rect.height / Rect.width - 1) < 0.2 && Rect.height > 50 && Rect.width > 50) {
        this.Items.push(Rect);
      }
    }
    this.Items.sort((a, b) => a.left - b.left);
  }
  GetDropType(Rects, ImageData) {
    let top = this.Items.reduce((a, b) => a + b.bottom, 0) / this.Items.length;
    let DropType = [];
    for (let Rect of Rects) {
      if (Rect.top > top && Rect.width / Rect.height > 3) {
        DropType.push({
          left: Rect.left,
          right: Rect.right,
          type: this.CompareType(ImageData[Rect.top][(Rect.left + Rect.right) >> 1])
        });
      }
    }
    for (let Rect of this.Items) {
      for (let type of DropType) {
        let [left, right] = Rect.direction(type);
        if (!left && !right) {
          Rect.type = type.type;
        }
      }
    }
  }
  RGBDiff(rgb1, rgb2) {
    return rgb1.map((v, i) => Math.abs(v - rgb2[i])).reduce((a, b) => a + b);
  }
  CompareType(rgb) {
    let Type = Object.entries(RectRecognition.DropTypeColor);
    for (let [type, color] of Type) {
      if (color(...rgb)) {
        return type;
      }
    }
    return "ALL_DROP";
  }
  Binarization(width, height, ImageData) {
    let Matrix = [];
    for (let y = this.DataAreaSpilt, ry = 0; y < height; y++) {
      Matrix.push([]);
      for (let x = 0; x < width; x++) {
        Matrix[ry][x] = (ImageData[y][x][0] + ImageData[y][x][1] + ImageData[y][x][2]) / 3 < 75 ? false : true;
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
    let MiddleLine = { top: 1, bottom: 0 };
    for (let i = 0; i < Rects.length; i++) {
      if (Rects[i].bottom - Rects[i].top > MiddleLine.bottom - MiddleLine.top) {
        MiddleLine = Rects[i];
      }
    }
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
      for (let i = 0; i < Rects.length; i++) {
        for (let j = i + 1; j < Rects.length; j++) {
          if (Rects[i].distance(Rects[j]) < q) {
            Rects[i].merge(Rects[j]);
            delete Rects.splice(j, 1);
            i--;
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
RectRecognition.DropTypeColor = {
  SPECIAL_DROP: (R, G, B) => {
    return Math.abs(R - 240) < 5 && Math.abs(G - 100) < 10 && B < 50;
  },
  NORMAL_DROP: (R, G, B) => {
    return Math.abs(R - 175) + Math.abs(G - 175) + Math.abs(B - 175) < 20;
  },
  EXTRA_DROP: (R, G, B) => {
    return G > R && G > B && B < 150 && R > 200 && G > 200;
  },
  FIXED_DROP: (R, G, B) => {
    return R > 200 && Math.abs(G - 200) < 20 && B < 120;
  },
  LUCKY_DROP: (R, G, B) => {
    return Math.abs(R - 250) < 5 && Math.abs(G - 100) < 10 && B < 50;
  }
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "@font-face {\n  font-family: \"Novecento WideBold\";\n  src:  url('data:font/woff;base64,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');\n  font-style: bold;\n}";
styleInject(css_248z);

var FontSizeData = {
	"10px": {
	width: 6,
	height: 2
},
	"11px": {
	width: 6,
	height: 2
},
	"12px": {
	width: 7,
	height: 2
},
	"13px": {
	width: 6,
	height: 2
},
	"14px": {
	width: 7,
	height: 2
},
	"15px": {
	width: 7,
	height: 3
},
	"16px": {
	width: 8,
	height: 3
},
	"17px": {
	width: 9,
	height: 3
},
	"18px": {
	width: 9,
	height: 3
},
	"19px": {
	width: 10,
	height: 3
},
	"20px": {
	width: 10,
	height: 3
},
	"21px": {
	width: 11,
	height: 3
},
	"22px": {
	width: 11,
	height: 3
},
	"23px": {
	width: 12,
	height: 4
},
	"24px": {
	width: 12,
	height: 4
},
	"25px": {
	width: 13,
	height: 4
},
	"26px": {
	width: 12,
	height: 4
},
	"27px": {
	width: 13,
	height: 4
},
	"28px": {
	width: 13,
	height: 4
},
	"29px": {
	width: 14,
	height: 4
},
	"30px": {
	width: 14,
	height: 5
},
	"31px": {
	width: 15,
	height: 5
},
	"32px": {
	width: 15,
	height: 5
},
	"33px": {
	width: 16,
	height: 5
},
	"34px": {
	width: 17,
	height: 5
},
	"35px": {
	width: 17,
	height: 5
},
	"36px": {
	width: 18,
	height: 5
},
	"37px": {
	width: 18,
	height: 6
},
	"38px": {
	width: 19,
	height: 6
},
	"39px": {
	width: 18,
	height: 6
},
	"40px": {
	width: 19,
	height: 6
},
	"41px": {
	width: 19,
	height: 6
},
	"42px": {
	width: 20,
	height: 6
},
	"43px": {
	width: 20,
	height: 6
},
	"44px": {
	width: 21,
	height: 7
},
	"45px": {
	width: 21,
	height: 7
},
	"46px": {
	width: 22,
	height: 7
},
	"47px": {
	width: 22,
	height: 7
},
	"48px": {
	width: 23,
	height: 7
},
	"49px": {
	width: 24,
	height: 7
},
	"50px": {
	width: 24,
	height: 7
},
	"51px": {
	width: 25,
	height: 7
},
	"52px": {
	width: 24,
	height: 8
},
	"53px": {
	width: 25,
	height: 8
},
	"54px": {
	width: 25,
	height: 8
},
	"55px": {
	width: 26,
	height: 8
},
	"56px": {
	width: 26,
	height: 8
},
	"57px": {
	width: 27,
	height: 8
},
	"58px": {
	width: 27,
	height: 8
},
	"59px": {
	width: 28,
	height: 9
},
	"60px": {
	width: 28,
	height: 9
},
	"61px": {
	width: 29,
	height: 9
},
	"62px": {
	width: 29,
	height: 9
},
	"63px": {
	width: 30,
	height: 9
},
	"64px": {
	width: 30,
	height: 9
},
	"65px": {
	width: 30,
	height: 9
},
	"66px": {
	width: 30,
	height: 10
},
	"67px": {
	width: 31,
	height: 10
},
	"68px": {
	width: 32,
	height: 10
},
	"69px": {
	width: 32,
	height: 10
},
	"70px": {
	width: 33,
	height: 10
},
	"71px": {
	width: 33,
	height: 10
},
	"72px": {
	width: 34,
	height: 10
},
	"73px": {
	width: 34,
	height: 11
},
	"74px": {
	width: 35,
	height: 11
},
	"75px": {
	width: 35,
	height: 11
},
	"76px": {
	width: 36,
	height: 11
},
	"77px": {
	width: 35,
	height: 11
},
	"78px": {
	width: 36,
	height: 11
},
	"79px": {
	width: 36,
	height: 11
},
	"80px": {
	width: 37,
	height: 11
},
	"81px": {
	width: 37,
	height: 12
},
	"82px": {
	width: 38,
	height: 12
},
	"83px": {
	width: 39,
	height: 12
},
	"84px": {
	width: 39,
	height: 12
},
	"85px": {
	width: 40,
	height: 12
},
	"86px": {
	width: 40,
	height: 12
},
	"87px": {
	width: 41,
	height: 12
},
	"88px": {
	width: 41,
	height: 13
},
	"89px": {
	width: 42,
	height: 13
},
	"90px": {
	width: 41,
	height: 13
},
	"91px": {
	width: 42,
	height: 13
},
	"92px": {
	width: 42,
	height: 13
},
	"93px": {
	width: 43,
	height: 13
},
	"94px": {
	width: 43,
	height: 13
},
	"95px": {
	width: 44,
	height: 13
},
	"96px": {
	width: 44,
	height: 14
},
	"97px": {
	width: 45,
	height: 14
},
	"98px": {
	width: 46,
	height: 14
},
	"99px": {
	width: 46,
	height: 14
},
	"100px": {
	width: 47,
	height: 14
}
};

let FontCache = {};
function StageRecognition(ImageMatrix) {
  let Matrix = [];
  let Confidence = [];
  let Node = new Set();
  for (let y = 0; y < ImageMatrix.length; y++) {
    Matrix.push([]);
    for (let x = 0; x < ImageMatrix[0].length; x++) {
      let [R, G, B] = ImageMatrix[y][x];
      Matrix[y][x] = (R + G + B) / 3 > 80;
      if (Matrix[y][x]) {
        Node.add(x * 10000 + y);
      }
    }
  }
  let getConnectedArea = new ConnectedAreaRecognition(Matrix, Node, true);
  let ConnectedAreas = getConnectedArea.GetAllConnectedArea().sort((a, b) => a.left - b.left);
  let Chars = [];
  let SplitChar;
  for (let Char of ConnectedAreas) {
    if (Char.height < Matrix.length >> 1) {
      Chars.push("-");
      SplitChar = Char;
    } else {
      Chars.push("");
    }
  }
  let FontSize = getFontSize(SplitChar);
  if (!FontCache[FontSize]) {
    FontCache[FontSize] = genFontData(FontSize);
  }
  for (let [Index, Char] of Chars.entries()) {
    if (Char == "-") {
      Confidence.push(1);
      continue;
    }
    let Result = compareNumber(ConnectedAreas[Index].matrix, FontCache[FontSize]);
    Chars[Index] = Result[0];
    let NumConf = Result[1];
    if (Result[1] < 0.9) {
      Result = compareChar(ConnectedAreas[Index].matrix, FontCache[FontSize]);
      if (Result[1] > NumConf) {
        Chars[Index] = Result[0];
        Confidence.push(Result[1]);
      } else {
        Confidence.push(NumConf);
      }
    } else {
      Confidence.push(NumConf);
    }
  }
  return [Chars.join(''),Confidence.reduce((a,b)=>a+b)/Confidence.length]
}
function getFontSize(CharRect) {
  let Find = false;
  let Ret;
  let Diff = Infinity;
  for (let [Size, Rect] of Object.entries(FontSizeData)) {
    let D = Math.abs(Rect.width - CharRect.width) + Math.abs(Rect.height - CharRect.height);
    if (D <= Diff) {
      Diff = D;
      Ret = Size;
      if (D == 0) {
        Find = true;
      }
    } else if (Find) {
      break;
    }
  }
  return Ret;
}
function compareNumber(Matrix, Font) {
  let Number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let Confidence = -Infinity;
  let Result;
  for (let Num of Number) {
    let Conf = compareMatrix(Matrix,Font[Num]);
    if (Conf > Confidence) {
      Confidence = Conf;
      Result = Num;
    }
  }
  return [Result, Confidence];
}
function compareChar(Matrix, Font) {
  let Chars = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];
  let Confidence = -Infinity;
  let Result;
  for (let Char of Chars) {
    let Conf = compareMatrix(Matrix,Font[Char]);
    if (Conf > Confidence) {
      Confidence = Conf;
      Result = Char;
    }
  }
  return [Result, Confidence];
}
function compareMatrix(Matrix1, Matrix2) {
  let Width = Math.min(Matrix1[0].length, Matrix2[0].length);
  let Height = Math.min(Matrix1.length, Matrix2.length);
  let Count = 0;
  for (let y = 0; y < Height; y++) {
    for (let x = 0; x < Width; x++) {
      if (Matrix1[y][x] == Matrix2[y][x]) {
        Count++;
      }
    }
  }
  return Count / (Matrix1[0].length * Matrix1.length);
}
// 生成每个字符数据
function genFontData(size) {
  let Canvas = document.createElement("canvas");
  let Ctx = Canvas.getContext("2d");
  Ctx.font = `${size} 'Novecento WideBold'`;
  Ctx.fillStyle = "#000000";
  Ctx.textBaseline = "top";
  let Data = {};
  let Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (let Char of Chars) {
    let Size = Ctx.measureText(Char);
    Canvas.height = Size.actualBoundingBoxAscent + Size.actualBoundingBoxDescent;
    Canvas.width = Size.width;
    Ctx.font = `${size} 'Novecento WideBold'`;
    Ctx.fillStyle = "#000000";
    Ctx.textBaseline = "top";
    Ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    Ctx.fillText(Char, 0, Size.actualBoundingBoxAscent);
    let IData = Ctx.getImageData(0, 0, Canvas.width, Canvas.height);
    let XFlags = new Array(Canvas.width).fill(false);
    let XRange = [];
    for (let x = 0; x < Canvas.width; x++) {
      for (let y = 0; y < Canvas.height; y++) {
        let Index = (y * Canvas.width + x) * 4;
        if (IData.data[Index + 3] > 0) {
          XFlags[x] = true;
          break;
        }
      }
    }
    for (let x = 0; x < Canvas.width; x++) {
      if (XFlags[x] && XRange.length == 0) {
        XRange.push(x);
      } else if (XFlags[x]) {
        XRange[1] = x;
      }
    }
    IData = Ctx.getImageData(XRange[0], 0, XRange[1] - XRange[0] + 1, Canvas.height);
    let Matrix = [];
    for (let y = 0; y < IData.height; y++) {
      Matrix.push([]);
      for (let x = 0; x < IData.width; x++) {
        Matrix[y][x] = IData.data[(y * IData.width + x) * 4 + 3] > 0;
      }
    }
    Data[Char] = Matrix;
  }
  return Data;
}

var NumbersHashList = [
	{
		number: 0,
		hash: [
			2,
			9,
			8,
			3,
			0,
			0,
			0,
			0,
			10,
			2,
			0,
			0,
			10,
			10,
			1,
			0,
			10,
			0,
			0,
			0,
			0,
			10,
			8,
			0,
			3,
			0,
			0,
			0,
			0,
			6,
			10,
			2,
			0,
			0,
			0,
			0,
			0,
			4,
			10,
			3,
			0,
			0,
			0,
			0,
			0,
			4,
			10,
			3,
			3,
			0,
			0,
			0,
			0,
			5,
			10,
			2,
			9,
			0,
			0,
			0,
			0,
			9,
			9,
			0,
			10,
			3,
			0,
			0,
			10,
			10,
			1,
			0,
			3,
			9,
			10,
			3,
			0,
			0,
			0,
			0
		],
		count: 10
	},
	{
		number: 1,
		hash: [
			51,
			47,
			37,
			22,
			0,
			0,
			0,
			0,
			54,
			25,
			46,
			29,
			0,
			0,
			0,
			0,
			0,
			6,
			45,
			43,
			0,
			0,
			0,
			0,
			0,
			1,
			45,
			43,
			0,
			0,
			0,
			0,
			0,
			1,
			45,
			43,
			0,
			0,
			0,
			0,
			0,
			2,
			45,
			43,
			0,
			0,
			0,
			0,
			0,
			2,
			45,
			43,
			0,
			0,
			0,
			0,
			0,
			1,
			45,
			43,
			0,
			0,
			0,
			0,
			3,
			6,
			48,
			44,
			0,
			0,
			0,
			0,
			16,
			1,
			1,
			0,
			0,
			0,
			0,
			0
		],
		count: 60
	},
	{
		number: 2,
		hash: [
			35,
			33,
			14,
			2,
			1,
			1,
			0,
			0,
			9,
			0,
			0,
			3,
			33,
			33,
			3,
			0,
			0,
			0,
			0,
			0,
			24,
			36,
			13,
			0,
			0,
			0,
			0,
			0,
			23,
			36,
			14,
			0,
			0,
			0,
			0,
			0,
			29,
			36,
			3,
			0,
			0,
			0,
			0,
			14,
			36,
			12,
			1,
			0,
			0,
			4,
			28,
			36,
			4,
			1,
			0,
			0,
			15,
			32,
			31,
			5,
			0,
			0,
			0,
			0,
			36,
			24,
			3,
			0,
			1,
			2,
			0,
			0,
			9,
			0,
			1,
			1,
			0,
			1,
			1,
			0
		],
		count: 36
	},
	{
		number: 3,
		hash: [
			31,
			28,
			14,
			6,
			0,
			0,
			0,
			0,
			27,
			1,
			0,
			0,
			29,
			30,
			6,
			0,
			0,
			0,
			0,
			0,
			13,
			31,
			16,
			0,
			0,
			0,
			0,
			0,
			23,
			29,
			8,
			0,
			3,
			25,
			32,
			10,
			6,
			0,
			0,
			0,
			2,
			19,
			25,
			14,
			23,
			11,
			1,
			0,
			0,
			0,
			0,
			0,
			5,
			28,
			29,
			2,
			0,
			0,
			0,
			0,
			1,
			23,
			31,
			5,
			1,
			0,
			0,
			1,
			17,
			32,
			25,
			2,
			32,
			21,
			6,
			2,
			1,
			0,
			0,
			0
		],
		count: 32
	},
	{
		number: 4,
		hash: [
			0,
			0,
			0,
			12,
			30,
			17,
			0,
			0,
			0,
			0,
			16,
			30,
			15,
			0,
			0,
			0,
			0,
			2,
			30,
			26,
			0,
			13,
			0,
			0,
			1,
			30,
			29,
			0,
			18,
			30,
			0,
			0,
			27,
			30,
			1,
			0,
			24,
			30,
			0,
			0,
			30,
			4,
			0,
			0,
			24,
			30,
			0,
			0,
			12,
			0,
			0,
			2,
			11,
			9,
			0,
			0,
			3,
			0,
			0,
			3,
			29,
			27,
			0,
			0,
			0,
			0,
			0,
			0,
			22,
			30,
			0,
			0,
			0,
			0,
			0,
			0,
			22,
			30,
			0,
			0
		],
		count: 30
	},
	{
		number: 5,
		hash: [
			34,
			11,
			2,
			0,
			0,
			0,
			0,
			0,
			33,
			1,
			0,
			0,
			1,
			1,
			0,
			0,
			32,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			31,
			0,
			1,
			5,
			0,
			0,
			0,
			0,
			33,
			0,
			0,
			0,
			21,
			18,
			1,
			0,
			10,
			0,
			0,
			0,
			20,
			35,
			33,
			2,
			0,
			0,
			0,
			0,
			0,
			25,
			35,
			6,
			0,
			0,
			0,
			0,
			2,
			29,
			34,
			4,
			0,
			0,
			0,
			3,
			30,
			36,
			23,
			0,
			36,
			25,
			8,
			1,
			3,
			0,
			0,
			0
		],
		count: 36
	},
	{
		number: 6,
		hash: [
			3,
			10,
			13,
			8,
			2,
			0,
			0,
			0,
			13,
			9,
			0,
			0,
			1,
			9,
			7,
			0,
			13,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			6,
			0,
			0,
			3,
			1,
			0,
			0,
			0,
			0,
			0,
			6,
			3,
			2,
			3,
			0,
			0,
			0,
			0,
			0,
			0,
			6,
			13,
			10,
			0,
			2,
			0,
			0,
			0,
			0,
			9,
			13,
			1,
			10,
			0,
			0,
			0,
			0,
			10,
			13,
			1,
			13,
			3,
			0,
			0,
			5,
			13,
			9,
			0,
			7,
			11,
			12,
			5,
			0,
			0,
			0,
			0
		],
		count: 13
	},
	{
		number: 7,
		hash: [
			5,
			1,
			1,
			0,
			0,
			0,
			0,
			0,
			2,
			0,
			0,
			0,
			12,
			19,
			8,
			0,
			0,
			0,
			0,
			1,
			18,
			18,
			1,
			0,
			0,
			0,
			0,
			4,
			19,
			0,
			0,
			0,
			0,
			0,
			2,
			19,
			7,
			0,
			0,
			0,
			0,
			0,
			8,
			19,
			0,
			0,
			0,
			0,
			0,
			1,
			18,
			17,
			0,
			0,
			0,
			0,
			0,
			1,
			19,
			14,
			0,
			0,
			0,
			0,
			0,
			2,
			19,
			12,
			0,
			0,
			0,
			0,
			0,
			3,
			19,
			10,
			0,
			0,
			0,
			0
		],
		count: 19
	},
	{
		number: 8,
		hash: [
			12,
			18,
			18,
			8,
			1,
			0,
			0,
			0,
			19,
			3,
			0,
			0,
			13,
			19,
			8,
			0,
			16,
			0,
			0,
			0,
			3,
			17,
			17,
			1,
			19,
			1,
			0,
			0,
			3,
			19,
			17,
			0,
			13,
			19,
			8,
			0,
			3,
			8,
			0,
			0,
			19,
			12,
			0,
			5,
			16,
			6,
			0,
			0,
			9,
			0,
			0,
			0,
			5,
			18,
			19,
			5,
			1,
			0,
			0,
			0,
			0,
			6,
			19,
			11,
			13,
			0,
			0,
			0,
			6,
			18,
			17,
			4,
			17,
			19,
			13,
			5,
			3,
			3,
			0,
			0
		],
		count: 19
	},
	{
		number: 9,
		hash: [
			14,
			17,
			11,
			2,
			1,
			0,
			0,
			0,
			13,
			0,
			0,
			0,
			14,
			16,
			4,
			0,
			1,
			0,
			0,
			0,
			4,
			14,
			16,
			1,
			0,
			0,
			0,
			0,
			0,
			10,
			17,
			3,
			8,
			0,
			0,
			0,
			8,
			16,
			16,
			0,
			17,
			8,
			1,
			0,
			7,
			2,
			10,
			2,
			0,
			3,
			3,
			0,
			0,
			11,
			17,
			2,
			0,
			0,
			0,
			0,
			4,
			16,
			15,
			0,
			12,
			2,
			0,
			1,
			17,
			17,
			1,
			0,
			17,
			10,
			5,
			3,
			0,
			0,
			0,
			0
		],
		count: 17
	}
];

class RecognitionData {
  /**
   *
   * @param {Object} Data
   */
  static Encode(Data, FileName) {
    let Id = Object.keys(Data);
    let keySize = Id.reduce((a, b) => a + b.length, 0);
    let DataSize = Math.ceil((Data[Id[0]][0].length * 3) / 8) * Id.length;
    let PrefixSize = Id.length;
    let HeaderSize = 2;
    let AllSize = PrefixSize + keySize + DataSize + HeaderSize;
    let DataBuffer = new Uint8Array(AllSize);
    let index = 0;
    // Write Header
    DataBuffer[index++] = 1; //Version
    DataBuffer[index++] = (Data[Id[0]][0].length >> 8) & 0b11111111;
    DataBuffer[index++] = Data[Id[0]][0].length & 0b11111111;

    //
    for (let [k, v] of Object.entries(Data)) {
      DataBuffer[index++] = k.length;
      // Write Key
      for (let s of k) {
        DataBuffer[index++] = s.charCodeAt(0);
      }
      v = [].concat(...v);
      let Byte = 0;
      let BitI = 0;
      for (let [i, bit] of v.entries()) {
        if (bit) {
          Byte = (Byte << 1) + 1;
        } else {
          Byte = Byte << 1;
        }
        if (++BitI == 8 || i == v.length - 1) {
          Byte = Byte << (8 - BitI);
          DataBuffer[index++] = Byte;
          Byte = 0;
          BitI = 0;
        }
      }
    }
    return DataBuffer;
  }
  static Decode(Encoded) {
    let Index = 0;
    let Version = Encoded[Index++];
    let BitLength = (Encoded[Index] << 8) | Encoded[Index + 1];
    Index += 2;
    let Mode = "KeySize";
    let Key = "";
    let KeySize = 0;
    let KeyIndex = 0;
    let Data = [[], [], []];
    let DataC = 0;
    let OutPut = {};
    for (; Index < Encoded.length; Index++) {
      switch (Mode) {
        case "KeySize":
          KeySize = Encoded[Index];
          Mode = "Key";
          KeyIndex = 0;
          Key = "";
          break;
        case "Key":
          Key += String.fromCharCode(Encoded[Index]);
          if (++KeyIndex == KeySize) {
            Mode = "Data";
            DataC = 0;
            Data = [[], [], []];
          }
          break;
        case "Data":
          let Byte = Encoded[Index];
          let BinByte = Byte.toString("2").padStart(8, "0").split("");
          for (let Bit of BinByte) {
            if (Data[DataC].push(Bit == "1") == BitLength) {
              if (++DataC == 3) {
                OutPut[Key] = Data;
                Mode = "KeySize";
                break;
              }
            }
          }
          break;
      }
    }
    return OutPut;
  }
}
var RecognitionData_1 = RecognitionData;

for (let hash of NumbersHashList) {
  if (hash.hash instanceof Array) {
    hash.hash = hash.hash.map(v => v / hash.count);
  }
}
class ItemRecognition {
  constructor(ImageData, Rules, Rect) {
    if (ImageData instanceof Rectangle) {
      this.Bound = ImageData;
      this.Confidence = {
        ItemId: -Infinity,
        Count: []
      };
      this.ItemId = "";
      this.Count = NaN;
      return;
    }
    this.Matrix = ImageData;
    this.Width = ImageData[0].length;
    this.Height = ImageData.length;
    this.IData = new Array();
    this.Bound = Rect;
    this.Rules = Rules;
    this.Confidence = {
      ItemId: -Infinity,
      Count: []
    };
    this.prepare();
    this.ItemId = this.getItemId();
    this.Count = this.getCount();
    delete this.Rules;
    delete this.IData;
    delete this.Height;
    delete this.Width;
    delete this.Matrix;
  }
  prepare() {
    let cx = this.Matrix[0].length >> 1;
    let cy = this.Matrix.length >> 1;
    let r = (cx + cy) >> 1;

    for (let y = 0; y < this.Height; y++) {
      for (let x = 0; x < this.Width; x++) {
        let TempColor = this.Matrix[y][x];
        if (Math.hypot(x - cx, y - cy) > r) TempColor = [255, 255, 255];
        this.IData.push(...TempColor, 255);
      }
    }
    this.IData = {
      data: this.IData,
      height: this.Height,
      width: this.Width
    };
  }
  getItemId() {
    let ItemSourceHash = [];
    let Canvas = document.createElement("canvas");
    Canvas.width = this.Width;
    Canvas.height = this.Height;
    let Ctx = Canvas.getContext("2d");
    let tempIData = Ctx.getImageData(0, 0, Canvas.width, Canvas.height);
    tempIData.data.set(this.IData.data);
    Ctx.putImageData(tempIData, 0, 0);
    Ctx.drawImage(Canvas, 0, 0, this.Width, this.Height, 0, 0, 17, 16);
    tempIData = Ctx.getImageData(0, 0, 17, 16);
    let Confidence = -Infinity;
    let Result = "";
    for (let Rule of this.Rules) {
      if (!ItemRecognition.ItemSourceHash[Rule.id]) continue;
      ItemSourceHash.push([Rule.id, ItemRecognition.ItemSourceHash[Rule.id]]);
    }
    for (let ItemHash of ItemSourceHash) {
      let Conf = this.CompareItemHash(ItemHash[1],this.getRGBDHash(tempIData));
      if (Conf > Confidence) {
        Confidence = Conf;
        Result = ItemHash[0];
      }
    }
    this.Confidence.ItemId = Confidence;
    return Result;
  }
  CompareItemHash(Hash1, Hash2) {
    let Hash1String = [].concat(...Hash1);
    let Hash2String = [].concat(...Hash2);
    let Distance = Math.abs(Hash1String.length - Hash2String.length);
    let Endidx = Math.min(Hash1String.length, Hash2String.length);
    for (let idx = 0; idx < Endidx; idx++) {
      if (Hash1String[idx] != Hash2String[idx]) {
        Distance += 1;
      }
    }
    return Math.max(Hash1String.length, Hash2String.length) - Distance;
  }
  getCount() {
    if (this.ItemId == "") {
      return NaN;
    }
    let Range = this.Rules.find(v => v.id == this.ItemId);
    if (Range) {
      Range = Range.range;
    } else {
      return;
    }
    let NumRange = [Range.upper > 9 ? 0 : Math.max(1, Range.lower), Math.min(9, Range.upper)];
    let NumList = [];
    for (let i = NumRange[0]; i <= NumRange[1]; i++) {
      NumList.push(i);
    }
    if (NumList.length == 1) {
      this.Confidence.Count[0] = 1;
      return NumList[0];
    }
    let XStart = false,
      XEnd = false,
      YStart = 0,
      Find = false;
    let NumberRect = new Rectangle();
    for (let y = this.Height >> 1; y < this.Height; y++) {
      XStart = false;
      XEnd = false;
      for (let x = this.Width >> 1; x < this.Width; x++) {
        let GreyUp = distance =>
          (this.Matrix[y - distance][x][0] + this.Matrix[y - distance][x][1] + this.Matrix[y - distance][x][2]) / 3;
        let GreyNow = (this.Matrix[y][x][0] + this.Matrix[y][x][1] + this.Matrix[y][x][2]) / 3;
        if (
          (this.ItemId == "3301"
            ? Math.abs(GreyNow - GreyUp(1))
            : Math.max(Math.abs(GreyNow - GreyUp(1)), Math.abs(GreyNow - GreyUp(2)), GreyNow - GreyUp(3))) > 20
        ) {
          if (!XStart) {
            XStart = x;
          } else {
            XEnd = x;
          }
        } else {
          if (XEnd - XStart + 1 > 20) {
            Find = true;
            break;
          } else {
            XStart = false;
            XEnd = false;
          }
        }
      }
      if (Find) {
        YStart = y;
        break;
      }
    }
    if (Find) {
      NumberRect.update({
        left: XStart,
        right: XEnd,
        top: YStart,
        bottom: Math.round(this.Bound.height - this.Bound.height * 0.08)
      });
      /* console.log({
        left: NumberRect.left + this.Bound.left,
        right: NumberRect.right + this.Bound.left,
        top: NumberRect.top + this.Bound.top,
        bottom: NumberRect.bottom + this.Bound.top
      });*/
    } else {
      return;
    }
    let NumberMartix = [];
    let NumberNodes = new Set();
    for (let y = 0; y < NumberRect.height; y++) {
      NumberMartix.push([]);
      for (let x = 0; x < NumberRect.width; x++) {
        let [R, G, B] = this.Matrix[y + NumberRect.top][x + NumberRect.left];
        let Grey = (R + G + B) / 3;
        if (Grey >= 120) {
          NumberMartix[y][x] = true;
        } else if (Grey < 120 && Grey > 105) {
          let left, right, top, bottom;
          if (x !== 0) {
            left = this.Matrix[y + NumberRect.top][x + NumberRect.left - 1].reduce((a, b) => a + b) / 3;
          }
          if (x !== NumberRect.width - 1) {
            right = this.Matrix[y + NumberRect.top][x + NumberRect.left + 1].reduce((a, b) => a + b) / 3;
          }
          if (y != 0) {
            top = this.Matrix[y + NumberRect.top - 1][x + NumberRect.left].reduce((a, b) => a + b) / 3;
          }
          if (y !== NumberRect.height - 1) {
            bottom = this.Matrix[y + NumberRect.top + 1][x + NumberRect.left].reduce((a, b) => a + b) / 3;
          }
          if ((left && left > 120) || (right && right > 120) || (top && top > 120) || (bottom && bottom > 120)) {
            NumberMartix[y][x] = true;
          } else {
            NumberMartix[y][x] = false;
          }
        } else {
          NumberMartix[y][x] = false;
        }
        NumberMartix[y][x] = Grey > 80;
        if (NumberMartix[y][x]) {
          NumberNodes.add(x * 10000 + y);
        }
      }
    }
    let GetAllNumber = new ConnectedAreaRecognition(NumberMartix, NumberNodes, true);
    let TempCount = "";
    let Result = GetAllNumber.GetAllConnectedArea(Rect => {
      //console.log(Rect);
      if (
        Rect.point < 20 ||
        Rect.width > Rect.height ||
        Rect.height < 8 ||
        Rect.width < 3 ||
        NumberRect.width - Rect.left < 5 ||
        Rect.left < 5
      ) {
        return false;
      }
      return Rect;
    }).sort((a, b) => a.left - b.left);
    let NumCanvas = document.createElement("canvas");
    NumCanvas.width = 9;
    NumCanvas.height = 10;
    let NumCtx = NumCanvas.getContext("2d");
    for (let Num of Result) {
      let Canvas = document.createElement("canvas");
      Canvas.width = Num.width;
      Canvas.height = Num.height;
      let Ctx = Canvas.getContext("2d");
      let ImgData = Ctx.getImageData(0, 0, Canvas.width, Canvas.height);
      for (let y = 0; y < Num.height; y++) {
        for (let x = 0; x < Num.width; x++) {
          let Index = (y * Canvas.width + x) * 4;
          if (Num.matrix[y][x]) {
            ImgData.data[Index] = 0;
            ImgData.data[Index + 1] = 0;
            ImgData.data[Index + 2] = 0;
          } else {
            ImgData.data[Index] = 255;
            ImgData.data[Index + 1] = 255;
            ImgData.data[Index + 2] = 255;
          }
          ImgData.data[Index + 3] = 255;
        }
      }
      Ctx.putImageData(ImgData, 0, 0);
      NumCtx.clearRect(0, 0, NumCanvas.width, NumCanvas.height);
      NumCtx.drawImage(Canvas, 0, 0, Canvas.width, Canvas.height, 0, 0, NumCanvas.width, NumCanvas.height);
      let DHash = this.getDHash(NumCtx.getImageData(0, 0, NumCanvas.width, NumCanvas.height));
      let NumberResult = this.dHashtoNumber(DHash, NumList);
      TempCount += NumberResult.Num;
      this.Confidence.Count.push(NumberResult.Confidence);
    }
    return Number(TempCount);
  }
  getDHash(item) {
    let HashString = "";
    for (let index = 0; index < item.data.length; index += 4) {
      if (Math.floor(index / 4) % item.width == 0) continue;
      if (
        Math.floor((item.data[index - 4] + item.data[index - 3] + item.data[index - 2]) / 3) >
        Math.floor((item.data[index] + item.data[index + 1] + item.data[index + 2]) / 3)
      ) {
        HashString += 1;
      } else {
        HashString += 0;
      }
    }
    return HashString;
  }
  getRGBDHash(item) {
    let Hash = [[], [], []];
    for (let index = 0; index < item.data.length; index += 4) {
      if (Math.floor(index / 4) % item.width == 0) continue;
      Hash[0].push(item.data[index - 4] > item.data[index]);
      Hash[1].push(item.data[index - 3] > item.data[index + 1]);
      Hash[2].push(item.data[index - 2] > item.data[index + 2]);
    }
    return Hash;
  }

  /**
   *
   * @param {string} hash
   * @param {array} Numbers
   */
  dHashtoNumber(hash, Numbers) {
    let NumConfidence = -Infinity;
    let Num = NaN;
    let AllLength = 80;
    let NumsHashList = NumbersHashList.filter(v => Numbers.includes(v.number));
    for (let NumberDHash of NumsHashList) {
      let Confidence = 0;
      for (let i = 0; i < hash.length; i++) {
        if (hash[i] == "1") {
          Confidence += NumberDHash.hash[i];
        } else {
          Confidence += 1 - NumberDHash.hash[i];
        }
      }
      Confidence /= AllLength;
      if (Confidence > NumConfidence) {
        NumConfidence = Confidence;
        Num = NumberDHash.number;
      }
    }
    return {
      Num: Num,
      Confidence: NumConfidence
    };
  }
  static init(blob) {
    let Reader = new FileReader();
    Reader.onload = () => {
      this.ItemSourceHash = RecognitionData_1.Decode(new Uint8Array(Reader.result));
    };
    Reader.readAsArrayBuffer(blob);
  }
}

class DropsRecognition {
  constructor(img) {
    this.Image = img;
    this.Canvas = document.createElement("canvas");
    //document.body.appendChild(this.Canvas);
    this.Canvas.width = img.width;
    this.Canvas.height = img.height;
    this.ctx = this.Canvas.getContext("2d");
    this.ctx.drawImage(img, 0, 0);
    this.ctx.fillStyle = "#00ff00";
    this.ctx.strokeStyle = "#00ff00";
    this.rawImageData = this.ctx.getImageData(0, 0, img.width, img.height);
    this.matrixImageData = [[]];
    this.BoundData = {};
    this.Stage = {};
    this.Items = [];
    for (let index = 0, x = 0, y = 0; index < this.rawImageData.data.length; index += 4) {
      this.matrixImageData[y][x] = [
        this.rawImageData.data[index],
        this.rawImageData.data[index + 1],
        this.rawImageData.data[index + 2]
      ];
      if (++x == img.width) {
        x = 0;
        if (++y != img.height) this.matrixImageData.push([]);
      }
    }
    this.RectRecognition();
    if (this.Debug) {
      for (let Rect of this.BoundData.mergedRects.Right) {
        this.ctx.strokeRect(Rect.left, Rect.top, Rect.width, Rect.height);
      }
      this.ctx.strokeStyle = "#ff0000";
      this.ctx.strokeRect(
        this.BoundData.Stage.left,
        this.BoundData.Stage.top,
        this.BoundData.Stage.width,
        this.BoundData.Stage.height
      );
    }
    this.detectStage();
    this.detectFurniture();
    this.detectItem();
    delete this.ctx;
    delete this.Canvas;
    delete this.matrixImageData;
    delete this.rawImageData;
    delete this.Image;
  }
  /**
   * 识别图像边界
   */
  RectRecognition() {
    this.BoundData = new RectRecognition(this.matrixImageData);
  }
  detectFurniture() {
    let DetectType = ["LUCKY_DROP", "SPECIAL_DROP", "ALL_DROP"];
    for (let Rect of this.BoundData.Items) {
      if (DetectType.includes(Rect.type)) {
        let OtherItems = this.BoundData.Items.filter(a => a != Rect);
        let AreaDiff =
          OtherItems.reduce((a, OtherItem) => {
            return a + Math.abs(OtherItem.area - Rect.area);
          }, 0) / OtherItems.length;
        if (AreaDiff > 1000) {
          Rect.type = "LUCKY_DROP";
          Rect.AreaDiff = AreaDiff;
        } else if ((Rect.type == "LUCKY_DROP")) {
          Rect.type == "SPECIAL_DROP";
        }
      }
    }
  }
  detectItem() {
    let DetectType = ["NORMAL_DROP", "EXTRA_DROP", "SPECIAL_DROP", "ALL_DROP"];
    for (let Rect of this.BoundData.Items) {
      let Type = Rect.type;
      delete Rect.type;
      let Result = { type: Type };
      if (DetectType.includes(Type)) {
        let DropList = [];
        for (let Drop of DropsRecognition.Stage[this.Stage.Code].dropInfos) {
          if ((Drop.dropType == Type || Type == "ALL_DROP") && Drop.itemId && Drop.itemId != "furni") {
            DropList.push({ id: Drop.itemId, range: Drop.bounds });
          }
        }
        // console.log(Type);
        let Item = new ItemRecognition(
          this.getImageMatrix(Rect.left, Rect.top, Rect.right, Rect.bottom),
          DropList,
          Rect
        );
        Object.assign(Result, Item);
      } else if (Type == "LUCKY_DROP") {
        let Item = new ItemRecognition(Rect);
        Item.ItemId = "furni";
        Item.Count = 1;
        Item.Confidence.Count = [1];

        Item.Confidence.ItemId = (ratio => {
          if (ratio > 1) {
            return 1;
          }
          let range,linear_val;
          if (ratio < 0.5) {
            range = 1.0 - 0.5;
            linear_val = ratio / (range * 2.0);
            return linear_val;
          } else {
            range = 0.5;
            linear_val = ratio / (range * 2.0);
            return linear_val + (1.0 - linear_val) * Math.pow((linear_val - 0.5) * 2, 0.2);
          }
        })(Rect.AreaDiff/2000);
        Object.assign(Result, Item);
      }
      this.Items.push(Result);
    }
  }
  getImageMatrix(x1, y1, x2, y2) {
    let Matrix = [];
    for (let y = y1; y <= y2; y++) {
      let ry = Matrix.push([]) - 1;
      for (let x = x1, rx = 0; x <= x2; x++, rx++) {
        Matrix[ry][rx] = [].concat(this.matrixImageData[y][x]);
      }
    }
    return Matrix;
  }
  detectStage() {
    [this.Stage.Code, this.Stage.Confidence] = StageRecognition(
      this.getImageMatrix(
        this.BoundData.Stage.left,
        this.BoundData.Stage.top,
        this.BoundData.Stage.right,
        this.BoundData.Stage.bottom
      )
    );
  }
  static init(dataName, Data) {
    switch (dataName) {
      case "Stage":
        this.Stage = Data;
        break;
      case "ItemImage":
        ItemRecognition.init(Data);
        break;
    }
  }
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var webfontloader = createCommonjsModule(function (module) {
/* Web Font Loader v1.6.28 - (c) Adobe Systems, Google. License: Apache 2.0 */(function(){function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function p(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return p.apply(null,arguments)}var q=Date.now||function(){return +new Date};function ca(a,b){this.a=a;this.o=b||a;this.c=this.o.document;}var da=!!window.FontFace;function t(a,b,c,d){b=a.c.createElement(b);if(c)for(var e in c)c.hasOwnProperty(e)&&("style"==e?b.style.cssText=c[e]:b.setAttribute(e,c[e]));d&&b.appendChild(a.c.createTextNode(d));return b}function u(a,b,c){a=a.c.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(c,a.lastChild);}function v(a){a.parentNode&&a.parentNode.removeChild(a);}
function w(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e]);}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e]);}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"");}function y(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return !0;return !1}
function ea(a){return a.o.location.hostname||a.a.location.hostname}function z(a,b,c){function d(){m&&e&&f&&(m(g),m=null);}b=t(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,m=c||null;da?(b.onload=function(){e=!0;d();},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");d();}):setTimeout(function(){e=!0;d();},0);u(a,"head",b);}
function A(a,b,c,d){var e=a.c.getElementsByTagName("head")[0];if(e){var f=t(a,"script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f));};e.appendChild(f);setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")));},d||5E3);return f}return null}function B(){this.a=0;this.c=null;}function C(a){a.a++;return function(){a.a--;D(a);}}function E(a,b){a.c=b;D(a);}function D(a){0==a.a&&a.c&&(a.c(),a.c=null);}function F(a){this.a=a||"-";}F.prototype.c=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function G(a,b){this.c=a;this.f=4;this.a="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.a=c[1],this.f=parseInt(c[2],10));}function fa(a){return H(a)+" "+(a.f+"00")+" 300px "+I(a.c)}function I(a){var b=[];a=a.split(/,\s*/);for(var c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1!=d.indexOf(" ")||/^\d/.test(d)?b.push("'"+d+"'"):b.push(d);}return b.join(",")}function J(a){return a.a+a.f}function H(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b}
function ga(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b}function ha(a,b){this.c=a;this.f=a.o.document.documentElement;this.h=b;this.a=new F("-");this.j=!1!==b.events;this.g=!1!==b.classes;}function ia(a){a.g&&w(a.f,[a.a.c("wf","loading")]);K(a,"loading");}function L(a){if(a.g){var b=y(a.f,a.a.c("wf","active")),c=[],d=[a.a.c("wf","loading")];b||c.push(a.a.c("wf","inactive"));w(a.f,c,d);}K(a,"inactive");}function K(a,b,c){if(a.j&&a.h[b])if(c)a.h[b](c.c,J(c));else a.h[b]();}function ja(){this.c={};}function ka(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.c[e];f&&d.push(f(b[e],c));}return d}function M(a,b){this.c=a;this.f=b;this.a=t(this.c,"span",{"aria-hidden":"true"},this.f);}function N(a){u(a.c,"body",a.a);}function O(a){return "display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+I(a.c)+";"+("font-style:"+H(a)+";font-weight:"+(a.f+"00")+";")}function P(a,b,c,d,e,f){this.g=a;this.j=b;this.a=d;this.c=c;this.f=e||3E3;this.h=f||void 0;}P.prototype.start=function(){var a=this.c.o.document,b=this,c=q(),d=new Promise(function(d,e){function f(){q()-c>=b.f?e():a.fonts.load(fa(b.a),b.h).then(function(a){1<=a.length?d():setTimeout(f,25);},function(){e();});}f();}),e=null,f=new Promise(function(a,d){e=setTimeout(d,b.f);});Promise.race([f,d]).then(function(){e&&(clearTimeout(e),e=null);b.g(b.a);},function(){b.j(b.a);});};function Q(a,b,c,d,e,f,g){this.v=a;this.B=b;this.c=c;this.a=d;this.s=g||"BESbswy";this.f={};this.w=e||3E3;this.u=f||null;this.m=this.j=this.h=this.g=null;this.g=new M(this.c,this.s);this.h=new M(this.c,this.s);this.j=new M(this.c,this.s);this.m=new M(this.c,this.s);a=new G(this.a.c+",serif",J(this.a));a=O(a);this.g.a.style.cssText=a;a=new G(this.a.c+",sans-serif",J(this.a));a=O(a);this.h.a.style.cssText=a;a=new G("serif",J(this.a));a=O(a);this.j.a.style.cssText=a;a=new G("sans-serif",J(this.a));a=
O(a);this.m.a.style.cssText=a;N(this.g);N(this.h);N(this.j);N(this.m);}var R={D:"serif",C:"sans-serif"},S=null;function T(){if(null===S){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);S=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10));}return S}Q.prototype.start=function(){this.f.serif=this.j.a.offsetWidth;this.f["sans-serif"]=this.m.a.offsetWidth;this.A=q();U(this);};
function la(a,b,c){for(var d in R)if(R.hasOwnProperty(d)&&b===a.f[R[d]]&&c===a.f[R[d]])return !0;return !1}function U(a){var b=a.g.a.offsetWidth,c=a.h.a.offsetWidth,d;(d=b===a.f.serif&&c===a.f["sans-serif"])||(d=T()&&la(a,b,c));d?q()-a.A>=a.w?T()&&la(a,b,c)&&(null===a.u||a.u.hasOwnProperty(a.a.c))?V(a,a.v):V(a,a.B):ma(a):V(a,a.v);}function ma(a){setTimeout(p(function(){U(this);},a),50);}function V(a,b){setTimeout(p(function(){v(this.g.a);v(this.h.a);v(this.j.a);v(this.m.a);b(this.a);},a),0);}function W(a,b,c){this.c=a;this.a=b;this.f=0;this.m=this.j=!1;this.s=c;}var X=null;W.prototype.g=function(a){var b=this.a;b.g&&w(b.f,[b.a.c("wf",a.c,J(a).toString(),"active")],[b.a.c("wf",a.c,J(a).toString(),"loading"),b.a.c("wf",a.c,J(a).toString(),"inactive")]);K(b,"fontactive",a);this.m=!0;na(this);};
W.prototype.h=function(a){var b=this.a;if(b.g){var c=y(b.f,b.a.c("wf",a.c,J(a).toString(),"active")),d=[],e=[b.a.c("wf",a.c,J(a).toString(),"loading")];c||d.push(b.a.c("wf",a.c,J(a).toString(),"inactive"));w(b.f,d,e);}K(b,"fontinactive",a);na(this);};function na(a){0==--a.f&&a.j&&(a.m?(a=a.a,a.g&&w(a.f,[a.a.c("wf","active")],[a.a.c("wf","loading"),a.a.c("wf","inactive")]),K(a,"active")):L(a.a));}function oa(a){this.j=a;this.a=new ja;this.h=0;this.f=this.g=!0;}oa.prototype.load=function(a){this.c=new ca(this.j,a.context||this.j);this.g=!1!==a.events;this.f=!1!==a.classes;pa(this,new ha(this.c,a),a);};
function qa(a,b,c,d,e){var f=0==--a.h;(a.f||a.g)&&setTimeout(function(){var a=e||null,m=d||null||{};if(0===c.length&&f)L(b.a);else {b.f+=c.length;f&&(b.j=f);var h,l=[];for(h=0;h<c.length;h++){var k=c[h],n=m[k.c],r=b.a,x=k;r.g&&w(r.f,[r.a.c("wf",x.c,J(x).toString(),"loading")]);K(r,"fontloading",x);r=null;if(null===X)if(window.FontFace){var x=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),xa=/OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent)&&/Apple/.exec(window.navigator.vendor);
X=x?42<parseInt(x[1],10):xa?!1:!0;}else X=!1;X?r=new P(p(b.g,b),p(b.h,b),b.c,k,b.s,n):r=new Q(p(b.g,b),p(b.h,b),b.c,k,b.s,a,n);l.push(r);}for(h=0;h<l.length;h++)l[h].start();}},0);}function pa(a,b,c){var d=[],e=c.timeout;ia(b);var d=ka(a.a,c,a.c),f=new W(a.c,b,e);a.h=d.length;b=0;for(c=d.length;b<c;b++)d[b].load(function(b,d,c){qa(a,f,b,d,c);});}function ra(a,b){this.c=a;this.a=b;}
ra.prototype.load=function(a){function b(){if(f["__mti_fntLst"+d]){var c=f["__mti_fntLst"+d](),e=[],h;if(c)for(var l=0;l<c.length;l++){var k=c[l].fontfamily;void 0!=c[l].fontStyle&&void 0!=c[l].fontWeight?(h=c[l].fontStyle+c[l].fontWeight,e.push(new G(k,h))):e.push(new G(k));}a(e);}else setTimeout(function(){b();},50);}var c=this,d=c.a.projectId,e=c.a.version;if(d){var f=c.c.o;A(this.c,(c.a.api||"https://fast.fonts.net/jsapi")+"/"+d+".js"+(e?"?v="+e:""),function(e){e?a([]):(f["__MonotypeConfiguration__"+
d]=function(){return c.a},b());}).id="__MonotypeAPIScript__"+d;}else a([]);};function sa(a,b){this.c=a;this.a=b;}sa.prototype.load=function(a){var b,c,d=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new B;b=0;for(c=d.length;b<c;b++)z(this.c,d[b],C(g));var m=[];b=0;for(c=e.length;b<c;b++)if(d=e[b].split(":"),d[1])for(var h=d[1].split(","),l=0;l<h.length;l+=1)m.push(new G(d[0],h[l]));else m.push(new G(d[0]));E(g,function(){a(m,f);});};function ta(a,b){a?this.c=a:this.c=ua;this.a=[];this.f=[];this.g=b||"";}var ua="https://fonts.googleapis.com/css";function va(a,b){for(var c=b.length,d=0;d<c;d++){var e=b[d].split(":");3==e.length&&a.f.push(e.pop());var f="";2==e.length&&""!=e[1]&&(f=":");a.a.push(e.join(f));}}
function wa(a){if(0==a.a.length)throw Error("No fonts to load!");if(-1!=a.c.indexOf("kit="))return a.c;for(var b=a.a.length,c=[],d=0;d<b;d++)c.push(a.a[d].replace(/ /g,"+"));b=a.c+"?family="+c.join("%7C");0<a.f.length&&(b+="&subset="+a.f.join(","));0<a.g.length&&(b+="&text="+encodeURIComponent(a.g));return b}function ya(a){this.f=a;this.a=[];this.c={};}
var za={latin:"BESbswy","latin-ext":"\u00e7\u00f6\u00fc\u011f\u015f",cyrillic:"\u0439\u044f\u0416",greek:"\u03b1\u03b2\u03a3",khmer:"\u1780\u1781\u1782",Hanuman:"\u1780\u1781\u1782"},Aa={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Ba={i:"i",italic:"i",n:"n",normal:"n"},
Ca=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
function Da(a){for(var b=a.f.length,c=0;c<b;c++){var d=a.f[c].split(":"),e=d[0].replace(/\+/g," "),f=["n4"];if(2<=d.length){var g;var m=d[1];g=[];if(m)for(var m=m.split(","),h=m.length,l=0;l<h;l++){var k;k=m[l];if(k.match(/^[\w-]+$/)){var n=Ca.exec(k.toLowerCase());if(null==n)k="";else {k=n[2];k=null==k||""==k?"n":Ba[k];n=n[1];if(null==n||""==n)n="4";else var r=Aa[n],n=r?r:isNaN(n)?"4":n.substr(0,1);k=[k,n].join("");}}else k="";k&&g.push(k);}0<g.length&&(f=g);3==d.length&&(d=d[2],g=[],d=d?d.split(","):
g,0<d.length&&(d=za[d[0]])&&(a.c[e]=d));}a.c[e]||(d=za[e])&&(a.c[e]=d);for(d=0;d<f.length;d+=1)a.a.push(new G(e,f[d]));}}function Ea(a,b){this.c=a;this.a=b;}var Fa={Arimo:!0,Cousine:!0,Tinos:!0};Ea.prototype.load=function(a){var b=new B,c=this.c,d=new ta(this.a.api,this.a.text),e=this.a.families;va(d,e);var f=new ya(e);Da(f);z(c,wa(d),C(b));E(b,function(){a(f.a,f.c,Fa);});};function Ga(a,b){this.c=a;this.a=b;}Ga.prototype.load=function(a){var b=this.a.id,c=this.c.o;b?A(this.c,(this.a.api||"https://use.typekit.net")+"/"+b+".js",function(b){if(b)a([]);else if(c.Typekit&&c.Typekit.config&&c.Typekit.config.fn){b=c.Typekit.config.fn;for(var e=[],f=0;f<b.length;f+=2)for(var g=b[f],m=b[f+1],h=0;h<m.length;h++)e.push(new G(g,m[h]));try{c.Typekit.load({events:!1,classes:!1,async:!0});}catch(l){}a(e);}},2E3):a([]);};function Ha(a,b){this.c=a;this.f=b;this.a=[];}Ha.prototype.load=function(a){var b=this.f.id,c=this.c.o,d=this;b?(c.__webfontfontdeckmodule__||(c.__webfontfontdeckmodule__={}),c.__webfontfontdeckmodule__[b]=function(b,c){for(var g=0,m=c.fonts.length;g<m;++g){var h=c.fonts[g];d.a.push(new G(h.name,ga("font-weight:"+h.weight+";font-style:"+h.style)));}a(d.a);},A(this.c,(this.f.api||"https://f.fontdeck.com/s/css/js/")+ea(this.c)+"/"+b+".js",function(b){b&&a([]);})):a([]);};var Y=new oa(window);Y.a.c.custom=function(a,b){return new sa(b,a)};Y.a.c.fontdeck=function(a,b){return new Ha(b,a)};Y.a.c.monotype=function(a,b){return new ra(b,a)};Y.a.c.typekit=function(a,b){return new Ga(b,a)};Y.a.c.google=function(a,b){return new Ea(b,a)};var Z={load:p(Y.load,Y)};module.exports?module.exports=Z:(window.WebFont=Z,window.WebFontConfig&&Y.load(window.WebFontConfig));}());
});

let FontLoaded = new Promise((resolve, reject) => {
  webfontloader.load({
    custom: {
      families: ["Novecento WideBold"]
    },
    active: function () {
      resolve();
    }
  });
});

export default DropsRecognition;
export { DropsRecognition as DropRecognition, FontLoaded, Rectangle };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJvcFJlY29nbml0aW9uLmpzIiwic291cmNlcyI6WyIuLi9zcmMvUmVjdGFuZ2xlLmpzIiwiLi4vc3JjL0Nvbm5lY3RlZEFyZWFSZWNvZ25pdGlvbi5qcyIsIi4uL3NyYy9SZWN0UmVjb2duaXRpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vc3JjL1N0YWdlUmVjb2duaXRpb24uanMiLCIuLi9zcmMvRGF0YS9SZWNvZ25pdGlvbkRhdGEuanMiLCIuLi9zcmMvSXRlbVJlY29nbml0aW9uLmpzIiwiLi4vc3JjL0Ryb3BSZWNvZ25pdGlvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy93ZWJmb250bG9hZGVyL3dlYmZvbnRsb2FkZXIuanMiLCIuLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUge1xuICBjb25zdHJ1Y3RvcihkYXRhID0ge30pIHtcbiAgICB0aGlzLmxlZnQgPSBkYXRhLmxlZnQgfHwgMDtcbiAgICB0aGlzLnRvcCA9IGRhdGEudG9wIHx8IDA7XG4gICAgdGhpcy5yaWdodCA9IGRhdGEucmlnaHQgfHwgMDtcbiAgICB0aGlzLmJvdHRvbSA9IGRhdGEuYm90dG9tIHx8IDA7XG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICBpZiAoIShrZXkgaW4gdGhpcykpIHtcbiAgICAgICAgdGhpc1trZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHVwZGF0ZShkYXRhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24odGhpcywgZGF0YSk7XG4gIH1cbiAgZGlyZWN0aW9uKFJlY3QyKSB7XG4gICAgbGV0IGxlZnQgPSBSZWN0Mi5yaWdodCA8IHRoaXMubGVmdDtcbiAgICBsZXQgcmlnaHQgPSBSZWN0Mi5sZWZ0ID4gdGhpcy5yaWdodDtcbiAgICBsZXQgdG9wID0gUmVjdDIuYm90dG9tIDwgdGhpcy50b3A7XG4gICAgbGV0IGJvdHRvbSA9IFJlY3QyLnRvcCA+IHRoaXMuYm90dG9tO1xuICAgIHJldHVybiBbbGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tXTtcbiAgfVxuICBtZXJnZShSZWN0Mikge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZSh7XG4gICAgICBsZWZ0OiBNYXRoLm1pbih0aGlzLmxlZnQsIFJlY3QyLmxlZnQpLFxuICAgICAgcmlnaHQ6IE1hdGgubWF4KHRoaXMucmlnaHQsIFJlY3QyLnJpZ2h0KSxcbiAgICAgIHRvcDogTWF0aC5taW4odGhpcy50b3AsIFJlY3QyLnRvcCksXG4gICAgICBib3R0b206IE1hdGgubWF4KHRoaXMuYm90dG9tLCBSZWN0Mi5ib3R0b20pXG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIOiuoeeul+efqeW9oui3neemu1xuICAgKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjYxNzgwMTVcbiAgICogQHBhcmFtIHsqfSBSZWN0MlxuICAgKi9cbiAgZGlzdGFuY2UoUmVjdDIpIHtcbiAgICBsZXQgW2xlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbV0gPSB0aGlzLmRpcmVjdGlvbihSZWN0Mik7XG4gICAgaWYgKGxlZnQgJiYgdG9wKSB7XG4gICAgICByZXR1cm4gTWF0aC5oeXBvdCh0aGlzLmxlZnQgLSBSZWN0Mi5yaWdodCwgdGhpcy50b3AgLSBSZWN0Mi5ib3R0b20pO1xuICAgIH0gZWxzZSBpZiAocmlnaHQgJiYgdG9wKSB7XG4gICAgICByZXR1cm4gTWF0aC5oeXBvdCh0aGlzLnJpZ2h0IC0gUmVjdDIubGVmdCwgdGhpcy50b3AgLSBSZWN0Mi5ib3R0b20pO1xuICAgIH0gZWxzZSBpZiAobGVmdCAmJiBib3R0b20pIHtcbiAgICAgIHJldHVybiBNYXRoLmh5cG90KHRoaXMubGVmdCAtIFJlY3QyLnJpZ2h0LCB0aGlzLmJvdHRvbSAtIFJlY3QyLnRvcCk7XG4gICAgfSBlbHNlIGlmIChyaWdodCAmJiBib3R0b20pIHtcbiAgICAgIHJldHVybiBNYXRoLmh5cG90KHRoaXMucmlnaHQgLSBSZWN0Mi5sZWZ0LCB0aGlzLmJvdHRvbSAtIFJlY3QyLnRvcCk7XG4gICAgfSBlbHNlIGlmIChsZWZ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5sZWZ0IC0gUmVjdDIucmlnaHQ7XG4gICAgfSBlbHNlIGlmIChyaWdodCkge1xuICAgICAgcmV0dXJuIFJlY3QyLmxlZnQgLSB0aGlzLnJpZ2h0O1xuICAgIH0gZWxzZSBpZiAodG9wKSB7XG4gICAgICByZXR1cm4gdGhpcy50b3AgLSBSZWN0Mi5ib3R0b207XG4gICAgfSBlbHNlIGlmIChib3R0b20pIHtcbiAgICAgIHJldHVybiBSZWN0Mi50b3AgLSB0aGlzLmJvdHRvbTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5yaWdodCAtIHRoaXMubGVmdCArIDE7XG4gIH1cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5ib3R0b20gLSB0aGlzLnRvcCArIDE7XG4gIH1cbiAgZ2V0IGFyZWEoKXtcbiAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0O1xuICB9XG59XG4iLCJpbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCIuL1JlY3RhbmdsZVwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29ubmVjdGVkQXJlYVJlY29nbml0aW9uIHtcbiAgY29uc3RydWN0b3IoTWF0cml4LCBOb2RlLCBHZXRNYXRyaXgpIHtcbiAgICB0aGlzLk1hdHJpeCA9IE1hdHJpeDtcbiAgICBpZiAoTm9kZSkgdGhpcy5Ob2RlID0gTm9kZTtcbiAgICBpZiAoR2V0TWF0cml4KSB7XG4gICAgICB0aGlzLkdldE1hdHJpeCA9IEdldE1hdHJpeDtcbiAgICB9XG4gIH1cbiAgR2V0Q29ubmVjdGVkQXJlYShWZXJ0ZXgsIENhbGxiYWNrKSB7XG4gICAgbGV0IFJlc3VsdCA9IHRoaXMuQkZTKHRoaXMuTWF0cml4LCBWZXJ0ZXgpO1xuICAgIGlmICh0aGlzLkdldE1hdHJpeCkge1xuICAgICAgbGV0IE1hdHJpeCA9IFtdO1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBSZXN1bHQuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgTWF0cml4LnB1c2gobmV3IEFycmF5KFJlc3VsdC53aWR0aCkuZmlsbChmYWxzZSkpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgYVZlcnRleCBvZiBSZXN1bHQubWF0cml4KSB7XG4gICAgICAgIE1hdHJpeFthVmVydGV4WzFdLVJlc3VsdC50b3BdW2FWZXJ0ZXhbMF0tUmVzdWx0LmxlZnRdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIFJlc3VsdC5tYXRyaXggPSBNYXRyaXg7XG4gICAgfVxuICAgIGlmIChDYWxsYmFjaykgUmVzdWx0ID0gQ2FsbGJhY2soUmVzdWx0KTtcbiAgICByZXR1cm4gUmVzdWx0O1xuICB9XG4gIEdldEFsbENvbm5lY3RlZEFyZWEoQ2FsbGJhY2spIHtcbiAgICBsZXQgUXVldWUgPSB0aGlzLk5vZGUudmFsdWVzKCk7XG4gICAgbGV0IFJldCA9IFtdO1xuICAgIGZvciAobGV0IFZlcnRleCBvZiBRdWV1ZSkge1xuICAgICAgbGV0IFJlc3VsdCA9IENhbGxiYWNrXG4gICAgICAgID8gdGhpcy5HZXRDb25uZWN0ZWRBcmVhKFtNYXRoLmZsb29yKFZlcnRleCAvIDEwMDAwKSwgVmVydGV4ICUgMTAwMDBdLCBDYWxsYmFjaylcbiAgICAgICAgOiB0aGlzLkdldENvbm5lY3RlZEFyZWEoW01hdGguZmxvb3IoVmVydGV4IC8gMTAwMDApLCBWZXJ0ZXggJSAxMDAwMF0pO1xuICAgICAgaWYgKFJlc3VsdCkge1xuICAgICAgICBSZXQucHVzaChSZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUmV0O1xuICB9XG4gIEJGUyhNYXRyaXgsIFZlcnRleCkge1xuICAgIGxldCBSZWN0ID0gbmV3IFJlY3RhbmdsZSh7XG4gICAgICBsZWZ0OiBJbmZpbml0eSxcbiAgICAgIHJpZ2h0OiAtSW5maW5pdHksXG4gICAgICB0b3A6IEluZmluaXR5LFxuICAgICAgYm90dG9tOiAtSW5maW5pdHksXG4gICAgICBwb2ludDogMFxuICAgIH0pO1xuICAgIGlmICh0aGlzLkdldE1hdHJpeCkge1xuICAgICAgUmVjdC5tYXRyaXggPSBbXTtcbiAgICB9XG4gICAgbGV0IFF1ZXVlID0gW107XG4gICAgbGV0IERpcmVjdGlvbiA9IFtcbiAgICAgIFswLCAtMV0sXG4gICAgICBbMSwgMF0sXG4gICAgICBbMCwgMV0sXG4gICAgICBbLTEsIDBdXG4gICAgXTtcbiAgICBSZWN0LnVwZGF0ZSh7XG4gICAgICBsZWZ0OiBNYXRoLm1pbihSZWN0LmxlZnQsIFZlcnRleFswXSksXG4gICAgICByaWdodDogTWF0aC5tYXgoUmVjdC5yaWdodCwgVmVydGV4WzBdKSxcbiAgICAgIHRvcDogTWF0aC5taW4oUmVjdC50b3AsIFZlcnRleFsxXSksXG4gICAgICBib3R0b206IE1hdGgubWF4KFJlY3QuYm90dG9tLCBWZXJ0ZXhbMV0pXG4gICAgfSk7XG4gICAgTWF0cml4W1ZlcnRleFsxXV1bVmVydGV4WzBdXSA9IGZhbHNlO1xuICAgIGlmICh0aGlzLk5vZGUpIHRoaXMuTm9kZS5kZWxldGUoVmVydGV4WzBdICogMTAwMDAgKyBWZXJ0ZXhbMV0pO1xuICAgIFF1ZXVlLnB1c2goVmVydGV4KTtcbiAgICB3aGlsZSAoUXVldWUubGVuZ3RoICE9IDApIHtcbiAgICAgIFJlY3QucG9pbnQrKztcbiAgICAgIGxldCBOb3dWZXJ0ZXggPSBRdWV1ZS5zaGlmdCgpO1xuICAgICAgaWYgKHRoaXMuR2V0TWF0cml4KSB7XG4gICAgICAgIFJlY3QubWF0cml4LnB1c2goTm93VmVydGV4KTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgRGlyZWN0aW9uLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgIGxldCBOZXh0VmVydGV4ID0gW05vd1ZlcnRleFswXSArIERpcmVjdGlvbltkXVswXSwgTm93VmVydGV4WzFdICsgRGlyZWN0aW9uW2RdWzFdXTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIE5leHRWZXJ0ZXhbMF0gPCAwIHx8XG4gICAgICAgICAgTmV4dFZlcnRleFsxXSA8IDAgfHxcbiAgICAgICAgICBOZXh0VmVydGV4WzBdID49IE1hdHJpeFswXS5sZW5ndGggfHxcbiAgICAgICAgICBOZXh0VmVydGV4WzFdID49IE1hdHJpeC5sZW5ndGhcbiAgICAgICAgKVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBpZiAoTWF0cml4W05leHRWZXJ0ZXhbMV1dW05leHRWZXJ0ZXhbMF1dKSB7XG4gICAgICAgICAgUmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgbGVmdDogTWF0aC5taW4oUmVjdC5sZWZ0LCBOZXh0VmVydGV4WzBdKSxcbiAgICAgICAgICAgIHJpZ2h0OiBNYXRoLm1heChSZWN0LnJpZ2h0LCBOZXh0VmVydGV4WzBdKSxcbiAgICAgICAgICAgIHRvcDogTWF0aC5taW4oUmVjdC50b3AsIE5leHRWZXJ0ZXhbMV0pLFxuICAgICAgICAgICAgYm90dG9tOiBNYXRoLm1heChSZWN0LmJvdHRvbSwgTmV4dFZlcnRleFsxXSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBNYXRyaXhbTmV4dFZlcnRleFsxXV1bTmV4dFZlcnRleFswXV0gPSBmYWxzZTtcbiAgICAgICAgICBpZiAodGhpcy5Ob2RlKSB0aGlzLk5vZGUuZGVsZXRlKE5leHRWZXJ0ZXhbMF0gKiAxMDAwMCArIE5leHRWZXJ0ZXhbMV0pO1xuICAgICAgICAgIFF1ZXVlLnB1c2goTmV4dFZlcnRleCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFJlY3Q7XG4gIH1cbn1cbiIsImltcG9ydCBDb25uZWN0ZWRBcmVhUmVjb2duaXRpb24gZnJvbSBcIi4vQ29ubmVjdGVkQXJlYVJlY29nbml0aW9uXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0UmVjb2duaXRpb24ge1xuICBjb25zdHJ1Y3RvcihJbWFnZURhdGEpIHtcbiAgICBsZXQgaGVpZ2h0ID0gSW1hZ2VEYXRhLmxlbmd0aDtcbiAgICBsZXQgd2lkdGggPSBJbWFnZURhdGFbMF0ubGVuZ3RoO1xuICAgIHRoaXMuSW1hZ2VEYXRhID0gSW1hZ2VEYXRhO1xuICAgIHRoaXMuTm9kZSA9IG5ldyBTZXQoKTtcbiAgICAvKiDnspfmo4DmtYvlhbPljaHmjonokL3kv6Hmga/ljLrln58gKi9cbiAgICBsZXQgWUF4aXMgPSBBcnJheShoZWlnaHQpLmZpbGwoMCk7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG4gICAgICAgIFlBeGlzW3ldICs9IEltYWdlRGF0YVt5XVt4XVswXSArIEltYWdlRGF0YVt5XVt4XVsxXSArIEltYWdlRGF0YVt5XVt4XVsyXTtcbiAgICAgIH1cbiAgICAgIFlBeGlzW3ldIC89IDM7XG4gICAgfVxuICAgIGxldCBEYXRhQXJlYVNwaWx0ID0gLTE7XG4gICAgZm9yIChsZXQgeSA9IDE7IHkgPCBoZWlnaHQ7IHkrKykge1xuICAgICAgaWYgKFlBeGlzW3kgLSAxXSAtIFlBeGlzW3ldID4gMjAwMDApIHtcbiAgICAgICAgbGV0IGNhbmNlbCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbiAgICAgICAgICBpZiAoSW1hZ2VEYXRhW3ldW3hdLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpIC8gMyA+IDEwMCkge1xuICAgICAgICAgICAgY2FuY2VsID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FuY2VsKSBjb250aW51ZTtcbiAgICAgICAgRGF0YUFyZWFTcGlsdCA9IHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLkRhdGFBcmVhU3BpbHQgPSBEYXRhQXJlYVNwaWx0O1xuICAgIGxldCBCaW5hcml6YXRpb25NYXRyaXggPSB0aGlzLkJpbmFyaXphdGlvbih3aWR0aCwgaGVpZ2h0LCBJbWFnZURhdGEpO1xuICAgIGxldCBDb25uZWN0ZWRBcmVhID0gbmV3IENvbm5lY3RlZEFyZWFSZWNvZ25pdGlvbihCaW5hcml6YXRpb25NYXRyaXgsIHRoaXMuTm9kZSk7XG4gICAgbGV0IG1lcmdlZFJlY3RzID0gdGhpcy5BdXRvbWVyZ2VSZWN0KFxuICAgICAgQ29ubmVjdGVkQXJlYS5HZXRBbGxDb25uZWN0ZWRBcmVhKFJlc3VsdCA9PiB7XG4gICAgICAgIFJlc3VsdC51cGRhdGUoe1xuICAgICAgICAgIHRvcDogUmVzdWx0LnRvcCArIERhdGFBcmVhU3BpbHQsXG4gICAgICAgICAgYm90dG9tOiBSZXN1bHQuYm90dG9tICsgRGF0YUFyZWFTcGlsdFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKFJlc3VsdC5wb2ludCA+IDEwMCkge1xuICAgICAgICAgIGRlbGV0ZSBSZXN1bHQucG9pbnQ7XG4gICAgICAgICAgcmV0dXJuIFJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuQm91bmQobWVyZ2VkUmVjdHMpO1xuICAgIHRoaXMuR2V0RHJvcFR5cGUobWVyZ2VkUmVjdHMuUmlnaHQsIEltYWdlRGF0YSk7XG4gICAgdGhpcy5tZXJnZWRSZWN0cyA9IG1lcmdlZFJlY3RzO1xuICAgIGRlbGV0ZSB0aGlzLkRhdGFBcmVhU3BpbHQ7XG4gICAgZGVsZXRlIHRoaXMuTm9kZTtcbiAgICBkZWxldGUgdGhpcy5JbWFnZURhdGE7XG4gIH1cbiAgLy8g6K+G5Yir6L6555WMXG4gIEJvdW5kKFJlY3RzKSB7XG4gICAgdGhpcy5TdGFnZSA9IFJlY3RzLlN0YWdlO1xuICAgIHRoaXMuSXRlbXMgPSBbXTtcbiAgICBmb3IgKGxldCBSZWN0IG9mIFJlY3RzLlJpZ2h0KSB7XG4gICAgICBpZiAoTWF0aC5hYnMoUmVjdC5oZWlnaHQgLyBSZWN0LndpZHRoIC0gMSkgPCAwLjIgJiYgUmVjdC5oZWlnaHQgPiA1MCAmJiBSZWN0LndpZHRoID4gNTApIHtcbiAgICAgICAgdGhpcy5JdGVtcy5wdXNoKFJlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLkl0ZW1zLnNvcnQoKGEsIGIpID0+IGEubGVmdCAtIGIubGVmdCk7XG4gIH1cbiAgR2V0RHJvcFR5cGUoUmVjdHMsIEltYWdlRGF0YSkge1xuICAgIGxldCB0b3AgPSB0aGlzLkl0ZW1zLnJlZHVjZSgoYSwgYikgPT4gYSArIGIuYm90dG9tLCAwKSAvIHRoaXMuSXRlbXMubGVuZ3RoO1xuICAgIGxldCBEcm9wVHlwZSA9IFtdO1xuICAgIGZvciAobGV0IFJlY3Qgb2YgUmVjdHMpIHtcbiAgICAgIGlmIChSZWN0LnRvcCA+IHRvcCAmJiBSZWN0LndpZHRoIC8gUmVjdC5oZWlnaHQgPiAzKSB7XG4gICAgICAgIERyb3BUeXBlLnB1c2goe1xuICAgICAgICAgIGxlZnQ6IFJlY3QubGVmdCxcbiAgICAgICAgICByaWdodDogUmVjdC5yaWdodCxcbiAgICAgICAgICB0eXBlOiB0aGlzLkNvbXBhcmVUeXBlKEltYWdlRGF0YVtSZWN0LnRvcF1bKFJlY3QubGVmdCArIFJlY3QucmlnaHQpID4+IDFdKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgUmVjdCBvZiB0aGlzLkl0ZW1zKSB7XG4gICAgICBmb3IgKGxldCB0eXBlIG9mIERyb3BUeXBlKSB7XG4gICAgICAgIGxldCBbbGVmdCwgcmlnaHRdID0gUmVjdC5kaXJlY3Rpb24odHlwZSk7XG4gICAgICAgIGlmICghbGVmdCAmJiAhcmlnaHQpIHtcbiAgICAgICAgICBSZWN0LnR5cGUgPSB0eXBlLnR5cGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgUkdCRGlmZihyZ2IxLCByZ2IyKSB7XG4gICAgcmV0dXJuIHJnYjEubWFwKCh2LCBpKSA9PiBNYXRoLmFicyh2IC0gcmdiMltpXSkpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xuICB9XG4gIENvbXBhcmVUeXBlKHJnYikge1xuICAgIGxldCBUeXBlID0gT2JqZWN0LmVudHJpZXMoUmVjdFJlY29nbml0aW9uLkRyb3BUeXBlQ29sb3IpO1xuICAgIGZvciAobGV0IFt0eXBlLCBjb2xvcl0gb2YgVHlwZSkge1xuICAgICAgaWYgKGNvbG9yKC4uLnJnYikpIHtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBcIkFMTF9EUk9QXCI7XG4gIH1cbiAgQmluYXJpemF0aW9uKHdpZHRoLCBoZWlnaHQsIEltYWdlRGF0YSkge1xuICAgIGxldCBNYXRyaXggPSBbXTtcbiAgICBmb3IgKGxldCB5ID0gdGhpcy5EYXRhQXJlYVNwaWx0LCByeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuICAgICAgTWF0cml4LnB1c2goW10pO1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG4gICAgICAgIE1hdHJpeFtyeV1beF0gPSAoSW1hZ2VEYXRhW3ldW3hdWzBdICsgSW1hZ2VEYXRhW3ldW3hdWzFdICsgSW1hZ2VEYXRhW3ldW3hdWzJdKSAvIDMgPCA3NSA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgICAgaWYgKE1hdHJpeFtyeV1beF0pIHtcbiAgICAgICAgICB0aGlzLk5vZGUuYWRkKHggKiAxMDAwMCArIHJ5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcnkrKztcbiAgICB9XG4gICAgcmV0dXJuIE1hdHJpeDtcbiAgfVxuICBzb3J0UmVjdChSZWN0MSwgUmVjdDIpIHtcbiAgICBsZXQgeSA9IFJlY3QxLnRvcCAtIFJlY3QyLnRvcCxcbiAgICAgIHggPSBSZWN0MS5sZWZ0IC0gUmVjdDIubGVmdDtcbiAgICBpZiAoeSA9PSAwKSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiDlkIjlubbovrnnlYzot53nprvlnKjkuIDlrprojIPlm7TlhoXnmoTov57pgJrljLpcbiAgICogQHBhcmFtIHsqfSBSZWN0c1xuICAgKi9cbiAgQXV0b21lcmdlUmVjdChSZWN0cykge1xuICAgIC8vIOaQnOe0ouWHuuS4remXtOeahOerlue6vyDku6XlroPkuLrlj4LogINcbiAgICBsZXQgTWlkZGxlTGluZSA9IHsgdG9wOiAxLCBib3R0b206IDAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IFJlY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoUmVjdHNbaV0uYm90dG9tIC0gUmVjdHNbaV0udG9wID4gTWlkZGxlTGluZS5ib3R0b20gLSBNaWRkbGVMaW5lLnRvcCkge1xuICAgICAgICBNaWRkbGVMaW5lID0gUmVjdHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBNaWRkbGVYID0gKE1pZGRsZUxpbmUucmlnaHQgKyBNaWRkbGVMaW5lLmxlZnQpIC8gMjtcbiAgICBsZXQgTGVmdFJlY3QgPSBbXSxcbiAgICAgIFJpZ2h0UmVjdCA9IFtdO1xuICAgIGZvciAobGV0IFJlY3Qgb2YgUmVjdHMpIHtcbiAgICAgIGlmIChSZWN0LnJpZ2h0IDwgTWlkZGxlWCkge1xuICAgICAgICBpZiAodGhpcy5JU0NoYXIoUmVjdCkpIHtcbiAgICAgICAgICBMZWZ0UmVjdC5wdXNoKFJlY3QpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChSZWN0LmxlZnQgPiBNaWRkbGVYKSB7XG4gICAgICAgIFJpZ2h0UmVjdC5wdXNoKFJlY3QpO1xuICAgICAgfVxuICAgIH1cbiAgICBMZWZ0UmVjdC5zb3J0KHRoaXMuc29ydFJlY3QpO1xuICAgIGxldCBTdGFnZVJlY3QgPSBMZWZ0UmVjdC5zaGlmdCgpO1xuICAgIGZvciAobGV0IFJlY3Qgb2YgTGVmdFJlY3QpIHtcbiAgICAgIGxldCBbbGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tXSA9IFN0YWdlUmVjdC5kaXJlY3Rpb24oUmVjdCk7XG4gICAgICBpZiAoKHJpZ2h0IHx8IGxlZnQpICYmICF0b3AgJiYgIWJvdHRvbSkge1xuICAgICAgICBTdGFnZVJlY3QubWVyZ2UoUmVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IE1lcmdlID0gKFJlY3RzLCBxKSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFJlY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IFJlY3RzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgaWYgKFJlY3RzW2ldLmRpc3RhbmNlKFJlY3RzW2pdKSA8IHEpIHtcbiAgICAgICAgICAgIFJlY3RzW2ldLm1lcmdlKFJlY3RzW2pdKTtcbiAgICAgICAgICAgIGRlbGV0ZSBSZWN0cy5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBSZWN0cztcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICBTdGFnZTogU3RhZ2VSZWN0LFxuICAgICAgUmlnaHQ6IE1lcmdlKFJpZ2h0UmVjdCwgMTApLFxuICAgICAgTWlkZGxlOiBNaWRkbGVMaW5lXG4gICAgfTtcbiAgfVxuICBJU0NoYXIoUmVjdCkge1xuICAgIGxldCBDID0gMDtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IFJlY3QuaGVpZ2h0OyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgUmVjdC53aWR0aDsgeCsrKSB7XG4gICAgICAgIGxldCBbUiwgRywgQl0gPSB0aGlzLkltYWdlRGF0YVt5ICsgUmVjdC50b3BdW3ggKyBSZWN0LmxlZnRdO1xuICAgICAgICBsZXQgQSA9IDI1NTtcbiAgICAgICAgbGV0IEQgPSAoTWF0aC5hYnMoUiAtIEEpICsgTWF0aC5hYnMoRyAtIEEpICsgTWF0aC5hYnMoQiAtIEEpKSAvIDM7XG4gICAgICAgIGlmIChEIDwgMzApIHtcbiAgICAgICAgICBDKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEMgLyAoUmVjdC53aWR0aCAqIFJlY3QuaGVpZ2h0KSA+IDAuMTtcbiAgfVxufVxuUmVjdFJlY29nbml0aW9uLkRyb3BUeXBlQ29sb3IgPSB7XG4gIFNQRUNJQUxfRFJPUDogKFIsIEcsIEIpID0+IHtcbiAgICByZXR1cm4gTWF0aC5hYnMoUiAtIDI0MCkgPCA1ICYmIE1hdGguYWJzKEcgLSAxMDApIDwgMTAgJiYgQiA8IDUwO1xuICB9LFxuICBOT1JNQUxfRFJPUDogKFIsIEcsIEIpID0+IHtcbiAgICByZXR1cm4gTWF0aC5hYnMoUiAtIDE3NSkgKyBNYXRoLmFicyhHIC0gMTc1KSArIE1hdGguYWJzKEIgLSAxNzUpIDwgMjA7XG4gIH0sXG4gIEVYVFJBX0RST1A6IChSLCBHLCBCKSA9PiB7XG4gICAgcmV0dXJuIEcgPiBSICYmIEcgPiBCICYmIEIgPCAxNTAgJiYgUiA+IDIwMCAmJiBHID4gMjAwO1xuICB9LFxuICBGSVhFRF9EUk9QOiAoUiwgRywgQikgPT4ge1xuICAgIHJldHVybiBSID4gMjAwICYmIE1hdGguYWJzKEcgLSAyMDApIDwgMjAgJiYgQiA8IDEyMDtcbiAgfSxcbiAgTFVDS1lfRFJPUDogKFIsIEcsIEIpID0+IHtcbiAgICByZXR1cm4gTWF0aC5hYnMoUiAtIDI1MCkgPCA1ICYmIE1hdGguYWJzKEcgLSAxMDApIDwgMTAgJiYgQiA8IDUwO1xuICB9XG59O1xuIiwiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsImltcG9ydCBcIi4vRGF0YS9Gb250LmNzc1wiO1xuaW1wb3J0IEZvbnRTaXplRGF0YSBmcm9tIFwiLi9EYXRhL1N0YWdlRm9udFNpemUuanNvblwiO1xuaW1wb3J0IENvbm5lY3RlZEFyZWFSZWNvZ25pdGlvbiBmcm9tIFwiLi9Db25uZWN0ZWRBcmVhUmVjb2duaXRpb25cIjtcblxubGV0IEZvbnRDYWNoZSA9IHt9O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhZ2VSZWNvZ25pdGlvbihJbWFnZU1hdHJpeCkge1xuICBsZXQgTWF0cml4ID0gW107XG4gIGxldCBDb25maWRlbmNlID0gW107XG4gIGxldCBOb2RlID0gbmV3IFNldCgpO1xuICBmb3IgKGxldCB5ID0gMDsgeSA8IEltYWdlTWF0cml4Lmxlbmd0aDsgeSsrKSB7XG4gICAgTWF0cml4LnB1c2goW10pO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgSW1hZ2VNYXRyaXhbMF0ubGVuZ3RoOyB4KyspIHtcbiAgICAgIGxldCBbUiwgRywgQl0gPSBJbWFnZU1hdHJpeFt5XVt4XTtcbiAgICAgIE1hdHJpeFt5XVt4XSA9IChSICsgRyArIEIpIC8gMyA+IDgwO1xuICAgICAgaWYgKE1hdHJpeFt5XVt4XSkge1xuICAgICAgICBOb2RlLmFkZCh4ICogMTAwMDAgKyB5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgbGV0IGdldENvbm5lY3RlZEFyZWEgPSBuZXcgQ29ubmVjdGVkQXJlYVJlY29nbml0aW9uKE1hdHJpeCwgTm9kZSwgdHJ1ZSk7XG4gIGxldCBDb25uZWN0ZWRBcmVhcyA9IGdldENvbm5lY3RlZEFyZWEuR2V0QWxsQ29ubmVjdGVkQXJlYSgpLnNvcnQoKGEsIGIpID0+IGEubGVmdCAtIGIubGVmdCk7XG4gIGxldCBDaGFycyA9IFtdO1xuICBsZXQgU3BsaXRDaGFyO1xuICBmb3IgKGxldCBDaGFyIG9mIENvbm5lY3RlZEFyZWFzKSB7XG4gICAgaWYgKENoYXIuaGVpZ2h0IDwgTWF0cml4Lmxlbmd0aCA+PiAxKSB7XG4gICAgICBDaGFycy5wdXNoKFwiLVwiKTtcbiAgICAgIFNwbGl0Q2hhciA9IENoYXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIENoYXJzLnB1c2goXCJcIik7XG4gICAgfVxuICB9XG4gIGxldCBGb250U2l6ZSA9IGdldEZvbnRTaXplKFNwbGl0Q2hhcik7XG4gIGlmICghRm9udENhY2hlW0ZvbnRTaXplXSkge1xuICAgIEZvbnRDYWNoZVtGb250U2l6ZV0gPSBnZW5Gb250RGF0YShGb250U2l6ZSk7XG4gIH1cbiAgZm9yIChsZXQgW0luZGV4LCBDaGFyXSBvZiBDaGFycy5lbnRyaWVzKCkpIHtcbiAgICBpZiAoQ2hhciA9PSBcIi1cIikge1xuICAgICAgQ29uZmlkZW5jZS5wdXNoKDEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGxldCBSZXN1bHQgPSBjb21wYXJlTnVtYmVyKENvbm5lY3RlZEFyZWFzW0luZGV4XS5tYXRyaXgsIEZvbnRDYWNoZVtGb250U2l6ZV0pO1xuICAgIENoYXJzW0luZGV4XSA9IFJlc3VsdFswXTtcbiAgICBsZXQgTnVtQ29uZiA9IFJlc3VsdFsxXTtcbiAgICBpZiAoUmVzdWx0WzFdIDwgMC45KSB7XG4gICAgICBSZXN1bHQgPSBjb21wYXJlQ2hhcihDb25uZWN0ZWRBcmVhc1tJbmRleF0ubWF0cml4LCBGb250Q2FjaGVbRm9udFNpemVdKTtcbiAgICAgIGlmIChSZXN1bHRbMV0gPiBOdW1Db25mKSB7XG4gICAgICAgIENoYXJzW0luZGV4XSA9IFJlc3VsdFswXTtcbiAgICAgICAgQ29uZmlkZW5jZS5wdXNoKFJlc3VsdFsxXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBDb25maWRlbmNlLnB1c2goTnVtQ29uZik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIENvbmZpZGVuY2UucHVzaChOdW1Db25mKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtDaGFycy5qb2luKCcnKSxDb25maWRlbmNlLnJlZHVjZSgoYSxiKT0+YStiKS9Db25maWRlbmNlLmxlbmd0aF1cbn1cbmZ1bmN0aW9uIGdldEZvbnRTaXplKENoYXJSZWN0KSB7XG4gIGxldCBGaW5kID0gZmFsc2U7XG4gIGxldCBSZXQ7XG4gIGxldCBEaWZmID0gSW5maW5pdHk7XG4gIGZvciAobGV0IFtTaXplLCBSZWN0XSBvZiBPYmplY3QuZW50cmllcyhGb250U2l6ZURhdGEpKSB7XG4gICAgbGV0IEQgPSBNYXRoLmFicyhSZWN0LndpZHRoIC0gQ2hhclJlY3Qud2lkdGgpICsgTWF0aC5hYnMoUmVjdC5oZWlnaHQgLSBDaGFyUmVjdC5oZWlnaHQpO1xuICAgIGlmIChEIDw9IERpZmYpIHtcbiAgICAgIERpZmYgPSBEO1xuICAgICAgUmV0ID0gU2l6ZTtcbiAgICAgIGlmIChEID09IDApIHtcbiAgICAgICAgRmluZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChGaW5kKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFJldDtcbn1cbmZ1bmN0aW9uIGNvbXBhcmVOdW1iZXIoTWF0cml4LCBGb250KSB7XG4gIGxldCBOdW1iZXIgPSBbMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV07XG4gIGxldCBDb25maWRlbmNlID0gLUluZmluaXR5O1xuICBsZXQgUmVzdWx0O1xuICBmb3IgKGxldCBOdW0gb2YgTnVtYmVyKSB7XG4gICAgbGV0IENvbmYgPSBjb21wYXJlTWF0cml4KE1hdHJpeCxGb250W051bV0pO1xuICAgIGlmIChDb25mID4gQ29uZmlkZW5jZSkge1xuICAgICAgQ29uZmlkZW5jZSA9IENvbmY7XG4gICAgICBSZXN1bHQgPSBOdW07XG4gICAgfVxuICB9XG4gIHJldHVybiBbUmVzdWx0LCBDb25maWRlbmNlXTtcbn1cbmZ1bmN0aW9uIGNvbXBhcmVDaGFyKE1hdHJpeCwgRm9udCkge1xuICBsZXQgQ2hhcnMgPSBbXG4gICAgXCJBXCIsXG4gICAgXCJCXCIsXG4gICAgXCJDXCIsXG4gICAgXCJEXCIsXG4gICAgXCJFXCIsXG4gICAgXCJGXCIsXG4gICAgXCJHXCIsXG4gICAgXCJIXCIsXG4gICAgXCJJXCIsXG4gICAgXCJKXCIsXG4gICAgXCJLXCIsXG4gICAgXCJMXCIsXG4gICAgXCJNXCIsXG4gICAgXCJOXCIsXG4gICAgXCJPXCIsXG4gICAgXCJQXCIsXG4gICAgXCJRXCIsXG4gICAgXCJSXCIsXG4gICAgXCJTXCIsXG4gICAgXCJUXCIsXG4gICAgXCJVXCIsXG4gICAgXCJWXCIsXG4gICAgXCJXXCIsXG4gICAgXCJYXCIsXG4gICAgXCJZXCIsXG4gICAgXCJaXCJcbiAgXTtcbiAgbGV0IENvbmZpZGVuY2UgPSAtSW5maW5pdHk7XG4gIGxldCBSZXN1bHQ7XG4gIGZvciAobGV0IENoYXIgb2YgQ2hhcnMpIHtcbiAgICBsZXQgQ29uZiA9IGNvbXBhcmVNYXRyaXgoTWF0cml4LEZvbnRbQ2hhcl0pO1xuICAgIGlmIChDb25mID4gQ29uZmlkZW5jZSkge1xuICAgICAgQ29uZmlkZW5jZSA9IENvbmY7XG4gICAgICBSZXN1bHQgPSBDaGFyO1xuICAgIH1cbiAgfVxuICByZXR1cm4gW1Jlc3VsdCwgQ29uZmlkZW5jZV07XG59XG5mdW5jdGlvbiBjb21wYXJlTWF0cml4KE1hdHJpeDEsIE1hdHJpeDIpIHtcbiAgbGV0IFdpZHRoID0gTWF0aC5taW4oTWF0cml4MVswXS5sZW5ndGgsIE1hdHJpeDJbMF0ubGVuZ3RoKTtcbiAgbGV0IEhlaWdodCA9IE1hdGgubWluKE1hdHJpeDEubGVuZ3RoLCBNYXRyaXgyLmxlbmd0aCk7XG4gIGxldCBDb3VudCA9IDA7XG4gIGZvciAobGV0IHkgPSAwOyB5IDwgSGVpZ2h0OyB5KyspIHtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFdpZHRoOyB4KyspIHtcbiAgICAgIGlmIChNYXRyaXgxW3ldW3hdID09IE1hdHJpeDJbeV1beF0pIHtcbiAgICAgICAgQ291bnQrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIENvdW50IC8gKE1hdHJpeDFbMF0ubGVuZ3RoICogTWF0cml4MS5sZW5ndGgpO1xufVxuLy8g55Sf5oiQ5q+P5Liq5a2X56ym5pWw5o2uXG5mdW5jdGlvbiBnZW5Gb250RGF0YShzaXplKSB7XG4gIGxldCBDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBsZXQgQ3R4ID0gQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgQ3R4LmZvbnQgPSBgJHtzaXplfSAnTm92ZWNlbnRvIFdpZGVCb2xkJ2A7XG4gIEN0eC5maWxsU3R5bGUgPSBcIiMwMDAwMDBcIjtcbiAgQ3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XG4gIGxldCBEYXRhID0ge307XG4gIGxldCBDaGFycyA9IFwiMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIuc3BsaXQoXCJcIik7XG4gIGZvciAobGV0IENoYXIgb2YgQ2hhcnMpIHtcbiAgICBsZXQgU2l6ZSA9IEN0eC5tZWFzdXJlVGV4dChDaGFyKTtcbiAgICBDYW52YXMuaGVpZ2h0ID0gU2l6ZS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudCArIFNpemUuYWN0dWFsQm91bmRpbmdCb3hEZXNjZW50O1xuICAgIENhbnZhcy53aWR0aCA9IFNpemUud2lkdGg7XG4gICAgQ3R4LmZvbnQgPSBgJHtzaXplfSAnTm92ZWNlbnRvIFdpZGVCb2xkJ2A7XG4gICAgQ3R4LmZpbGxTdHlsZSA9IFwiIzAwMDAwMFwiO1xuICAgIEN0eC50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xuICAgIEN0eC5jbGVhclJlY3QoMCwgMCwgQ2FudmFzLndpZHRoLCBDYW52YXMuaGVpZ2h0KTtcbiAgICBDdHguZmlsbFRleHQoQ2hhciwgMCwgU2l6ZS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudCk7XG4gICAgbGV0IElEYXRhID0gQ3R4LmdldEltYWdlRGF0YSgwLCAwLCBDYW52YXMud2lkdGgsIENhbnZhcy5oZWlnaHQpO1xuICAgIGxldCBYRmxhZ3MgPSBuZXcgQXJyYXkoQ2FudmFzLndpZHRoKS5maWxsKGZhbHNlKTtcbiAgICBsZXQgWFJhbmdlID0gW107XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBDYW52YXMud2lkdGg7IHgrKykge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBDYW52YXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgbGV0IEluZGV4ID0gKHkgKiBDYW52YXMud2lkdGggKyB4KSAqIDQ7XG4gICAgICAgIGlmIChJRGF0YS5kYXRhW0luZGV4ICsgM10gPiAwKSB7XG4gICAgICAgICAgWEZsYWdzW3hdID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IENhbnZhcy53aWR0aDsgeCsrKSB7XG4gICAgICBpZiAoWEZsYWdzW3hdICYmIFhSYW5nZS5sZW5ndGggPT0gMCkge1xuICAgICAgICBYUmFuZ2UucHVzaCh4KTtcbiAgICAgIH0gZWxzZSBpZiAoWEZsYWdzW3hdKSB7XG4gICAgICAgIFhSYW5nZVsxXSA9IHg7XG4gICAgICB9XG4gICAgfVxuICAgIElEYXRhID0gQ3R4LmdldEltYWdlRGF0YShYUmFuZ2VbMF0sIDAsIFhSYW5nZVsxXSAtIFhSYW5nZVswXSArIDEsIENhbnZhcy5oZWlnaHQpO1xuICAgIGxldCBNYXRyaXggPSBbXTtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IElEYXRhLmhlaWdodDsgeSsrKSB7XG4gICAgICBNYXRyaXgucHVzaChbXSk7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IElEYXRhLndpZHRoOyB4KyspIHtcbiAgICAgICAgTWF0cml4W3ldW3hdID0gSURhdGEuZGF0YVsoeSAqIElEYXRhLndpZHRoICsgeCkgKiA0ICsgM10gPiAwO1xuICAgICAgfVxuICAgIH1cbiAgICBEYXRhW0NoYXJdID0gTWF0cml4O1xuICB9XG4gIHJldHVybiBEYXRhO1xufVxuIiwiY2xhc3MgUmVjb2duaXRpb25EYXRhIHtcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBEYXRhXG4gICAqL1xuICBzdGF0aWMgRW5jb2RlKERhdGEsIEZpbGVOYW1lKSB7XG4gICAgbGV0IElkID0gT2JqZWN0LmtleXMoRGF0YSk7XG4gICAgbGV0IGtleVNpemUgPSBJZC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLmxlbmd0aCwgMCk7XG4gICAgbGV0IERhdGFTaXplID0gTWF0aC5jZWlsKChEYXRhW0lkWzBdXVswXS5sZW5ndGggKiAzKSAvIDgpICogSWQubGVuZ3RoO1xuICAgIGxldCBQcmVmaXhTaXplID0gSWQubGVuZ3RoO1xuICAgIGxldCBIZWFkZXJTaXplID0gMjtcbiAgICBsZXQgQWxsU2l6ZSA9IFByZWZpeFNpemUgKyBrZXlTaXplICsgRGF0YVNpemUgKyBIZWFkZXJTaXplO1xuICAgIGxldCBEYXRhQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoQWxsU2l6ZSk7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICAvLyBXcml0ZSBIZWFkZXJcbiAgICBEYXRhQnVmZmVyW2luZGV4KytdID0gMTsgLy9WZXJzaW9uXG4gICAgRGF0YUJ1ZmZlcltpbmRleCsrXSA9IChEYXRhW0lkWzBdXVswXS5sZW5ndGggPj4gOCkgJiAwYjExMTExMTExO1xuICAgIERhdGFCdWZmZXJbaW5kZXgrK10gPSBEYXRhW0lkWzBdXVswXS5sZW5ndGggJiAwYjExMTExMTExO1xuXG4gICAgLy9cbiAgICBmb3IgKGxldCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoRGF0YSkpIHtcbiAgICAgIERhdGFCdWZmZXJbaW5kZXgrK10gPSBrLmxlbmd0aDtcbiAgICAgIC8vIFdyaXRlIEtleVxuICAgICAgZm9yIChsZXQgcyBvZiBrKSB7XG4gICAgICAgIERhdGFCdWZmZXJbaW5kZXgrK10gPSBzLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9XG4gICAgICB2ID0gW10uY29uY2F0KC4uLnYpO1xuICAgICAgbGV0IEJ5dGUgPSAwO1xuICAgICAgbGV0IEJpdEkgPSAwO1xuICAgICAgZm9yIChsZXQgW2ksIGJpdF0gb2Ygdi5lbnRyaWVzKCkpIHtcbiAgICAgICAgaWYgKGJpdCkge1xuICAgICAgICAgIEJ5dGUgPSAoQnl0ZSA8PCAxKSArIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQnl0ZSA9IEJ5dGUgPDwgMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKytCaXRJID09IDggfHwgaSA9PSB2Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBCeXRlID0gQnl0ZSA8PCAoOCAtIEJpdEkpO1xuICAgICAgICAgIERhdGFCdWZmZXJbaW5kZXgrK10gPSBCeXRlO1xuICAgICAgICAgIEJ5dGUgPSAwO1xuICAgICAgICAgIEJpdEkgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBEYXRhQnVmZmVyO1xuICB9XG4gIHN0YXRpYyBEZWNvZGUoRW5jb2RlZCkge1xuICAgIGxldCBJbmRleCA9IDA7XG4gICAgbGV0IFZlcnNpb24gPSBFbmNvZGVkW0luZGV4KytdO1xuICAgIGxldCBCaXRMZW5ndGggPSAoRW5jb2RlZFtJbmRleF0gPDwgOCkgfCBFbmNvZGVkW0luZGV4ICsgMV07XG4gICAgSW5kZXggKz0gMjtcbiAgICBsZXQgTW9kZSA9IFwiS2V5U2l6ZVwiO1xuICAgIGxldCBLZXkgPSBcIlwiO1xuICAgIGxldCBLZXlTaXplID0gMDtcbiAgICBsZXQgS2V5SW5kZXggPSAwO1xuICAgIGxldCBEYXRhID0gW1tdLCBbXSwgW11dO1xuICAgIGxldCBEYXRhQyA9IDA7XG4gICAgbGV0IE91dFB1dCA9IHt9O1xuICAgIGZvciAoOyBJbmRleCA8IEVuY29kZWQubGVuZ3RoOyBJbmRleCsrKSB7XG4gICAgICBzd2l0Y2ggKE1vZGUpIHtcbiAgICAgICAgY2FzZSBcIktleVNpemVcIjpcbiAgICAgICAgICBLZXlTaXplID0gRW5jb2RlZFtJbmRleF07XG4gICAgICAgICAgTW9kZSA9IFwiS2V5XCI7XG4gICAgICAgICAgS2V5SW5kZXggPSAwO1xuICAgICAgICAgIEtleSA9IFwiXCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJLZXlcIjpcbiAgICAgICAgICBLZXkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShFbmNvZGVkW0luZGV4XSk7XG4gICAgICAgICAgaWYgKCsrS2V5SW5kZXggPT0gS2V5U2l6ZSkge1xuICAgICAgICAgICAgTW9kZSA9IFwiRGF0YVwiO1xuICAgICAgICAgICAgRGF0YUMgPSAwO1xuICAgICAgICAgICAgRGF0YSA9IFtbXSwgW10sIFtdXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJEYXRhXCI6XG4gICAgICAgICAgbGV0IEJ5dGUgPSBFbmNvZGVkW0luZGV4XTtcbiAgICAgICAgICBsZXQgQmluQnl0ZSA9IEJ5dGUudG9TdHJpbmcoXCIyXCIpLnBhZFN0YXJ0KDgsIFwiMFwiKS5zcGxpdChcIlwiKTtcbiAgICAgICAgICBmb3IgKGxldCBCaXQgb2YgQmluQnl0ZSkge1xuICAgICAgICAgICAgaWYgKERhdGFbRGF0YUNdLnB1c2goQml0ID09IFwiMVwiKSA9PSBCaXRMZW5ndGgpIHtcbiAgICAgICAgICAgICAgaWYgKCsrRGF0YUMgPT0gMykge1xuICAgICAgICAgICAgICAgIE91dFB1dFtLZXldID0gRGF0YTtcbiAgICAgICAgICAgICAgICBNb2RlID0gXCJLZXlTaXplXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBPdXRQdXQ7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gUmVjb2duaXRpb25EYXRhO1xuIiwiaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi9SZWN0YW5nbGVcIjtcbmltcG9ydCBDb25uZWN0ZWRBcmVhUmVjb2duaXRpb24gZnJvbSBcIi4vQ29ubmVjdGVkQXJlYVJlY29nbml0aW9uXCI7XG5pbXBvcnQgTnVtYmVyc0hhc2hMaXN0IGZyb20gXCIuL0RhdGEvTnVtYmVySGFzaExpc3QuanNvblwiO1xuaW1wb3J0IFJlY29nbml0aW9uRGF0YSBmcm9tIFwiLi9EYXRhL1JlY29nbml0aW9uRGF0YVwiO1xuZm9yIChsZXQgaGFzaCBvZiBOdW1iZXJzSGFzaExpc3QpIHtcbiAgaWYgKGhhc2guaGFzaCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgaGFzaC5oYXNoID0gaGFzaC5oYXNoLm1hcCh2ID0+IHYgLyBoYXNoLmNvdW50KTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbVJlY29nbml0aW9uIHtcbiAgY29uc3RydWN0b3IoSW1hZ2VEYXRhLCBSdWxlcywgUmVjdCkge1xuICAgIGlmIChJbWFnZURhdGEgaW5zdGFuY2VvZiBSZWN0YW5nbGUpIHtcbiAgICAgIHRoaXMuQm91bmQgPSBJbWFnZURhdGE7XG4gICAgICB0aGlzLkNvbmZpZGVuY2UgPSB7XG4gICAgICAgIEl0ZW1JZDogLUluZmluaXR5LFxuICAgICAgICBDb3VudDogW11cbiAgICAgIH07XG4gICAgICB0aGlzLkl0ZW1JZCA9IFwiXCI7XG4gICAgICB0aGlzLkNvdW50ID0gTmFOO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLk1hdHJpeCA9IEltYWdlRGF0YTtcbiAgICB0aGlzLldpZHRoID0gSW1hZ2VEYXRhWzBdLmxlbmd0aDtcbiAgICB0aGlzLkhlaWdodCA9IEltYWdlRGF0YS5sZW5ndGg7XG4gICAgdGhpcy5JRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuQm91bmQgPSBSZWN0O1xuICAgIHRoaXMuUnVsZXMgPSBSdWxlcztcbiAgICB0aGlzLkNvbmZpZGVuY2UgPSB7XG4gICAgICBJdGVtSWQ6IC1JbmZpbml0eSxcbiAgICAgIENvdW50OiBbXVxuICAgIH07XG4gICAgdGhpcy5wcmVwYXJlKCk7XG4gICAgdGhpcy5JdGVtSWQgPSB0aGlzLmdldEl0ZW1JZCgpO1xuICAgIHRoaXMuQ291bnQgPSB0aGlzLmdldENvdW50KCk7XG4gICAgZGVsZXRlIHRoaXMuUnVsZXM7XG4gICAgZGVsZXRlIHRoaXMuSURhdGE7XG4gICAgZGVsZXRlIHRoaXMuSGVpZ2h0O1xuICAgIGRlbGV0ZSB0aGlzLldpZHRoO1xuICAgIGRlbGV0ZSB0aGlzLk1hdHJpeDtcbiAgfVxuICBwcmVwYXJlKCkge1xuICAgIGxldCBjeCA9IHRoaXMuTWF0cml4WzBdLmxlbmd0aCA+PiAxO1xuICAgIGxldCBjeSA9IHRoaXMuTWF0cml4Lmxlbmd0aCA+PiAxO1xuICAgIGxldCByID0gKGN4ICsgY3kpID4+IDE7XG5cbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuSGVpZ2h0OyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5XaWR0aDsgeCsrKSB7XG4gICAgICAgIGxldCBUZW1wQ29sb3IgPSB0aGlzLk1hdHJpeFt5XVt4XTtcbiAgICAgICAgaWYgKE1hdGguaHlwb3QoeCAtIGN4LCB5IC0gY3kpID4gcikgVGVtcENvbG9yID0gWzI1NSwgMjU1LCAyNTVdO1xuICAgICAgICB0aGlzLklEYXRhLnB1c2goLi4uVGVtcENvbG9yLCAyNTUpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLklEYXRhID0ge1xuICAgICAgZGF0YTogdGhpcy5JRGF0YSxcbiAgICAgIGhlaWdodDogdGhpcy5IZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy5XaWR0aFxuICAgIH07XG4gIH1cbiAgZ2V0SXRlbUlkKCkge1xuICAgIGxldCBJdGVtU291cmNlSGFzaCA9IFtdO1xuICAgIGxldCBDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIENhbnZhcy53aWR0aCA9IHRoaXMuV2lkdGg7XG4gICAgQ2FudmFzLmhlaWdodCA9IHRoaXMuSGVpZ2h0O1xuICAgIGxldCBDdHggPSBDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGxldCB0ZW1wSURhdGEgPSBDdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIENhbnZhcy53aWR0aCwgQ2FudmFzLmhlaWdodCk7XG4gICAgdGVtcElEYXRhLmRhdGEuc2V0KHRoaXMuSURhdGEuZGF0YSk7XG4gICAgQ3R4LnB1dEltYWdlRGF0YSh0ZW1wSURhdGEsIDAsIDApO1xuICAgIEN0eC5kcmF3SW1hZ2UoQ2FudmFzLCAwLCAwLCB0aGlzLldpZHRoLCB0aGlzLkhlaWdodCwgMCwgMCwgMTcsIDE2KTtcbiAgICB0ZW1wSURhdGEgPSBDdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDE3LCAxNik7XG4gICAgbGV0IENvbmZpZGVuY2UgPSAtSW5maW5pdHk7XG4gICAgbGV0IFJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChsZXQgUnVsZSBvZiB0aGlzLlJ1bGVzKSB7XG4gICAgICBpZiAoIUl0ZW1SZWNvZ25pdGlvbi5JdGVtU291cmNlSGFzaFtSdWxlLmlkXSkgY29udGludWU7XG4gICAgICBJdGVtU291cmNlSGFzaC5wdXNoKFtSdWxlLmlkLCBJdGVtUmVjb2duaXRpb24uSXRlbVNvdXJjZUhhc2hbUnVsZS5pZF1dKTtcbiAgICB9XG4gICAgZm9yIChsZXQgSXRlbUhhc2ggb2YgSXRlbVNvdXJjZUhhc2gpIHtcbiAgICAgIGxldCBDb25mID0gdGhpcy5Db21wYXJlSXRlbUhhc2goSXRlbUhhc2hbMV0sdGhpcy5nZXRSR0JESGFzaCh0ZW1wSURhdGEpKTtcbiAgICAgIGlmIChDb25mID4gQ29uZmlkZW5jZSkge1xuICAgICAgICBDb25maWRlbmNlID0gQ29uZjtcbiAgICAgICAgUmVzdWx0ID0gSXRlbUhhc2hbMF07XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuQ29uZmlkZW5jZS5JdGVtSWQgPSBDb25maWRlbmNlO1xuICAgIHJldHVybiBSZXN1bHQ7XG4gIH1cbiAgQ29tcGFyZUl0ZW1IYXNoKEhhc2gxLCBIYXNoMikge1xuICAgIGxldCBIYXNoMVN0cmluZyA9IFtdLmNvbmNhdCguLi5IYXNoMSk7XG4gICAgbGV0IEhhc2gyU3RyaW5nID0gW10uY29uY2F0KC4uLkhhc2gyKTtcbiAgICBsZXQgRGlzdGFuY2UgPSBNYXRoLmFicyhIYXNoMVN0cmluZy5sZW5ndGggLSBIYXNoMlN0cmluZy5sZW5ndGgpO1xuICAgIGxldCBFbmRpZHggPSBNYXRoLm1pbihIYXNoMVN0cmluZy5sZW5ndGgsIEhhc2gyU3RyaW5nLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgRW5kaWR4OyBpZHgrKykge1xuICAgICAgaWYgKEhhc2gxU3RyaW5nW2lkeF0gIT0gSGFzaDJTdHJpbmdbaWR4XSkge1xuICAgICAgICBEaXN0YW5jZSArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gTWF0aC5tYXgoSGFzaDFTdHJpbmcubGVuZ3RoLCBIYXNoMlN0cmluZy5sZW5ndGgpIC0gRGlzdGFuY2U7XG4gIH1cbiAgZ2V0Q291bnQoKSB7XG4gICAgaWYgKHRoaXMuSXRlbUlkID09IFwiXCIpIHtcbiAgICAgIHJldHVybiBOYU47XG4gICAgfVxuICAgIGxldCBSYW5nZSA9IHRoaXMuUnVsZXMuZmluZCh2ID0+IHYuaWQgPT0gdGhpcy5JdGVtSWQpO1xuICAgIGlmIChSYW5nZSkge1xuICAgICAgUmFuZ2UgPSBSYW5nZS5yYW5nZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgTnVtUmFuZ2UgPSBbUmFuZ2UudXBwZXIgPiA5ID8gMCA6IE1hdGgubWF4KDEsIFJhbmdlLmxvd2VyKSwgTWF0aC5taW4oOSwgUmFuZ2UudXBwZXIpXTtcbiAgICBsZXQgTnVtTGlzdCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSBOdW1SYW5nZVswXTsgaSA8PSBOdW1SYW5nZVsxXTsgaSsrKSB7XG4gICAgICBOdW1MaXN0LnB1c2goaSk7XG4gICAgfVxuICAgIGlmIChOdW1MaXN0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICB0aGlzLkNvbmZpZGVuY2UuQ291bnRbMF0gPSAxO1xuICAgICAgcmV0dXJuIE51bUxpc3RbMF07XG4gICAgfVxuICAgIGxldCBYU3RhcnQgPSBmYWxzZSxcbiAgICAgIFhFbmQgPSBmYWxzZSxcbiAgICAgIFlTdGFydCA9IDAsXG4gICAgICBGaW5kID0gZmFsc2U7XG4gICAgbGV0IE51bWJlclJlY3QgPSBuZXcgUmVjdGFuZ2xlKCk7XG4gICAgZm9yIChsZXQgeSA9IHRoaXMuSGVpZ2h0ID4+IDE7IHkgPCB0aGlzLkhlaWdodDsgeSsrKSB7XG4gICAgICBYU3RhcnQgPSBmYWxzZTtcbiAgICAgIFhFbmQgPSBmYWxzZTtcbiAgICAgIGZvciAobGV0IHggPSB0aGlzLldpZHRoID4+IDE7IHggPCB0aGlzLldpZHRoOyB4KyspIHtcbiAgICAgICAgbGV0IEdyZXlVcCA9IGRpc3RhbmNlID0+XG4gICAgICAgICAgKHRoaXMuTWF0cml4W3kgLSBkaXN0YW5jZV1beF1bMF0gKyB0aGlzLk1hdHJpeFt5IC0gZGlzdGFuY2VdW3hdWzFdICsgdGhpcy5NYXRyaXhbeSAtIGRpc3RhbmNlXVt4XVsyXSkgLyAzO1xuICAgICAgICBsZXQgR3JleU5vdyA9ICh0aGlzLk1hdHJpeFt5XVt4XVswXSArIHRoaXMuTWF0cml4W3ldW3hdWzFdICsgdGhpcy5NYXRyaXhbeV1beF1bMl0pIC8gMztcbiAgICAgICAgaWYgKFxuICAgICAgICAgICh0aGlzLkl0ZW1JZCA9PSBcIjMzMDFcIlxuICAgICAgICAgICAgPyBNYXRoLmFicyhHcmV5Tm93IC0gR3JleVVwKDEpKVxuICAgICAgICAgICAgOiBNYXRoLm1heChNYXRoLmFicyhHcmV5Tm93IC0gR3JleVVwKDEpKSwgTWF0aC5hYnMoR3JleU5vdyAtIEdyZXlVcCgyKSksIEdyZXlOb3cgLSBHcmV5VXAoMykpKSA+IDIwXG4gICAgICAgICkge1xuICAgICAgICAgIGlmICghWFN0YXJ0KSB7XG4gICAgICAgICAgICBYU3RhcnQgPSB4O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBYRW5kID0geDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFhFbmQgLSBYU3RhcnQgKyAxID4gMjApIHtcbiAgICAgICAgICAgIEZpbmQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFhTdGFydCA9IGZhbHNlO1xuICAgICAgICAgICAgWEVuZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKEZpbmQpIHtcbiAgICAgICAgWVN0YXJ0ID0geTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChGaW5kKSB7XG4gICAgICBOdW1iZXJSZWN0LnVwZGF0ZSh7XG4gICAgICAgIGxlZnQ6IFhTdGFydCxcbiAgICAgICAgcmlnaHQ6IFhFbmQsXG4gICAgICAgIHRvcDogWVN0YXJ0LFxuICAgICAgICBib3R0b206IE1hdGgucm91bmQodGhpcy5Cb3VuZC5oZWlnaHQgLSB0aGlzLkJvdW5kLmhlaWdodCAqIDAuMDgpXG4gICAgICB9KTtcbiAgICAgIC8qIGNvbnNvbGUubG9nKHtcbiAgICAgICAgbGVmdDogTnVtYmVyUmVjdC5sZWZ0ICsgdGhpcy5Cb3VuZC5sZWZ0LFxuICAgICAgICByaWdodDogTnVtYmVyUmVjdC5yaWdodCArIHRoaXMuQm91bmQubGVmdCxcbiAgICAgICAgdG9wOiBOdW1iZXJSZWN0LnRvcCArIHRoaXMuQm91bmQudG9wLFxuICAgICAgICBib3R0b206IE51bWJlclJlY3QuYm90dG9tICsgdGhpcy5Cb3VuZC50b3BcbiAgICAgIH0pOyovXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IE51bWJlck1hcnRpeCA9IFtdO1xuICAgIGxldCBOdW1iZXJOb2RlcyA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IE51bWJlclJlY3QuaGVpZ2h0OyB5KyspIHtcbiAgICAgIE51bWJlck1hcnRpeC5wdXNoKFtdKTtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgTnVtYmVyUmVjdC53aWR0aDsgeCsrKSB7XG4gICAgICAgIGxldCBbUiwgRywgQl0gPSB0aGlzLk1hdHJpeFt5ICsgTnVtYmVyUmVjdC50b3BdW3ggKyBOdW1iZXJSZWN0LmxlZnRdO1xuICAgICAgICBsZXQgR3JleSA9IChSICsgRyArIEIpIC8gMztcbiAgICAgICAgaWYgKEdyZXkgPj0gMTIwKSB7XG4gICAgICAgICAgTnVtYmVyTWFydGl4W3ldW3hdID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChHcmV5IDwgMTIwICYmIEdyZXkgPiAxMDUpIHtcbiAgICAgICAgICBsZXQgbGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tO1xuICAgICAgICAgIGlmICh4ICE9PSAwKSB7XG4gICAgICAgICAgICBsZWZ0ID0gdGhpcy5NYXRyaXhbeSArIE51bWJlclJlY3QudG9wXVt4ICsgTnVtYmVyUmVjdC5sZWZ0IC0gMV0ucmVkdWNlKChhLCBiKSA9PiBhICsgYikgLyAzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeCAhPT0gTnVtYmVyUmVjdC53aWR0aCAtIDEpIHtcbiAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy5NYXRyaXhbeSArIE51bWJlclJlY3QudG9wXVt4ICsgTnVtYmVyUmVjdC5sZWZ0ICsgMV0ucmVkdWNlKChhLCBiKSA9PiBhICsgYikgLyAzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeSAhPSAwKSB7XG4gICAgICAgICAgICB0b3AgPSB0aGlzLk1hdHJpeFt5ICsgTnVtYmVyUmVjdC50b3AgLSAxXVt4ICsgTnVtYmVyUmVjdC5sZWZ0XS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKSAvIDM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh5ICE9PSBOdW1iZXJSZWN0LmhlaWdodCAtIDEpIHtcbiAgICAgICAgICAgIGJvdHRvbSA9IHRoaXMuTWF0cml4W3kgKyBOdW1iZXJSZWN0LnRvcCArIDFdW3ggKyBOdW1iZXJSZWN0LmxlZnRdLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpIC8gMztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKChsZWZ0ICYmIGxlZnQgPiAxMjApIHx8IChyaWdodCAmJiByaWdodCA+IDEyMCkgfHwgKHRvcCAmJiB0b3AgPiAxMjApIHx8IChib3R0b20gJiYgYm90dG9tID4gMTIwKSkge1xuICAgICAgICAgICAgTnVtYmVyTWFydGl4W3ldW3hdID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgTnVtYmVyTWFydGl4W3ldW3hdID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE51bWJlck1hcnRpeFt5XVt4XSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIE51bWJlck1hcnRpeFt5XVt4XSA9IEdyZXkgPiA4MDtcbiAgICAgICAgaWYgKE51bWJlck1hcnRpeFt5XVt4XSkge1xuICAgICAgICAgIE51bWJlck5vZGVzLmFkZCh4ICogMTAwMDAgKyB5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgR2V0QWxsTnVtYmVyID0gbmV3IENvbm5lY3RlZEFyZWFSZWNvZ25pdGlvbihOdW1iZXJNYXJ0aXgsIE51bWJlck5vZGVzLCB0cnVlKTtcbiAgICBsZXQgVGVtcENvdW50ID0gXCJcIjtcbiAgICBsZXQgUmVzdWx0ID0gR2V0QWxsTnVtYmVyLkdldEFsbENvbm5lY3RlZEFyZWEoUmVjdCA9PiB7XG4gICAgICAvL2NvbnNvbGUubG9nKFJlY3QpO1xuICAgICAgaWYgKFxuICAgICAgICBSZWN0LnBvaW50IDwgMjAgfHxcbiAgICAgICAgUmVjdC53aWR0aCA+IFJlY3QuaGVpZ2h0IHx8XG4gICAgICAgIFJlY3QuaGVpZ2h0IDwgOCB8fFxuICAgICAgICBSZWN0LndpZHRoIDwgMyB8fFxuICAgICAgICBOdW1iZXJSZWN0LndpZHRoIC0gUmVjdC5sZWZ0IDwgNSB8fFxuICAgICAgICBSZWN0LmxlZnQgPCA1XG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFJlY3Q7XG4gICAgfSkuc29ydCgoYSwgYikgPT4gYS5sZWZ0IC0gYi5sZWZ0KTtcbiAgICBsZXQgTnVtQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBOdW1DYW52YXMud2lkdGggPSA5O1xuICAgIE51bUNhbnZhcy5oZWlnaHQgPSAxMDtcbiAgICBsZXQgTnVtQ3R4ID0gTnVtQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBmb3IgKGxldCBOdW0gb2YgUmVzdWx0KSB7XG4gICAgICBsZXQgQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIENhbnZhcy53aWR0aCA9IE51bS53aWR0aDtcbiAgICAgIENhbnZhcy5oZWlnaHQgPSBOdW0uaGVpZ2h0O1xuICAgICAgbGV0IEN0eCA9IENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBsZXQgSW1nRGF0YSA9IEN0eC5nZXRJbWFnZURhdGEoMCwgMCwgQ2FudmFzLndpZHRoLCBDYW52YXMuaGVpZ2h0KTtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgTnVtLmhlaWdodDsgeSsrKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgTnVtLndpZHRoOyB4KyspIHtcbiAgICAgICAgICBsZXQgSW5kZXggPSAoeSAqIENhbnZhcy53aWR0aCArIHgpICogNDtcbiAgICAgICAgICBpZiAoTnVtLm1hdHJpeFt5XVt4XSkge1xuICAgICAgICAgICAgSW1nRGF0YS5kYXRhW0luZGV4XSA9IDA7XG4gICAgICAgICAgICBJbWdEYXRhLmRhdGFbSW5kZXggKyAxXSA9IDA7XG4gICAgICAgICAgICBJbWdEYXRhLmRhdGFbSW5kZXggKyAyXSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEltZ0RhdGEuZGF0YVtJbmRleF0gPSAyNTU7XG4gICAgICAgICAgICBJbWdEYXRhLmRhdGFbSW5kZXggKyAxXSA9IDI1NTtcbiAgICAgICAgICAgIEltZ0RhdGEuZGF0YVtJbmRleCArIDJdID0gMjU1O1xuICAgICAgICAgIH1cbiAgICAgICAgICBJbWdEYXRhLmRhdGFbSW5kZXggKyAzXSA9IDI1NTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgQ3R4LnB1dEltYWdlRGF0YShJbWdEYXRhLCAwLCAwKTtcbiAgICAgIE51bUN0eC5jbGVhclJlY3QoMCwgMCwgTnVtQ2FudmFzLndpZHRoLCBOdW1DYW52YXMuaGVpZ2h0KTtcbiAgICAgIE51bUN0eC5kcmF3SW1hZ2UoQ2FudmFzLCAwLCAwLCBDYW52YXMud2lkdGgsIENhbnZhcy5oZWlnaHQsIDAsIDAsIE51bUNhbnZhcy53aWR0aCwgTnVtQ2FudmFzLmhlaWdodCk7XG4gICAgICBsZXQgREhhc2ggPSB0aGlzLmdldERIYXNoKE51bUN0eC5nZXRJbWFnZURhdGEoMCwgMCwgTnVtQ2FudmFzLndpZHRoLCBOdW1DYW52YXMuaGVpZ2h0KSk7XG4gICAgICBsZXQgTnVtYmVyUmVzdWx0ID0gdGhpcy5kSGFzaHRvTnVtYmVyKERIYXNoLCBOdW1MaXN0KTtcbiAgICAgIFRlbXBDb3VudCArPSBOdW1iZXJSZXN1bHQuTnVtO1xuICAgICAgdGhpcy5Db25maWRlbmNlLkNvdW50LnB1c2goTnVtYmVyUmVzdWx0LkNvbmZpZGVuY2UpO1xuICAgIH1cbiAgICByZXR1cm4gTnVtYmVyKFRlbXBDb3VudCk7XG4gIH1cbiAgZ2V0REhhc2goaXRlbSkge1xuICAgIGxldCBIYXNoU3RyaW5nID0gXCJcIjtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgaXRlbS5kYXRhLmxlbmd0aDsgaW5kZXggKz0gNCkge1xuICAgICAgaWYgKE1hdGguZmxvb3IoaW5kZXggLyA0KSAlIGl0ZW0ud2lkdGggPT0gMCkgY29udGludWU7XG4gICAgICBpZiAoXG4gICAgICAgIE1hdGguZmxvb3IoKGl0ZW0uZGF0YVtpbmRleCAtIDRdICsgaXRlbS5kYXRhW2luZGV4IC0gM10gKyBpdGVtLmRhdGFbaW5kZXggLSAyXSkgLyAzKSA+XG4gICAgICAgIE1hdGguZmxvb3IoKGl0ZW0uZGF0YVtpbmRleF0gKyBpdGVtLmRhdGFbaW5kZXggKyAxXSArIGl0ZW0uZGF0YVtpbmRleCArIDJdKSAvIDMpXG4gICAgICApIHtcbiAgICAgICAgSGFzaFN0cmluZyArPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgSGFzaFN0cmluZyArPSAwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSGFzaFN0cmluZztcbiAgfVxuICBnZXRSR0JESGFzaChpdGVtKSB7XG4gICAgbGV0IEhhc2ggPSBbW10sIFtdLCBbXV07XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGl0ZW0uZGF0YS5sZW5ndGg7IGluZGV4ICs9IDQpIHtcbiAgICAgIGlmIChNYXRoLmZsb29yKGluZGV4IC8gNCkgJSBpdGVtLndpZHRoID09IDApIGNvbnRpbnVlO1xuICAgICAgSGFzaFswXS5wdXNoKGl0ZW0uZGF0YVtpbmRleCAtIDRdID4gaXRlbS5kYXRhW2luZGV4XSk7XG4gICAgICBIYXNoWzFdLnB1c2goaXRlbS5kYXRhW2luZGV4IC0gM10gPiBpdGVtLmRhdGFbaW5kZXggKyAxXSk7XG4gICAgICBIYXNoWzJdLnB1c2goaXRlbS5kYXRhW2luZGV4IC0gMl0gPiBpdGVtLmRhdGFbaW5kZXggKyAyXSk7XG4gICAgfVxuICAgIHJldHVybiBIYXNoO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoYXNoXG4gICAqIEBwYXJhbSB7YXJyYXl9IE51bWJlcnNcbiAgICovXG4gIGRIYXNodG9OdW1iZXIoaGFzaCwgTnVtYmVycykge1xuICAgIGxldCBOdW1Db25maWRlbmNlID0gLUluZmluaXR5O1xuICAgIGxldCBOdW0gPSBOYU47XG4gICAgbGV0IEFsbExlbmd0aCA9IDgwO1xuICAgIGxldCBOdW1zSGFzaExpc3QgPSBOdW1iZXJzSGFzaExpc3QuZmlsdGVyKHYgPT4gTnVtYmVycy5pbmNsdWRlcyh2Lm51bWJlcikpO1xuICAgIGZvciAobGV0IE51bWJlckRIYXNoIG9mIE51bXNIYXNoTGlzdCkge1xuICAgICAgbGV0IENvbmZpZGVuY2UgPSAwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYXNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChoYXNoW2ldID09IFwiMVwiKSB7XG4gICAgICAgICAgQ29uZmlkZW5jZSArPSBOdW1iZXJESGFzaC5oYXNoW2ldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIENvbmZpZGVuY2UgKz0gMSAtIE51bWJlckRIYXNoLmhhc2hbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIENvbmZpZGVuY2UgLz0gQWxsTGVuZ3RoO1xuICAgICAgaWYgKENvbmZpZGVuY2UgPiBOdW1Db25maWRlbmNlKSB7XG4gICAgICAgIE51bUNvbmZpZGVuY2UgPSBDb25maWRlbmNlO1xuICAgICAgICBOdW0gPSBOdW1iZXJESGFzaC5udW1iZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBOdW06IE51bSxcbiAgICAgIENvbmZpZGVuY2U6IE51bUNvbmZpZGVuY2VcbiAgICB9O1xuICB9XG4gIHN0YXRpYyBpbml0KGJsb2IpIHtcbiAgICBsZXQgUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICBSZWFkZXIub25sb2FkID0gKCkgPT4ge1xuICAgICAgdGhpcy5JdGVtU291cmNlSGFzaCA9IFJlY29nbml0aW9uRGF0YS5EZWNvZGUobmV3IFVpbnQ4QXJyYXkoUmVhZGVyLnJlc3VsdCkpO1xuICAgIH07XG4gICAgUmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpO1xuICB9XG59XG4iLCJpbXBvcnQgUmVjdFJlY29nbml0aW9uIGZyb20gXCIuL1JlY3RSZWNvZ25pdGlvblwiO1xuaW1wb3J0IFN0YWdlUmVjb2duaXRpb24gZnJvbSBcIi4vU3RhZ2VSZWNvZ25pdGlvblwiO1xuaW1wb3J0IEl0ZW1SZWNvZ25pdGlvbiBmcm9tIFwiLi9JdGVtUmVjb2duaXRpb25cIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyb3BzUmVjb2duaXRpb24ge1xuICBjb25zdHJ1Y3RvcihpbWcpIHtcbiAgICB0aGlzLkltYWdlID0gaW1nO1xuICAgIHRoaXMuQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAvL2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5DYW52YXMpO1xuICAgIHRoaXMuQ2FudmFzLndpZHRoID0gaW1nLndpZHRoO1xuICAgIHRoaXMuQ2FudmFzLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgdGhpcy5jdHggPSB0aGlzLkNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjMDBmZjAwXCI7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcIiMwMGZmMDBcIjtcbiAgICB0aGlzLnJhd0ltYWdlRGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xuICAgIHRoaXMubWF0cml4SW1hZ2VEYXRhID0gW1tdXTtcbiAgICB0aGlzLkJvdW5kRGF0YSA9IHt9O1xuICAgIHRoaXMuU3RhZ2UgPSB7fTtcbiAgICB0aGlzLkl0ZW1zID0gW107XG4gICAgZm9yIChsZXQgaW5kZXggPSAwLCB4ID0gMCwgeSA9IDA7IGluZGV4IDwgdGhpcy5yYXdJbWFnZURhdGEuZGF0YS5sZW5ndGg7IGluZGV4ICs9IDQpIHtcbiAgICAgIHRoaXMubWF0cml4SW1hZ2VEYXRhW3ldW3hdID0gW1xuICAgICAgICB0aGlzLnJhd0ltYWdlRGF0YS5kYXRhW2luZGV4XSxcbiAgICAgICAgdGhpcy5yYXdJbWFnZURhdGEuZGF0YVtpbmRleCArIDFdLFxuICAgICAgICB0aGlzLnJhd0ltYWdlRGF0YS5kYXRhW2luZGV4ICsgMl1cbiAgICAgIF07XG4gICAgICBpZiAoKyt4ID09IGltZy53aWR0aCkge1xuICAgICAgICB4ID0gMDtcbiAgICAgICAgaWYgKCsreSAhPSBpbWcuaGVpZ2h0KSB0aGlzLm1hdHJpeEltYWdlRGF0YS5wdXNoKFtdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5SZWN0UmVjb2duaXRpb24oKTtcbiAgICBpZiAodGhpcy5EZWJ1Zykge1xuICAgICAgZm9yIChsZXQgUmVjdCBvZiB0aGlzLkJvdW5kRGF0YS5tZXJnZWRSZWN0cy5SaWdodCkge1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VSZWN0KFJlY3QubGVmdCwgUmVjdC50b3AsIFJlY3Qud2lkdGgsIFJlY3QuaGVpZ2h0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gXCIjZmYwMDAwXCI7XG4gICAgICB0aGlzLmN0eC5zdHJva2VSZWN0KFxuICAgICAgICB0aGlzLkJvdW5kRGF0YS5TdGFnZS5sZWZ0LFxuICAgICAgICB0aGlzLkJvdW5kRGF0YS5TdGFnZS50b3AsXG4gICAgICAgIHRoaXMuQm91bmREYXRhLlN0YWdlLndpZHRoLFxuICAgICAgICB0aGlzLkJvdW5kRGF0YS5TdGFnZS5oZWlnaHRcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuZGV0ZWN0U3RhZ2UoKTtcbiAgICB0aGlzLmRldGVjdEZ1cm5pdHVyZSgpO1xuICAgIHRoaXMuZGV0ZWN0SXRlbSgpO1xuICAgIGRlbGV0ZSB0aGlzLmN0eDtcbiAgICBkZWxldGUgdGhpcy5DYW52YXM7XG4gICAgZGVsZXRlIHRoaXMubWF0cml4SW1hZ2VEYXRhO1xuICAgIGRlbGV0ZSB0aGlzLnJhd0ltYWdlRGF0YTtcbiAgICBkZWxldGUgdGhpcy5JbWFnZTtcbiAgfVxuICAvKipcbiAgICog6K+G5Yir5Zu+5YOP6L6555WMXG4gICAqL1xuICBSZWN0UmVjb2duaXRpb24oKSB7XG4gICAgdGhpcy5Cb3VuZERhdGEgPSBuZXcgUmVjdFJlY29nbml0aW9uKHRoaXMubWF0cml4SW1hZ2VEYXRhKTtcbiAgfVxuICBkZXRlY3RGdXJuaXR1cmUoKSB7XG4gICAgbGV0IERldGVjdFR5cGUgPSBbXCJMVUNLWV9EUk9QXCIsIFwiU1BFQ0lBTF9EUk9QXCIsIFwiQUxMX0RST1BcIl07XG4gICAgZm9yIChsZXQgUmVjdCBvZiB0aGlzLkJvdW5kRGF0YS5JdGVtcykge1xuICAgICAgaWYgKERldGVjdFR5cGUuaW5jbHVkZXMoUmVjdC50eXBlKSkge1xuICAgICAgICBsZXQgT3RoZXJJdGVtcyA9IHRoaXMuQm91bmREYXRhLkl0ZW1zLmZpbHRlcihhID0+IGEgIT0gUmVjdCk7XG4gICAgICAgIGxldCBBcmVhRGlmZiA9XG4gICAgICAgICAgT3RoZXJJdGVtcy5yZWR1Y2UoKGEsIE90aGVySXRlbSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEgKyBNYXRoLmFicyhPdGhlckl0ZW0uYXJlYSAtIFJlY3QuYXJlYSk7XG4gICAgICAgICAgfSwgMCkgLyBPdGhlckl0ZW1zLmxlbmd0aDtcbiAgICAgICAgaWYgKEFyZWFEaWZmID4gMTAwMCkge1xuICAgICAgICAgIFJlY3QudHlwZSA9IFwiTFVDS1lfRFJPUFwiO1xuICAgICAgICAgIFJlY3QuQXJlYURpZmYgPSBBcmVhRGlmZjtcbiAgICAgICAgfSBlbHNlIGlmICgoUmVjdC50eXBlID09IFwiTFVDS1lfRFJPUFwiKSkge1xuICAgICAgICAgIFJlY3QudHlwZSA9PSBcIlNQRUNJQUxfRFJPUFwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGRldGVjdEl0ZW0oKSB7XG4gICAgbGV0IERldGVjdFR5cGUgPSBbXCJOT1JNQUxfRFJPUFwiLCBcIkVYVFJBX0RST1BcIiwgXCJTUEVDSUFMX0RST1BcIiwgXCJBTExfRFJPUFwiXTtcbiAgICBmb3IgKGxldCBSZWN0IG9mIHRoaXMuQm91bmREYXRhLkl0ZW1zKSB7XG4gICAgICBsZXQgVHlwZSA9IFJlY3QudHlwZTtcbiAgICAgIGRlbGV0ZSBSZWN0LnR5cGU7XG4gICAgICBsZXQgUmVzdWx0ID0geyB0eXBlOiBUeXBlIH07XG4gICAgICBpZiAoRGV0ZWN0VHlwZS5pbmNsdWRlcyhUeXBlKSkge1xuICAgICAgICBsZXQgRHJvcExpc3QgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgRHJvcCBvZiBEcm9wc1JlY29nbml0aW9uLlN0YWdlW3RoaXMuU3RhZ2UuQ29kZV0uZHJvcEluZm9zKSB7XG4gICAgICAgICAgaWYgKChEcm9wLmRyb3BUeXBlID09IFR5cGUgfHwgVHlwZSA9PSBcIkFMTF9EUk9QXCIpICYmIERyb3AuaXRlbUlkICYmIERyb3AuaXRlbUlkICE9IFwiZnVybmlcIikge1xuICAgICAgICAgICAgRHJvcExpc3QucHVzaCh7IGlkOiBEcm9wLml0ZW1JZCwgcmFuZ2U6IERyb3AuYm91bmRzIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhUeXBlKTtcbiAgICAgICAgbGV0IEl0ZW0gPSBuZXcgSXRlbVJlY29nbml0aW9uKFxuICAgICAgICAgIHRoaXMuZ2V0SW1hZ2VNYXRyaXgoUmVjdC5sZWZ0LCBSZWN0LnRvcCwgUmVjdC5yaWdodCwgUmVjdC5ib3R0b20pLFxuICAgICAgICAgIERyb3BMaXN0LFxuICAgICAgICAgIFJlY3RcbiAgICAgICAgKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihSZXN1bHQsIEl0ZW0pO1xuICAgICAgfSBlbHNlIGlmIChUeXBlID09IFwiTFVDS1lfRFJPUFwiKSB7XG4gICAgICAgIGxldCBJdGVtID0gbmV3IEl0ZW1SZWNvZ25pdGlvbihSZWN0KTtcbiAgICAgICAgSXRlbS5JdGVtSWQgPSBcImZ1cm5pXCI7XG4gICAgICAgIEl0ZW0uQ291bnQgPSAxO1xuICAgICAgICBJdGVtLkNvbmZpZGVuY2UuQ291bnQgPSBbMV07XG5cbiAgICAgICAgSXRlbS5Db25maWRlbmNlLkl0ZW1JZCA9IChyYXRpbyA9PiB7XG4gICAgICAgICAgaWYgKHJhdGlvID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCByYW5nZSxsaW5lYXJfdmFsO1xuICAgICAgICAgIGlmIChyYXRpbyA8IDAuNSkge1xuICAgICAgICAgICAgcmFuZ2UgPSAxLjAgLSAwLjU7XG4gICAgICAgICAgICBsaW5lYXJfdmFsID0gcmF0aW8gLyAocmFuZ2UgKiAyLjApO1xuICAgICAgICAgICAgcmV0dXJuIGxpbmVhcl92YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJhbmdlID0gMC41O1xuICAgICAgICAgICAgbGluZWFyX3ZhbCA9IHJhdGlvIC8gKHJhbmdlICogMi4wKTtcbiAgICAgICAgICAgIHJldHVybiBsaW5lYXJfdmFsICsgKDEuMCAtIGxpbmVhcl92YWwpICogTWF0aC5wb3coKGxpbmVhcl92YWwgLSAwLjUpICogMiwgMC4yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKFJlY3QuQXJlYURpZmYvMjAwMCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oUmVzdWx0LCBJdGVtKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuSXRlbXMucHVzaChSZXN1bHQpO1xuICAgIH1cbiAgfVxuICBnZXRJbWFnZU1hdHJpeCh4MSwgeTEsIHgyLCB5Mikge1xuICAgIGxldCBNYXRyaXggPSBbXTtcbiAgICBmb3IgKGxldCB5ID0geTE7IHkgPD0geTI7IHkrKykge1xuICAgICAgbGV0IHJ5ID0gTWF0cml4LnB1c2goW10pIC0gMTtcbiAgICAgIGZvciAobGV0IHggPSB4MSwgcnggPSAwOyB4IDw9IHgyOyB4KyssIHJ4KyspIHtcbiAgICAgICAgTWF0cml4W3J5XVtyeF0gPSBbXS5jb25jYXQodGhpcy5tYXRyaXhJbWFnZURhdGFbeV1beF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gTWF0cml4O1xuICB9XG4gIGRldGVjdFN0YWdlKCkge1xuICAgIFt0aGlzLlN0YWdlLkNvZGUsIHRoaXMuU3RhZ2UuQ29uZmlkZW5jZV0gPSBTdGFnZVJlY29nbml0aW9uKFxuICAgICAgdGhpcy5nZXRJbWFnZU1hdHJpeChcbiAgICAgICAgdGhpcy5Cb3VuZERhdGEuU3RhZ2UubGVmdCxcbiAgICAgICAgdGhpcy5Cb3VuZERhdGEuU3RhZ2UudG9wLFxuICAgICAgICB0aGlzLkJvdW5kRGF0YS5TdGFnZS5yaWdodCxcbiAgICAgICAgdGhpcy5Cb3VuZERhdGEuU3RhZ2UuYm90dG9tXG4gICAgICApXG4gICAgKTtcbiAgfVxuICBzdGF0aWMgaW5pdChkYXRhTmFtZSwgRGF0YSkge1xuICAgIHN3aXRjaCAoZGF0YU5hbWUpIHtcbiAgICAgIGNhc2UgXCJTdGFnZVwiOlxuICAgICAgICB0aGlzLlN0YWdlID0gRGF0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiSXRlbUltYWdlXCI6XG4gICAgICAgIEl0ZW1SZWNvZ25pdGlvbi5pbml0KERhdGEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cbiIsIi8qIFdlYiBGb250IExvYWRlciB2MS42LjI4IC0gKGMpIEFkb2JlIFN5c3RlbXMsIEdvb2dsZS4gTGljZW5zZTogQXBhY2hlIDIuMCAqLyhmdW5jdGlvbigpe2Z1bmN0aW9uIGFhKGEsYixjKXtyZXR1cm4gYS5jYWxsLmFwcGx5KGEuYmluZCxhcmd1bWVudHMpfWZ1bmN0aW9uIGJhKGEsYixjKXtpZighYSl0aHJvdyBFcnJvcigpO2lmKDI8YXJndW1lbnRzLmxlbmd0aCl7dmFyIGQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpO3JldHVybiBmdW5jdGlvbigpe3ZhciBjPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7QXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoYyxkKTtyZXR1cm4gYS5hcHBseShiLGMpfX1yZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYS5hcHBseShiLGFyZ3VtZW50cyl9fWZ1bmN0aW9uIHAoYSxiLGMpe3A9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQmJi0xIT1GdW5jdGlvbi5wcm90b3R5cGUuYmluZC50b1N0cmluZygpLmluZGV4T2YoXCJuYXRpdmUgY29kZVwiKT9hYTpiYTtyZXR1cm4gcC5hcHBseShudWxsLGFyZ3VtZW50cyl9dmFyIHE9RGF0ZS5ub3d8fGZ1bmN0aW9uKCl7cmV0dXJuK25ldyBEYXRlfTtmdW5jdGlvbiBjYShhLGIpe3RoaXMuYT1hO3RoaXMubz1ifHxhO3RoaXMuYz10aGlzLm8uZG9jdW1lbnR9dmFyIGRhPSEhd2luZG93LkZvbnRGYWNlO2Z1bmN0aW9uIHQoYSxiLGMsZCl7Yj1hLmMuY3JlYXRlRWxlbWVudChiKTtpZihjKWZvcih2YXIgZSBpbiBjKWMuaGFzT3duUHJvcGVydHkoZSkmJihcInN0eWxlXCI9PWU/Yi5zdHlsZS5jc3NUZXh0PWNbZV06Yi5zZXRBdHRyaWJ1dGUoZSxjW2VdKSk7ZCYmYi5hcHBlbmRDaGlsZChhLmMuY3JlYXRlVGV4dE5vZGUoZCkpO3JldHVybiBifWZ1bmN0aW9uIHUoYSxiLGMpe2E9YS5jLmdldEVsZW1lbnRzQnlUYWdOYW1lKGIpWzBdO2F8fChhPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7YS5pbnNlcnRCZWZvcmUoYyxhLmxhc3RDaGlsZCl9ZnVuY3Rpb24gdihhKXthLnBhcmVudE5vZGUmJmEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhKX1cbmZ1bmN0aW9uIHcoYSxiLGMpe2I9Ynx8W107Yz1jfHxbXTtmb3IodmFyIGQ9YS5jbGFzc05hbWUuc3BsaXQoL1xccysvKSxlPTA7ZTxiLmxlbmd0aDtlKz0xKXtmb3IodmFyIGY9ITEsZz0wO2c8ZC5sZW5ndGg7Zys9MSlpZihiW2VdPT09ZFtnXSl7Zj0hMDticmVha31mfHxkLnB1c2goYltlXSl9Yj1bXTtmb3IoZT0wO2U8ZC5sZW5ndGg7ZSs9MSl7Zj0hMTtmb3IoZz0wO2c8Yy5sZW5ndGg7Zys9MSlpZihkW2VdPT09Y1tnXSl7Zj0hMDticmVha31mfHxiLnB1c2goZFtlXSl9YS5jbGFzc05hbWU9Yi5qb2luKFwiIFwiKS5yZXBsYWNlKC9cXHMrL2csXCIgXCIpLnJlcGxhY2UoL15cXHMrfFxccyskLyxcIlwiKX1mdW5jdGlvbiB5KGEsYil7Zm9yKHZhciBjPWEuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyksZD0wLGU9Yy5sZW5ndGg7ZDxlO2QrKylpZihjW2RdPT1iKXJldHVybiEwO3JldHVybiExfVxuZnVuY3Rpb24gZWEoYSl7cmV0dXJuIGEuby5sb2NhdGlvbi5ob3N0bmFtZXx8YS5hLmxvY2F0aW9uLmhvc3RuYW1lfWZ1bmN0aW9uIHooYSxiLGMpe2Z1bmN0aW9uIGQoKXttJiZlJiZmJiYobShnKSxtPW51bGwpfWI9dChhLFwibGlua1wiLHtyZWw6XCJzdHlsZXNoZWV0XCIsaHJlZjpiLG1lZGlhOlwiYWxsXCJ9KTt2YXIgZT0hMSxmPSEwLGc9bnVsbCxtPWN8fG51bGw7ZGE/KGIub25sb2FkPWZ1bmN0aW9uKCl7ZT0hMDtkKCl9LGIub25lcnJvcj1mdW5jdGlvbigpe2U9ITA7Zz1FcnJvcihcIlN0eWxlc2hlZXQgZmFpbGVkIHRvIGxvYWRcIik7ZCgpfSk6c2V0VGltZW91dChmdW5jdGlvbigpe2U9ITA7ZCgpfSwwKTt1KGEsXCJoZWFkXCIsYil9XG5mdW5jdGlvbiBBKGEsYixjLGQpe3ZhciBlPWEuYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07aWYoZSl7dmFyIGY9dChhLFwic2NyaXB0XCIse3NyYzpifSksZz0hMTtmLm9ubG9hZD1mLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2d8fHRoaXMucmVhZHlTdGF0ZSYmXCJsb2FkZWRcIiE9dGhpcy5yZWFkeVN0YXRlJiZcImNvbXBsZXRlXCIhPXRoaXMucmVhZHlTdGF0ZXx8KGc9ITAsYyYmYyhudWxsKSxmLm9ubG9hZD1mLm9ucmVhZHlzdGF0ZWNoYW5nZT1udWxsLFwiSEVBRFwiPT1mLnBhcmVudE5vZGUudGFnTmFtZSYmZS5yZW1vdmVDaGlsZChmKSl9O2UuYXBwZW5kQ2hpbGQoZik7c2V0VGltZW91dChmdW5jdGlvbigpe2d8fChnPSEwLGMmJmMoRXJyb3IoXCJTY3JpcHQgbG9hZCB0aW1lb3V0XCIpKSl9LGR8fDVFMyk7cmV0dXJuIGZ9cmV0dXJuIG51bGx9O2Z1bmN0aW9uIEIoKXt0aGlzLmE9MDt0aGlzLmM9bnVsbH1mdW5jdGlvbiBDKGEpe2EuYSsrO3JldHVybiBmdW5jdGlvbigpe2EuYS0tO0QoYSl9fWZ1bmN0aW9uIEUoYSxiKXthLmM9YjtEKGEpfWZ1bmN0aW9uIEQoYSl7MD09YS5hJiZhLmMmJihhLmMoKSxhLmM9bnVsbCl9O2Z1bmN0aW9uIEYoYSl7dGhpcy5hPWF8fFwiLVwifUYucHJvdG90eXBlLmM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVtdLGM9MDtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKWIucHVzaChhcmd1bWVudHNbY10ucmVwbGFjZSgvW1xcV19dKy9nLFwiXCIpLnRvTG93ZXJDYXNlKCkpO3JldHVybiBiLmpvaW4odGhpcy5hKX07ZnVuY3Rpb24gRyhhLGIpe3RoaXMuYz1hO3RoaXMuZj00O3RoaXMuYT1cIm5cIjt2YXIgYz0oYnx8XCJuNFwiKS5tYXRjaCgvXihbbmlvXSkoWzEtOV0pJC9pKTtjJiYodGhpcy5hPWNbMV0sdGhpcy5mPXBhcnNlSW50KGNbMl0sMTApKX1mdW5jdGlvbiBmYShhKXtyZXR1cm4gSChhKStcIiBcIisoYS5mK1wiMDBcIikrXCIgMzAwcHggXCIrSShhLmMpfWZ1bmN0aW9uIEkoYSl7dmFyIGI9W107YT1hLnNwbGl0KC8sXFxzKi8pO2Zvcih2YXIgYz0wO2M8YS5sZW5ndGg7YysrKXt2YXIgZD1hW2NdLnJlcGxhY2UoL1snXCJdL2csXCJcIik7LTEhPWQuaW5kZXhPZihcIiBcIil8fC9eXFxkLy50ZXN0KGQpP2IucHVzaChcIidcIitkK1wiJ1wiKTpiLnB1c2goZCl9cmV0dXJuIGIuam9pbihcIixcIil9ZnVuY3Rpb24gSihhKXtyZXR1cm4gYS5hK2EuZn1mdW5jdGlvbiBIKGEpe3ZhciBiPVwibm9ybWFsXCI7XCJvXCI9PT1hLmE/Yj1cIm9ibGlxdWVcIjpcImlcIj09PWEuYSYmKGI9XCJpdGFsaWNcIik7cmV0dXJuIGJ9XG5mdW5jdGlvbiBnYShhKXt2YXIgYj00LGM9XCJuXCIsZD1udWxsO2EmJigoZD1hLm1hdGNoKC8obm9ybWFsfG9ibGlxdWV8aXRhbGljKS9pKSkmJmRbMV0mJihjPWRbMV0uc3Vic3RyKDAsMSkudG9Mb3dlckNhc2UoKSksKGQ9YS5tYXRjaCgvKFsxLTldMDB8bm9ybWFsfGJvbGQpL2kpKSYmZFsxXSYmKC9ib2xkL2kudGVzdChkWzFdKT9iPTc6L1sxLTldMDAvLnRlc3QoZFsxXSkmJihiPXBhcnNlSW50KGRbMV0uc3Vic3RyKDAsMSksMTApKSkpO3JldHVybiBjK2J9O2Z1bmN0aW9uIGhhKGEsYil7dGhpcy5jPWE7dGhpcy5mPWEuby5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7dGhpcy5oPWI7dGhpcy5hPW5ldyBGKFwiLVwiKTt0aGlzLmo9ITEhPT1iLmV2ZW50czt0aGlzLmc9ITEhPT1iLmNsYXNzZXN9ZnVuY3Rpb24gaWEoYSl7YS5nJiZ3KGEuZixbYS5hLmMoXCJ3ZlwiLFwibG9hZGluZ1wiKV0pO0soYSxcImxvYWRpbmdcIil9ZnVuY3Rpb24gTChhKXtpZihhLmcpe3ZhciBiPXkoYS5mLGEuYS5jKFwid2ZcIixcImFjdGl2ZVwiKSksYz1bXSxkPVthLmEuYyhcIndmXCIsXCJsb2FkaW5nXCIpXTtifHxjLnB1c2goYS5hLmMoXCJ3ZlwiLFwiaW5hY3RpdmVcIikpO3coYS5mLGMsZCl9SyhhLFwiaW5hY3RpdmVcIil9ZnVuY3Rpb24gSyhhLGIsYyl7aWYoYS5qJiZhLmhbYl0paWYoYylhLmhbYl0oYy5jLEooYykpO2Vsc2UgYS5oW2JdKCl9O2Z1bmN0aW9uIGphKCl7dGhpcy5jPXt9fWZ1bmN0aW9uIGthKGEsYixjKXt2YXIgZD1bXSxlO2ZvcihlIGluIGIpaWYoYi5oYXNPd25Qcm9wZXJ0eShlKSl7dmFyIGY9YS5jW2VdO2YmJmQucHVzaChmKGJbZV0sYykpfXJldHVybiBkfTtmdW5jdGlvbiBNKGEsYil7dGhpcy5jPWE7dGhpcy5mPWI7dGhpcy5hPXQodGhpcy5jLFwic3BhblwiLHtcImFyaWEtaGlkZGVuXCI6XCJ0cnVlXCJ9LHRoaXMuZil9ZnVuY3Rpb24gTihhKXt1KGEuYyxcImJvZHlcIixhLmEpfWZ1bmN0aW9uIE8oYSl7cmV0dXJuXCJkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3RvcDotOTk5OXB4O2xlZnQ6LTk5OTlweDtmb250LXNpemU6MzAwcHg7d2lkdGg6YXV0bztoZWlnaHQ6YXV0bztsaW5lLWhlaWdodDpub3JtYWw7bWFyZ2luOjA7cGFkZGluZzowO2ZvbnQtdmFyaWFudDpub3JtYWw7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtZmFtaWx5OlwiK0koYS5jKStcIjtcIisoXCJmb250LXN0eWxlOlwiK0goYSkrXCI7Zm9udC13ZWlnaHQ6XCIrKGEuZitcIjAwXCIpK1wiO1wiKX07ZnVuY3Rpb24gUChhLGIsYyxkLGUsZil7dGhpcy5nPWE7dGhpcy5qPWI7dGhpcy5hPWQ7dGhpcy5jPWM7dGhpcy5mPWV8fDNFMzt0aGlzLmg9Znx8dm9pZCAwfVAucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5jLm8uZG9jdW1lbnQsYj10aGlzLGM9cSgpLGQ9bmV3IFByb21pc2UoZnVuY3Rpb24oZCxlKXtmdW5jdGlvbiBmKCl7cSgpLWM+PWIuZj9lKCk6YS5mb250cy5sb2FkKGZhKGIuYSksYi5oKS50aGVuKGZ1bmN0aW9uKGEpezE8PWEubGVuZ3RoP2QoKTpzZXRUaW1lb3V0KGYsMjUpfSxmdW5jdGlvbigpe2UoKX0pfWYoKX0pLGU9bnVsbCxmPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsZCl7ZT1zZXRUaW1lb3V0KGQsYi5mKX0pO1Byb21pc2UucmFjZShbZixkXSkudGhlbihmdW5jdGlvbigpe2UmJihjbGVhclRpbWVvdXQoZSksZT1udWxsKTtiLmcoYi5hKX0sZnVuY3Rpb24oKXtiLmooYi5hKX0pfTtmdW5jdGlvbiBRKGEsYixjLGQsZSxmLGcpe3RoaXMudj1hO3RoaXMuQj1iO3RoaXMuYz1jO3RoaXMuYT1kO3RoaXMucz1nfHxcIkJFU2Jzd3lcIjt0aGlzLmY9e307dGhpcy53PWV8fDNFMzt0aGlzLnU9Znx8bnVsbDt0aGlzLm09dGhpcy5qPXRoaXMuaD10aGlzLmc9bnVsbDt0aGlzLmc9bmV3IE0odGhpcy5jLHRoaXMucyk7dGhpcy5oPW5ldyBNKHRoaXMuYyx0aGlzLnMpO3RoaXMuaj1uZXcgTSh0aGlzLmMsdGhpcy5zKTt0aGlzLm09bmV3IE0odGhpcy5jLHRoaXMucyk7YT1uZXcgRyh0aGlzLmEuYytcIixzZXJpZlwiLEoodGhpcy5hKSk7YT1PKGEpO3RoaXMuZy5hLnN0eWxlLmNzc1RleHQ9YTthPW5ldyBHKHRoaXMuYS5jK1wiLHNhbnMtc2VyaWZcIixKKHRoaXMuYSkpO2E9TyhhKTt0aGlzLmguYS5zdHlsZS5jc3NUZXh0PWE7YT1uZXcgRyhcInNlcmlmXCIsSih0aGlzLmEpKTthPU8oYSk7dGhpcy5qLmEuc3R5bGUuY3NzVGV4dD1hO2E9bmV3IEcoXCJzYW5zLXNlcmlmXCIsSih0aGlzLmEpKTthPVxuTyhhKTt0aGlzLm0uYS5zdHlsZS5jc3NUZXh0PWE7Tih0aGlzLmcpO04odGhpcy5oKTtOKHRoaXMuaik7Tih0aGlzLm0pfXZhciBSPXtEOlwic2VyaWZcIixDOlwic2Fucy1zZXJpZlwifSxTPW51bGw7ZnVuY3Rpb24gVCgpe2lmKG51bGw9PT1TKXt2YXIgYT0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7Uz0hIWEmJig1MzY+cGFyc2VJbnQoYVsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGFbMV0sMTApJiYxMT49cGFyc2VJbnQoYVsyXSwxMCkpfXJldHVybiBTfVEucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7dGhpcy5mLnNlcmlmPXRoaXMuai5hLm9mZnNldFdpZHRoO3RoaXMuZltcInNhbnMtc2VyaWZcIl09dGhpcy5tLmEub2Zmc2V0V2lkdGg7dGhpcy5BPXEoKTtVKHRoaXMpfTtcbmZ1bmN0aW9uIGxhKGEsYixjKXtmb3IodmFyIGQgaW4gUilpZihSLmhhc093blByb3BlcnR5KGQpJiZiPT09YS5mW1JbZF1dJiZjPT09YS5mW1JbZF1dKXJldHVybiEwO3JldHVybiExfWZ1bmN0aW9uIFUoYSl7dmFyIGI9YS5nLmEub2Zmc2V0V2lkdGgsYz1hLmguYS5vZmZzZXRXaWR0aCxkOyhkPWI9PT1hLmYuc2VyaWYmJmM9PT1hLmZbXCJzYW5zLXNlcmlmXCJdKXx8KGQ9VCgpJiZsYShhLGIsYykpO2Q/cSgpLWEuQT49YS53P1QoKSYmbGEoYSxiLGMpJiYobnVsbD09PWEudXx8YS51Lmhhc093blByb3BlcnR5KGEuYS5jKSk/VihhLGEudik6VihhLGEuQik6bWEoYSk6VihhLGEudil9ZnVuY3Rpb24gbWEoYSl7c2V0VGltZW91dChwKGZ1bmN0aW9uKCl7VSh0aGlzKX0sYSksNTApfWZ1bmN0aW9uIFYoYSxiKXtzZXRUaW1lb3V0KHAoZnVuY3Rpb24oKXt2KHRoaXMuZy5hKTt2KHRoaXMuaC5hKTt2KHRoaXMuai5hKTt2KHRoaXMubS5hKTtiKHRoaXMuYSl9LGEpLDApfTtmdW5jdGlvbiBXKGEsYixjKXt0aGlzLmM9YTt0aGlzLmE9Yjt0aGlzLmY9MDt0aGlzLm09dGhpcy5qPSExO3RoaXMucz1jfXZhciBYPW51bGw7Vy5wcm90b3R5cGUuZz1mdW5jdGlvbihhKXt2YXIgYj10aGlzLmE7Yi5nJiZ3KGIuZixbYi5hLmMoXCJ3ZlwiLGEuYyxKKGEpLnRvU3RyaW5nKCksXCJhY3RpdmVcIildLFtiLmEuYyhcIndmXCIsYS5jLEooYSkudG9TdHJpbmcoKSxcImxvYWRpbmdcIiksYi5hLmMoXCJ3ZlwiLGEuYyxKKGEpLnRvU3RyaW5nKCksXCJpbmFjdGl2ZVwiKV0pO0soYixcImZvbnRhY3RpdmVcIixhKTt0aGlzLm09ITA7bmEodGhpcyl9O1xuVy5wcm90b3R5cGUuaD1mdW5jdGlvbihhKXt2YXIgYj10aGlzLmE7aWYoYi5nKXt2YXIgYz15KGIuZixiLmEuYyhcIndmXCIsYS5jLEooYSkudG9TdHJpbmcoKSxcImFjdGl2ZVwiKSksZD1bXSxlPVtiLmEuYyhcIndmXCIsYS5jLEooYSkudG9TdHJpbmcoKSxcImxvYWRpbmdcIildO2N8fGQucHVzaChiLmEuYyhcIndmXCIsYS5jLEooYSkudG9TdHJpbmcoKSxcImluYWN0aXZlXCIpKTt3KGIuZixkLGUpfUsoYixcImZvbnRpbmFjdGl2ZVwiLGEpO25hKHRoaXMpfTtmdW5jdGlvbiBuYShhKXswPT0tLWEuZiYmYS5qJiYoYS5tPyhhPWEuYSxhLmcmJncoYS5mLFthLmEuYyhcIndmXCIsXCJhY3RpdmVcIildLFthLmEuYyhcIndmXCIsXCJsb2FkaW5nXCIpLGEuYS5jKFwid2ZcIixcImluYWN0aXZlXCIpXSksSyhhLFwiYWN0aXZlXCIpKTpMKGEuYSkpfTtmdW5jdGlvbiBvYShhKXt0aGlzLmo9YTt0aGlzLmE9bmV3IGphO3RoaXMuaD0wO3RoaXMuZj10aGlzLmc9ITB9b2EucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSl7dGhpcy5jPW5ldyBjYSh0aGlzLmosYS5jb250ZXh0fHx0aGlzLmopO3RoaXMuZz0hMSE9PWEuZXZlbnRzO3RoaXMuZj0hMSE9PWEuY2xhc3NlcztwYSh0aGlzLG5ldyBoYSh0aGlzLmMsYSksYSl9O1xuZnVuY3Rpb24gcWEoYSxiLGMsZCxlKXt2YXIgZj0wPT0tLWEuaDsoYS5mfHxhLmcpJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dmFyIGE9ZXx8bnVsbCxtPWR8fG51bGx8fHt9O2lmKDA9PT1jLmxlbmd0aCYmZilMKGIuYSk7ZWxzZXtiLmYrPWMubGVuZ3RoO2YmJihiLmo9Zik7dmFyIGgsbD1bXTtmb3IoaD0wO2g8Yy5sZW5ndGg7aCsrKXt2YXIgaz1jW2hdLG49bVtrLmNdLHI9Yi5hLHg9aztyLmcmJncoci5mLFtyLmEuYyhcIndmXCIseC5jLEooeCkudG9TdHJpbmcoKSxcImxvYWRpbmdcIildKTtLKHIsXCJmb250bG9hZGluZ1wiLHgpO3I9bnVsbDtpZihudWxsPT09WClpZih3aW5kb3cuRm9udEZhY2Upe3ZhciB4PS9HZWNrby4qRmlyZWZveFxcLyhcXGQrKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkseGE9L09TIFguKlZlcnNpb25cXC8xMFxcLi4qU2FmYXJpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSYmL0FwcGxlLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKTtcblg9eD80MjxwYXJzZUludCh4WzFdLDEwKTp4YT8hMTohMH1lbHNlIFg9ITE7WD9yPW5ldyBQKHAoYi5nLGIpLHAoYi5oLGIpLGIuYyxrLGIucyxuKTpyPW5ldyBRKHAoYi5nLGIpLHAoYi5oLGIpLGIuYyxrLGIucyxhLG4pO2wucHVzaChyKX1mb3IoaD0wO2g8bC5sZW5ndGg7aCsrKWxbaF0uc3RhcnQoKX19LDApfWZ1bmN0aW9uIHBhKGEsYixjKXt2YXIgZD1bXSxlPWMudGltZW91dDtpYShiKTt2YXIgZD1rYShhLmEsYyxhLmMpLGY9bmV3IFcoYS5jLGIsZSk7YS5oPWQubGVuZ3RoO2I9MDtmb3IoYz1kLmxlbmd0aDtiPGM7YisrKWRbYl0ubG9hZChmdW5jdGlvbihiLGQsYyl7cWEoYSxmLGIsZCxjKX0pfTtmdW5jdGlvbiByYShhLGIpe3RoaXMuYz1hO3RoaXMuYT1ifVxucmEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYigpe2lmKGZbXCJfX210aV9mbnRMc3RcIitkXSl7dmFyIGM9ZltcIl9fbXRpX2ZudExzdFwiK2RdKCksZT1bXSxoO2lmKGMpZm9yKHZhciBsPTA7bDxjLmxlbmd0aDtsKyspe3ZhciBrPWNbbF0uZm9udGZhbWlseTt2b2lkIDAhPWNbbF0uZm9udFN0eWxlJiZ2b2lkIDAhPWNbbF0uZm9udFdlaWdodD8oaD1jW2xdLmZvbnRTdHlsZStjW2xdLmZvbnRXZWlnaHQsZS5wdXNoKG5ldyBHKGssaCkpKTplLnB1c2gobmV3IEcoaykpfWEoZSl9ZWxzZSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YigpfSw1MCl9dmFyIGM9dGhpcyxkPWMuYS5wcm9qZWN0SWQsZT1jLmEudmVyc2lvbjtpZihkKXt2YXIgZj1jLmMubztBKHRoaXMuYywoYy5hLmFwaXx8XCJodHRwczovL2Zhc3QuZm9udHMubmV0L2pzYXBpXCIpK1wiL1wiK2QrXCIuanNcIisoZT9cIj92PVwiK2U6XCJcIiksZnVuY3Rpb24oZSl7ZT9hKFtdKTooZltcIl9fTW9ub3R5cGVDb25maWd1cmF0aW9uX19cIitcbmRdPWZ1bmN0aW9uKCl7cmV0dXJuIGMuYX0sYigpKX0pLmlkPVwiX19Nb25vdHlwZUFQSVNjcmlwdF9fXCIrZH1lbHNlIGEoW10pfTtmdW5jdGlvbiBzYShhLGIpe3RoaXMuYz1hO3RoaXMuYT1ifXNhLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe3ZhciBiLGMsZD10aGlzLmEudXJsc3x8W10sZT10aGlzLmEuZmFtaWxpZXN8fFtdLGY9dGhpcy5hLnRlc3RTdHJpbmdzfHx7fSxnPW5ldyBCO2I9MDtmb3IoYz1kLmxlbmd0aDtiPGM7YisrKXoodGhpcy5jLGRbYl0sQyhnKSk7dmFyIG09W107Yj0wO2ZvcihjPWUubGVuZ3RoO2I8YztiKyspaWYoZD1lW2JdLnNwbGl0KFwiOlwiKSxkWzFdKWZvcih2YXIgaD1kWzFdLnNwbGl0KFwiLFwiKSxsPTA7bDxoLmxlbmd0aDtsKz0xKW0ucHVzaChuZXcgRyhkWzBdLGhbbF0pKTtlbHNlIG0ucHVzaChuZXcgRyhkWzBdKSk7RShnLGZ1bmN0aW9uKCl7YShtLGYpfSl9O2Z1bmN0aW9uIHRhKGEsYil7YT90aGlzLmM9YTp0aGlzLmM9dWE7dGhpcy5hPVtdO3RoaXMuZj1bXTt0aGlzLmc9Ynx8XCJcIn12YXIgdWE9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzc1wiO2Z1bmN0aW9uIHZhKGEsYil7Zm9yKHZhciBjPWIubGVuZ3RoLGQ9MDtkPGM7ZCsrKXt2YXIgZT1iW2RdLnNwbGl0KFwiOlwiKTszPT1lLmxlbmd0aCYmYS5mLnB1c2goZS5wb3AoKSk7dmFyIGY9XCJcIjsyPT1lLmxlbmd0aCYmXCJcIiE9ZVsxXSYmKGY9XCI6XCIpO2EuYS5wdXNoKGUuam9pbihmKSl9fVxuZnVuY3Rpb24gd2EoYSl7aWYoMD09YS5hLmxlbmd0aCl0aHJvdyBFcnJvcihcIk5vIGZvbnRzIHRvIGxvYWQhXCIpO2lmKC0xIT1hLmMuaW5kZXhPZihcImtpdD1cIikpcmV0dXJuIGEuYztmb3IodmFyIGI9YS5hLmxlbmd0aCxjPVtdLGQ9MDtkPGI7ZCsrKWMucHVzaChhLmFbZF0ucmVwbGFjZSgvIC9nLFwiK1wiKSk7Yj1hLmMrXCI/ZmFtaWx5PVwiK2Muam9pbihcIiU3Q1wiKTswPGEuZi5sZW5ndGgmJihiKz1cIiZzdWJzZXQ9XCIrYS5mLmpvaW4oXCIsXCIpKTswPGEuZy5sZW5ndGgmJihiKz1cIiZ0ZXh0PVwiK2VuY29kZVVSSUNvbXBvbmVudChhLmcpKTtyZXR1cm4gYn07ZnVuY3Rpb24geWEoYSl7dGhpcy5mPWE7dGhpcy5hPVtdO3RoaXMuYz17fX1cbnZhciB6YT17bGF0aW46XCJCRVNic3d5XCIsXCJsYXRpbi1leHRcIjpcIlxcdTAwZTdcXHUwMGY2XFx1MDBmY1xcdTAxMWZcXHUwMTVmXCIsY3lyaWxsaWM6XCJcXHUwNDM5XFx1MDQ0ZlxcdTA0MTZcIixncmVlazpcIlxcdTAzYjFcXHUwM2IyXFx1MDNhM1wiLGtobWVyOlwiXFx1MTc4MFxcdTE3ODFcXHUxNzgyXCIsSGFudW1hbjpcIlxcdTE3ODBcXHUxNzgxXFx1MTc4MlwifSxBYT17dGhpbjpcIjFcIixleHRyYWxpZ2h0OlwiMlwiLFwiZXh0cmEtbGlnaHRcIjpcIjJcIix1bHRyYWxpZ2h0OlwiMlwiLFwidWx0cmEtbGlnaHRcIjpcIjJcIixsaWdodDpcIjNcIixyZWd1bGFyOlwiNFwiLGJvb2s6XCI0XCIsbWVkaXVtOlwiNVwiLFwic2VtaS1ib2xkXCI6XCI2XCIsc2VtaWJvbGQ6XCI2XCIsXCJkZW1pLWJvbGRcIjpcIjZcIixkZW1pYm9sZDpcIjZcIixib2xkOlwiN1wiLFwiZXh0cmEtYm9sZFwiOlwiOFwiLGV4dHJhYm9sZDpcIjhcIixcInVsdHJhLWJvbGRcIjpcIjhcIix1bHRyYWJvbGQ6XCI4XCIsYmxhY2s6XCI5XCIsaGVhdnk6XCI5XCIsbDpcIjNcIixyOlwiNFwiLGI6XCI3XCJ9LEJhPXtpOlwiaVwiLGl0YWxpYzpcImlcIixuOlwiblwiLG5vcm1hbDpcIm5cIn0sXG5DYT0vXih0aGlufCg/Oig/OmV4dHJhfHVsdHJhKS0/KT9saWdodHxyZWd1bGFyfGJvb2t8bWVkaXVtfCg/Oig/OnNlbWl8ZGVtaXxleHRyYXx1bHRyYSktPyk/Ym9sZHxibGFja3xoZWF2eXxsfHJ8YnxbMS05XTAwKT8obnxpfG5vcm1hbHxpdGFsaWMpPyQvO1xuZnVuY3Rpb24gRGEoYSl7Zm9yKHZhciBiPWEuZi5sZW5ndGgsYz0wO2M8YjtjKyspe3ZhciBkPWEuZltjXS5zcGxpdChcIjpcIiksZT1kWzBdLnJlcGxhY2UoL1xcKy9nLFwiIFwiKSxmPVtcIm40XCJdO2lmKDI8PWQubGVuZ3RoKXt2YXIgZzt2YXIgbT1kWzFdO2c9W107aWYobSlmb3IodmFyIG09bS5zcGxpdChcIixcIiksaD1tLmxlbmd0aCxsPTA7bDxoO2wrKyl7dmFyIGs7az1tW2xdO2lmKGsubWF0Y2goL15bXFx3LV0rJC8pKXt2YXIgbj1DYS5leGVjKGsudG9Mb3dlckNhc2UoKSk7aWYobnVsbD09bilrPVwiXCI7ZWxzZXtrPW5bMl07az1udWxsPT1rfHxcIlwiPT1rP1wiblwiOkJhW2tdO249blsxXTtpZihudWxsPT1ufHxcIlwiPT1uKW49XCI0XCI7ZWxzZSB2YXIgcj1BYVtuXSxuPXI/cjppc05hTihuKT9cIjRcIjpuLnN1YnN0cigwLDEpO2s9W2ssbl0uam9pbihcIlwiKX19ZWxzZSBrPVwiXCI7ayYmZy5wdXNoKGspfTA8Zy5sZW5ndGgmJihmPWcpOzM9PWQubGVuZ3RoJiYoZD1kWzJdLGc9W10sZD1kP2Quc3BsaXQoXCIsXCIpOlxuZywwPGQubGVuZ3RoJiYoZD16YVtkWzBdXSkmJihhLmNbZV09ZCkpfWEuY1tlXXx8KGQ9emFbZV0pJiYoYS5jW2VdPWQpO2ZvcihkPTA7ZDxmLmxlbmd0aDtkKz0xKWEuYS5wdXNoKG5ldyBHKGUsZltkXSkpfX07ZnVuY3Rpb24gRWEoYSxiKXt0aGlzLmM9YTt0aGlzLmE9Yn12YXIgRmE9e0FyaW1vOiEwLENvdXNpbmU6ITAsVGlub3M6ITB9O0VhLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe3ZhciBiPW5ldyBCLGM9dGhpcy5jLGQ9bmV3IHRhKHRoaXMuYS5hcGksdGhpcy5hLnRleHQpLGU9dGhpcy5hLmZhbWlsaWVzO3ZhKGQsZSk7dmFyIGY9bmV3IHlhKGUpO0RhKGYpO3ooYyx3YShkKSxDKGIpKTtFKGIsZnVuY3Rpb24oKXthKGYuYSxmLmMsRmEpfSl9O2Z1bmN0aW9uIEdhKGEsYil7dGhpcy5jPWE7dGhpcy5hPWJ9R2EucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5hLmlkLGM9dGhpcy5jLm87Yj9BKHRoaXMuYywodGhpcy5hLmFwaXx8XCJodHRwczovL3VzZS50eXBla2l0Lm5ldFwiKStcIi9cIitiK1wiLmpzXCIsZnVuY3Rpb24oYil7aWYoYilhKFtdKTtlbHNlIGlmKGMuVHlwZWtpdCYmYy5UeXBla2l0LmNvbmZpZyYmYy5UeXBla2l0LmNvbmZpZy5mbil7Yj1jLlR5cGVraXQuY29uZmlnLmZuO2Zvcih2YXIgZT1bXSxmPTA7ZjxiLmxlbmd0aDtmKz0yKWZvcih2YXIgZz1iW2ZdLG09YltmKzFdLGg9MDtoPG0ubGVuZ3RoO2grKyllLnB1c2gobmV3IEcoZyxtW2hdKSk7dHJ5e2MuVHlwZWtpdC5sb2FkKHtldmVudHM6ITEsY2xhc3NlczohMSxhc3luYzohMH0pfWNhdGNoKGwpe31hKGUpfX0sMkUzKTphKFtdKX07ZnVuY3Rpb24gSGEoYSxiKXt0aGlzLmM9YTt0aGlzLmY9Yjt0aGlzLmE9W119SGEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5mLmlkLGM9dGhpcy5jLm8sZD10aGlzO2I/KGMuX193ZWJmb250Zm9udGRlY2ttb2R1bGVfX3x8KGMuX193ZWJmb250Zm9udGRlY2ttb2R1bGVfXz17fSksYy5fX3dlYmZvbnRmb250ZGVja21vZHVsZV9fW2JdPWZ1bmN0aW9uKGIsYyl7Zm9yKHZhciBnPTAsbT1jLmZvbnRzLmxlbmd0aDtnPG07KytnKXt2YXIgaD1jLmZvbnRzW2ddO2QuYS5wdXNoKG5ldyBHKGgubmFtZSxnYShcImZvbnQtd2VpZ2h0OlwiK2gud2VpZ2h0K1wiO2ZvbnQtc3R5bGU6XCIraC5zdHlsZSkpKX1hKGQuYSl9LEEodGhpcy5jLCh0aGlzLmYuYXBpfHxcImh0dHBzOi8vZi5mb250ZGVjay5jb20vcy9jc3MvanMvXCIpK2VhKHRoaXMuYykrXCIvXCIrYitcIi5qc1wiLGZ1bmN0aW9uKGIpe2ImJmEoW10pfSkpOmEoW10pfTt2YXIgWT1uZXcgb2Eod2luZG93KTtZLmEuYy5jdXN0b209ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IHNhKGIsYSl9O1kuYS5jLmZvbnRkZWNrPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBIYShiLGEpfTtZLmEuYy5tb25vdHlwZT1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgcmEoYixhKX07WS5hLmMudHlwZWtpdD1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgR2EoYixhKX07WS5hLmMuZ29vZ2xlPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBFYShiLGEpfTt2YXIgWj17bG9hZDpwKFkubG9hZCxZKX07XCJmdW5jdGlvblwiPT09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gWn0pOlwidW5kZWZpbmVkXCIhPT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1aOih3aW5kb3cuV2ViRm9udD1aLHdpbmRvdy5XZWJGb250Q29uZmlnJiZZLmxvYWQod2luZG93LldlYkZvbnRDb25maWcpKTt9KCkpO1xuIiwiaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi9SZWN0YW5nbGVcIjtcbmltcG9ydCBEcm9wUmVjb2duaXRpb24gZnJvbSBcIi4vRHJvcFJlY29nbml0aW9uXCI7XG5pbXBvcnQgV2ViRm9udCBmcm9tIFwid2ViZm9udGxvYWRlclwiO1xubGV0IEZvbnRMb2FkZWQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gIFdlYkZvbnQubG9hZCh7XG4gICAgY3VzdG9tOiB7XG4gICAgICBmYW1pbGllczogW1wiTm92ZWNlbnRvIFdpZGVCb2xkXCJdXG4gICAgfSxcbiAgICBhY3RpdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9XG4gIH0pO1xufSk7XG5leHBvcnQgeyBEcm9wUmVjb2duaXRpb24sIFJlY3RhbmdsZSxGb250TG9hZGVkIH07XG5leHBvcnQgZGVmYXVsdCBEcm9wUmVjb2duaXRpb247XG4iXSwibmFtZXMiOlsiUmVjb2duaXRpb25EYXRhIiwiV2ViRm9udCJdLCJtYXBwaW5ncyI6IkFBQWUsTUFBTSxTQUFTLENBQUM7QUFDL0IsRUFBRSxXQUFXLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRTtBQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzdCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztBQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7QUFDbkMsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNuRCxNQUFNLElBQUksRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUU7QUFDMUIsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzFCLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRTtBQUNmLElBQUksT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyQyxHQUFHO0FBQ0gsRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ25CLElBQUksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZDLElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3hDLElBQUksSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3RDLElBQUksSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3pDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLEdBQUc7QUFDSCxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDZixJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN2QixNQUFNLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQztBQUMzQyxNQUFNLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUM5QyxNQUFNLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUN4QyxNQUFNLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNqRCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQ2xCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0QsSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDckIsTUFBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFFLEtBQUssTUFBTSxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUU7QUFDN0IsTUFBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFFLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDL0IsTUFBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFFLEtBQUssTUFBTSxJQUFJ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QUFFLENBQUM7QUFDMUI7QUFDQSxJQUFJLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN0QyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRixPQUFPO0FBQ1AsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLEtBQUs7QUFDTCxJQUFJLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFO0FBQzNDLFFBQVEsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQzNCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxVQUFVLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMs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QztBQUNyRSxHQUFHO0FBQ0gsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSztBQUM1QixJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFFLEdBQUc7QUFDSCxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLO0FBQzNCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDM0QsR0FBRztBQUNILEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUs7QUFDM0IsSUFBSSxPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDeEQsR0FBRztBQUNILEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUs7QUFDM0IsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyRSxHQUFHO0FBQ0gsQ0FBQzs7QUM3TUQsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUMvQixFQUFFLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDakMsRUFBRSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQzlCO0FBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUMxRDtBQUNBLEVBQUUsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkUsRUFBRSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7QUFDMUI7QUFDQSxFQUFFLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtBQUMxQixJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN6QixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRCxLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsS0FBSztBQUNMLEdBQUcsTUFBTTtBQUNULElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtBQUN4QixJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUNuQyxHQUFHLE1BQU07QUFDVCxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BELEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckJBLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNKLFNBQVMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFO0FBQ3RELEVBQUUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLEVBQUUsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN2QixFQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9DLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwQixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3BELE1BQU0sSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FB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Q0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlDLEVBQUUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDN0IsRUFBRSxJQUFJLE1BQU0sQ0FBQztBQUNiLEVBQUUsS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7QUFDMUIsSUFBSSxJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQy9DLElBQUksSUFBSSxJQUFJLEdBQUcsVUFBVSxFQUFFO0FBQzNCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQztBQUN4QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDbkIsS0FBSztBQUNMLEdBQUc7QUFDSCxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUNELFNBQVMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDbkMsRUFBRSxJQUFJLEtBQUssR0FBRztBQUNkLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLElBQUksR0FBRztBQUNQLEdBQUcsQ0FBQztBQUNKLEVBQUUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDN0Is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Q0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN4RCxJQUFJLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRSxJQUFJLElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckQsSUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDcEIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlDLFFBQVEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDdkMsVUFBVSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFVBQVUsTUFBTTtBQUNoQixTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDM0MsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLE9BQU8sTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixRQUFRLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEIsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JGLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0MsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsUUFBUSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JFLE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ3hCLEdBQUc7QUFDSCxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3TEEsTUFBTSxlQUFlLENBQUM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDaEMsSUFBSSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkQsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUMxRSxJQUFJLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDL0IsSUFBSSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDdkIsSUFBSSxJQUFJLE9BQU8sR0FBRyxVQUFVLEdBQUcsT0FBTyxHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUM7QUFDL0QsSUFBSSxJQUFJLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNsQjtBQUNBLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUM7QUFDcEUsSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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QUFHO0FBQ0gsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNoQyxJQUFJLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUMxQyxJQUFJLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUMxQyxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDckUsSUFBSSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xFLElBQUksS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUMzQyxNQUFNLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNoRCxRQUFRLFFBQVEsSUFBSSxDQUFDLENBQUM7QUFDdEIsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUM7QUFDdkUsR0FBRztBQUNILEVBQUUsUUFBUSxHQUFHO0FBQ2IsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxFQUFFO0FBQzNCLE1BQU0sT0FBTyxHQUFHLENBQUM7QUFDakIsS0FBSztBQUNMLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFELElBQUksSUFBSSxLQUFLLEVBQUU7QUFDZixNQUFN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O0FBQzFCLElBQUksSUFBSSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQyxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hELE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QixNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2pELFFBQVEsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0UsUUFBUSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQyxRQUFRLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUN6QixVQUFVLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDcEMsU0FBUyxNQUFNLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsR0FBRyxFQUFFO0FBQzdDLFVBQVUsSUFBSSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUM7QUFDdkMsVUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDdkIsWUFBWSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4RyxXQUFXO0FBQ1gsVUFBVSxJQUFJLENBQUMsS0FBSyxVQUFVLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtBQUMxQyxZQUFZLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pHLFdBQVc7QUFDWCxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN0QixZQUFZLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZHLFdBQVc7QUFDWCxVQUFVLElBQUksQ0FBQyxLQUFLLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNDLFlBQVksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUcsV0FBVztBQUNYLFVBQVUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxNQUFNLEtBQUssSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMs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QUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNHLE1BQU0sSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM5RixNQUFNLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVELE1BQU0sU0FBUyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUM7QUFDcEMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFELEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEdBQUc7QUFDSCxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFDakIsSUFBSSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDeEIsSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRTtBQUM5RCxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsU0FBUztBQUM1RCxNQUFNO0FBQ04sUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdB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QUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLE9BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUMsQ0FBQztBQUM3aEMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdmIsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUM7QUFDcFcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDLENBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy90QyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLDJMQUEyTCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMW5FLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLHFDQUFxQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQzFhLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUMxeEIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDM2xCLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6ZixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7QUFDMVgsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLDJCQUEyQjtBQUN4ZixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxrQ0FBa0MsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ3R0QixTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDO0FBQ25XLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsZ0NBQWdDLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUM5ZixFQUFFLENBQUMsOElBQThJLENBQUM7QUFDbEosU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ3ZmLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLHlCQUF5QixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMseUJBQXlCLEdBQUcsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWtHLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7QUNicHVELElBQUMsVUFBVSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sS0FBSztBQUNsRCxFQUFFQyxhQUFPLENBQUMsSUFBSSxDQUFDO0FBQ2YsSUFBSSxNQUFNLEVBQUU7QUFDWixNQUFNLFFBQVEsRUFBRSxDQUFDLG9CQUFvQixDQUFDO0FBQ3RDLEtBQUs7QUFDTCxJQUFJLE1BQU0sRUFBRSxZQUFZO0FBQ3hCLE1BQU0sT0FBTyxFQUFFLENBQUM7QUFDaEIsS0FBSztBQUNMLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsQ0FBQzs7Ozs7In0=
