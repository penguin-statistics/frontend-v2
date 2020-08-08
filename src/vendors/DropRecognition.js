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

var ssim_web = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}(window,(function(){return function(t){var e={};function r(i){if(e[i])return e[i].exports;var a=e[i]={i:i,l:!1,exports:{}};return t[i].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=t,r.c=e,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i});},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(i,a,function(e){return t[e]}.bind(null,a));return i},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=10)}([function(t,e,r){function i(t){return a(t)/t.length}function a(t){for(var e=0,r=0;r<t.length;r++)e+=t[r];return e}function n(t){for(var e=t.data,r=0,i=0;i<e.length;i++)r+=e[i];return r}function d(t,e){for(var r=t.data,i=t.width,a=t.height,n=new Array(r.length),d=0;d<r.length;d++)n[d]=r[d]+e;return {data:n,width:i,height:a}}function o(t,e){return "number"==typeof e?function(t,e){for(var r=t.data,i=t.width,a=t.height,n=new Array(r.length),d=0;d<r.length;d++)n[d]=r[d]*e;return {data:n,width:i,height:a}}(t,e):function(t,e){for(var r=t.data,i=t.width,a=t.height,n=e.data,d=new Array(r.length),o=0;o<r.length;o++)d[o]=r[o]*n[o];return {data:d,width:i,height:a}}(t,e)}Object.defineProperty(e,"__esModule",{value:!0}),e.covariance=e.variance=e.mean2d=e.square2d=e.multiply2d=e.divide2d=e.subtract2d=e.add2d=e.sum2d=e.floor=e.sum=e.average=void 0,e.average=i,e.sum=a,e.floor=function(t){for(var e=new Array(t.length),r=0;r<t.length;r++)e[r]=Math.floor(t[r]);return e},e.sum2d=n,e.add2d=function(t,e){return "number"==typeof e?d(t,e):function(t,e){for(var r=t.data,i=t.width,a=t.height,n=e.data,d=new Array(r.length),o=0;o<a;o++)for(var u=o*i,h=0;h<i;h++)d[u+h]=r[u+h]+n[u+h];return {data:d,width:i,height:a}}(t,e)},e.subtract2d=function(t,e){return "number"==typeof e?d(t,-e):function(t,e){for(var r=t.data,i=t.width,a=t.height,n=e.data,d=new Array(r.length),o=0;o<a;o++)for(var u=o*i,h=0;h<i;h++)d[u+h]=r[u+h]-n[u+h];return {data:d,width:i,height:a}}(t,e)},e.divide2d=function(t,e){return "number"==typeof e?function(t,e){for(var r=t.data,i=t.width,a=t.height,n=new Array(r.length),d=0;d<r.length;d++)n[d]=r[d]/e;return {data:n,width:i,height:a}}(t,e):function(t,e){for(var r=t.data,i=t.width,a=t.height,n=e.data,d=new Array(r.length),o=0;o<r.length;o++)d[o]=r[o]/n[o];return {data:d,width:i,height:a}}(t,e)},e.multiply2d=o,e.square2d=function(t){return o(t,t)},e.mean2d=function(t){return n(t)/t.data.length},e.variance=function(t,e){void 0===e&&(e=i(t));for(var r=0,a=t.length;a--;)r+=Math.pow(t[a]-e,2);return r/t.length},e.covariance=function(t,e,r,a){void 0===r&&(r=i(t)),void 0===a&&(a=i(e));for(var n=0,d=t.length;d--;)n+=(t[d]-r)*(e[d]-a);return n/t.length};},function(t,e,r){var i=this&&this.__createBinding||(Object.create?function(t,e,r,i){void 0===i&&(i=r),Object.defineProperty(t,i,{enumerable:!0,get:function(){return e[r]}});}:function(t,e,r,i){void 0===i&&(i=r),t[i]=e[r];}),a=this&&this.__exportStar||function(t,e){for(var r in t)"default"===r||e.hasOwnProperty(r)||i(e,t,r);};Object.defineProperty(e,"__esModule",{value:!0}),a(r(2),e),a(r(7),e),a(r(11),e),a(r(12),e),a(r(13),e),a(r(3),e),a(r(9),e),a(r(14),e),a(r(15),e),a(r(5),e),a(r(16),e),a(r(6),e);},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.conv2=void 0;var i=r(0),a=r(3),n=r(5),d=r(6);function o(t,e,r){var i=t.data,a=t.width,n=t.height;void 0===r&&(r="full");for(var o=a+e.width-1,u=n+e.height-1,h=d.zeros(u,o).data,f=0;f<e.height;f++)for(var s=0;s<e.width;s++){var v=e.data[f*e.width+s];if(v)for(var c=0;c<n;c++)for(var w=0;w<a;w++)h[(c+f)*o+w+s]+=i[c*a+w]*v;}return l({data:h,width:o,height:u},r,n,e.height,a,e.width)}function u(t,e,r){var n=e.data,d=e.width,o=e.height;void 0===r&&(r="full");var u=f(t,a.ones(o,1),a.ones(1,d),r);return i.multiply2d(u,n[0])}function h(t){for(var e=t.data,r=e[0],i=1;i<e.length;i++)if(e[i]!==r)return !1;return !0}function f(t,e,r,i){void 0===i&&(i="full");var a=Math.max(e.height,e.width),n=Math.max(r.height,r.width),d=o(t,e,"full");return l(o(d,r,"full"),i,t.height,a,t.width,n)}function l(t,e,r,i,a,d){if("full"===e)return t;if("same"===e){var o=Math.ceil((t.height-r)/2),u=Math.ceil((t.width-a)/2);return n.sub(t,o,r,u,a)}return n.sub(t,i-1,r-i+1,d-1,a-d+1)}e.conv2=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return t[2]&&t[2].data?f.apply(void 0,t):h(t[1])?u.apply(void 0,t):o.apply(void 0,t)};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.ones=void 0;var i=r(4);e.ones=function(t,e){return void 0===e&&(e=t),i.numbers(t,e,1)};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.numbers=void 0,e.numbers=function(t,e,r){for(var i=e*t,a=new Array(i),n=0;n<i;n++)a[n]=r;return {data:a,width:e,height:t}};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.sub=void 0,e.sub=function(t,e,r,i,a){for(var n=t.data,d=t.width,o=new Array(a*r),u=0;u<r;u++)for(var h=0;h<a;h++)o[u*a+h]=n[(i+u)*d+e+h];return {data:o,width:a,height:r}};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.zeros=void 0;var i=r(4);e.zeros=function(t,e){return void 0===e&&(e=t),i.numbers(t,e,0)};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.filter2=void 0;var i=r(2);e.filter2=function(t,e,r){return void 0===r&&(r="same"),i.conv2(e,function(t){for(var e=t.data,r=t.width,i=t.height,a=new Array(e.length),n=0;n<i;n++)for(var d=0;d<r;d++)a[n*r+d]=e[(i-1-n)*r+r-1-d];return {data:a,width:r,height:i}}(t),r)};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.mod=void 0,e.mod=function(t,e){return t-e*Math.floor(t/e)};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.padarray=void 0;var i=r(8);function a(t,e){for(var r=t.width+2*e,a=new Array(r*t.height),n=function(t,e){for(var r=t.width+e.width,i=new Array(t.height*r),a=0;a<t.height;a++){for(var n=0;n<t.width;n++)i[a*r+n]=t.data[a*t.width+n];for(n=0;n<e.width;n++)i[a*r+n+t.width]=e.data[a*e.width+n];}return {data:i,width:r,height:t.height}}(t,function(t){for(var e=t.data,r=t.width,i=t.height,a=new Array(e.length),n=0;n<i;n++)for(var d=0;d<r;d++)a[n*r+d]=e[n*r+r-1-d];return {data:a,width:r,height:i}}(t)),d=0;d<t.height;d++)for(var o=-e;o<t.width+e;o++)a[d*r+o+e]=n.data[d*n.width+i.mod(o,n.width)];return {data:a,width:r,height:t.height}}function n(t,e){for(var r=function(t,e){return {data:t.data.concat(e.data),height:t.height+e.height,width:t.width}}(t,function(t){for(var e=t.data,r=t.width,i=t.height,a=new Array(e.length),n=0;n<i;n++)for(var d=0;d<r;d++)a[n*r+d]=e[(i-1-n)*r+d];return {data:a,width:r,height:i}}(t)),a=t.height+2*e,n=new Array(t.width*a),d=-e;d<t.height+e;d++)for(var o=0;o<t.width;o++)n[(d+e)*t.width+o]=r.data[i.mod(d,r.height)*t.width+o];return {data:n,width:t.width,height:a}}e.padarray=function(t,e,r,i){var d=e[0],o=e[1];return t.height>=d&&t.width>=o?function(t,e){for(var r=e[0],i=e[1],a=t.width+2*i,n=t.height+2*r,d=new Array(a*n),o=-r;o<0;o++){for(var u=-i;u<0;u++)d[(o+r)*a+u+i]=t.data[(Math.abs(o)-1)*t.width+Math.abs(u)-1];for(u=0;u<t.width;u++)d[(o+r)*a+u+i]=t.data[(Math.abs(o)-1)*t.width+u];for(u=t.width;u<t.width+i;u++)d[(o+r)*a+u+i]=t.data[(Math.abs(o)-1)*t.width+2*t.width-u-1];}for(o=0;o<t.height;o++){for(u=-i;u<0;u++)d[(o+r)*a+u+i]=t.data[o*t.width+Math.abs(u)-1];for(u=0;u<t.width;u++)d[(o+r)*a+u+i]=t.data[o*t.width+u];for(u=t.width;u<t.width+i;u++)d[(o+r)*a+u+i]=t.data[o*t.width+2*t.width-u-1];}for(o=t.height;o<t.height+r;o++){for(u=-i;u<0;u++)d[(o+r)*a+u+i]=t.data[(2*t.height-o-1)*t.width+Math.abs(u)-1];for(u=0;u<t.width;u++)d[(o+r)*a+u+i]=t.data[(2*t.height-o-1)*t.width+u];for(u=t.width;u<t.width+i;u++)d[(o+r)*a+u+i]=t.data[(2*t.height-o-1)*t.width+2*t.width-u-1];}return {data:d,width:a,height:n}}(t,[d,o]):n(a(t,o),d)};},function(t,e,r){var i=this&&this.__assign||function(){return (i=Object.assign||function(t){for(var e,r=1,i=arguments.length;r<i;r++)for(var a in e=arguments[r])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t}).apply(this,arguments)};Object.defineProperty(e,"__esModule",{value:!0}),e.ssim=void 0;var a=r(1),n=r(0),d=r(17),o=r(18),u=r(19),h=r(20),f=r(21),l={fast:d.ssim,original:o.originalSsim,bezkrovny:u.bezkrovnySsim};function s(t){var e=i(i({},f.defaults),t);return function(t){if(Object.keys(t).forEach((function(t){if(!(t in f.defaults))throw new Error('"'+t+'" is not a valid option')})),"k1"in t&&("number"!=typeof t.k1||t.k1<0))throw new Error("Invalid k1 value. Default is "+f.defaults.k1);if("k2"in t&&("number"!=typeof t.k2||t.k2<0))throw new Error("Invalid k2 value. Default is "+f.defaults.k2);if(!(t.ssim in l))throw new Error("Invalid ssim option (use: "+Object.keys(l).join(", ")+")")}(e),e}function v(t,e,r){var i=(new Date).getTime(),d=function(t){var e=t[0],r=t[1],i=t[2];return l[i.ssim](e,r,i)}(function(t){var e=t[0],r=t[1],i=t[2],a=h.downsample([e,r],i);return [a[0],a[1],i]}(function(t){var e=t[0],r=t[1],i=t[2];return [a.rgb2gray(e),a.rgb2gray(r),i]}(function(t){var e=t[0],r=t[1],i=t[2];if(e.width!==r.width||e.height!==r.height)throw new Error("Image dimensions do not match");return [e,r,i]}([t,e,s(r)]))));return {ssim_map:d,mssim:n.mean2d(d),performance:(new Date).getTime()-i}}e.ssim=v,e.default=v;},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.fspecial=void 0;var i=r(0);e.fspecial=function(t,e,r){void 0===e&&(e=3),void 0===r&&(r=1.5);var a=function(t,e){for(var r=t.data,i=t.width,a=t.height,n=new Array(r.length),d=0;d<r.length;d++)n[d]=Math.exp(-r[d]/(2*Math.pow(e,2)));return {data:n,width:i,height:a}}(function(t){for(var e=2*t+1,r=new Array(Math.pow(e,2)),i=0;i<e;i++)for(var a=0;a<e;a++)r[i*e+a]=Math.pow(i-t,2)+Math.pow(a-t,2);return {data:r,width:e,height:e}}(e=(e-1)/2),r),n=i.sum2d(a);return i.divide2d(a,n)};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.imfilter=void 0;var i=r(8),a=r(9),n=r(0),d=r(7);e.imfilter=function(t,e,r,o){return void 0===r&&(r="symmetric"),void 0===o&&(o="same"),t=function(t,e,r,d){if(t=a.padarray(t,n.floor([e/2,r/2]),d),0===i.mod(e,2)&&(t.data=t.data.slice(0,-t.width),t.height--),0===i.mod(r,2)){for(var o=[],u=0;u<t.data.length;u++)(u+1)%t.width!=0&&o.push(t.data[u]);t.data=o,t.width--;}return t}(t,e.width,e.height,r),o=function(t){return "same"===t&&(t="valid"),t}(o),d.filter2(e,t,o)};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.normpdf=void 0,e.normpdf=function(t,e,r){var i=t.data,a=t.width,n=t.height;void 0===e&&(e=0),void 0===r&&(r=1);for(var d=new Array(i.length),o=0;o<i.length;o++){var u=(i[o]-e)/r;d[o]=Math.exp(-Math.pow(u,2)/2)/(2.5066282746310007*r);}return {data:d,width:a,height:n}};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.rgb2gray=void 0,e.rgb2gray=function(t){for(var e,r,i,a=t.data,n=t.width,d=t.height,o=new Array(n*d),u=0;u<d;u++)for(var h=0;h<n;h++){var f=h+u*n,l=4*f;o[f]=(e=a[l],r=a[l+1],i=a[l+2],Math.round(.29894*e+.58704*r+.11402*i));}return {data:o,width:n,height:d}};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.skip2d=void 0,e.skip2d=function(t,e,r){for(var i=e[0],a=e[1],n=e[2],d=r[0],o=r[1],u=r[2],h=Math.ceil((u-d)/o),f=Math.ceil((n-i)/a),l=new Array(h*f),s=0;s<f;s++)for(var v=0;v<h;v++){var c=i+s*a,w=d+v*o;l[s*h+v]=t.data[c*t.width+w];}return {data:l,width:h,height:f}};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.transpose=void 0,e.transpose=function(t){for(var e=t.data,r=t.width,i=t.height,a=new Array(r*i),n=0;n<i;n++)for(var d=0;d<r;d++)a[d*i+n]=e[n*r+d];return {data:a,height:r,width:i}};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.ssim=void 0;var i=r(0),a=r(1);e.ssim=function(t,e,r){var n=a.normpdf(function(t){for(var e=Math.floor(t/2),r=new Array(2*e+1),i=-e;i<=e;i++)r[i+e]=Math.abs(i);return {data:r,width:r.length,height:1}}(r.windowSize),0,1.5),d=Math.pow(2,r.bitDepth)-1,o=Math.pow(r.k1*d,2),u=Math.pow(r.k2*d,2);n=i.divide2d(n,i.sum2d(n));var h=a.transpose(n),f=a.conv2(t,n,h,"valid"),l=a.conv2(e,n,h,"valid"),s=i.square2d(f),v=i.square2d(l),c=i.multiply2d(f,l),w=i.square2d(t),g=i.square2d(e),p=i.subtract2d(a.conv2(w,n,h,"valid"),s),y=i.subtract2d(a.conv2(g,n,h,"valid"),v),m=i.subtract2d(a.conv2(i.multiply2d(t,e),n,h,"valid"),c);return o>0&&u>0?function(t,e,r,a,n,d,o,u){var h=i.add2d(i.multiply2d(t,2),o),f=i.add2d(i.multiply2d(e,2),u),l=i.add2d(i.add2d(r,a),o),s=i.add2d(i.add2d(n,d),u);return i.divide2d(i.multiply2d(h,f),i.multiply2d(l,s))}(c,m,s,v,p,y,o,u):function(t,e,r,a,n,d){var o=i.multiply2d(t,2),u=i.multiply2d(e,2),h=i.add2d(r,a),f=i.add2d(n,d);return i.divide2d(i.multiply2d(o,u),i.multiply2d(h,f))}(c,m,s,v,p,y)};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.originalSsim=void 0;var i=r(0),a=r(1);e.originalSsim=function(t,e,r){var n=a.fspecial("gaussian",r.windowSize,1.5),d=Math.pow(2,r.bitDepth)-1,o=Math.pow(r.k1*d,2),u=Math.pow(r.k2*d,2);n=i.divide2d(n,i.sum2d(n));var h=a.filter2(n,t,"valid"),f=a.filter2(n,e,"valid"),l=i.square2d(h),s=i.square2d(f),v=i.multiply2d(h,f),c=i.square2d(t),w=i.square2d(e),g=i.subtract2d(a.filter2(n,c,"valid"),l),p=i.subtract2d(a.filter2(n,w,"valid"),s),y=i.subtract2d(a.filter2(n,i.multiply2d(t,e),"valid"),v);if(o>0&&u>0){var m=i.add2d(i.multiply2d(v,2),o),b=i.add2d(i.multiply2d(y,2),u),M=i.add2d(i.add2d(l,s),o),_=i.add2d(i.add2d(g,p),u);return i.divide2d(i.multiply2d(m,b),i.multiply2d(M,_))}var j=i.multiply2d(v,2),O=i.multiply2d(y,2),P=i.add2d(l,s),k=i.add2d(g,p);return i.divide2d(i.multiply2d(j,O),i.multiply2d(P,k))};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.bezkrovnySsim=void 0;var i=r(0),a=r(1);function n(t,e,r){var a=t.data,n=e.data,d=r.bitDepth,o=r.k1,u=r.k2,h=Math.pow(2,d)-1,f=Math.pow(o*h,2),l=Math.pow(u*h,2),s=i.average(a),v=i.average(n),c=i.variance(a,s),w=i.variance(n,v);return (2*s*v+f)*(2*i.covariance(a,n,s,v)+l)/((Math.pow(s,2)+Math.pow(v,2)+f)*(c+w+l))}e.bezkrovnySsim=function(t,e,r){for(var i=r.windowSize,d=Math.ceil(t.width/i),o=Math.ceil(t.height/i),u=new Array(d*o),h=0,f=0;f<t.height;f+=i)for(var l=0;l<t.width;l+=i){var s=Math.min(i,t.width-l),v=Math.min(i,t.height-f),c=a.sub(t,l,v,f,s),w=a.sub(e,l,v,f,s);u[h++]=n(c,w,r);}return {data:u,width:d,height:o}};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.downsample=void 0;var i=r(0),a=r(1);function n(t,e,r){var i=a.imfilter(t,e,"symmetric","same");return a.skip2d(i,[0,r,i.height],[0,r,i.width])}e.downsample=function(t,e){return "original"===e.downsample?function(t,e,r){void 0===r&&(r=256);var d=Math.min(t.width,e.height)/r,o=Math.round(d);if(o>1){var u=a.ones(o);t=n(t,u=i.divide2d(u,i.sum2d(u)),o),e=n(e,u,o);}return [t,e]}(t[0],t[1],e.maxSize):t};},function(t,e,r){Object.defineProperty(e,"__esModule",{value:!0}),e.defaults=void 0,e.defaults={windowSize:11,k1:.01,k2:.03,bitDepth:8,downsample:"original",ssim:"fast",maxSize:256};}])}));

});

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
    let Images = [];
    let Canvas = document.createElement("canvas");
    Canvas.width = this.Width;
    Canvas.height = this.Height;
    let Ctx = Canvas.getContext("2d");
    let Confidence = -Infinity;
    let Result = "";
    for (let Rule of this.Rules) {
      if (!ItemRecognition.Images[Rule.id]) continue;
      Ctx.clearRect(0, 0, Canvas.width, Canvas.height);
      Ctx.drawImage(
        ItemRecognition.Images[Rule.id],
        0,
        0,
        ItemRecognition.Images[Rule.id].width,
        ItemRecognition.Images[Rule.id].height,
        0,
        0,
        Canvas.width,
        Canvas.height
      );
      let ImageD = Ctx.getImageData(0, 0, Canvas.width, Canvas.height);
      Images.push([Rule.id, ImageD]);
    }
    for (let Image of Images) {
      let SSIM = ssim_web.ssim(Image[1], this.IData, { windowSize: 8, ssim: "bezkrovny" }).mssim;
      if (SSIM > Confidence) {
        Confidence = SSIM;
        Result = Image[0];
      }
    }
    this.Confidence.ItemId = Confidence;
    return Result;
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
  static init(Image) {
    this.Images = Image;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJvcFJlY29nbml0aW9uLmpzIiwic291cmNlcyI6WyIuLi9zcmMvUmVjdGFuZ2xlLmpzIiwiLi4vc3JjL0Nvbm5lY3RlZEFyZWFSZWNvZ25pdGlvbi5qcyIsIi4uL3NyYy9SZWN0UmVjb2duaXRpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vc3JjL1N0YWdlUmVjb2duaXRpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvc3NpbS5qcy9kaXN0L3NzaW0ud2ViLmpzIiwiLi4vc3JjL0l0ZW1SZWNvZ25pdGlvbi5qcyIsIi4uL3NyYy9Ecm9wUmVjb2duaXRpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvd2ViZm9udGxvYWRlci93ZWJmb250bG9hZGVyLmpzIiwiLi4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlIHtcbiAgY29uc3RydWN0b3IoZGF0YSA9IHt9KSB7XG4gICAgdGhpcy5sZWZ0ID0gZGF0YS5sZWZ0IHx8IDA7XG4gICAgdGhpcy50b3AgPSBkYXRhLnRvcCB8fCAwO1xuICAgIHRoaXMucmlnaHQgPSBkYXRhLnJpZ2h0IHx8IDA7XG4gICAgdGhpcy5ib3R0b20gPSBkYXRhLmJvdHRvbSB8fCAwO1xuICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xuICAgICAgaWYgKCEoa2V5IGluIHRoaXMpKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB1cGRhdGUoZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRoaXMsIGRhdGEpO1xuICB9XG4gIGRpcmVjdGlvbihSZWN0Mikge1xuICAgIGxldCBsZWZ0ID0gUmVjdDIucmlnaHQgPCB0aGlzLmxlZnQ7XG4gICAgbGV0IHJpZ2h0ID0gUmVjdDIubGVmdCA+IHRoaXMucmlnaHQ7XG4gICAgbGV0IHRvcCA9IFJlY3QyLmJvdHRvbSA8IHRoaXMudG9wO1xuICAgIGxldCBib3R0b20gPSBSZWN0Mi50b3AgPiB0aGlzLmJvdHRvbTtcbiAgICByZXR1cm4gW2xlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbV07XG4gIH1cbiAgbWVyZ2UoUmVjdDIpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGUoe1xuICAgICAgbGVmdDogTWF0aC5taW4odGhpcy5sZWZ0LCBSZWN0Mi5sZWZ0KSxcbiAgICAgIHJpZ2h0OiBNYXRoLm1heCh0aGlzLnJpZ2h0LCBSZWN0Mi5yaWdodCksXG4gICAgICB0b3A6IE1hdGgubWluKHRoaXMudG9wLCBSZWN0Mi50b3ApLFxuICAgICAgYm90dG9tOiBNYXRoLm1heCh0aGlzLmJvdHRvbSwgUmVjdDIuYm90dG9tKVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiDorqHnrpfnn6nlvaLot53nprtcbiAgICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2MTc4MDE1XG4gICAqIEBwYXJhbSB7Kn0gUmVjdDJcbiAgICovXG4gIGRpc3RhbmNlKFJlY3QyKSB7XG4gICAgbGV0IFtsZWZ0LCByaWdodCwgdG9wLCBib3R0b21dID0gdGhpcy5kaXJlY3Rpb24oUmVjdDIpO1xuICAgIGlmIChsZWZ0ICYmIHRvcCkge1xuICAgICAgcmV0dXJuIE1hdGguaHlwb3QodGhpcy5sZWZ0IC0gUmVjdDIucmlnaHQsIHRoaXMudG9wIC0gUmVjdDIuYm90dG9tKTtcbiAgICB9IGVsc2UgaWYgKHJpZ2h0ICYmIHRvcCkge1xuICAgICAgcmV0dXJuIE1hdGguaHlwb3QodGhpcy5yaWdodCAtIFJlY3QyLmxlZnQsIHRoaXMudG9wIC0gUmVjdDIuYm90dG9tKTtcbiAgICB9IGVsc2UgaWYgKGxlZnQgJiYgYm90dG9tKSB7XG4gICAgICByZXR1cm4gTWF0aC5oeXBvdCh0aGlzLmxlZnQgLSBSZWN0Mi5yaWdodCwgdGhpcy5ib3R0b20gLSBSZWN0Mi50b3ApO1xuICAgIH0gZWxzZSBpZiAocmlnaHQgJiYgYm90dG9tKSB7XG4gICAgICByZXR1cm4gTWF0aC5oeXBvdCh0aGlzLnJpZ2h0IC0gUmVjdDIubGVmdCwgdGhpcy5ib3R0b20gLSBSZWN0Mi50b3ApO1xuICAgIH0gZWxzZSBpZiAobGVmdCkge1xuICAgICAgcmV0dXJuIHRoaXMubGVmdCAtIFJlY3QyLnJpZ2h0O1xuICAgIH0gZWxzZSBpZiAocmlnaHQpIHtcbiAgICAgIHJldHVybiBSZWN0Mi5sZWZ0IC0gdGhpcy5yaWdodDtcbiAgICB9IGVsc2UgaWYgKHRvcCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9wIC0gUmVjdDIuYm90dG9tO1xuICAgIH0gZWxzZSBpZiAoYm90dG9tKSB7XG4gICAgICByZXR1cm4gUmVjdDIudG9wIC0gdGhpcy5ib3R0b207XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucmlnaHQgLSB0aGlzLmxlZnQgKyAxO1xuICB9XG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYm90dG9tIC0gdGhpcy50b3AgKyAxO1xuICB9XG4gIGdldCBhcmVhKCl7XG4gICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodDtcbiAgfVxufVxuIiwiaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi9SZWN0YW5nbGVcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3RlZEFyZWFSZWNvZ25pdGlvbiB7XG4gIGNvbnN0cnVjdG9yKE1hdHJpeCwgTm9kZSwgR2V0TWF0cml4KSB7XG4gICAgdGhpcy5NYXRyaXggPSBNYXRyaXg7XG4gICAgaWYgKE5vZGUpIHRoaXMuTm9kZSA9IE5vZGU7XG4gICAgaWYgKEdldE1hdHJpeCkge1xuICAgICAgdGhpcy5HZXRNYXRyaXggPSBHZXRNYXRyaXg7XG4gICAgfVxuICB9XG4gIEdldENvbm5lY3RlZEFyZWEoVmVydGV4LCBDYWxsYmFjaykge1xuICAgIGxldCBSZXN1bHQgPSB0aGlzLkJGUyh0aGlzLk1hdHJpeCwgVmVydGV4KTtcbiAgICBpZiAodGhpcy5HZXRNYXRyaXgpIHtcbiAgICAgIGxldCBNYXRyaXggPSBbXTtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgUmVzdWx0LmhlaWdodDsgeSsrKSB7XG4gICAgICAgIE1hdHJpeC5wdXNoKG5ldyBBcnJheShSZXN1bHQud2lkdGgpLmZpbGwoZmFsc2UpKTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGFWZXJ0ZXggb2YgUmVzdWx0Lm1hdHJpeCkge1xuICAgICAgICBNYXRyaXhbYVZlcnRleFsxXS1SZXN1bHQudG9wXVthVmVydGV4WzBdLVJlc3VsdC5sZWZ0XSA9IHRydWU7XG4gICAgICB9XG4gICAgICBSZXN1bHQubWF0cml4ID0gTWF0cml4O1xuICAgIH1cbiAgICBpZiAoQ2FsbGJhY2spIFJlc3VsdCA9IENhbGxiYWNrKFJlc3VsdCk7XG4gICAgcmV0dXJuIFJlc3VsdDtcbiAgfVxuICBHZXRBbGxDb25uZWN0ZWRBcmVhKENhbGxiYWNrKSB7XG4gICAgbGV0IFF1ZXVlID0gdGhpcy5Ob2RlLnZhbHVlcygpO1xuICAgIGxldCBSZXQgPSBbXTtcbiAgICBmb3IgKGxldCBWZXJ0ZXggb2YgUXVldWUpIHtcbiAgICAgIGxldCBSZXN1bHQgPSBDYWxsYmFja1xuICAgICAgICA/IHRoaXMuR2V0Q29ubmVjdGVkQXJlYShbTWF0aC5mbG9vcihWZXJ0ZXggLyAxMDAwMCksIFZlcnRleCAlIDEwMDAwXSwgQ2FsbGJhY2spXG4gICAgICAgIDogdGhpcy5HZXRDb25uZWN0ZWRBcmVhKFtNYXRoLmZsb29yKFZlcnRleCAvIDEwMDAwKSwgVmVydGV4ICUgMTAwMDBdKTtcbiAgICAgIGlmIChSZXN1bHQpIHtcbiAgICAgICAgUmV0LnB1c2goUmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFJldDtcbiAgfVxuICBCRlMoTWF0cml4LCBWZXJ0ZXgpIHtcbiAgICBsZXQgUmVjdCA9IG5ldyBSZWN0YW5nbGUoe1xuICAgICAgbGVmdDogSW5maW5pdHksXG4gICAgICByaWdodDogLUluZmluaXR5LFxuICAgICAgdG9wOiBJbmZpbml0eSxcbiAgICAgIGJvdHRvbTogLUluZmluaXR5LFxuICAgICAgcG9pbnQ6IDBcbiAgICB9KTtcbiAgICBpZiAodGhpcy5HZXRNYXRyaXgpIHtcbiAgICAgIFJlY3QubWF0cml4ID0gW107XG4gICAgfVxuICAgIGxldCBRdWV1ZSA9IFtdO1xuICAgIGxldCBEaXJlY3Rpb24gPSBbXG4gICAgICBbMCwgLTFdLFxuICAgICAgWzEsIDBdLFxuICAgICAgWzAsIDFdLFxuICAgICAgWy0xLCAwXVxuICAgIF07XG4gICAgUmVjdC51cGRhdGUoe1xuICAgICAgbGVmdDogTWF0aC5taW4oUmVjdC5sZWZ0LCBWZXJ0ZXhbMF0pLFxuICAgICAgcmlnaHQ6IE1hdGgubWF4KFJlY3QucmlnaHQsIFZlcnRleFswXSksXG4gICAgICB0b3A6IE1hdGgubWluKFJlY3QudG9wLCBWZXJ0ZXhbMV0pLFxuICAgICAgYm90dG9tOiBNYXRoLm1heChSZWN0LmJvdHRvbSwgVmVydGV4WzFdKVxuICAgIH0pO1xuICAgIE1hdHJpeFtWZXJ0ZXhbMV1dW1ZlcnRleFswXV0gPSBmYWxzZTtcbiAgICBpZiAodGhpcy5Ob2RlKSB0aGlzLk5vZGUuZGVsZXRlKFZlcnRleFswXSAqIDEwMDAwICsgVmVydGV4WzFdKTtcbiAgICBRdWV1ZS5wdXNoKFZlcnRleCk7XG4gICAgd2hpbGUgKFF1ZXVlLmxlbmd0aCAhPSAwKSB7XG4gICAgICBSZWN0LnBvaW50Kys7XG4gICAgICBsZXQgTm93VmVydGV4ID0gUXVldWUuc2hpZnQoKTtcbiAgICAgIGlmICh0aGlzLkdldE1hdHJpeCkge1xuICAgICAgICBSZWN0Lm1hdHJpeC5wdXNoKE5vd1ZlcnRleCk7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBkID0gMDsgZCA8IERpcmVjdGlvbi5sZW5ndGg7IGQrKykge1xuICAgICAgICBsZXQgTmV4dFZlcnRleCA9IFtOb3dWZXJ0ZXhbMF0gKyBEaXJlY3Rpb25bZF1bMF0sIE5vd1ZlcnRleFsxXSArIERpcmVjdGlvbltkXVsxXV07XG4gICAgICAgIGlmIChcbiAgICAgICAgICBOZXh0VmVydGV4WzBdIDwgMCB8fFxuICAgICAgICAgIE5leHRWZXJ0ZXhbMV0gPCAwIHx8XG4gICAgICAgICAgTmV4dFZlcnRleFswXSA+PSBNYXRyaXhbMF0ubGVuZ3RoIHx8XG4gICAgICAgICAgTmV4dFZlcnRleFsxXSA+PSBNYXRyaXgubGVuZ3RoXG4gICAgICAgIClcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKE1hdHJpeFtOZXh0VmVydGV4WzFdXVtOZXh0VmVydGV4WzBdXSkge1xuICAgICAgICAgIFJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgIGxlZnQ6IE1hdGgubWluKFJlY3QubGVmdCwgTmV4dFZlcnRleFswXSksXG4gICAgICAgICAgICByaWdodDogTWF0aC5tYXgoUmVjdC5yaWdodCwgTmV4dFZlcnRleFswXSksXG4gICAgICAgICAgICB0b3A6IE1hdGgubWluKFJlY3QudG9wLCBOZXh0VmVydGV4WzFdKSxcbiAgICAgICAgICAgIGJvdHRvbTogTWF0aC5tYXgoUmVjdC5ib3R0b20sIE5leHRWZXJ0ZXhbMV0pXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgTWF0cml4W05leHRWZXJ0ZXhbMV1dW05leHRWZXJ0ZXhbMF1dID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHRoaXMuTm9kZSkgdGhpcy5Ob2RlLmRlbGV0ZShOZXh0VmVydGV4WzBdICogMTAwMDAgKyBOZXh0VmVydGV4WzFdKTtcbiAgICAgICAgICBRdWV1ZS5wdXNoKE5leHRWZXJ0ZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBSZWN0O1xuICB9XG59XG4iLCJpbXBvcnQgQ29ubmVjdGVkQXJlYVJlY29nbml0aW9uIGZyb20gXCIuL0Nvbm5lY3RlZEFyZWFSZWNvZ25pdGlvblwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdFJlY29nbml0aW9uIHtcbiAgY29uc3RydWN0b3IoSW1hZ2VEYXRhKSB7XG4gICAgbGV0IGhlaWdodCA9IEltYWdlRGF0YS5sZW5ndGg7XG4gICAgbGV0IHdpZHRoID0gSW1hZ2VEYXRhWzBdLmxlbmd0aDtcbiAgICB0aGlzLkltYWdlRGF0YSA9IEltYWdlRGF0YTtcbiAgICB0aGlzLk5vZGUgPSBuZXcgU2V0KCk7XG4gICAgLyog57KX5qOA5rWL5YWz5Y2h5o6J6JC95L+h5oGv5Yy65Z+fICovXG4gICAgbGV0IFlBeGlzID0gQXJyYXkoaGVpZ2h0KS5maWxsKDApO1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuICAgICAgICBZQXhpc1t5XSArPSBJbWFnZURhdGFbeV1beF1bMF0gKyBJbWFnZURhdGFbeV1beF1bMV0gKyBJbWFnZURhdGFbeV1beF1bMl07XG4gICAgICB9XG4gICAgICBZQXhpc1t5XSAvPSAzO1xuICAgIH1cbiAgICBsZXQgRGF0YUFyZWFTcGlsdCA9IC0xO1xuICAgIGZvciAobGV0IHkgPSAxOyB5IDwgaGVpZ2h0OyB5KyspIHtcbiAgICAgIGlmIChZQXhpc1t5IC0gMV0gLSBZQXhpc1t5XSA+IDIwMDAwKSB7XG4gICAgICAgIGxldCBjYW5jZWwgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XG4gICAgICAgICAgaWYgKEltYWdlRGF0YVt5XVt4XS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKSAvIDMgPiAxMDApIHtcbiAgICAgICAgICAgIGNhbmNlbCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhbmNlbCkgY29udGludWU7XG4gICAgICAgIERhdGFBcmVhU3BpbHQgPSB5O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5EYXRhQXJlYVNwaWx0ID0gRGF0YUFyZWFTcGlsdDtcbiAgICBsZXQgQmluYXJpemF0aW9uTWF0cml4ID0gdGhpcy5CaW5hcml6YXRpb24od2lkdGgsIGhlaWdodCwgSW1hZ2VEYXRhKTtcbiAgICBsZXQgQ29ubmVjdGVkQXJlYSA9IG5ldyBDb25uZWN0ZWRBcmVhUmVjb2duaXRpb24oQmluYXJpemF0aW9uTWF0cml4LCB0aGlzLk5vZGUpO1xuICAgIGxldCBtZXJnZWRSZWN0cyA9IHRoaXMuQXV0b21lcmdlUmVjdChcbiAgICAgIENvbm5lY3RlZEFyZWEuR2V0QWxsQ29ubmVjdGVkQXJlYShSZXN1bHQgPT4ge1xuICAgICAgICBSZXN1bHQudXBkYXRlKHtcbiAgICAgICAgICB0b3A6IFJlc3VsdC50b3AgKyBEYXRhQXJlYVNwaWx0LFxuICAgICAgICAgIGJvdHRvbTogUmVzdWx0LmJvdHRvbSArIERhdGFBcmVhU3BpbHRcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChSZXN1bHQucG9pbnQgPiAxMDApIHtcbiAgICAgICAgICBkZWxldGUgUmVzdWx0LnBvaW50O1xuICAgICAgICAgIHJldHVybiBSZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLkJvdW5kKG1lcmdlZFJlY3RzKTtcbiAgICB0aGlzLkdldERyb3BUeXBlKG1lcmdlZFJlY3RzLlJpZ2h0LCBJbWFnZURhdGEpO1xuICAgIHRoaXMubWVyZ2VkUmVjdHMgPSBtZXJnZWRSZWN0cztcbiAgICBkZWxldGUgdGhpcy5EYXRhQXJlYVNwaWx0O1xuICAgIGRlbGV0ZSB0aGlzLk5vZGU7XG4gICAgZGVsZXRlIHRoaXMuSW1hZ2VEYXRhO1xuICB9XG4gIC8vIOivhuWIq+i+ueeVjFxuICBCb3VuZChSZWN0cykge1xuICAgIHRoaXMuU3RhZ2UgPSBSZWN0cy5TdGFnZTtcbiAgICB0aGlzLkl0ZW1zID0gW107XG4gICAgZm9yIChsZXQgUmVjdCBvZiBSZWN0cy5SaWdodCkge1xuICAgICAgaWYgKE1hdGguYWJzKFJlY3QuaGVpZ2h0IC8gUmVjdC53aWR0aCAtIDEpIDwgMC4yICYmIFJlY3QuaGVpZ2h0ID4gNTAgJiYgUmVjdC53aWR0aCA+IDUwKSB7XG4gICAgICAgIHRoaXMuSXRlbXMucHVzaChSZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5JdGVtcy5zb3J0KChhLCBiKSA9PiBhLmxlZnQgLSBiLmxlZnQpO1xuICB9XG4gIEdldERyb3BUeXBlKFJlY3RzLCBJbWFnZURhdGEpIHtcbiAgICBsZXQgdG9wID0gdGhpcy5JdGVtcy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLmJvdHRvbSwgMCkgLyB0aGlzLkl0ZW1zLmxlbmd0aDtcbiAgICBsZXQgRHJvcFR5cGUgPSBbXTtcbiAgICBmb3IgKGxldCBSZWN0IG9mIFJlY3RzKSB7XG4gICAgICBpZiAoUmVjdC50b3AgPiB0b3AgJiYgUmVjdC53aWR0aCAvIFJlY3QuaGVpZ2h0ID4gMykge1xuICAgICAgICBEcm9wVHlwZS5wdXNoKHtcbiAgICAgICAgICBsZWZ0OiBSZWN0LmxlZnQsXG4gICAgICAgICAgcmlnaHQ6IFJlY3QucmlnaHQsXG4gICAgICAgICAgdHlwZTogdGhpcy5Db21wYXJlVHlwZShJbWFnZURhdGFbUmVjdC50b3BdWyhSZWN0LmxlZnQgKyBSZWN0LnJpZ2h0KSA+PiAxXSlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IFJlY3Qgb2YgdGhpcy5JdGVtcykge1xuICAgICAgZm9yIChsZXQgdHlwZSBvZiBEcm9wVHlwZSkge1xuICAgICAgICBsZXQgW2xlZnQsIHJpZ2h0XSA9IFJlY3QuZGlyZWN0aW9uKHR5cGUpO1xuICAgICAgICBpZiAoIWxlZnQgJiYgIXJpZ2h0KSB7XG4gICAgICAgICAgUmVjdC50eXBlID0gdHlwZS50eXBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFJHQkRpZmYocmdiMSwgcmdiMikge1xuICAgIHJldHVybiByZ2IxLm1hcCgodiwgaSkgPT4gTWF0aC5hYnModiAtIHJnYjJbaV0pKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcbiAgfVxuICBDb21wYXJlVHlwZShyZ2IpIHtcbiAgICBsZXQgVHlwZSA9IE9iamVjdC5lbnRyaWVzKFJlY3RSZWNvZ25pdGlvbi5Ecm9wVHlwZUNvbG9yKTtcbiAgICBmb3IgKGxldCBbdHlwZSwgY29sb3JdIG9mIFR5cGUpIHtcbiAgICAgIGlmIChjb2xvciguLi5yZ2IpKSB7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gXCJBTExfRFJPUFwiO1xuICB9XG4gIEJpbmFyaXphdGlvbih3aWR0aCwgaGVpZ2h0LCBJbWFnZURhdGEpIHtcbiAgICBsZXQgTWF0cml4ID0gW107XG4gICAgZm9yIChsZXQgeSA9IHRoaXMuRGF0YUFyZWFTcGlsdCwgcnkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcbiAgICAgIE1hdHJpeC5wdXNoKFtdKTtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuICAgICAgICBNYXRyaXhbcnldW3hdID0gKEltYWdlRGF0YVt5XVt4XVswXSArIEltYWdlRGF0YVt5XVt4XVsxXSArIEltYWdlRGF0YVt5XVt4XVsyXSkgLyAzIDwgNzUgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIGlmIChNYXRyaXhbcnldW3hdKSB7XG4gICAgICAgICAgdGhpcy5Ob2RlLmFkZCh4ICogMTAwMDAgKyByeSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJ5Kys7XG4gICAgfVxuICAgIHJldHVybiBNYXRyaXg7XG4gIH1cbiAgc29ydFJlY3QoUmVjdDEsIFJlY3QyKSB7XG4gICAgbGV0IHkgPSBSZWN0MS50b3AgLSBSZWN0Mi50b3AsXG4gICAgICB4ID0gUmVjdDEubGVmdCAtIFJlY3QyLmxlZnQ7XG4gICAgaWYgKHkgPT0gMCkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB5O1xuICAgIH1cbiAgfVxuICAvKipcbiAgICog5ZCI5bm26L6555WM6Led56a75Zyo5LiA5a6a6IyD5Zu05YaF55qE6L+e6YCa5Yy6XG4gICAqIEBwYXJhbSB7Kn0gUmVjdHNcbiAgICovXG4gIEF1dG9tZXJnZVJlY3QoUmVjdHMpIHtcbiAgICAvLyDmkJzntKLlh7rkuK3pl7TnmoTnq5bnur8g5Lul5a6D5Li65Y+C6ICDXG4gICAgbGV0IE1pZGRsZUxpbmUgPSB7IHRvcDogMSwgYm90dG9tOiAwIH07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBSZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFJlY3RzW2ldLmJvdHRvbSAtIFJlY3RzW2ldLnRvcCA+IE1pZGRsZUxpbmUuYm90dG9tIC0gTWlkZGxlTGluZS50b3ApIHtcbiAgICAgICAgTWlkZGxlTGluZSA9IFJlY3RzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgTWlkZGxlWCA9IChNaWRkbGVMaW5lLnJpZ2h0ICsgTWlkZGxlTGluZS5sZWZ0KSAvIDI7XG4gICAgbGV0IExlZnRSZWN0ID0gW10sXG4gICAgICBSaWdodFJlY3QgPSBbXTtcbiAgICBmb3IgKGxldCBSZWN0IG9mIFJlY3RzKSB7XG4gICAgICBpZiAoUmVjdC5yaWdodCA8IE1pZGRsZVgpIHtcbiAgICAgICAgaWYgKHRoaXMuSVNDaGFyKFJlY3QpKSB7XG4gICAgICAgICAgTGVmdFJlY3QucHVzaChSZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoUmVjdC5sZWZ0ID4gTWlkZGxlWCkge1xuICAgICAgICBSaWdodFJlY3QucHVzaChSZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgTGVmdFJlY3Quc29ydCh0aGlzLnNvcnRSZWN0KTtcbiAgICBsZXQgU3RhZ2VSZWN0ID0gTGVmdFJlY3Quc2hpZnQoKTtcbiAgICBmb3IgKGxldCBSZWN0IG9mIExlZnRSZWN0KSB7XG4gICAgICBsZXQgW2xlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbV0gPSBTdGFnZVJlY3QuZGlyZWN0aW9uKFJlY3QpO1xuICAgICAgaWYgKChyaWdodCB8fCBsZWZ0KSAmJiAhdG9wICYmICFib3R0b20pIHtcbiAgICAgICAgU3RhZ2VSZWN0Lm1lcmdlKFJlY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBNZXJnZSA9IChSZWN0cywgcSkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBSZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBSZWN0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmIChSZWN0c1tpXS5kaXN0YW5jZShSZWN0c1tqXSkgPCBxKSB7XG4gICAgICAgICAgICBSZWN0c1tpXS5tZXJnZShSZWN0c1tqXSk7XG4gICAgICAgICAgICBkZWxldGUgUmVjdHMuc3BsaWNlKGosIDEpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gUmVjdHM7XG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgU3RhZ2U6IFN0YWdlUmVjdCxcbiAgICAgIFJpZ2h0OiBNZXJnZShSaWdodFJlY3QsIDEwKSxcbiAgICAgIE1pZGRsZTogTWlkZGxlTGluZVxuICAgIH07XG4gIH1cbiAgSVNDaGFyKFJlY3QpIHtcbiAgICBsZXQgQyA9IDA7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBSZWN0LmhlaWdodDsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IFJlY3Qud2lkdGg7IHgrKykge1xuICAgICAgICBsZXQgW1IsIEcsIEJdID0gdGhpcy5JbWFnZURhdGFbeSArIFJlY3QudG9wXVt4ICsgUmVjdC5sZWZ0XTtcbiAgICAgICAgbGV0IEEgPSAyNTU7XG4gICAgICAgIGxldCBEID0gKE1hdGguYWJzKFIgLSBBKSArIE1hdGguYWJzKEcgLSBBKSArIE1hdGguYWJzKEIgLSBBKSkgLyAzO1xuICAgICAgICBpZiAoRCA8IDMwKSB7XG4gICAgICAgICAgQysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBDIC8gKFJlY3Qud2lkdGggKiBSZWN0LmhlaWdodCkgPiAwLjE7XG4gIH1cbn1cblJlY3RSZWNvZ25pdGlvbi5Ecm9wVHlwZUNvbG9yID0ge1xuICBTUEVDSUFMX0RST1A6IChSLCBHLCBCKSA9PiB7XG4gICAgcmV0dXJuIE1hdGguYWJzKFIgLSAyNDApIDwgNSAmJiBNYXRoLmFicyhHIC0gMTAwKSA8IDEwICYmIEIgPCA1MDtcbiAgfSxcbiAgTk9STUFMX0RST1A6IChSLCBHLCBCKSA9PiB7XG4gICAgcmV0dXJuIE1hdGguYWJzKFIgLSAxNzUpICsgTWF0aC5hYnMoRyAtIDE3NSkgKyBNYXRoLmFicyhCIC0gMTc1KSA8IDIwO1xuICB9LFxuICBFWFRSQV9EUk9QOiAoUiwgRywgQikgPT4ge1xuICAgIHJldHVybiBHID4gUiAmJiBHID4gQiAmJiBCIDwgMTUwICYmIFIgPiAyMDAgJiYgRyA+IDIwMDtcbiAgfSxcbiAgRklYRURfRFJPUDogKFIsIEcsIEIpID0+IHtcbiAgICByZXR1cm4gUiA+IDIwMCAmJiBNYXRoLmFicyhHIC0gMjAwKSA8IDIwICYmIEIgPCAxMjA7XG4gIH0sXG4gIExVQ0tZX0RST1A6IChSLCBHLCBCKSA9PiB7XG4gICAgcmV0dXJuIE1hdGguYWJzKFIgLSAyNTApIDwgNSAmJiBNYXRoLmFicyhHIC0gMTAwKSA8IDEwICYmIEIgPCA1MDtcbiAgfVxufTtcbiIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJpbXBvcnQgXCIuL0RhdGEvRm9udC5jc3NcIjtcbmltcG9ydCBGb250U2l6ZURhdGEgZnJvbSBcIi4vRGF0YS9TdGFnZUZvbnRTaXplLmpzb25cIjtcbmltcG9ydCBDb25uZWN0ZWRBcmVhUmVjb2duaXRpb24gZnJvbSBcIi4vQ29ubmVjdGVkQXJlYVJlY29nbml0aW9uXCI7XG5cbmxldCBGb250Q2FjaGUgPSB7fTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0YWdlUmVjb2duaXRpb24oSW1hZ2VNYXRyaXgpIHtcbiAgbGV0IE1hdHJpeCA9IFtdO1xuICBsZXQgQ29uZmlkZW5jZSA9IFtdO1xuICBsZXQgTm9kZSA9IG5ldyBTZXQoKTtcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCBJbWFnZU1hdHJpeC5sZW5ndGg7IHkrKykge1xuICAgIE1hdHJpeC5wdXNoKFtdKTtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IEltYWdlTWF0cml4WzBdLmxlbmd0aDsgeCsrKSB7XG4gICAgICBsZXQgW1IsIEcsIEJdID0gSW1hZ2VNYXRyaXhbeV1beF07XG4gICAgICBNYXRyaXhbeV1beF0gPSAoUiArIEcgKyBCKSAvIDMgPiA4MDtcbiAgICAgIGlmIChNYXRyaXhbeV1beF0pIHtcbiAgICAgICAgTm9kZS5hZGQoeCAqIDEwMDAwICsgeSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGxldCBnZXRDb25uZWN0ZWRBcmVhID0gbmV3IENvbm5lY3RlZEFyZWFSZWNvZ25pdGlvbihNYXRyaXgsIE5vZGUsIHRydWUpO1xuICBsZXQgQ29ubmVjdGVkQXJlYXMgPSBnZXRDb25uZWN0ZWRBcmVhLkdldEFsbENvbm5lY3RlZEFyZWEoKS5zb3J0KChhLCBiKSA9PiBhLmxlZnQgLSBiLmxlZnQpO1xuICBsZXQgQ2hhcnMgPSBbXTtcbiAgbGV0IFNwbGl0Q2hhcjtcbiAgZm9yIChsZXQgQ2hhciBvZiBDb25uZWN0ZWRBcmVhcykge1xuICAgIGlmIChDaGFyLmhlaWdodCA8IE1hdHJpeC5sZW5ndGggPj4gMSkge1xuICAgICAgQ2hhcnMucHVzaChcIi1cIik7XG4gICAgICBTcGxpdENoYXIgPSBDaGFyO1xuICAgIH0gZWxzZSB7XG4gICAgICBDaGFycy5wdXNoKFwiXCIpO1xuICAgIH1cbiAgfVxuICBsZXQgRm9udFNpemUgPSBnZXRGb250U2l6ZShTcGxpdENoYXIpO1xuICBpZiAoIUZvbnRDYWNoZVtGb250U2l6ZV0pIHtcbiAgICBGb250Q2FjaGVbRm9udFNpemVdID0gZ2VuRm9udERhdGEoRm9udFNpemUpO1xuICB9XG4gIGZvciAobGV0IFtJbmRleCwgQ2hhcl0gb2YgQ2hhcnMuZW50cmllcygpKSB7XG4gICAgaWYgKENoYXIgPT0gXCItXCIpIHtcbiAgICAgIENvbmZpZGVuY2UucHVzaCgxKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBsZXQgUmVzdWx0ID0gY29tcGFyZU51bWJlcihDb25uZWN0ZWRBcmVhc1tJbmRleF0ubWF0cml4LCBGb250Q2FjaGVbRm9udFNpemVdKTtcbiAgICBDaGFyc1tJbmRleF0gPSBSZXN1bHRbMF07XG4gICAgbGV0IE51bUNvbmYgPSBSZXN1bHRbMV07XG4gICAgaWYgKFJlc3VsdFsxXSA8IDAuOSkge1xuICAgICAgUmVzdWx0ID0gY29tcGFyZUNoYXIoQ29ubmVjdGVkQXJlYXNbSW5kZXhdLm1hdHJpeCwgRm9udENhY2hlW0ZvbnRTaXplXSk7XG4gICAgICBpZiAoUmVzdWx0WzFdID4gTnVtQ29uZikge1xuICAgICAgICBDaGFyc1tJbmRleF0gPSBSZXN1bHRbMF07XG4gICAgICAgIENvbmZpZGVuY2UucHVzaChSZXN1bHRbMV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQ29uZmlkZW5jZS5wdXNoKE51bUNvbmYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBDb25maWRlbmNlLnB1c2goTnVtQ29uZik7XG4gICAgfVxuICB9XG4gIHJldHVybiBbQ2hhcnMuam9pbignJyksQ29uZmlkZW5jZS5yZWR1Y2UoKGEsYik9PmErYikvQ29uZmlkZW5jZS5sZW5ndGhdXG59XG5mdW5jdGlvbiBnZXRGb250U2l6ZShDaGFyUmVjdCkge1xuICBsZXQgRmluZCA9IGZhbHNlO1xuICBsZXQgUmV0O1xuICBsZXQgRGlmZiA9IEluZmluaXR5O1xuICBmb3IgKGxldCBbU2l6ZSwgUmVjdF0gb2YgT2JqZWN0LmVudHJpZXMoRm9udFNpemVEYXRhKSkge1xuICAgIGxldCBEID0gTWF0aC5hYnMoUmVjdC53aWR0aCAtIENoYXJSZWN0LndpZHRoKSArIE1hdGguYWJzKFJlY3QuaGVpZ2h0IC0gQ2hhclJlY3QuaGVpZ2h0KTtcbiAgICBpZiAoRCA8PSBEaWZmKSB7XG4gICAgICBEaWZmID0gRDtcbiAgICAgIFJldCA9IFNpemU7XG4gICAgICBpZiAoRCA9PSAwKSB7XG4gICAgICAgIEZpbmQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoRmluZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBSZXQ7XG59XG5mdW5jdGlvbiBjb21wYXJlTnVtYmVyKE1hdHJpeCwgRm9udCkge1xuICBsZXQgTnVtYmVyID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldO1xuICBsZXQgQ29uZmlkZW5jZSA9IC1JbmZpbml0eTtcbiAgbGV0IFJlc3VsdDtcbiAgZm9yIChsZXQgTnVtIG9mIE51bWJlcikge1xuICAgIGxldCBDb25mID0gY29tcGFyZU1hdHJpeChNYXRyaXgsRm9udFtOdW1dKTtcbiAgICBpZiAoQ29uZiA+IENvbmZpZGVuY2UpIHtcbiAgICAgIENvbmZpZGVuY2UgPSBDb25mO1xuICAgICAgUmVzdWx0ID0gTnVtO1xuICAgIH1cbiAgfVxuICByZXR1cm4gW1Jlc3VsdCwgQ29uZmlkZW5jZV07XG59XG5mdW5jdGlvbiBjb21wYXJlQ2hhcihNYXRyaXgsIEZvbnQpIHtcbiAgbGV0IENoYXJzID0gW1xuICAgIFwiQVwiLFxuICAgIFwiQlwiLFxuICAgIFwiQ1wiLFxuICAgIFwiRFwiLFxuICAgIFwiRVwiLFxuICAgIFwiRlwiLFxuICAgIFwiR1wiLFxuICAgIFwiSFwiLFxuICAgIFwiSVwiLFxuICAgIFwiSlwiLFxuICAgIFwiS1wiLFxuICAgIFwiTFwiLFxuICAgIFwiTVwiLFxuICAgIFwiTlwiLFxuICAgIFwiT1wiLFxuICAgIFwiUFwiLFxuICAgIFwiUVwiLFxuICAgIFwiUlwiLFxuICAgIFwiU1wiLFxuICAgIFwiVFwiLFxuICAgIFwiVVwiLFxuICAgIFwiVlwiLFxuICAgIFwiV1wiLFxuICAgIFwiWFwiLFxuICAgIFwiWVwiLFxuICAgIFwiWlwiXG4gIF07XG4gIGxldCBDb25maWRlbmNlID0gLUluZmluaXR5O1xuICBsZXQgUmVzdWx0O1xuICBmb3IgKGxldCBDaGFyIG9mIENoYXJzKSB7XG4gICAgbGV0IENvbmYgPSBjb21wYXJlTWF0cml4KE1hdHJpeCxGb250W0NoYXJdKTtcbiAgICBpZiAoQ29uZiA+IENvbmZpZGVuY2UpIHtcbiAgICAgIENvbmZpZGVuY2UgPSBDb25mO1xuICAgICAgUmVzdWx0ID0gQ2hhcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtSZXN1bHQsIENvbmZpZGVuY2VdO1xufVxuZnVuY3Rpb24gY29tcGFyZU1hdHJpeChNYXRyaXgxLCBNYXRyaXgyKSB7XG4gIGxldCBXaWR0aCA9IE1hdGgubWluKE1hdHJpeDFbMF0ubGVuZ3RoLCBNYXRyaXgyWzBdLmxlbmd0aCk7XG4gIGxldCBIZWlnaHQgPSBNYXRoLm1pbihNYXRyaXgxLmxlbmd0aCwgTWF0cml4Mi5sZW5ndGgpO1xuICBsZXQgQ291bnQgPSAwO1xuICBmb3IgKGxldCB5ID0gMDsgeSA8IEhlaWdodDsgeSsrKSB7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBXaWR0aDsgeCsrKSB7XG4gICAgICBpZiAoTWF0cml4MVt5XVt4XSA9PSBNYXRyaXgyW3ldW3hdKSB7XG4gICAgICAgIENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBDb3VudCAvIChNYXRyaXgxWzBdLmxlbmd0aCAqIE1hdHJpeDEubGVuZ3RoKTtcbn1cbi8vIOeUn+aIkOavj+S4quWtl+espuaVsOaNrlxuZnVuY3Rpb24gZ2VuRm9udERhdGEoc2l6ZSkge1xuICBsZXQgQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgbGV0IEN0eCA9IENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIEN0eC5mb250ID0gYCR7c2l6ZX0gJ05vdmVjZW50byBXaWRlQm9sZCdgO1xuICBDdHguZmlsbFN0eWxlID0gXCIjMDAwMDAwXCI7XG4gIEN0eC50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xuICBsZXQgRGF0YSA9IHt9O1xuICBsZXQgQ2hhcnMgPSBcIjAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiLnNwbGl0KFwiXCIpO1xuICBmb3IgKGxldCBDaGFyIG9mIENoYXJzKSB7XG4gICAgbGV0IFNpemUgPSBDdHgubWVhc3VyZVRleHQoQ2hhcik7XG4gICAgQ2FudmFzLmhlaWdodCA9IFNpemUuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQgKyBTaXplLmFjdHVhbEJvdW5kaW5nQm94RGVzY2VudDtcbiAgICBDYW52YXMud2lkdGggPSBTaXplLndpZHRoO1xuICAgIEN0eC5mb250ID0gYCR7c2l6ZX0gJ05vdmVjZW50byBXaWRlQm9sZCdgO1xuICAgIEN0eC5maWxsU3R5bGUgPSBcIiMwMDAwMDBcIjtcbiAgICBDdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcbiAgICBDdHguY2xlYXJSZWN0KDAsIDAsIENhbnZhcy53aWR0aCwgQ2FudmFzLmhlaWdodCk7XG4gICAgQ3R4LmZpbGxUZXh0KENoYXIsIDAsIFNpemUuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQpO1xuICAgIGxldCBJRGF0YSA9IEN0eC5nZXRJbWFnZURhdGEoMCwgMCwgQ2FudmFzLndpZHRoLCBDYW52YXMuaGVpZ2h0KTtcbiAgICBsZXQgWEZsYWdzID0gbmV3IEFycmF5KENhbnZhcy53aWR0aCkuZmlsbChmYWxzZSk7XG4gICAgbGV0IFhSYW5nZSA9IFtdO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgQ2FudmFzLndpZHRoOyB4KyspIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgQ2FudmFzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgIGxldCBJbmRleCA9ICh5ICogQ2FudmFzLndpZHRoICsgeCkgKiA0O1xuICAgICAgICBpZiAoSURhdGEuZGF0YVtJbmRleCArIDNdID4gMCkge1xuICAgICAgICAgIFhGbGFnc1t4XSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBDYW52YXMud2lkdGg7IHgrKykge1xuICAgICAgaWYgKFhGbGFnc1t4XSAmJiBYUmFuZ2UubGVuZ3RoID09IDApIHtcbiAgICAgICAgWFJhbmdlLnB1c2goeCk7XG4gICAgICB9IGVsc2UgaWYgKFhGbGFnc1t4XSkge1xuICAgICAgICBYUmFuZ2VbMV0gPSB4O1xuICAgICAgfVxuICAgIH1cbiAgICBJRGF0YSA9IEN0eC5nZXRJbWFnZURhdGEoWFJhbmdlWzBdLCAwLCBYUmFuZ2VbMV0gLSBYUmFuZ2VbMF0gKyAxLCBDYW52YXMuaGVpZ2h0KTtcbiAgICBsZXQgTWF0cml4ID0gW107XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBJRGF0YS5oZWlnaHQ7IHkrKykge1xuICAgICAgTWF0cml4LnB1c2goW10pO1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBJRGF0YS53aWR0aDsgeCsrKSB7XG4gICAgICAgIE1hdHJpeFt5XVt4XSA9IElEYXRhLmRhdGFbKHkgKiBJRGF0YS53aWR0aCArIHgpICogNCArIDNdID4gMDtcbiAgICAgIH1cbiAgICB9XG4gICAgRGF0YVtDaGFyXSA9IE1hdHJpeDtcbiAgfVxuICByZXR1cm4gRGF0YTtcbn1cbiIsIiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLGUpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuc3NpbT1lKCk6dC5zc2ltPWUoKX0od2luZG93LChmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXt2YXIgZT17fTtmdW5jdGlvbiByKGkpe2lmKGVbaV0pcmV0dXJuIGVbaV0uZXhwb3J0czt2YXIgYT1lW2ldPXtpOmksbDohMSxleHBvcnRzOnt9fTtyZXR1cm4gdFtpXS5jYWxsKGEuZXhwb3J0cyxhLGEuZXhwb3J0cyxyKSxhLmw9ITAsYS5leHBvcnRzfXJldHVybiByLm09dCxyLmM9ZSxyLmQ9ZnVuY3Rpb24odCxlLGkpe3Iubyh0LGUpfHxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHtlbnVtZXJhYmxlOiEwLGdldDppfSl9LHIucj1mdW5jdGlvbih0KXtcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6XCJNb2R1bGVcIn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSxyLnQ9ZnVuY3Rpb24odCxlKXtpZigxJmUmJih0PXIodCkpLDgmZSlyZXR1cm4gdDtpZig0JmUmJlwib2JqZWN0XCI9PXR5cGVvZiB0JiZ0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGk9T2JqZWN0LmNyZWF0ZShudWxsKTtpZihyLnIoaSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGksXCJkZWZhdWx0XCIse2VudW1lcmFibGU6ITAsdmFsdWU6dH0pLDImZSYmXCJzdHJpbmdcIiE9dHlwZW9mIHQpZm9yKHZhciBhIGluIHQpci5kKGksYSxmdW5jdGlvbihlKXtyZXR1cm4gdFtlXX0uYmluZChudWxsLGEpKTtyZXR1cm4gaX0sci5uPWZ1bmN0aW9uKHQpe3ZhciBlPXQmJnQuX19lc01vZHVsZT9mdW5jdGlvbigpe3JldHVybiB0LmRlZmF1bHR9OmZ1bmN0aW9uKCl7cmV0dXJuIHR9O3JldHVybiByLmQoZSxcImFcIixlKSxlfSxyLm89ZnVuY3Rpb24odCxlKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsZSl9LHIucD1cIlwiLHIoci5zPTEwKX0oW2Z1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiBhKHQpL3QubGVuZ3RofWZ1bmN0aW9uIGEodCl7Zm9yKHZhciBlPTAscj0wO3I8dC5sZW5ndGg7cisrKWUrPXRbcl07cmV0dXJuIGV9ZnVuY3Rpb24gbih0KXtmb3IodmFyIGU9dC5kYXRhLHI9MCxpPTA7aTxlLmxlbmd0aDtpKyspcis9ZVtpXTtyZXR1cm4gcn1mdW5jdGlvbiBkKHQsZSl7Zm9yKHZhciByPXQuZGF0YSxpPXQud2lkdGgsYT10LmhlaWdodCxuPW5ldyBBcnJheShyLmxlbmd0aCksZD0wO2Q8ci5sZW5ndGg7ZCsrKW5bZF09cltkXStlO3JldHVybntkYXRhOm4sd2lkdGg6aSxoZWlnaHQ6YX19ZnVuY3Rpb24gbyh0LGUpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBlP2Z1bmN0aW9uKHQsZSl7Zm9yKHZhciByPXQuZGF0YSxpPXQud2lkdGgsYT10LmhlaWdodCxuPW5ldyBBcnJheShyLmxlbmd0aCksZD0wO2Q8ci5sZW5ndGg7ZCsrKW5bZF09cltkXSplO3JldHVybntkYXRhOm4sd2lkdGg6aSxoZWlnaHQ6YX19KHQsZSk6ZnVuY3Rpb24odCxlKXtmb3IodmFyIHI9dC5kYXRhLGk9dC53aWR0aCxhPXQuaGVpZ2h0LG49ZS5kYXRhLGQ9bmV3IEFycmF5KHIubGVuZ3RoKSxvPTA7bzxyLmxlbmd0aDtvKyspZFtvXT1yW29dKm5bb107cmV0dXJue2RhdGE6ZCx3aWR0aDppLGhlaWdodDphfX0odCxlKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLmNvdmFyaWFuY2U9ZS52YXJpYW5jZT1lLm1lYW4yZD1lLnNxdWFyZTJkPWUubXVsdGlwbHkyZD1lLmRpdmlkZTJkPWUuc3VidHJhY3QyZD1lLmFkZDJkPWUuc3VtMmQ9ZS5mbG9vcj1lLnN1bT1lLmF2ZXJhZ2U9dm9pZCAwLGUuYXZlcmFnZT1pLGUuc3VtPWEsZS5mbG9vcj1mdW5jdGlvbih0KXtmb3IodmFyIGU9bmV3IEFycmF5KHQubGVuZ3RoKSxyPTA7cjx0Lmxlbmd0aDtyKyspZVtyXT1NYXRoLmZsb29yKHRbcl0pO3JldHVybiBlfSxlLnN1bTJkPW4sZS5hZGQyZD1mdW5jdGlvbih0LGUpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBlP2QodCxlKTpmdW5jdGlvbih0LGUpe2Zvcih2YXIgcj10LmRhdGEsaT10LndpZHRoLGE9dC5oZWlnaHQsbj1lLmRhdGEsZD1uZXcgQXJyYXkoci5sZW5ndGgpLG89MDtvPGE7bysrKWZvcih2YXIgdT1vKmksaD0wO2g8aTtoKyspZFt1K2hdPXJbdStoXStuW3UraF07cmV0dXJue2RhdGE6ZCx3aWR0aDppLGhlaWdodDphfX0odCxlKX0sZS5zdWJ0cmFjdDJkPWZ1bmN0aW9uKHQsZSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGU/ZCh0LC1lKTpmdW5jdGlvbih0LGUpe2Zvcih2YXIgcj10LmRhdGEsaT10LndpZHRoLGE9dC5oZWlnaHQsbj1lLmRhdGEsZD1uZXcgQXJyYXkoci5sZW5ndGgpLG89MDtvPGE7bysrKWZvcih2YXIgdT1vKmksaD0wO2g8aTtoKyspZFt1K2hdPXJbdStoXS1uW3UraF07cmV0dXJue2RhdGE6ZCx3aWR0aDppLGhlaWdodDphfX0odCxlKX0sZS5kaXZpZGUyZD1mdW5jdGlvbih0LGUpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBlP2Z1bmN0aW9uKHQsZSl7Zm9yKHZhciByPXQuZGF0YSxpPXQud2lkdGgsYT10LmhlaWdodCxuPW5ldyBBcnJheShyLmxlbmd0aCksZD0wO2Q8ci5sZW5ndGg7ZCsrKW5bZF09cltkXS9lO3JldHVybntkYXRhOm4sd2lkdGg6aSxoZWlnaHQ6YX19KHQsZSk6ZnVuY3Rpb24odCxlKXtmb3IodmFyIHI9dC5kYXRhLGk9dC53aWR0aCxhPXQuaGVpZ2h0LG49ZS5kYXRhLGQ9bmV3IEFycmF5KHIubGVuZ3RoKSxvPTA7bzxyLmxlbmd0aDtvKyspZFtvXT1yW29dL25bb107cmV0dXJue2RhdGE6ZCx3aWR0aDppLGhlaWdodDphfX0odCxlKX0sZS5tdWx0aXBseTJkPW8sZS5zcXVhcmUyZD1mdW5jdGlvbih0KXtyZXR1cm4gbyh0LHQpfSxlLm1lYW4yZD1mdW5jdGlvbih0KXtyZXR1cm4gbih0KS90LmRhdGEubGVuZ3RofSxlLnZhcmlhbmNlPWZ1bmN0aW9uKHQsZSl7dm9pZCAwPT09ZSYmKGU9aSh0KSk7Zm9yKHZhciByPTAsYT10Lmxlbmd0aDthLS07KXIrPU1hdGgucG93KHRbYV0tZSwyKTtyZXR1cm4gci90Lmxlbmd0aH0sZS5jb3ZhcmlhbmNlPWZ1bmN0aW9uKHQsZSxyLGEpe3ZvaWQgMD09PXImJihyPWkodCkpLHZvaWQgMD09PWEmJihhPWkoZSkpO2Zvcih2YXIgbj0wLGQ9dC5sZW5ndGg7ZC0tOyluKz0odFtkXS1yKSooZVtkXS1hKTtyZXR1cm4gbi90Lmxlbmd0aH19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjt2YXIgaT10aGlzJiZ0aGlzLl9fY3JlYXRlQmluZGluZ3x8KE9iamVjdC5jcmVhdGU/ZnVuY3Rpb24odCxlLHIsaSl7dm9pZCAwPT09aSYmKGk9ciksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaSx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZVtyXX19KX06ZnVuY3Rpb24odCxlLHIsaSl7dm9pZCAwPT09aSYmKGk9ciksdFtpXT1lW3JdfSksYT10aGlzJiZ0aGlzLl9fZXhwb3J0U3Rhcnx8ZnVuY3Rpb24odCxlKXtmb3IodmFyIHIgaW4gdClcImRlZmF1bHRcIj09PXJ8fGUuaGFzT3duUHJvcGVydHkocil8fGkoZSx0LHIpfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxhKHIoMiksZSksYShyKDcpLGUpLGEocigxMSksZSksYShyKDEyKSxlKSxhKHIoMTMpLGUpLGEocigzKSxlKSxhKHIoOSksZSksYShyKDE0KSxlKSxhKHIoMTUpLGUpLGEocig1KSxlKSxhKHIoMTYpLGUpLGEocig2KSxlKX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuY29udjI9dm9pZCAwO3ZhciBpPXIoMCksYT1yKDMpLG49cig1KSxkPXIoNik7ZnVuY3Rpb24gbyh0LGUscil7dmFyIGk9dC5kYXRhLGE9dC53aWR0aCxuPXQuaGVpZ2h0O3ZvaWQgMD09PXImJihyPVwiZnVsbFwiKTtmb3IodmFyIG89YStlLndpZHRoLTEsdT1uK2UuaGVpZ2h0LTEsaD1kLnplcm9zKHUsbykuZGF0YSxmPTA7ZjxlLmhlaWdodDtmKyspZm9yKHZhciBzPTA7czxlLndpZHRoO3MrKyl7dmFyIHY9ZS5kYXRhW2YqZS53aWR0aCtzXTtpZih2KWZvcih2YXIgYz0wO2M8bjtjKyspZm9yKHZhciB3PTA7dzxhO3crKyloWyhjK2YpKm8rdytzXSs9aVtjKmErd10qdn1yZXR1cm4gbCh7ZGF0YTpoLHdpZHRoOm8saGVpZ2h0OnV9LHIsbixlLmhlaWdodCxhLGUud2lkdGgpfWZ1bmN0aW9uIHUodCxlLHIpe3ZhciBuPWUuZGF0YSxkPWUud2lkdGgsbz1lLmhlaWdodDt2b2lkIDA9PT1yJiYocj1cImZ1bGxcIik7dmFyIHU9Zih0LGEub25lcyhvLDEpLGEub25lcygxLGQpLHIpO3JldHVybiBpLm11bHRpcGx5MmQodSxuWzBdKX1mdW5jdGlvbiBoKHQpe2Zvcih2YXIgZT10LmRhdGEscj1lWzBdLGk9MTtpPGUubGVuZ3RoO2krKylpZihlW2ldIT09cilyZXR1cm4hMTtyZXR1cm4hMH1mdW5jdGlvbiBmKHQsZSxyLGkpe3ZvaWQgMD09PWkmJihpPVwiZnVsbFwiKTt2YXIgYT1NYXRoLm1heChlLmhlaWdodCxlLndpZHRoKSxuPU1hdGgubWF4KHIuaGVpZ2h0LHIud2lkdGgpLGQ9byh0LGUsXCJmdWxsXCIpO3JldHVybiBsKG8oZCxyLFwiZnVsbFwiKSxpLHQuaGVpZ2h0LGEsdC53aWR0aCxuKX1mdW5jdGlvbiBsKHQsZSxyLGksYSxkKXtpZihcImZ1bGxcIj09PWUpcmV0dXJuIHQ7aWYoXCJzYW1lXCI9PT1lKXt2YXIgbz1NYXRoLmNlaWwoKHQuaGVpZ2h0LXIpLzIpLHU9TWF0aC5jZWlsKCh0LndpZHRoLWEpLzIpO3JldHVybiBuLnN1Yih0LG8scix1LGEpfXJldHVybiBuLnN1Yih0LGktMSxyLWkrMSxkLTEsYS1kKzEpfWUuY29udjI9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9W10sZT0wO2U8YXJndW1lbnRzLmxlbmd0aDtlKyspdFtlXT1hcmd1bWVudHNbZV07cmV0dXJuIHRbMl0mJnRbMl0uZGF0YT9mLmFwcGx5KHZvaWQgMCx0KTpoKHRbMV0pP3UuYXBwbHkodm9pZCAwLHQpOm8uYXBwbHkodm9pZCAwLHQpfX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUub25lcz12b2lkIDA7dmFyIGk9cig0KTtlLm9uZXM9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdm9pZCAwPT09ZSYmKGU9dCksaS5udW1iZXJzKHQsZSwxKX19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLm51bWJlcnM9dm9pZCAwLGUubnVtYmVycz1mdW5jdGlvbih0LGUscil7Zm9yKHZhciBpPWUqdCxhPW5ldyBBcnJheShpKSxuPTA7bjxpO24rKylhW25dPXI7cmV0dXJue2RhdGE6YSx3aWR0aDplLGhlaWdodDp0fX19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLnN1Yj12b2lkIDAsZS5zdWI9ZnVuY3Rpb24odCxlLHIsaSxhKXtmb3IodmFyIG49dC5kYXRhLGQ9dC53aWR0aCxvPW5ldyBBcnJheShhKnIpLHU9MDt1PHI7dSsrKWZvcih2YXIgaD0wO2g8YTtoKyspb1t1KmEraF09blsoaSt1KSpkK2UraF07cmV0dXJue2RhdGE6byx3aWR0aDphLGhlaWdodDpyfX19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLnplcm9zPXZvaWQgMDt2YXIgaT1yKDQpO2UuemVyb3M9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdm9pZCAwPT09ZSYmKGU9dCksaS5udW1iZXJzKHQsZSwwKX19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLmZpbHRlcjI9dm9pZCAwO3ZhciBpPXIoMik7ZS5maWx0ZXIyPWZ1bmN0aW9uKHQsZSxyKXtyZXR1cm4gdm9pZCAwPT09ciYmKHI9XCJzYW1lXCIpLGkuY29udjIoZSxmdW5jdGlvbih0KXtmb3IodmFyIGU9dC5kYXRhLHI9dC53aWR0aCxpPXQuaGVpZ2h0LGE9bmV3IEFycmF5KGUubGVuZ3RoKSxuPTA7bjxpO24rKylmb3IodmFyIGQ9MDtkPHI7ZCsrKWFbbipyK2RdPWVbKGktMS1uKSpyK3ItMS1kXTtyZXR1cm57ZGF0YTphLHdpZHRoOnIsaGVpZ2h0Oml9fSh0KSxyKX19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLm1vZD12b2lkIDAsZS5tb2Q9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdC1lKk1hdGguZmxvb3IodC9lKX19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLnBhZGFycmF5PXZvaWQgMDt2YXIgaT1yKDgpO2Z1bmN0aW9uIGEodCxlKXtmb3IodmFyIHI9dC53aWR0aCsyKmUsYT1uZXcgQXJyYXkocip0LmhlaWdodCksbj1mdW5jdGlvbih0LGUpe2Zvcih2YXIgcj10LndpZHRoK2Uud2lkdGgsaT1uZXcgQXJyYXkodC5oZWlnaHQqciksYT0wO2E8dC5oZWlnaHQ7YSsrKXtmb3IodmFyIG49MDtuPHQud2lkdGg7bisrKWlbYSpyK25dPXQuZGF0YVthKnQud2lkdGgrbl07Zm9yKG49MDtuPGUud2lkdGg7bisrKWlbYSpyK24rdC53aWR0aF09ZS5kYXRhW2EqZS53aWR0aCtuXX1yZXR1cm57ZGF0YTppLHdpZHRoOnIsaGVpZ2h0OnQuaGVpZ2h0fX0odCxmdW5jdGlvbih0KXtmb3IodmFyIGU9dC5kYXRhLHI9dC53aWR0aCxpPXQuaGVpZ2h0LGE9bmV3IEFycmF5KGUubGVuZ3RoKSxuPTA7bjxpO24rKylmb3IodmFyIGQ9MDtkPHI7ZCsrKWFbbipyK2RdPWVbbipyK3ItMS1kXTtyZXR1cm57ZGF0YTphLHdpZHRoOnIsaGVpZ2h0Oml9fSh0KSksZD0wO2Q8dC5oZWlnaHQ7ZCsrKWZvcih2YXIgbz0tZTtvPHQud2lkdGgrZTtvKyspYVtkKnIrbytlXT1uLmRhdGFbZCpuLndpZHRoK2kubW9kKG8sbi53aWR0aCldO3JldHVybntkYXRhOmEsd2lkdGg6cixoZWlnaHQ6dC5oZWlnaHR9fWZ1bmN0aW9uIG4odCxlKXtmb3IodmFyIHI9ZnVuY3Rpb24odCxlKXtyZXR1cm57ZGF0YTp0LmRhdGEuY29uY2F0KGUuZGF0YSksaGVpZ2h0OnQuaGVpZ2h0K2UuaGVpZ2h0LHdpZHRoOnQud2lkdGh9fSh0LGZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10LmRhdGEscj10LndpZHRoLGk9dC5oZWlnaHQsYT1uZXcgQXJyYXkoZS5sZW5ndGgpLG49MDtuPGk7bisrKWZvcih2YXIgZD0wO2Q8cjtkKyspYVtuKnIrZF09ZVsoaS0xLW4pKnIrZF07cmV0dXJue2RhdGE6YSx3aWR0aDpyLGhlaWdodDppfX0odCkpLGE9dC5oZWlnaHQrMiplLG49bmV3IEFycmF5KHQud2lkdGgqYSksZD0tZTtkPHQuaGVpZ2h0K2U7ZCsrKWZvcih2YXIgbz0wO288dC53aWR0aDtvKyspblsoZCtlKSp0LndpZHRoK29dPXIuZGF0YVtpLm1vZChkLHIuaGVpZ2h0KSp0LndpZHRoK29dO3JldHVybntkYXRhOm4sd2lkdGg6dC53aWR0aCxoZWlnaHQ6YX19ZS5wYWRhcnJheT1mdW5jdGlvbih0LGUscixpKXt2YXIgZD1lWzBdLG89ZVsxXTtyZXR1cm4gdC5oZWlnaHQ+PWQmJnQud2lkdGg+PW8/ZnVuY3Rpb24odCxlKXtmb3IodmFyIHI9ZVswXSxpPWVbMV0sYT10LndpZHRoKzIqaSxuPXQuaGVpZ2h0KzIqcixkPW5ldyBBcnJheShhKm4pLG89LXI7bzwwO28rKyl7Zm9yKHZhciB1PS1pO3U8MDt1KyspZFsobytyKSphK3UraV09dC5kYXRhWyhNYXRoLmFicyhvKS0xKSp0LndpZHRoK01hdGguYWJzKHUpLTFdO2Zvcih1PTA7dTx0LndpZHRoO3UrKylkWyhvK3IpKmErdStpXT10LmRhdGFbKE1hdGguYWJzKG8pLTEpKnQud2lkdGgrdV07Zm9yKHU9dC53aWR0aDt1PHQud2lkdGgraTt1KyspZFsobytyKSphK3UraV09dC5kYXRhWyhNYXRoLmFicyhvKS0xKSp0LndpZHRoKzIqdC53aWR0aC11LTFdfWZvcihvPTA7bzx0LmhlaWdodDtvKyspe2Zvcih1PS1pO3U8MDt1KyspZFsobytyKSphK3UraV09dC5kYXRhW28qdC53aWR0aCtNYXRoLmFicyh1KS0xXTtmb3IodT0wO3U8dC53aWR0aDt1KyspZFsobytyKSphK3UraV09dC5kYXRhW28qdC53aWR0aCt1XTtmb3IodT10LndpZHRoO3U8dC53aWR0aCtpO3UrKylkWyhvK3IpKmErdStpXT10LmRhdGFbbyp0LndpZHRoKzIqdC53aWR0aC11LTFdfWZvcihvPXQuaGVpZ2h0O288dC5oZWlnaHQrcjtvKyspe2Zvcih1PS1pO3U8MDt1KyspZFsobytyKSphK3UraV09dC5kYXRhWygyKnQuaGVpZ2h0LW8tMSkqdC53aWR0aCtNYXRoLmFicyh1KS0xXTtmb3IodT0wO3U8dC53aWR0aDt1KyspZFsobytyKSphK3UraV09dC5kYXRhWygyKnQuaGVpZ2h0LW8tMSkqdC53aWR0aCt1XTtmb3IodT10LndpZHRoO3U8dC53aWR0aCtpO3UrKylkWyhvK3IpKmErdStpXT10LmRhdGFbKDIqdC5oZWlnaHQtby0xKSp0LndpZHRoKzIqdC53aWR0aC11LTFdfXJldHVybntkYXRhOmQsd2lkdGg6YSxoZWlnaHQ6bn19KHQsW2Qsb10pOm4oYSh0LG8pLGQpfX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO3ZhciBpPXRoaXMmJnRoaXMuX19hc3NpZ258fGZ1bmN0aW9uKCl7cmV0dXJuKGk9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24odCl7Zm9yKHZhciBlLHI9MSxpPWFyZ3VtZW50cy5sZW5ndGg7cjxpO3IrKylmb3IodmFyIGEgaW4gZT1hcmd1bWVudHNbcl0pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUsYSkmJih0W2FdPWVbYV0pO3JldHVybiB0fSkuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLnNzaW09dm9pZCAwO3ZhciBhPXIoMSksbj1yKDApLGQ9cigxNyksbz1yKDE4KSx1PXIoMTkpLGg9cigyMCksZj1yKDIxKSxsPXtmYXN0OmQuc3NpbSxvcmlnaW5hbDpvLm9yaWdpbmFsU3NpbSxiZXprcm92bnk6dS5iZXprcm92bnlTc2ltfTtmdW5jdGlvbiBzKHQpe3ZhciBlPWkoaSh7fSxmLmRlZmF1bHRzKSx0KTtyZXR1cm4gZnVuY3Rpb24odCl7aWYoT2JqZWN0LmtleXModCkuZm9yRWFjaCgoZnVuY3Rpb24odCl7aWYoISh0IGluIGYuZGVmYXVsdHMpKXRocm93IG5ldyBFcnJvcignXCInK3QrJ1wiIGlzIG5vdCBhIHZhbGlkIG9wdGlvbicpfSkpLFwiazFcImluIHQmJihcIm51bWJlclwiIT10eXBlb2YgdC5rMXx8dC5rMTwwKSl0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGsxIHZhbHVlLiBEZWZhdWx0IGlzIFwiK2YuZGVmYXVsdHMuazEpO2lmKFwiazJcImluIHQmJihcIm51bWJlclwiIT10eXBlb2YgdC5rMnx8dC5rMjwwKSl0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGsyIHZhbHVlLiBEZWZhdWx0IGlzIFwiK2YuZGVmYXVsdHMuazIpO2lmKCEodC5zc2ltIGluIGwpKXRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc3NpbSBvcHRpb24gKHVzZTogXCIrT2JqZWN0LmtleXMobCkuam9pbihcIiwgXCIpK1wiKVwiKX0oZSksZX1mdW5jdGlvbiB2KHQsZSxyKXt2YXIgaT0obmV3IERhdGUpLmdldFRpbWUoKSxkPWZ1bmN0aW9uKHQpe3ZhciBlPXRbMF0scj10WzFdLGk9dFsyXTtyZXR1cm4gbFtpLnNzaW1dKGUscixpKX0oZnVuY3Rpb24odCl7dmFyIGU9dFswXSxyPXRbMV0saT10WzJdLGE9aC5kb3duc2FtcGxlKFtlLHJdLGkpO3JldHVyblthWzBdLGFbMV0saV19KGZ1bmN0aW9uKHQpe3ZhciBlPXRbMF0scj10WzFdLGk9dFsyXTtyZXR1cm5bYS5yZ2IyZ3JheShlKSxhLnJnYjJncmF5KHIpLGldfShmdW5jdGlvbih0KXt2YXIgZT10WzBdLHI9dFsxXSxpPXRbMl07aWYoZS53aWR0aCE9PXIud2lkdGh8fGUuaGVpZ2h0IT09ci5oZWlnaHQpdGhyb3cgbmV3IEVycm9yKFwiSW1hZ2UgZGltZW5zaW9ucyBkbyBub3QgbWF0Y2hcIik7cmV0dXJuW2UscixpXX0oW3QsZSxzKHIpXSkpKSk7cmV0dXJue3NzaW1fbWFwOmQsbXNzaW06bi5tZWFuMmQoZCkscGVyZm9ybWFuY2U6KG5ldyBEYXRlKS5nZXRUaW1lKCktaX19ZS5zc2ltPXYsZS5kZWZhdWx0PXZ9LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLmZzcGVjaWFsPXZvaWQgMDt2YXIgaT1yKDApO2UuZnNwZWNpYWw9ZnVuY3Rpb24odCxlLHIpe3ZvaWQgMD09PWUmJihlPTMpLHZvaWQgMD09PXImJihyPTEuNSk7dmFyIGE9ZnVuY3Rpb24odCxlKXtmb3IodmFyIHI9dC5kYXRhLGk9dC53aWR0aCxhPXQuaGVpZ2h0LG49bmV3IEFycmF5KHIubGVuZ3RoKSxkPTA7ZDxyLmxlbmd0aDtkKyspbltkXT1NYXRoLmV4cCgtcltkXS8oMipNYXRoLnBvdyhlLDIpKSk7cmV0dXJue2RhdGE6bix3aWR0aDppLGhlaWdodDphfX0oZnVuY3Rpb24odCl7Zm9yKHZhciBlPTIqdCsxLHI9bmV3IEFycmF5KE1hdGgucG93KGUsMikpLGk9MDtpPGU7aSsrKWZvcih2YXIgYT0wO2E8ZTthKyspcltpKmUrYV09TWF0aC5wb3coaS10LDIpK01hdGgucG93KGEtdCwyKTtyZXR1cm57ZGF0YTpyLHdpZHRoOmUsaGVpZ2h0OmV9fShlPShlLTEpLzIpLHIpLG49aS5zdW0yZChhKTtyZXR1cm4gaS5kaXZpZGUyZChhLG4pfX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuaW1maWx0ZXI9dm9pZCAwO3ZhciBpPXIoOCksYT1yKDkpLG49cigwKSxkPXIoNyk7ZS5pbWZpbHRlcj1mdW5jdGlvbih0LGUscixvKXtyZXR1cm4gdm9pZCAwPT09ciYmKHI9XCJzeW1tZXRyaWNcIiksdm9pZCAwPT09byYmKG89XCJzYW1lXCIpLHQ9ZnVuY3Rpb24odCxlLHIsZCl7aWYodD1hLnBhZGFycmF5KHQsbi5mbG9vcihbZS8yLHIvMl0pLGQpLDA9PT1pLm1vZChlLDIpJiYodC5kYXRhPXQuZGF0YS5zbGljZSgwLC10LndpZHRoKSx0LmhlaWdodC0tKSwwPT09aS5tb2QociwyKSl7Zm9yKHZhciBvPVtdLHU9MDt1PHQuZGF0YS5sZW5ndGg7dSsrKSh1KzEpJXQud2lkdGghPTAmJm8ucHVzaCh0LmRhdGFbdV0pO3QuZGF0YT1vLHQud2lkdGgtLX1yZXR1cm4gdH0odCxlLndpZHRoLGUuaGVpZ2h0LHIpLG89ZnVuY3Rpb24odCl7cmV0dXJuXCJzYW1lXCI9PT10JiYodD1cInZhbGlkXCIpLHR9KG8pLGQuZmlsdGVyMihlLHQsbyl9fSxmdW5jdGlvbih0LGUscil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5ub3JtcGRmPXZvaWQgMCxlLm5vcm1wZGY9ZnVuY3Rpb24odCxlLHIpe3ZhciBpPXQuZGF0YSxhPXQud2lkdGgsbj10LmhlaWdodDt2b2lkIDA9PT1lJiYoZT0wKSx2b2lkIDA9PT1yJiYocj0xKTtmb3IodmFyIGQ9bmV3IEFycmF5KGkubGVuZ3RoKSxvPTA7bzxpLmxlbmd0aDtvKyspe3ZhciB1PShpW29dLWUpL3I7ZFtvXT1NYXRoLmV4cCgtTWF0aC5wb3codSwyKS8yKS8oMi41MDY2MjgyNzQ2MzEwMDA3KnIpfXJldHVybntkYXRhOmQsd2lkdGg6YSxoZWlnaHQ6bn19fSxmdW5jdGlvbih0LGUscil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5yZ2IyZ3JheT12b2lkIDAsZS5yZ2IyZ3JheT1mdW5jdGlvbih0KXtmb3IodmFyIGUscixpLGE9dC5kYXRhLG49dC53aWR0aCxkPXQuaGVpZ2h0LG89bmV3IEFycmF5KG4qZCksdT0wO3U8ZDt1KyspZm9yKHZhciBoPTA7aDxuO2grKyl7dmFyIGY9aCt1Km4sbD00KmY7b1tmXT0oZT1hW2xdLHI9YVtsKzFdLGk9YVtsKzJdLE1hdGgucm91bmQoLjI5ODk0KmUrLjU4NzA0KnIrLjExNDAyKmkpKX1yZXR1cm57ZGF0YTpvLHdpZHRoOm4saGVpZ2h0OmR9fX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuc2tpcDJkPXZvaWQgMCxlLnNraXAyZD1mdW5jdGlvbih0LGUscil7Zm9yKHZhciBpPWVbMF0sYT1lWzFdLG49ZVsyXSxkPXJbMF0sbz1yWzFdLHU9clsyXSxoPU1hdGguY2VpbCgodS1kKS9vKSxmPU1hdGguY2VpbCgobi1pKS9hKSxsPW5ldyBBcnJheShoKmYpLHM9MDtzPGY7cysrKWZvcih2YXIgdj0wO3Y8aDt2Kyspe3ZhciBjPWkrcyphLHc9ZCt2Km87bFtzKmgrdl09dC5kYXRhW2MqdC53aWR0aCt3XX1yZXR1cm57ZGF0YTpsLHdpZHRoOmgsaGVpZ2h0OmZ9fX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUudHJhbnNwb3NlPXZvaWQgMCxlLnRyYW5zcG9zZT1mdW5jdGlvbih0KXtmb3IodmFyIGU9dC5kYXRhLHI9dC53aWR0aCxpPXQuaGVpZ2h0LGE9bmV3IEFycmF5KHIqaSksbj0wO248aTtuKyspZm9yKHZhciBkPTA7ZDxyO2QrKylhW2QqaStuXT1lW24qcitkXTtyZXR1cm57ZGF0YTphLGhlaWdodDpyLHdpZHRoOml9fX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuc3NpbT12b2lkIDA7dmFyIGk9cigwKSxhPXIoMSk7ZS5zc2ltPWZ1bmN0aW9uKHQsZSxyKXt2YXIgbj1hLm5vcm1wZGYoZnVuY3Rpb24odCl7Zm9yKHZhciBlPU1hdGguZmxvb3IodC8yKSxyPW5ldyBBcnJheSgyKmUrMSksaT0tZTtpPD1lO2krKylyW2krZV09TWF0aC5hYnMoaSk7cmV0dXJue2RhdGE6cix3aWR0aDpyLmxlbmd0aCxoZWlnaHQ6MX19KHIud2luZG93U2l6ZSksMCwxLjUpLGQ9TWF0aC5wb3coMixyLmJpdERlcHRoKS0xLG89TWF0aC5wb3coci5rMSpkLDIpLHU9TWF0aC5wb3coci5rMipkLDIpO249aS5kaXZpZGUyZChuLGkuc3VtMmQobikpO3ZhciBoPWEudHJhbnNwb3NlKG4pLGY9YS5jb252Mih0LG4saCxcInZhbGlkXCIpLGw9YS5jb252MihlLG4saCxcInZhbGlkXCIpLHM9aS5zcXVhcmUyZChmKSx2PWkuc3F1YXJlMmQobCksYz1pLm11bHRpcGx5MmQoZixsKSx3PWkuc3F1YXJlMmQodCksZz1pLnNxdWFyZTJkKGUpLHA9aS5zdWJ0cmFjdDJkKGEuY29udjIodyxuLGgsXCJ2YWxpZFwiKSxzKSx5PWkuc3VidHJhY3QyZChhLmNvbnYyKGcsbixoLFwidmFsaWRcIiksdiksbT1pLnN1YnRyYWN0MmQoYS5jb252MihpLm11bHRpcGx5MmQodCxlKSxuLGgsXCJ2YWxpZFwiKSxjKTtyZXR1cm4gbz4wJiZ1PjA/ZnVuY3Rpb24odCxlLHIsYSxuLGQsbyx1KXt2YXIgaD1pLmFkZDJkKGkubXVsdGlwbHkyZCh0LDIpLG8pLGY9aS5hZGQyZChpLm11bHRpcGx5MmQoZSwyKSx1KSxsPWkuYWRkMmQoaS5hZGQyZChyLGEpLG8pLHM9aS5hZGQyZChpLmFkZDJkKG4sZCksdSk7cmV0dXJuIGkuZGl2aWRlMmQoaS5tdWx0aXBseTJkKGgsZiksaS5tdWx0aXBseTJkKGwscykpfShjLG0scyx2LHAseSxvLHUpOmZ1bmN0aW9uKHQsZSxyLGEsbixkKXt2YXIgbz1pLm11bHRpcGx5MmQodCwyKSx1PWkubXVsdGlwbHkyZChlLDIpLGg9aS5hZGQyZChyLGEpLGY9aS5hZGQyZChuLGQpO3JldHVybiBpLmRpdmlkZTJkKGkubXVsdGlwbHkyZChvLHUpLGkubXVsdGlwbHkyZChoLGYpKX0oYyxtLHMsdixwLHkpfX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUub3JpZ2luYWxTc2ltPXZvaWQgMDt2YXIgaT1yKDApLGE9cigxKTtlLm9yaWdpbmFsU3NpbT1mdW5jdGlvbih0LGUscil7dmFyIG49YS5mc3BlY2lhbChcImdhdXNzaWFuXCIsci53aW5kb3dTaXplLDEuNSksZD1NYXRoLnBvdygyLHIuYml0RGVwdGgpLTEsbz1NYXRoLnBvdyhyLmsxKmQsMiksdT1NYXRoLnBvdyhyLmsyKmQsMik7bj1pLmRpdmlkZTJkKG4saS5zdW0yZChuKSk7dmFyIGg9YS5maWx0ZXIyKG4sdCxcInZhbGlkXCIpLGY9YS5maWx0ZXIyKG4sZSxcInZhbGlkXCIpLGw9aS5zcXVhcmUyZChoKSxzPWkuc3F1YXJlMmQoZiksdj1pLm11bHRpcGx5MmQoaCxmKSxjPWkuc3F1YXJlMmQodCksdz1pLnNxdWFyZTJkKGUpLGc9aS5zdWJ0cmFjdDJkKGEuZmlsdGVyMihuLGMsXCJ2YWxpZFwiKSxsKSxwPWkuc3VidHJhY3QyZChhLmZpbHRlcjIobix3LFwidmFsaWRcIikscykseT1pLnN1YnRyYWN0MmQoYS5maWx0ZXIyKG4saS5tdWx0aXBseTJkKHQsZSksXCJ2YWxpZFwiKSx2KTtpZihvPjAmJnU+MCl7dmFyIG09aS5hZGQyZChpLm11bHRpcGx5MmQodiwyKSxvKSxiPWkuYWRkMmQoaS5tdWx0aXBseTJkKHksMiksdSksTT1pLmFkZDJkKGkuYWRkMmQobCxzKSxvKSxfPWkuYWRkMmQoaS5hZGQyZChnLHApLHUpO3JldHVybiBpLmRpdmlkZTJkKGkubXVsdGlwbHkyZChtLGIpLGkubXVsdGlwbHkyZChNLF8pKX12YXIgaj1pLm11bHRpcGx5MmQodiwyKSxPPWkubXVsdGlwbHkyZCh5LDIpLFA9aS5hZGQyZChsLHMpLGs9aS5hZGQyZChnLHApO3JldHVybiBpLmRpdmlkZTJkKGkubXVsdGlwbHkyZChqLE8pLGkubXVsdGlwbHkyZChQLGspKX19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLmJlemtyb3ZueVNzaW09dm9pZCAwO3ZhciBpPXIoMCksYT1yKDEpO2Z1bmN0aW9uIG4odCxlLHIpe3ZhciBhPXQuZGF0YSxuPWUuZGF0YSxkPXIuYml0RGVwdGgsbz1yLmsxLHU9ci5rMixoPU1hdGgucG93KDIsZCktMSxmPU1hdGgucG93KG8qaCwyKSxsPU1hdGgucG93KHUqaCwyKSxzPWkuYXZlcmFnZShhKSx2PWkuYXZlcmFnZShuKSxjPWkudmFyaWFuY2UoYSxzKSx3PWkudmFyaWFuY2Uobix2KTtyZXR1cm4oMipzKnYrZikqKDIqaS5jb3ZhcmlhbmNlKGEsbixzLHYpK2wpLygoTWF0aC5wb3cocywyKStNYXRoLnBvdyh2LDIpK2YpKihjK3crbCkpfWUuYmV6a3Jvdm55U3NpbT1mdW5jdGlvbih0LGUscil7Zm9yKHZhciBpPXIud2luZG93U2l6ZSxkPU1hdGguY2VpbCh0LndpZHRoL2kpLG89TWF0aC5jZWlsKHQuaGVpZ2h0L2kpLHU9bmV3IEFycmF5KGQqbyksaD0wLGY9MDtmPHQuaGVpZ2h0O2YrPWkpZm9yKHZhciBsPTA7bDx0LndpZHRoO2wrPWkpe3ZhciBzPU1hdGgubWluKGksdC53aWR0aC1sKSx2PU1hdGgubWluKGksdC5oZWlnaHQtZiksYz1hLnN1Yih0LGwsdixmLHMpLHc9YS5zdWIoZSxsLHYsZixzKTt1W2grK109bihjLHcscil9cmV0dXJue2RhdGE6dSx3aWR0aDpkLGhlaWdodDpvfX19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLmRvd25zYW1wbGU9dm9pZCAwO3ZhciBpPXIoMCksYT1yKDEpO2Z1bmN0aW9uIG4odCxlLHIpe3ZhciBpPWEuaW1maWx0ZXIodCxlLFwic3ltbWV0cmljXCIsXCJzYW1lXCIpO3JldHVybiBhLnNraXAyZChpLFswLHIsaS5oZWlnaHRdLFswLHIsaS53aWR0aF0pfWUuZG93bnNhbXBsZT1mdW5jdGlvbih0LGUpe3JldHVyblwib3JpZ2luYWxcIj09PWUuZG93bnNhbXBsZT9mdW5jdGlvbih0LGUscil7dm9pZCAwPT09ciYmKHI9MjU2KTt2YXIgZD1NYXRoLm1pbih0LndpZHRoLGUuaGVpZ2h0KS9yLG89TWF0aC5yb3VuZChkKTtpZihvPjEpe3ZhciB1PWEub25lcyhvKTt0PW4odCx1PWkuZGl2aWRlMmQodSxpLnN1bTJkKHUpKSxvKSxlPW4oZSx1LG8pfXJldHVyblt0LGVdfSh0WzBdLHRbMV0sZS5tYXhTaXplKTp0fX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuZGVmYXVsdHM9dm9pZCAwLGUuZGVmYXVsdHM9e3dpbmRvd1NpemU6MTEsazE6LjAxLGsyOi4wMyxiaXREZXB0aDo4LGRvd25zYW1wbGU6XCJvcmlnaW5hbFwiLHNzaW06XCJmYXN0XCIsbWF4U2l6ZToyNTZ9fV0pfSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3NpbS53ZWIuanMubWFwIiwiaW1wb3J0IHsgc3NpbSB9IGZyb20gXCJzc2ltLmpzXCI7XG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCIuL1JlY3RhbmdsZVwiO1xuaW1wb3J0IENvbm5lY3RlZEFyZWFSZWNvZ25pdGlvbiBmcm9tIFwiLi9Db25uZWN0ZWRBcmVhUmVjb2duaXRpb25cIjtcbmltcG9ydCBOdW1iZXJzSGFzaExpc3QgZnJvbSBcIi4vRGF0YS9OdW1iZXJIYXNoTGlzdC5qc29uXCI7XG5mb3IgKGxldCBoYXNoIG9mIE51bWJlcnNIYXNoTGlzdCkge1xuICBpZiAoaGFzaC5oYXNoIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBoYXNoLmhhc2ggPSBoYXNoLmhhc2gubWFwKHYgPT4gdiAvIGhhc2guY291bnQpO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtUmVjb2duaXRpb24ge1xuICBjb25zdHJ1Y3RvcihJbWFnZURhdGEsIFJ1bGVzLCBSZWN0KSB7XG4gICAgaWYgKEltYWdlRGF0YSBpbnN0YW5jZW9mIFJlY3RhbmdsZSkge1xuICAgICAgdGhpcy5Cb3VuZCA9IEltYWdlRGF0YTtcbiAgICAgIHRoaXMuQ29uZmlkZW5jZSA9IHtcbiAgICAgICAgSXRlbUlkOiAtSW5maW5pdHksXG4gICAgICAgIENvdW50OiBbXVxuICAgICAgfTtcbiAgICAgIHRoaXMuSXRlbUlkID0gXCJcIjtcbiAgICAgIHRoaXMuQ291bnQgPSBOYU47XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuTWF0cml4ID0gSW1hZ2VEYXRhO1xuICAgIHRoaXMuV2lkdGggPSBJbWFnZURhdGFbMF0ubGVuZ3RoO1xuICAgIHRoaXMuSGVpZ2h0ID0gSW1hZ2VEYXRhLmxlbmd0aDtcbiAgICB0aGlzLklEYXRhID0gbmV3IEFycmF5KCk7XG4gICAgdGhpcy5Cb3VuZCA9IFJlY3Q7XG4gICAgdGhpcy5SdWxlcyA9IFJ1bGVzO1xuICAgIHRoaXMuQ29uZmlkZW5jZSA9IHtcbiAgICAgIEl0ZW1JZDogLUluZmluaXR5LFxuICAgICAgQ291bnQ6IFtdXG4gICAgfTtcbiAgICB0aGlzLnByZXBhcmUoKTtcbiAgICB0aGlzLkl0ZW1JZCA9IHRoaXMuZ2V0SXRlbUlkKCk7XG4gICAgdGhpcy5Db3VudCA9IHRoaXMuZ2V0Q291bnQoKTtcbiAgICBkZWxldGUgdGhpcy5SdWxlcztcbiAgICBkZWxldGUgdGhpcy5JRGF0YTtcbiAgICBkZWxldGUgdGhpcy5IZWlnaHQ7XG4gICAgZGVsZXRlIHRoaXMuV2lkdGg7XG4gICAgZGVsZXRlIHRoaXMuTWF0cml4O1xuICB9XG4gIHByZXBhcmUoKSB7XG4gICAgbGV0IGN4ID0gdGhpcy5NYXRyaXhbMF0ubGVuZ3RoID4+IDE7XG4gICAgbGV0IGN5ID0gdGhpcy5NYXRyaXgubGVuZ3RoID4+IDE7XG4gICAgbGV0IHIgPSAoY3ggKyBjeSkgPj4gMTtcblxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5IZWlnaHQ7IHkrKykge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLldpZHRoOyB4KyspIHtcbiAgICAgICAgbGV0IFRlbXBDb2xvciA9IHRoaXMuTWF0cml4W3ldW3hdO1xuICAgICAgICBpZiAoTWF0aC5oeXBvdCh4IC0gY3gsIHkgLSBjeSkgPiByKSBUZW1wQ29sb3IgPSBbMjU1LCAyNTUsIDI1NV07XG4gICAgICAgIHRoaXMuSURhdGEucHVzaCguLi5UZW1wQ29sb3IsIDI1NSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuSURhdGEgPSB7XG4gICAgICBkYXRhOiB0aGlzLklEYXRhLFxuICAgICAgaGVpZ2h0OiB0aGlzLkhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLldpZHRoXG4gICAgfTtcbiAgfVxuICBnZXRJdGVtSWQoKSB7XG4gICAgbGV0IEltYWdlcyA9IFtdO1xuICAgIGxldCBDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIENhbnZhcy53aWR0aCA9IHRoaXMuV2lkdGg7XG4gICAgQ2FudmFzLmhlaWdodCA9IHRoaXMuSGVpZ2h0O1xuICAgIGxldCBDdHggPSBDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGxldCBDb25maWRlbmNlID0gLUluZmluaXR5O1xuICAgIGxldCBSZXN1bHQgPSBcIlwiO1xuICAgIGZvciAobGV0IFJ1bGUgb2YgdGhpcy5SdWxlcykge1xuICAgICAgaWYgKCFJdGVtUmVjb2duaXRpb24uSW1hZ2VzW1J1bGUuaWRdKSBjb250aW51ZTtcbiAgICAgIEN0eC5jbGVhclJlY3QoMCwgMCwgQ2FudmFzLndpZHRoLCBDYW52YXMuaGVpZ2h0KTtcbiAgICAgIEN0eC5kcmF3SW1hZ2UoXG4gICAgICAgIEl0ZW1SZWNvZ25pdGlvbi5JbWFnZXNbUnVsZS5pZF0sXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIEl0ZW1SZWNvZ25pdGlvbi5JbWFnZXNbUnVsZS5pZF0ud2lkdGgsXG4gICAgICAgIEl0ZW1SZWNvZ25pdGlvbi5JbWFnZXNbUnVsZS5pZF0uaGVpZ2h0LFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICBDYW52YXMud2lkdGgsXG4gICAgICAgIENhbnZhcy5oZWlnaHRcbiAgICAgICk7XG4gICAgICBsZXQgSW1hZ2VEID0gQ3R4LmdldEltYWdlRGF0YSgwLCAwLCBDYW52YXMud2lkdGgsIENhbnZhcy5oZWlnaHQpO1xuICAgICAgSW1hZ2VzLnB1c2goW1J1bGUuaWQsIEltYWdlRF0pO1xuICAgIH1cbiAgICBmb3IgKGxldCBJbWFnZSBvZiBJbWFnZXMpIHtcbiAgICAgIGxldCBTU0lNID0gc3NpbShJbWFnZVsxXSwgdGhpcy5JRGF0YSwgeyB3aW5kb3dTaXplOiA4LCBzc2ltOiBcImJlemtyb3ZueVwiIH0pLm1zc2ltO1xuICAgICAgaWYgKFNTSU0gPiBDb25maWRlbmNlKSB7XG4gICAgICAgIENvbmZpZGVuY2UgPSBTU0lNO1xuICAgICAgICBSZXN1bHQgPSBJbWFnZVswXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5Db25maWRlbmNlLkl0ZW1JZCA9IENvbmZpZGVuY2U7XG4gICAgcmV0dXJuIFJlc3VsdDtcbiAgfVxuICBnZXRDb3VudCgpIHtcbiAgICBpZiAodGhpcy5JdGVtSWQgPT0gXCJcIikge1xuICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gICAgbGV0IFJhbmdlID0gdGhpcy5SdWxlcy5maW5kKHYgPT4gdi5pZCA9PSB0aGlzLkl0ZW1JZCk7XG4gICAgaWYgKFJhbmdlKSB7XG4gICAgICBSYW5nZSA9IFJhbmdlLnJhbmdlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBOdW1SYW5nZSA9IFtSYW5nZS51cHBlciA+IDkgPyAwIDogTWF0aC5tYXgoMSwgUmFuZ2UubG93ZXIpLCBNYXRoLm1pbig5LCBSYW5nZS51cHBlcildO1xuICAgIGxldCBOdW1MaXN0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IE51bVJhbmdlWzBdOyBpIDw9IE51bVJhbmdlWzFdOyBpKyspIHtcbiAgICAgIE51bUxpc3QucHVzaChpKTtcbiAgICB9XG4gICAgaWYgKE51bUxpc3QubGVuZ3RoID09IDEpIHtcbiAgICAgIHRoaXMuQ29uZmlkZW5jZS5Db3VudFswXSA9IDE7XG4gICAgICByZXR1cm4gTnVtTGlzdFswXTtcbiAgICB9XG4gICAgbGV0IFhTdGFydCA9IGZhbHNlLFxuICAgICAgWEVuZCA9IGZhbHNlLFxuICAgICAgWVN0YXJ0ID0gMCxcbiAgICAgIEZpbmQgPSBmYWxzZTtcbiAgICBsZXQgTnVtYmVyUmVjdCA9IG5ldyBSZWN0YW5nbGUoKTtcbiAgICBmb3IgKGxldCB5ID0gdGhpcy5IZWlnaHQgPj4gMTsgeSA8IHRoaXMuSGVpZ2h0OyB5KyspIHtcbiAgICAgIFhTdGFydCA9IGZhbHNlO1xuICAgICAgWEVuZCA9IGZhbHNlO1xuICAgICAgZm9yIChsZXQgeCA9IHRoaXMuV2lkdGggPj4gMTsgeCA8IHRoaXMuV2lkdGg7IHgrKykge1xuICAgICAgICBsZXQgR3JleVVwID0gZGlzdGFuY2UgPT5cbiAgICAgICAgICAodGhpcy5NYXRyaXhbeSAtIGRpc3RhbmNlXVt4XVswXSArIHRoaXMuTWF0cml4W3kgLSBkaXN0YW5jZV1beF1bMV0gKyB0aGlzLk1hdHJpeFt5IC0gZGlzdGFuY2VdW3hdWzJdKSAvIDM7XG4gICAgICAgIGxldCBHcmV5Tm93ID0gKHRoaXMuTWF0cml4W3ldW3hdWzBdICsgdGhpcy5NYXRyaXhbeV1beF1bMV0gKyB0aGlzLk1hdHJpeFt5XVt4XVsyXSkgLyAzO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKHRoaXMuSXRlbUlkID09IFwiMzMwMVwiXG4gICAgICAgICAgICA/IE1hdGguYWJzKEdyZXlOb3cgLSBHcmV5VXAoMSkpXG4gICAgICAgICAgICA6IE1hdGgubWF4KE1hdGguYWJzKEdyZXlOb3cgLSBHcmV5VXAoMSkpLCBNYXRoLmFicyhHcmV5Tm93IC0gR3JleVVwKDIpKSwgR3JleU5vdyAtIEdyZXlVcCgzKSkpID4gMjBcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKCFYU3RhcnQpIHtcbiAgICAgICAgICAgIFhTdGFydCA9IHg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFhFbmQgPSB4O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoWEVuZCAtIFhTdGFydCArIDEgPiAyMCkge1xuICAgICAgICAgICAgRmluZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgWFN0YXJ0ID0gZmFsc2U7XG4gICAgICAgICAgICBYRW5kID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoRmluZCkge1xuICAgICAgICBZU3RhcnQgPSB5O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKEZpbmQpIHtcbiAgICAgIE51bWJlclJlY3QudXBkYXRlKHtcbiAgICAgICAgbGVmdDogWFN0YXJ0LFxuICAgICAgICByaWdodDogWEVuZCxcbiAgICAgICAgdG9wOiBZU3RhcnQsXG4gICAgICAgIGJvdHRvbTogTWF0aC5yb3VuZCh0aGlzLkJvdW5kLmhlaWdodCAtIHRoaXMuQm91bmQuaGVpZ2h0ICogMC4wOClcbiAgICAgIH0pO1xuICAgICAgLyogY29uc29sZS5sb2coe1xuICAgICAgICBsZWZ0OiBOdW1iZXJSZWN0LmxlZnQgKyB0aGlzLkJvdW5kLmxlZnQsXG4gICAgICAgIHJpZ2h0OiBOdW1iZXJSZWN0LnJpZ2h0ICsgdGhpcy5Cb3VuZC5sZWZ0LFxuICAgICAgICB0b3A6IE51bWJlclJlY3QudG9wICsgdGhpcy5Cb3VuZC50b3AsXG4gICAgICAgIGJvdHRvbTogTnVtYmVyUmVjdC5ib3R0b20gKyB0aGlzLkJvdW5kLnRvcFxuICAgICAgfSk7Ki9cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgTnVtYmVyTWFydGl4ID0gW107XG4gICAgbGV0IE51bWJlck5vZGVzID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgTnVtYmVyUmVjdC5oZWlnaHQ7IHkrKykge1xuICAgICAgTnVtYmVyTWFydGl4LnB1c2goW10pO1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBOdW1iZXJSZWN0LndpZHRoOyB4KyspIHtcbiAgICAgICAgbGV0IFtSLCBHLCBCXSA9IHRoaXMuTWF0cml4W3kgKyBOdW1iZXJSZWN0LnRvcF1beCArIE51bWJlclJlY3QubGVmdF07XG4gICAgICAgIGxldCBHcmV5ID0gKFIgKyBHICsgQikgLyAzO1xuICAgICAgICBpZiAoR3JleSA+PSAxMjApIHtcbiAgICAgICAgICBOdW1iZXJNYXJ0aXhbeV1beF0gPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKEdyZXkgPCAxMjAgJiYgR3JleSA+IDEwNSkge1xuICAgICAgICAgIGxldCBsZWZ0LCByaWdodCwgdG9wLCBib3R0b207XG4gICAgICAgICAgaWYgKHggIT09IDApIHtcbiAgICAgICAgICAgIGxlZnQgPSB0aGlzLk1hdHJpeFt5ICsgTnVtYmVyUmVjdC50b3BdW3ggKyBOdW1iZXJSZWN0LmxlZnQgLSAxXS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKSAvIDM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh4ICE9PSBOdW1iZXJSZWN0LndpZHRoIC0gMSkge1xuICAgICAgICAgICAgcmlnaHQgPSB0aGlzLk1hdHJpeFt5ICsgTnVtYmVyUmVjdC50b3BdW3ggKyBOdW1iZXJSZWN0LmxlZnQgKyAxXS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKSAvIDM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh5ICE9IDApIHtcbiAgICAgICAgICAgIHRvcCA9IHRoaXMuTWF0cml4W3kgKyBOdW1iZXJSZWN0LnRvcCAtIDFdW3ggKyBOdW1iZXJSZWN0LmxlZnRdLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpIC8gMztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHkgIT09IE51bWJlclJlY3QuaGVpZ2h0IC0gMSkge1xuICAgICAgICAgICAgYm90dG9tID0gdGhpcy5NYXRyaXhbeSArIE51bWJlclJlY3QudG9wICsgMV1beCArIE51bWJlclJlY3QubGVmdF0ucmVkdWNlKChhLCBiKSA9PiBhICsgYikgLyAzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKGxlZnQgJiYgbGVmdCA+IDEyMCkgfHwgKHJpZ2h0ICYmIHJpZ2h0ID4gMTIwKSB8fCAodG9wICYmIHRvcCA+IDEyMCkgfHwgKGJvdHRvbSAmJiBib3R0b20gPiAxMjApKSB7XG4gICAgICAgICAgICBOdW1iZXJNYXJ0aXhbeV1beF0gPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBOdW1iZXJNYXJ0aXhbeV1beF0gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgTnVtYmVyTWFydGl4W3ldW3hdID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgTnVtYmVyTWFydGl4W3ldW3hdID0gR3JleSA+IDgwO1xuICAgICAgICBpZiAoTnVtYmVyTWFydGl4W3ldW3hdKSB7XG4gICAgICAgICAgTnVtYmVyTm9kZXMuYWRkKHggKiAxMDAwMCArIHkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBHZXRBbGxOdW1iZXIgPSBuZXcgQ29ubmVjdGVkQXJlYVJlY29nbml0aW9uKE51bWJlck1hcnRpeCwgTnVtYmVyTm9kZXMsIHRydWUpO1xuICAgIGxldCBUZW1wQ291bnQgPSBcIlwiO1xuICAgIGxldCBSZXN1bHQgPSBHZXRBbGxOdW1iZXIuR2V0QWxsQ29ubmVjdGVkQXJlYShSZWN0ID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coUmVjdCk7XG4gICAgICBpZiAoXG4gICAgICAgIFJlY3QucG9pbnQgPCAyMCB8fFxuICAgICAgICBSZWN0LndpZHRoID4gUmVjdC5oZWlnaHQgfHxcbiAgICAgICAgUmVjdC5oZWlnaHQgPCA4IHx8XG4gICAgICAgIFJlY3Qud2lkdGggPCAzIHx8XG4gICAgICAgIE51bWJlclJlY3Qud2lkdGggLSBSZWN0LmxlZnQgPCA1IHx8XG4gICAgICAgIFJlY3QubGVmdCA8IDVcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gUmVjdDtcbiAgICB9KS5zb3J0KChhLCBiKSA9PiBhLmxlZnQgLSBiLmxlZnQpO1xuICAgIGxldCBOdW1DYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIE51bUNhbnZhcy53aWR0aCA9IDk7XG4gICAgTnVtQ2FudmFzLmhlaWdodCA9IDEwO1xuICAgIGxldCBOdW1DdHggPSBOdW1DYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGZvciAobGV0IE51bSBvZiBSZXN1bHQpIHtcbiAgICAgIGxldCBDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgQ2FudmFzLndpZHRoID0gTnVtLndpZHRoO1xuICAgICAgQ2FudmFzLmhlaWdodCA9IE51bS5oZWlnaHQ7XG4gICAgICBsZXQgQ3R4ID0gQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGxldCBJbWdEYXRhID0gQ3R4LmdldEltYWdlRGF0YSgwLCAwLCBDYW52YXMud2lkdGgsIENhbnZhcy5oZWlnaHQpO1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBOdW0uaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBOdW0ud2lkdGg7IHgrKykge1xuICAgICAgICAgIGxldCBJbmRleCA9ICh5ICogQ2FudmFzLndpZHRoICsgeCkgKiA0O1xuICAgICAgICAgIGlmIChOdW0ubWF0cml4W3ldW3hdKSB7XG4gICAgICAgICAgICBJbWdEYXRhLmRhdGFbSW5kZXhdID0gMDtcbiAgICAgICAgICAgIEltZ0RhdGEuZGF0YVtJbmRleCArIDFdID0gMDtcbiAgICAgICAgICAgIEltZ0RhdGEuZGF0YVtJbmRleCArIDJdID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgSW1nRGF0YS5kYXRhW0luZGV4XSA9IDI1NTtcbiAgICAgICAgICAgIEltZ0RhdGEuZGF0YVtJbmRleCArIDFdID0gMjU1O1xuICAgICAgICAgICAgSW1nRGF0YS5kYXRhW0luZGV4ICsgMl0gPSAyNTU7XG4gICAgICAgICAgfVxuICAgICAgICAgIEltZ0RhdGEuZGF0YVtJbmRleCArIDNdID0gMjU1O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBDdHgucHV0SW1hZ2VEYXRhKEltZ0RhdGEsIDAsIDApO1xuICAgICAgTnVtQ3R4LmNsZWFyUmVjdCgwLCAwLCBOdW1DYW52YXMud2lkdGgsIE51bUNhbnZhcy5oZWlnaHQpO1xuICAgICAgTnVtQ3R4LmRyYXdJbWFnZShDYW52YXMsIDAsIDAsIENhbnZhcy53aWR0aCwgQ2FudmFzLmhlaWdodCwgMCwgMCwgTnVtQ2FudmFzLndpZHRoLCBOdW1DYW52YXMuaGVpZ2h0KTtcbiAgICAgIGxldCBESGFzaCA9IHRoaXMuZ2V0REhhc2goTnVtQ3R4LmdldEltYWdlRGF0YSgwLCAwLCBOdW1DYW52YXMud2lkdGgsIE51bUNhbnZhcy5oZWlnaHQpKTtcbiAgICAgIGxldCBOdW1iZXJSZXN1bHQgPSB0aGlzLmRIYXNodG9OdW1iZXIoREhhc2gsIE51bUxpc3QpO1xuICAgICAgVGVtcENvdW50ICs9IE51bWJlclJlc3VsdC5OdW07XG4gICAgICB0aGlzLkNvbmZpZGVuY2UuQ291bnQucHVzaChOdW1iZXJSZXN1bHQuQ29uZmlkZW5jZSk7XG4gICAgfVxuICAgIHJldHVybiBOdW1iZXIoVGVtcENvdW50KTtcbiAgfVxuICBnZXRESGFzaChpdGVtKSB7XG4gICAgbGV0IEhhc2hTdHJpbmcgPSBcIlwiO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpdGVtLmRhdGEubGVuZ3RoOyBpbmRleCArPSA0KSB7XG4gICAgICBpZiAoTWF0aC5mbG9vcihpbmRleCAvIDQpICUgaXRlbS53aWR0aCA9PSAwKSBjb250aW51ZTtcbiAgICAgIGlmIChcbiAgICAgICAgTWF0aC5mbG9vcigoaXRlbS5kYXRhW2luZGV4IC0gNF0gKyBpdGVtLmRhdGFbaW5kZXggLSAzXSArIGl0ZW0uZGF0YVtpbmRleCAtIDJdKSAvIDMpID5cbiAgICAgICAgTWF0aC5mbG9vcigoaXRlbS5kYXRhW2luZGV4XSArIGl0ZW0uZGF0YVtpbmRleCArIDFdICsgaXRlbS5kYXRhW2luZGV4ICsgMl0pIC8gMylcbiAgICAgICkge1xuICAgICAgICBIYXNoU3RyaW5nICs9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBIYXNoU3RyaW5nICs9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBIYXNoU3RyaW5nO1xuICB9XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGFzaFxuICAgKiBAcGFyYW0ge2FycmF5fSBOdW1iZXJzXG4gICAqL1xuICBkSGFzaHRvTnVtYmVyKGhhc2gsIE51bWJlcnMpIHtcbiAgICBsZXQgTnVtQ29uZmlkZW5jZSA9IC1JbmZpbml0eTtcbiAgICBsZXQgTnVtID0gTmFOO1xuICAgIGxldCBBbGxMZW5ndGggPSA4MDtcbiAgICBsZXQgTnVtc0hhc2hMaXN0ID0gTnVtYmVyc0hhc2hMaXN0LmZpbHRlcih2ID0+IE51bWJlcnMuaW5jbHVkZXModi5udW1iZXIpKTtcbiAgICBmb3IgKGxldCBOdW1iZXJESGFzaCBvZiBOdW1zSGFzaExpc3QpIHtcbiAgICAgIGxldCBDb25maWRlbmNlID0gMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFzaC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaGFzaFtpXSA9PSBcIjFcIikge1xuICAgICAgICAgIENvbmZpZGVuY2UgKz0gTnVtYmVyREhhc2guaGFzaFtpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBDb25maWRlbmNlICs9IDEgLSBOdW1iZXJESGFzaC5oYXNoW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBDb25maWRlbmNlIC89IEFsbExlbmd0aDtcbiAgICAgIGlmIChDb25maWRlbmNlID4gTnVtQ29uZmlkZW5jZSkge1xuICAgICAgICBOdW1Db25maWRlbmNlID0gQ29uZmlkZW5jZTtcbiAgICAgICAgTnVtID0gTnVtYmVyREhhc2gubnVtYmVyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgTnVtOiBOdW0sXG4gICAgICBDb25maWRlbmNlOiBOdW1Db25maWRlbmNlXG4gICAgfTtcbiAgfVxuICBzdGF0aWMgaW5pdChJbWFnZSkge1xuICAgIHRoaXMuSW1hZ2VzID0gSW1hZ2U7XG4gIH1cbn1cbiIsImltcG9ydCBSZWN0UmVjb2duaXRpb24gZnJvbSBcIi4vUmVjdFJlY29nbml0aW9uXCI7XG5pbXBvcnQgU3RhZ2VSZWNvZ25pdGlvbiBmcm9tIFwiLi9TdGFnZVJlY29nbml0aW9uXCI7XG5pbXBvcnQgSXRlbVJlY29nbml0aW9uIGZyb20gXCIuL0l0ZW1SZWNvZ25pdGlvblwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcHNSZWNvZ25pdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGltZykge1xuICAgIHRoaXMuSW1hZ2UgPSBpbWc7XG4gICAgdGhpcy5DYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIC8vZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLkNhbnZhcyk7XG4gICAgdGhpcy5DYW52YXMud2lkdGggPSBpbWcud2lkdGg7XG4gICAgdGhpcy5DYW52YXMuaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICB0aGlzLmN0eCA9IHRoaXMuQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcIiMwMGZmMDBcIjtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwiIzAwZmYwMFwiO1xuICAgIHRoaXMucmF3SW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XG4gICAgdGhpcy5tYXRyaXhJbWFnZURhdGEgPSBbW11dO1xuICAgIHRoaXMuQm91bmREYXRhID0ge307XG4gICAgdGhpcy5TdGFnZSA9IHt9O1xuICAgIHRoaXMuSXRlbXMgPSBbXTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDAsIHggPSAwLCB5ID0gMDsgaW5kZXggPCB0aGlzLnJhd0ltYWdlRGF0YS5kYXRhLmxlbmd0aDsgaW5kZXggKz0gNCkge1xuICAgICAgdGhpcy5tYXRyaXhJbWFnZURhdGFbeV1beF0gPSBbXG4gICAgICAgIHRoaXMucmF3SW1hZ2VEYXRhLmRhdGFbaW5kZXhdLFxuICAgICAgICB0aGlzLnJhd0ltYWdlRGF0YS5kYXRhW2luZGV4ICsgMV0sXG4gICAgICAgIHRoaXMucmF3SW1hZ2VEYXRhLmRhdGFbaW5kZXggKyAyXVxuICAgICAgXTtcbiAgICAgIGlmICgrK3ggPT0gaW1nLndpZHRoKSB7XG4gICAgICAgIHggPSAwO1xuICAgICAgICBpZiAoKyt5ICE9IGltZy5oZWlnaHQpIHRoaXMubWF0cml4SW1hZ2VEYXRhLnB1c2goW10pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLlJlY3RSZWNvZ25pdGlvbigpO1xuICAgIGlmICh0aGlzLkRlYnVnKSB7XG4gICAgICBmb3IgKGxldCBSZWN0IG9mIHRoaXMuQm91bmREYXRhLm1lcmdlZFJlY3RzLlJpZ2h0KSB7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVJlY3QoUmVjdC5sZWZ0LCBSZWN0LnRvcCwgUmVjdC53aWR0aCwgUmVjdC5oZWlnaHQpO1xuICAgICAgfVxuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcIiNmZjAwMDBcIjtcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVJlY3QoXG4gICAgICAgIHRoaXMuQm91bmREYXRhLlN0YWdlLmxlZnQsXG4gICAgICAgIHRoaXMuQm91bmREYXRhLlN0YWdlLnRvcCxcbiAgICAgICAgdGhpcy5Cb3VuZERhdGEuU3RhZ2Uud2lkdGgsXG4gICAgICAgIHRoaXMuQm91bmREYXRhLlN0YWdlLmhlaWdodFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5kZXRlY3RTdGFnZSgpO1xuICAgIHRoaXMuZGV0ZWN0RnVybml0dXJlKCk7XG4gICAgdGhpcy5kZXRlY3RJdGVtKCk7XG4gICAgZGVsZXRlIHRoaXMuY3R4O1xuICAgIGRlbGV0ZSB0aGlzLkNhbnZhcztcbiAgICBkZWxldGUgdGhpcy5tYXRyaXhJbWFnZURhdGE7XG4gICAgZGVsZXRlIHRoaXMucmF3SW1hZ2VEYXRhO1xuICAgIGRlbGV0ZSB0aGlzLkltYWdlO1xuICB9XG4gIC8qKlxuICAgKiDor4bliKvlm77lg4/ovrnnlYxcbiAgICovXG4gIFJlY3RSZWNvZ25pdGlvbigpIHtcbiAgICB0aGlzLkJvdW5kRGF0YSA9IG5ldyBSZWN0UmVjb2duaXRpb24odGhpcy5tYXRyaXhJbWFnZURhdGEpO1xuICB9XG4gIGRldGVjdEZ1cm5pdHVyZSgpIHtcbiAgICBsZXQgRGV0ZWN0VHlwZSA9IFtcIkxVQ0tZX0RST1BcIiwgXCJTUEVDSUFMX0RST1BcIiwgXCJBTExfRFJPUFwiXTtcbiAgICBmb3IgKGxldCBSZWN0IG9mIHRoaXMuQm91bmREYXRhLkl0ZW1zKSB7XG4gICAgICBpZiAoRGV0ZWN0VHlwZS5pbmNsdWRlcyhSZWN0LnR5cGUpKSB7XG4gICAgICAgIGxldCBPdGhlckl0ZW1zID0gdGhpcy5Cb3VuZERhdGEuSXRlbXMuZmlsdGVyKGEgPT4gYSAhPSBSZWN0KTtcbiAgICAgICAgbGV0IEFyZWFEaWZmID1cbiAgICAgICAgICBPdGhlckl0ZW1zLnJlZHVjZSgoYSwgT3RoZXJJdGVtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYSArIE1hdGguYWJzKE90aGVySXRlbS5hcmVhIC0gUmVjdC5hcmVhKTtcbiAgICAgICAgICB9LCAwKSAvIE90aGVySXRlbXMubGVuZ3RoO1xuICAgICAgICBpZiAoQXJlYURpZmYgPiAxMDAwKSB7XG4gICAgICAgICAgUmVjdC50eXBlID0gXCJMVUNLWV9EUk9QXCI7XG4gICAgICAgICAgUmVjdC5BcmVhRGlmZiA9IEFyZWFEaWZmO1xuICAgICAgICB9IGVsc2UgaWYgKChSZWN0LnR5cGUgPT0gXCJMVUNLWV9EUk9QXCIpKSB7XG4gICAgICAgICAgUmVjdC50eXBlID09IFwiU1BFQ0lBTF9EUk9QXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZGV0ZWN0SXRlbSgpIHtcbiAgICBsZXQgRGV0ZWN0VHlwZSA9IFtcIk5PUk1BTF9EUk9QXCIsIFwiRVhUUkFfRFJPUFwiLCBcIlNQRUNJQUxfRFJPUFwiLCBcIkFMTF9EUk9QXCJdO1xuICAgIGZvciAobGV0IFJlY3Qgb2YgdGhpcy5Cb3VuZERhdGEuSXRlbXMpIHtcbiAgICAgIGxldCBUeXBlID0gUmVjdC50eXBlO1xuICAgICAgZGVsZXRlIFJlY3QudHlwZTtcbiAgICAgIGxldCBSZXN1bHQgPSB7IHR5cGU6IFR5cGUgfTtcbiAgICAgIGlmIChEZXRlY3RUeXBlLmluY2x1ZGVzKFR5cGUpKSB7XG4gICAgICAgIGxldCBEcm9wTGlzdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBEcm9wIG9mIERyb3BzUmVjb2duaXRpb24uU3RhZ2VbdGhpcy5TdGFnZS5Db2RlXS5kcm9wSW5mb3MpIHtcbiAgICAgICAgICBpZiAoKERyb3AuZHJvcFR5cGUgPT0gVHlwZSB8fCBUeXBlID09IFwiQUxMX0RST1BcIikgJiYgRHJvcC5pdGVtSWQgJiYgRHJvcC5pdGVtSWQgIT0gXCJmdXJuaVwiKSB7XG4gICAgICAgICAgICBEcm9wTGlzdC5wdXNoKHsgaWQ6IERyb3AuaXRlbUlkLCByYW5nZTogRHJvcC5ib3VuZHMgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFR5cGUpO1xuICAgICAgICBsZXQgSXRlbSA9IG5ldyBJdGVtUmVjb2duaXRpb24oXG4gICAgICAgICAgdGhpcy5nZXRJbWFnZU1hdHJpeChSZWN0LmxlZnQsIFJlY3QudG9wLCBSZWN0LnJpZ2h0LCBSZWN0LmJvdHRvbSksXG4gICAgICAgICAgRHJvcExpc3QsXG4gICAgICAgICAgUmVjdFxuICAgICAgICApO1xuICAgICAgICBPYmplY3QuYXNzaWduKFJlc3VsdCwgSXRlbSk7XG4gICAgICB9IGVsc2UgaWYgKFR5cGUgPT0gXCJMVUNLWV9EUk9QXCIpIHtcbiAgICAgICAgbGV0IEl0ZW0gPSBuZXcgSXRlbVJlY29nbml0aW9uKFJlY3QpO1xuICAgICAgICBJdGVtLkl0ZW1JZCA9IFwiZnVybmlcIjtcbiAgICAgICAgSXRlbS5Db3VudCA9IDE7XG4gICAgICAgIEl0ZW0uQ29uZmlkZW5jZS5Db3VudCA9IFsxXTtcblxuICAgICAgICBJdGVtLkNvbmZpZGVuY2UuSXRlbUlkID0gKHJhdGlvID0+IHtcbiAgICAgICAgICBpZiAocmF0aW8gPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IHJhbmdlLGxpbmVhcl92YWw7XG4gICAgICAgICAgaWYgKHJhdGlvIDwgMC41KSB7XG4gICAgICAgICAgICByYW5nZSA9IDEuMCAtIDAuNTtcbiAgICAgICAgICAgIGxpbmVhcl92YWwgPSByYXRpbyAvIChyYW5nZSAqIDIuMCk7XG4gICAgICAgICAgICByZXR1cm4gbGluZWFyX3ZhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmFuZ2UgPSAwLjU7XG4gICAgICAgICAgICBsaW5lYXJfdmFsID0gcmF0aW8gLyAocmFuZ2UgKiAyLjApO1xuICAgICAgICAgICAgcmV0dXJuIGxpbmVhcl92YWwgKyAoMS4wIC0gbGluZWFyX3ZhbCkgKiBNYXRoLnBvdygobGluZWFyX3ZhbCAtIDAuNSkgKiAyLCAwLjIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkoUmVjdC5BcmVhRGlmZi8yMDAwKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihSZXN1bHQsIEl0ZW0pO1xuICAgICAgfVxuICAgICAgdGhpcy5JdGVtcy5wdXNoKFJlc3VsdCk7XG4gICAgfVxuICB9XG4gIGdldEltYWdlTWF0cml4KHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgbGV0IE1hdHJpeCA9IFtdO1xuICAgIGZvciAobGV0IHkgPSB5MTsgeSA8PSB5MjsgeSsrKSB7XG4gICAgICBsZXQgcnkgPSBNYXRyaXgucHVzaChbXSkgLSAxO1xuICAgICAgZm9yIChsZXQgeCA9IHgxLCByeCA9IDA7IHggPD0geDI7IHgrKywgcngrKykge1xuICAgICAgICBNYXRyaXhbcnldW3J4XSA9IFtdLmNvbmNhdCh0aGlzLm1hdHJpeEltYWdlRGF0YVt5XVt4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBNYXRyaXg7XG4gIH1cbiAgZGV0ZWN0U3RhZ2UoKSB7XG4gICAgW3RoaXMuU3RhZ2UuQ29kZSwgdGhpcy5TdGFnZS5Db25maWRlbmNlXSA9IFN0YWdlUmVjb2duaXRpb24oXG4gICAgICB0aGlzLmdldEltYWdlTWF0cml4KFxuICAgICAgICB0aGlzLkJvdW5kRGF0YS5TdGFnZS5sZWZ0LFxuICAgICAgICB0aGlzLkJvdW5kRGF0YS5TdGFnZS50b3AsXG4gICAgICAgIHRoaXMuQm91bmREYXRhLlN0YWdlLnJpZ2h0LFxuICAgICAgICB0aGlzLkJvdW5kRGF0YS5TdGFnZS5ib3R0b21cbiAgICAgIClcbiAgICApO1xuICB9XG4gIHN0YXRpYyBpbml0KGRhdGFOYW1lLCBEYXRhKSB7XG4gICAgc3dpdGNoIChkYXRhTmFtZSkge1xuICAgICAgY2FzZSBcIlN0YWdlXCI6XG4gICAgICAgIHRoaXMuU3RhZ2UgPSBEYXRhO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJJdGVtSW1hZ2VcIjpcbiAgICAgICAgSXRlbVJlY29nbml0aW9uLmluaXQoRGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIiwiLyogV2ViIEZvbnQgTG9hZGVyIHYxLjYuMjggLSAoYykgQWRvYmUgU3lzdGVtcywgR29vZ2xlLiBMaWNlbnNlOiBBcGFjaGUgMi4wICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYWEoYSxiLGMpe3JldHVybiBhLmNhbGwuYXBwbHkoYS5iaW5kLGFyZ3VtZW50cyl9ZnVuY3Rpb24gYmEoYSxiLGMpe2lmKCFhKXRocm93IEVycm9yKCk7aWYoMjxhcmd1bWVudHMubGVuZ3RoKXt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMik7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShjLGQpO3JldHVybiBhLmFwcGx5KGIsYyl9fXJldHVybiBmdW5jdGlvbigpe3JldHVybiBhLmFwcGx5KGIsYXJndW1lbnRzKX19ZnVuY3Rpb24gcChhLGIsYyl7cD1GdW5jdGlvbi5wcm90b3R5cGUuYmluZCYmLTEhPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLnRvU3RyaW5nKCkuaW5kZXhPZihcIm5hdGl2ZSBjb2RlXCIpP2FhOmJhO3JldHVybiBwLmFwcGx5KG51bGwsYXJndW1lbnRzKX12YXIgcT1EYXRlLm5vd3x8ZnVuY3Rpb24oKXtyZXR1cm4rbmV3IERhdGV9O2Z1bmN0aW9uIGNhKGEsYil7dGhpcy5hPWE7dGhpcy5vPWJ8fGE7dGhpcy5jPXRoaXMuby5kb2N1bWVudH12YXIgZGE9ISF3aW5kb3cuRm9udEZhY2U7ZnVuY3Rpb24gdChhLGIsYyxkKXtiPWEuYy5jcmVhdGVFbGVtZW50KGIpO2lmKGMpZm9yKHZhciBlIGluIGMpYy5oYXNPd25Qcm9wZXJ0eShlKSYmKFwic3R5bGVcIj09ZT9iLnN0eWxlLmNzc1RleHQ9Y1tlXTpiLnNldEF0dHJpYnV0ZShlLGNbZV0pKTtkJiZiLmFwcGVuZENoaWxkKGEuYy5jcmVhdGVUZXh0Tm9kZShkKSk7cmV0dXJuIGJ9ZnVuY3Rpb24gdShhLGIsYyl7YT1hLmMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYilbMF07YXx8KGE9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTthLmluc2VydEJlZm9yZShjLGEubGFzdENoaWxkKX1mdW5jdGlvbiB2KGEpe2EucGFyZW50Tm9kZSYmYS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGEpfVxuZnVuY3Rpb24gdyhhLGIsYyl7Yj1ifHxbXTtjPWN8fFtdO2Zvcih2YXIgZD1hLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLGU9MDtlPGIubGVuZ3RoO2UrPTEpe2Zvcih2YXIgZj0hMSxnPTA7ZzxkLmxlbmd0aDtnKz0xKWlmKGJbZV09PT1kW2ddKXtmPSEwO2JyZWFrfWZ8fGQucHVzaChiW2VdKX1iPVtdO2ZvcihlPTA7ZTxkLmxlbmd0aDtlKz0xKXtmPSExO2ZvcihnPTA7ZzxjLmxlbmd0aDtnKz0xKWlmKGRbZV09PT1jW2ddKXtmPSEwO2JyZWFrfWZ8fGIucHVzaChkW2VdKX1hLmNsYXNzTmFtZT1iLmpvaW4oXCIgXCIpLnJlcGxhY2UoL1xccysvZyxcIiBcIikucmVwbGFjZSgvXlxccyt8XFxzKyQvLFwiXCIpfWZ1bmN0aW9uIHkoYSxiKXtmb3IodmFyIGM9YS5jbGFzc05hbWUuc3BsaXQoL1xccysvKSxkPTAsZT1jLmxlbmd0aDtkPGU7ZCsrKWlmKGNbZF09PWIpcmV0dXJuITA7cmV0dXJuITF9XG5mdW5jdGlvbiBlYShhKXtyZXR1cm4gYS5vLmxvY2F0aW9uLmhvc3RuYW1lfHxhLmEubG9jYXRpb24uaG9zdG5hbWV9ZnVuY3Rpb24geihhLGIsYyl7ZnVuY3Rpb24gZCgpe20mJmUmJmYmJihtKGcpLG09bnVsbCl9Yj10KGEsXCJsaW5rXCIse3JlbDpcInN0eWxlc2hlZXRcIixocmVmOmIsbWVkaWE6XCJhbGxcIn0pO3ZhciBlPSExLGY9ITAsZz1udWxsLG09Y3x8bnVsbDtkYT8oYi5vbmxvYWQ9ZnVuY3Rpb24oKXtlPSEwO2QoKX0sYi5vbmVycm9yPWZ1bmN0aW9uKCl7ZT0hMDtnPUVycm9yKFwiU3R5bGVzaGVldCBmYWlsZWQgdG8gbG9hZFwiKTtkKCl9KTpzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZT0hMDtkKCl9LDApO3UoYSxcImhlYWRcIixiKX1cbmZ1bmN0aW9uIEEoYSxiLGMsZCl7dmFyIGU9YS5jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtpZihlKXt2YXIgZj10KGEsXCJzY3JpcHRcIix7c3JjOmJ9KSxnPSExO2Yub25sb2FkPWYub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7Z3x8dGhpcy5yZWFkeVN0YXRlJiZcImxvYWRlZFwiIT10aGlzLnJlYWR5U3RhdGUmJlwiY29tcGxldGVcIiE9dGhpcy5yZWFkeVN0YXRlfHwoZz0hMCxjJiZjKG51bGwpLGYub25sb2FkPWYub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsXCJIRUFEXCI9PWYucGFyZW50Tm9kZS50YWdOYW1lJiZlLnJlbW92ZUNoaWxkKGYpKX07ZS5hcHBlbmRDaGlsZChmKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Z3x8KGc9ITAsYyYmYyhFcnJvcihcIlNjcmlwdCBsb2FkIHRpbWVvdXRcIikpKX0sZHx8NUUzKTtyZXR1cm4gZn1yZXR1cm4gbnVsbH07ZnVuY3Rpb24gQigpe3RoaXMuYT0wO3RoaXMuYz1udWxsfWZ1bmN0aW9uIEMoYSl7YS5hKys7cmV0dXJuIGZ1bmN0aW9uKCl7YS5hLS07RChhKX19ZnVuY3Rpb24gRShhLGIpe2EuYz1iO0QoYSl9ZnVuY3Rpb24gRChhKXswPT1hLmEmJmEuYyYmKGEuYygpLGEuYz1udWxsKX07ZnVuY3Rpb24gRihhKXt0aGlzLmE9YXx8XCItXCJ9Ri5wcm90b3R5cGUuYz1mdW5jdGlvbihhKXtmb3IodmFyIGI9W10sYz0wO2M8YXJndW1lbnRzLmxlbmd0aDtjKyspYi5wdXNoKGFyZ3VtZW50c1tjXS5yZXBsYWNlKC9bXFxXX10rL2csXCJcIikudG9Mb3dlckNhc2UoKSk7cmV0dXJuIGIuam9pbih0aGlzLmEpfTtmdW5jdGlvbiBHKGEsYil7dGhpcy5jPWE7dGhpcy5mPTQ7dGhpcy5hPVwiblwiO3ZhciBjPShifHxcIm40XCIpLm1hdGNoKC9eKFtuaW9dKShbMS05XSkkL2kpO2MmJih0aGlzLmE9Y1sxXSx0aGlzLmY9cGFyc2VJbnQoY1syXSwxMCkpfWZ1bmN0aW9uIGZhKGEpe3JldHVybiBIKGEpK1wiIFwiKyhhLmYrXCIwMFwiKStcIiAzMDBweCBcIitJKGEuYyl9ZnVuY3Rpb24gSShhKXt2YXIgYj1bXTthPWEuc3BsaXQoLyxcXHMqLyk7Zm9yKHZhciBjPTA7YzxhLmxlbmd0aDtjKyspe3ZhciBkPWFbY10ucmVwbGFjZSgvWydcIl0vZyxcIlwiKTstMSE9ZC5pbmRleE9mKFwiIFwiKXx8L15cXGQvLnRlc3QoZCk/Yi5wdXNoKFwiJ1wiK2QrXCInXCIpOmIucHVzaChkKX1yZXR1cm4gYi5qb2luKFwiLFwiKX1mdW5jdGlvbiBKKGEpe3JldHVybiBhLmErYS5mfWZ1bmN0aW9uIEgoYSl7dmFyIGI9XCJub3JtYWxcIjtcIm9cIj09PWEuYT9iPVwib2JsaXF1ZVwiOlwiaVwiPT09YS5hJiYoYj1cIml0YWxpY1wiKTtyZXR1cm4gYn1cbmZ1bmN0aW9uIGdhKGEpe3ZhciBiPTQsYz1cIm5cIixkPW51bGw7YSYmKChkPWEubWF0Y2goLyhub3JtYWx8b2JsaXF1ZXxpdGFsaWMpL2kpKSYmZFsxXSYmKGM9ZFsxXS5zdWJzdHIoMCwxKS50b0xvd2VyQ2FzZSgpKSwoZD1hLm1hdGNoKC8oWzEtOV0wMHxub3JtYWx8Ym9sZCkvaSkpJiZkWzFdJiYoL2JvbGQvaS50ZXN0KGRbMV0pP2I9NzovWzEtOV0wMC8udGVzdChkWzFdKSYmKGI9cGFyc2VJbnQoZFsxXS5zdWJzdHIoMCwxKSwxMCkpKSk7cmV0dXJuIGMrYn07ZnVuY3Rpb24gaGEoYSxiKXt0aGlzLmM9YTt0aGlzLmY9YS5vLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDt0aGlzLmg9Yjt0aGlzLmE9bmV3IEYoXCItXCIpO3RoaXMuaj0hMSE9PWIuZXZlbnRzO3RoaXMuZz0hMSE9PWIuY2xhc3Nlc31mdW5jdGlvbiBpYShhKXthLmcmJncoYS5mLFthLmEuYyhcIndmXCIsXCJsb2FkaW5nXCIpXSk7SyhhLFwibG9hZGluZ1wiKX1mdW5jdGlvbiBMKGEpe2lmKGEuZyl7dmFyIGI9eShhLmYsYS5hLmMoXCJ3ZlwiLFwiYWN0aXZlXCIpKSxjPVtdLGQ9W2EuYS5jKFwid2ZcIixcImxvYWRpbmdcIildO2J8fGMucHVzaChhLmEuYyhcIndmXCIsXCJpbmFjdGl2ZVwiKSk7dyhhLmYsYyxkKX1LKGEsXCJpbmFjdGl2ZVwiKX1mdW5jdGlvbiBLKGEsYixjKXtpZihhLmomJmEuaFtiXSlpZihjKWEuaFtiXShjLmMsSihjKSk7ZWxzZSBhLmhbYl0oKX07ZnVuY3Rpb24gamEoKXt0aGlzLmM9e319ZnVuY3Rpb24ga2EoYSxiLGMpe3ZhciBkPVtdLGU7Zm9yKGUgaW4gYilpZihiLmhhc093blByb3BlcnR5KGUpKXt2YXIgZj1hLmNbZV07ZiYmZC5wdXNoKGYoYltlXSxjKSl9cmV0dXJuIGR9O2Z1bmN0aW9uIE0oYSxiKXt0aGlzLmM9YTt0aGlzLmY9Yjt0aGlzLmE9dCh0aGlzLmMsXCJzcGFuXCIse1wiYXJpYS1oaWRkZW5cIjpcInRydWVcIn0sdGhpcy5mKX1mdW5jdGlvbiBOKGEpe3UoYS5jLFwiYm9keVwiLGEuYSl9ZnVuY3Rpb24gTyhhKXtyZXR1cm5cImRpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7dG9wOi05OTk5cHg7bGVmdDotOTk5OXB4O2ZvbnQtc2l6ZTozMDBweDt3aWR0aDphdXRvO2hlaWdodDphdXRvO2xpbmUtaGVpZ2h0Om5vcm1hbDttYXJnaW46MDtwYWRkaW5nOjA7Zm9udC12YXJpYW50Om5vcm1hbDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1mYW1pbHk6XCIrSShhLmMpK1wiO1wiKyhcImZvbnQtc3R5bGU6XCIrSChhKStcIjtmb250LXdlaWdodDpcIisoYS5mK1wiMDBcIikrXCI7XCIpfTtmdW5jdGlvbiBQKGEsYixjLGQsZSxmKXt0aGlzLmc9YTt0aGlzLmo9Yjt0aGlzLmE9ZDt0aGlzLmM9Yzt0aGlzLmY9ZXx8M0UzO3RoaXMuaD1mfHx2b2lkIDB9UC5wcm90b3R5cGUuc3RhcnQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmMuby5kb2N1bWVudCxiPXRoaXMsYz1xKCksZD1uZXcgUHJvbWlzZShmdW5jdGlvbihkLGUpe2Z1bmN0aW9uIGYoKXtxKCktYz49Yi5mP2UoKTphLmZvbnRzLmxvYWQoZmEoYi5hKSxiLmgpLnRoZW4oZnVuY3Rpb24oYSl7MTw9YS5sZW5ndGg/ZCgpOnNldFRpbWVvdXQoZiwyNSl9LGZ1bmN0aW9uKCl7ZSgpfSl9ZigpfSksZT1udWxsLGY9bmV3IFByb21pc2UoZnVuY3Rpb24oYSxkKXtlPXNldFRpbWVvdXQoZCxiLmYpfSk7UHJvbWlzZS5yYWNlKFtmLGRdKS50aGVuKGZ1bmN0aW9uKCl7ZSYmKGNsZWFyVGltZW91dChlKSxlPW51bGwpO2IuZyhiLmEpfSxmdW5jdGlvbigpe2IuaihiLmEpfSl9O2Z1bmN0aW9uIFEoYSxiLGMsZCxlLGYsZyl7dGhpcy52PWE7dGhpcy5CPWI7dGhpcy5jPWM7dGhpcy5hPWQ7dGhpcy5zPWd8fFwiQkVTYnN3eVwiO3RoaXMuZj17fTt0aGlzLnc9ZXx8M0UzO3RoaXMudT1mfHxudWxsO3RoaXMubT10aGlzLmo9dGhpcy5oPXRoaXMuZz1udWxsO3RoaXMuZz1uZXcgTSh0aGlzLmMsdGhpcy5zKTt0aGlzLmg9bmV3IE0odGhpcy5jLHRoaXMucyk7dGhpcy5qPW5ldyBNKHRoaXMuYyx0aGlzLnMpO3RoaXMubT1uZXcgTSh0aGlzLmMsdGhpcy5zKTthPW5ldyBHKHRoaXMuYS5jK1wiLHNlcmlmXCIsSih0aGlzLmEpKTthPU8oYSk7dGhpcy5nLmEuc3R5bGUuY3NzVGV4dD1hO2E9bmV3IEcodGhpcy5hLmMrXCIsc2Fucy1zZXJpZlwiLEoodGhpcy5hKSk7YT1PKGEpO3RoaXMuaC5hLnN0eWxlLmNzc1RleHQ9YTthPW5ldyBHKFwic2VyaWZcIixKKHRoaXMuYSkpO2E9TyhhKTt0aGlzLmouYS5zdHlsZS5jc3NUZXh0PWE7YT1uZXcgRyhcInNhbnMtc2VyaWZcIixKKHRoaXMuYSkpO2E9XG5PKGEpO3RoaXMubS5hLnN0eWxlLmNzc1RleHQ9YTtOKHRoaXMuZyk7Tih0aGlzLmgpO04odGhpcy5qKTtOKHRoaXMubSl9dmFyIFI9e0Q6XCJzZXJpZlwiLEM6XCJzYW5zLXNlcmlmXCJ9LFM9bnVsbDtmdW5jdGlvbiBUKCl7aWYobnVsbD09PVMpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtTPSEhYSYmKDUzNj5wYXJzZUludChhWzFdLDEwKXx8NTM2PT09cGFyc2VJbnQoYVsxXSwxMCkmJjExPj1wYXJzZUludChhWzJdLDEwKSl9cmV0dXJuIFN9US5wcm90b3R5cGUuc3RhcnQ9ZnVuY3Rpb24oKXt0aGlzLmYuc2VyaWY9dGhpcy5qLmEub2Zmc2V0V2lkdGg7dGhpcy5mW1wic2Fucy1zZXJpZlwiXT10aGlzLm0uYS5vZmZzZXRXaWR0aDt0aGlzLkE9cSgpO1UodGhpcyl9O1xuZnVuY3Rpb24gbGEoYSxiLGMpe2Zvcih2YXIgZCBpbiBSKWlmKFIuaGFzT3duUHJvcGVydHkoZCkmJmI9PT1hLmZbUltkXV0mJmM9PT1hLmZbUltkXV0pcmV0dXJuITA7cmV0dXJuITF9ZnVuY3Rpb24gVShhKXt2YXIgYj1hLmcuYS5vZmZzZXRXaWR0aCxjPWEuaC5hLm9mZnNldFdpZHRoLGQ7KGQ9Yj09PWEuZi5zZXJpZiYmYz09PWEuZltcInNhbnMtc2VyaWZcIl0pfHwoZD1UKCkmJmxhKGEsYixjKSk7ZD9xKCktYS5BPj1hLnc/VCgpJiZsYShhLGIsYykmJihudWxsPT09YS51fHxhLnUuaGFzT3duUHJvcGVydHkoYS5hLmMpKT9WKGEsYS52KTpWKGEsYS5CKTptYShhKTpWKGEsYS52KX1mdW5jdGlvbiBtYShhKXtzZXRUaW1lb3V0KHAoZnVuY3Rpb24oKXtVKHRoaXMpfSxhKSw1MCl9ZnVuY3Rpb24gVihhLGIpe3NldFRpbWVvdXQocChmdW5jdGlvbigpe3YodGhpcy5nLmEpO3YodGhpcy5oLmEpO3YodGhpcy5qLmEpO3YodGhpcy5tLmEpO2IodGhpcy5hKX0sYSksMCl9O2Z1bmN0aW9uIFcoYSxiLGMpe3RoaXMuYz1hO3RoaXMuYT1iO3RoaXMuZj0wO3RoaXMubT10aGlzLmo9ITE7dGhpcy5zPWN9dmFyIFg9bnVsbDtXLnByb3RvdHlwZS5nPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYTtiLmcmJncoYi5mLFtiLmEuYyhcIndmXCIsYS5jLEooYSkudG9TdHJpbmcoKSxcImFjdGl2ZVwiKV0sW2IuYS5jKFwid2ZcIixhLmMsSihhKS50b1N0cmluZygpLFwibG9hZGluZ1wiKSxiLmEuYyhcIndmXCIsYS5jLEooYSkudG9TdHJpbmcoKSxcImluYWN0aXZlXCIpXSk7SyhiLFwiZm9udGFjdGl2ZVwiLGEpO3RoaXMubT0hMDtuYSh0aGlzKX07XG5XLnByb3RvdHlwZS5oPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYTtpZihiLmcpe3ZhciBjPXkoYi5mLGIuYS5jKFwid2ZcIixhLmMsSihhKS50b1N0cmluZygpLFwiYWN0aXZlXCIpKSxkPVtdLGU9W2IuYS5jKFwid2ZcIixhLmMsSihhKS50b1N0cmluZygpLFwibG9hZGluZ1wiKV07Y3x8ZC5wdXNoKGIuYS5jKFwid2ZcIixhLmMsSihhKS50b1N0cmluZygpLFwiaW5hY3RpdmVcIikpO3coYi5mLGQsZSl9SyhiLFwiZm9udGluYWN0aXZlXCIsYSk7bmEodGhpcyl9O2Z1bmN0aW9uIG5hKGEpezA9PS0tYS5mJiZhLmomJihhLm0/KGE9YS5hLGEuZyYmdyhhLmYsW2EuYS5jKFwid2ZcIixcImFjdGl2ZVwiKV0sW2EuYS5jKFwid2ZcIixcImxvYWRpbmdcIiksYS5hLmMoXCJ3ZlwiLFwiaW5hY3RpdmVcIildKSxLKGEsXCJhY3RpdmVcIikpOkwoYS5hKSl9O2Z1bmN0aW9uIG9hKGEpe3RoaXMuaj1hO3RoaXMuYT1uZXcgamE7dGhpcy5oPTA7dGhpcy5mPXRoaXMuZz0hMH1vYS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhKXt0aGlzLmM9bmV3IGNhKHRoaXMuaixhLmNvbnRleHR8fHRoaXMuaik7dGhpcy5nPSExIT09YS5ldmVudHM7dGhpcy5mPSExIT09YS5jbGFzc2VzO3BhKHRoaXMsbmV3IGhhKHRoaXMuYyxhKSxhKX07XG5mdW5jdGlvbiBxYShhLGIsYyxkLGUpe3ZhciBmPTA9PS0tYS5oOyhhLmZ8fGEuZykmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXt2YXIgYT1lfHxudWxsLG09ZHx8bnVsbHx8e307aWYoMD09PWMubGVuZ3RoJiZmKUwoYi5hKTtlbHNle2IuZis9Yy5sZW5ndGg7ZiYmKGIuaj1mKTt2YXIgaCxsPVtdO2ZvcihoPTA7aDxjLmxlbmd0aDtoKyspe3ZhciBrPWNbaF0sbj1tW2suY10scj1iLmEseD1rO3IuZyYmdyhyLmYsW3IuYS5jKFwid2ZcIix4LmMsSih4KS50b1N0cmluZygpLFwibG9hZGluZ1wiKV0pO0socixcImZvbnRsb2FkaW5nXCIseCk7cj1udWxsO2lmKG51bGw9PT1YKWlmKHdpbmRvdy5Gb250RmFjZSl7dmFyIHg9L0dlY2tvLipGaXJlZm94XFwvKFxcZCspLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSx4YT0vT1MgWC4qVmVyc2lvblxcLzEwXFwuLipTYWZhcmkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpJiYvQXBwbGUvLmV4ZWMod2luZG93Lm5hdmlnYXRvci52ZW5kb3IpO1xuWD14PzQyPHBhcnNlSW50KHhbMV0sMTApOnhhPyExOiEwfWVsc2UgWD0hMTtYP3I9bmV3IFAocChiLmcsYikscChiLmgsYiksYi5jLGssYi5zLG4pOnI9bmV3IFEocChiLmcsYikscChiLmgsYiksYi5jLGssYi5zLGEsbik7bC5wdXNoKHIpfWZvcihoPTA7aDxsLmxlbmd0aDtoKyspbFtoXS5zdGFydCgpfX0sMCl9ZnVuY3Rpb24gcGEoYSxiLGMpe3ZhciBkPVtdLGU9Yy50aW1lb3V0O2lhKGIpO3ZhciBkPWthKGEuYSxjLGEuYyksZj1uZXcgVyhhLmMsYixlKTthLmg9ZC5sZW5ndGg7Yj0wO2ZvcihjPWQubGVuZ3RoO2I8YztiKyspZFtiXS5sb2FkKGZ1bmN0aW9uKGIsZCxjKXtxYShhLGYsYixkLGMpfSl9O2Z1bmN0aW9uIHJhKGEsYil7dGhpcy5jPWE7dGhpcy5hPWJ9XG5yYS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhKXtmdW5jdGlvbiBiKCl7aWYoZltcIl9fbXRpX2ZudExzdFwiK2RdKXt2YXIgYz1mW1wiX19tdGlfZm50THN0XCIrZF0oKSxlPVtdLGg7aWYoYylmb3IodmFyIGw9MDtsPGMubGVuZ3RoO2wrKyl7dmFyIGs9Y1tsXS5mb250ZmFtaWx5O3ZvaWQgMCE9Y1tsXS5mb250U3R5bGUmJnZvaWQgMCE9Y1tsXS5mb250V2VpZ2h0PyhoPWNbbF0uZm9udFN0eWxlK2NbbF0uZm9udFdlaWdodCxlLnB1c2gobmV3IEcoayxoKSkpOmUucHVzaChuZXcgRyhrKSl9YShlKX1lbHNlIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtiKCl9LDUwKX12YXIgYz10aGlzLGQ9Yy5hLnByb2plY3RJZCxlPWMuYS52ZXJzaW9uO2lmKGQpe3ZhciBmPWMuYy5vO0EodGhpcy5jLChjLmEuYXBpfHxcImh0dHBzOi8vZmFzdC5mb250cy5uZXQvanNhcGlcIikrXCIvXCIrZCtcIi5qc1wiKyhlP1wiP3Y9XCIrZTpcIlwiKSxmdW5jdGlvbihlKXtlP2EoW10pOihmW1wiX19Nb25vdHlwZUNvbmZpZ3VyYXRpb25fX1wiK1xuZF09ZnVuY3Rpb24oKXtyZXR1cm4gYy5hfSxiKCkpfSkuaWQ9XCJfX01vbm90eXBlQVBJU2NyaXB0X19cIitkfWVsc2UgYShbXSl9O2Z1bmN0aW9uIHNhKGEsYil7dGhpcy5jPWE7dGhpcy5hPWJ9c2EucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSl7dmFyIGIsYyxkPXRoaXMuYS51cmxzfHxbXSxlPXRoaXMuYS5mYW1pbGllc3x8W10sZj10aGlzLmEudGVzdFN0cmluZ3N8fHt9LGc9bmV3IEI7Yj0wO2ZvcihjPWQubGVuZ3RoO2I8YztiKyspeih0aGlzLmMsZFtiXSxDKGcpKTt2YXIgbT1bXTtiPTA7Zm9yKGM9ZS5sZW5ndGg7YjxjO2IrKylpZihkPWVbYl0uc3BsaXQoXCI6XCIpLGRbMV0pZm9yKHZhciBoPWRbMV0uc3BsaXQoXCIsXCIpLGw9MDtsPGgubGVuZ3RoO2wrPTEpbS5wdXNoKG5ldyBHKGRbMF0saFtsXSkpO2Vsc2UgbS5wdXNoKG5ldyBHKGRbMF0pKTtFKGcsZnVuY3Rpb24oKXthKG0sZil9KX07ZnVuY3Rpb24gdGEoYSxiKXthP3RoaXMuYz1hOnRoaXMuYz11YTt0aGlzLmE9W107dGhpcy5mPVtdO3RoaXMuZz1ifHxcIlwifXZhciB1YT1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzXCI7ZnVuY3Rpb24gdmEoYSxiKXtmb3IodmFyIGM9Yi5sZW5ndGgsZD0wO2Q8YztkKyspe3ZhciBlPWJbZF0uc3BsaXQoXCI6XCIpOzM9PWUubGVuZ3RoJiZhLmYucHVzaChlLnBvcCgpKTt2YXIgZj1cIlwiOzI9PWUubGVuZ3RoJiZcIlwiIT1lWzFdJiYoZj1cIjpcIik7YS5hLnB1c2goZS5qb2luKGYpKX19XG5mdW5jdGlvbiB3YShhKXtpZigwPT1hLmEubGVuZ3RoKXRocm93IEVycm9yKFwiTm8gZm9udHMgdG8gbG9hZCFcIik7aWYoLTEhPWEuYy5pbmRleE9mKFwia2l0PVwiKSlyZXR1cm4gYS5jO2Zvcih2YXIgYj1hLmEubGVuZ3RoLGM9W10sZD0wO2Q8YjtkKyspYy5wdXNoKGEuYVtkXS5yZXBsYWNlKC8gL2csXCIrXCIpKTtiPWEuYytcIj9mYW1pbHk9XCIrYy5qb2luKFwiJTdDXCIpOzA8YS5mLmxlbmd0aCYmKGIrPVwiJnN1YnNldD1cIithLmYuam9pbihcIixcIikpOzA8YS5nLmxlbmd0aCYmKGIrPVwiJnRleHQ9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGEuZykpO3JldHVybiBifTtmdW5jdGlvbiB5YShhKXt0aGlzLmY9YTt0aGlzLmE9W107dGhpcy5jPXt9fVxudmFyIHphPXtsYXRpbjpcIkJFU2Jzd3lcIixcImxhdGluLWV4dFwiOlwiXFx1MDBlN1xcdTAwZjZcXHUwMGZjXFx1MDExZlxcdTAxNWZcIixjeXJpbGxpYzpcIlxcdTA0MzlcXHUwNDRmXFx1MDQxNlwiLGdyZWVrOlwiXFx1MDNiMVxcdTAzYjJcXHUwM2EzXCIsa2htZXI6XCJcXHUxNzgwXFx1MTc4MVxcdTE3ODJcIixIYW51bWFuOlwiXFx1MTc4MFxcdTE3ODFcXHUxNzgyXCJ9LEFhPXt0aGluOlwiMVwiLGV4dHJhbGlnaHQ6XCIyXCIsXCJleHRyYS1saWdodFwiOlwiMlwiLHVsdHJhbGlnaHQ6XCIyXCIsXCJ1bHRyYS1saWdodFwiOlwiMlwiLGxpZ2h0OlwiM1wiLHJlZ3VsYXI6XCI0XCIsYm9vazpcIjRcIixtZWRpdW06XCI1XCIsXCJzZW1pLWJvbGRcIjpcIjZcIixzZW1pYm9sZDpcIjZcIixcImRlbWktYm9sZFwiOlwiNlwiLGRlbWlib2xkOlwiNlwiLGJvbGQ6XCI3XCIsXCJleHRyYS1ib2xkXCI6XCI4XCIsZXh0cmFib2xkOlwiOFwiLFwidWx0cmEtYm9sZFwiOlwiOFwiLHVsdHJhYm9sZDpcIjhcIixibGFjazpcIjlcIixoZWF2eTpcIjlcIixsOlwiM1wiLHI6XCI0XCIsYjpcIjdcIn0sQmE9e2k6XCJpXCIsaXRhbGljOlwiaVwiLG46XCJuXCIsbm9ybWFsOlwiblwifSxcbkNhPS9eKHRoaW58KD86KD86ZXh0cmF8dWx0cmEpLT8pP2xpZ2h0fHJlZ3VsYXJ8Ym9va3xtZWRpdW18KD86KD86c2VtaXxkZW1pfGV4dHJhfHVsdHJhKS0/KT9ib2xkfGJsYWNrfGhlYXZ5fGx8cnxifFsxLTldMDApPyhufGl8bm9ybWFsfGl0YWxpYyk/JC87XG5mdW5jdGlvbiBEYShhKXtmb3IodmFyIGI9YS5mLmxlbmd0aCxjPTA7YzxiO2MrKyl7dmFyIGQ9YS5mW2NdLnNwbGl0KFwiOlwiKSxlPWRbMF0ucmVwbGFjZSgvXFwrL2csXCIgXCIpLGY9W1wibjRcIl07aWYoMjw9ZC5sZW5ndGgpe3ZhciBnO3ZhciBtPWRbMV07Zz1bXTtpZihtKWZvcih2YXIgbT1tLnNwbGl0KFwiLFwiKSxoPW0ubGVuZ3RoLGw9MDtsPGg7bCsrKXt2YXIgaztrPW1bbF07aWYoay5tYXRjaCgvXltcXHctXSskLykpe3ZhciBuPUNhLmV4ZWMoay50b0xvd2VyQ2FzZSgpKTtpZihudWxsPT1uKWs9XCJcIjtlbHNle2s9blsyXTtrPW51bGw9PWt8fFwiXCI9PWs/XCJuXCI6QmFba107bj1uWzFdO2lmKG51bGw9PW58fFwiXCI9PW4pbj1cIjRcIjtlbHNlIHZhciByPUFhW25dLG49cj9yOmlzTmFOKG4pP1wiNFwiOm4uc3Vic3RyKDAsMSk7az1bayxuXS5qb2luKFwiXCIpfX1lbHNlIGs9XCJcIjtrJiZnLnB1c2goayl9MDxnLmxlbmd0aCYmKGY9Zyk7Mz09ZC5sZW5ndGgmJihkPWRbMl0sZz1bXSxkPWQ/ZC5zcGxpdChcIixcIik6XG5nLDA8ZC5sZW5ndGgmJihkPXphW2RbMF1dKSYmKGEuY1tlXT1kKSl9YS5jW2VdfHwoZD16YVtlXSkmJihhLmNbZV09ZCk7Zm9yKGQ9MDtkPGYubGVuZ3RoO2QrPTEpYS5hLnB1c2gobmV3IEcoZSxmW2RdKSl9fTtmdW5jdGlvbiBFYShhLGIpe3RoaXMuYz1hO3RoaXMuYT1ifXZhciBGYT17QXJpbW86ITAsQ291c2luZTohMCxUaW5vczohMH07RWEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSl7dmFyIGI9bmV3IEIsYz10aGlzLmMsZD1uZXcgdGEodGhpcy5hLmFwaSx0aGlzLmEudGV4dCksZT10aGlzLmEuZmFtaWxpZXM7dmEoZCxlKTt2YXIgZj1uZXcgeWEoZSk7RGEoZik7eihjLHdhKGQpLEMoYikpO0UoYixmdW5jdGlvbigpe2EoZi5hLGYuYyxGYSl9KX07ZnVuY3Rpb24gR2EoYSxiKXt0aGlzLmM9YTt0aGlzLmE9Yn1HYS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhKXt2YXIgYj10aGlzLmEuaWQsYz10aGlzLmMubztiP0EodGhpcy5jLCh0aGlzLmEuYXBpfHxcImh0dHBzOi8vdXNlLnR5cGVraXQubmV0XCIpK1wiL1wiK2IrXCIuanNcIixmdW5jdGlvbihiKXtpZihiKWEoW10pO2Vsc2UgaWYoYy5UeXBla2l0JiZjLlR5cGVraXQuY29uZmlnJiZjLlR5cGVraXQuY29uZmlnLmZuKXtiPWMuVHlwZWtpdC5jb25maWcuZm47Zm9yKHZhciBlPVtdLGY9MDtmPGIubGVuZ3RoO2YrPTIpZm9yKHZhciBnPWJbZl0sbT1iW2YrMV0saD0wO2g8bS5sZW5ndGg7aCsrKWUucHVzaChuZXcgRyhnLG1baF0pKTt0cnl7Yy5UeXBla2l0LmxvYWQoe2V2ZW50czohMSxjbGFzc2VzOiExLGFzeW5jOiEwfSl9Y2F0Y2gobCl7fWEoZSl9fSwyRTMpOmEoW10pfTtmdW5jdGlvbiBIYShhLGIpe3RoaXMuYz1hO3RoaXMuZj1iO3RoaXMuYT1bXX1IYS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhKXt2YXIgYj10aGlzLmYuaWQsYz10aGlzLmMubyxkPXRoaXM7Yj8oYy5fX3dlYmZvbnRmb250ZGVja21vZHVsZV9ffHwoYy5fX3dlYmZvbnRmb250ZGVja21vZHVsZV9fPXt9KSxjLl9fd2ViZm9udGZvbnRkZWNrbW9kdWxlX19bYl09ZnVuY3Rpb24oYixjKXtmb3IodmFyIGc9MCxtPWMuZm9udHMubGVuZ3RoO2c8bTsrK2cpe3ZhciBoPWMuZm9udHNbZ107ZC5hLnB1c2gobmV3IEcoaC5uYW1lLGdhKFwiZm9udC13ZWlnaHQ6XCIraC53ZWlnaHQrXCI7Zm9udC1zdHlsZTpcIitoLnN0eWxlKSkpfWEoZC5hKX0sQSh0aGlzLmMsKHRoaXMuZi5hcGl8fFwiaHR0cHM6Ly9mLmZvbnRkZWNrLmNvbS9zL2Nzcy9qcy9cIikrZWEodGhpcy5jKStcIi9cIitiK1wiLmpzXCIsZnVuY3Rpb24oYil7YiYmYShbXSl9KSk6YShbXSl9O3ZhciBZPW5ldyBvYSh3aW5kb3cpO1kuYS5jLmN1c3RvbT1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgc2EoYixhKX07WS5hLmMuZm9udGRlY2s9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IEhhKGIsYSl9O1kuYS5jLm1vbm90eXBlPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyByYShiLGEpfTtZLmEuYy50eXBla2l0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBHYShiLGEpfTtZLmEuYy5nb29nbGU9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IEVhKGIsYSl9O3ZhciBaPXtsb2FkOnAoWS5sb2FkLFkpfTtcImZ1bmN0aW9uXCI9PT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShmdW5jdGlvbigpe3JldHVybiBafSk6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPVo6KHdpbmRvdy5XZWJGb250PVosd2luZG93LldlYkZvbnRDb25maWcmJlkubG9hZCh3aW5kb3cuV2ViRm9udENvbmZpZykpO30oKSk7XG4iLCJpbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCIuL1JlY3RhbmdsZVwiO1xuaW1wb3J0IERyb3BSZWNvZ25pdGlvbiBmcm9tIFwiLi9Ecm9wUmVjb2duaXRpb25cIjtcbmltcG9ydCBXZWJGb250IGZyb20gXCJ3ZWJmb250bG9hZGVyXCI7XG5sZXQgRm9udExvYWRlZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgV2ViRm9udC5sb2FkKHtcbiAgICBjdXN0b206IHtcbiAgICAgIGZhbWlsaWVzOiBbXCJOb3ZlY2VudG8gV2lkZUJvbGRcIl1cbiAgICB9LFxuICAgIGFjdGl2ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmVzb2x2ZSgpO1xuICAgIH1cbiAgfSk7XG59KTtcbmV4cG9ydCB7IERyb3BSZWNvZ25pdGlvbiwgUmVjdGFuZ2xlLEZvbnRMb2FkZWQgfTtcbmV4cG9ydCBkZWZhdWx0IERyb3BSZWNvZ25pdGlvbjtcbiJdLCJuYW1lcyI6WyJzc2ltIiwiV2ViRm9udCJdLCJtYXBwaW5ncyI6IkFBQWUsTUFBTSxTQUFTLENBQUM7QUFDL0IsRUFBRSxXQUFXLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRTtBQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzdCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztBQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7QUFDbkMsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNuRCxNQUFNLElBQUksRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUU7QUFDMUIsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzFCLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRTtBQUNmLElBQUksT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyQyxHQUFHO0FBQ0gsRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ25CLElBQUksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZDLElBQUksSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3hDLElBQUksSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3RDLElBQUksSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3pDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLEdBQUc7QUFDSCxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDZixJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN2QixNQUFNLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQztBQUMzQyxNQUFNLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUM5QyxNQUFNLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUN4QyxNQUFNLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNqRCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQ2xCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0QsSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDckIsTUFBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFFLEtBQUssTUFBTSxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUU7QUFDN0IsTUFBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFFLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDL0IsTUFBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFFLEtBQUssTUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7QUFDaEMsTUFBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFFLEtBQUssTUFBTSxJQUFJLElBQUksRUFBRTtBQUNyQixNQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ3JDLEtBQUssTUFBTSxJQUFJLEtBQUssRUFBRTtBQUN0QixNQUFNLE9BQU8sS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3JDLEtBQUssTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUNwQixNQUFNLE9BQU8sSUFBSSxDQUFD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QUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDcEIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlDLFFBQVEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDdkMsVUFBVSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFVBQVUsTUFBTTtBQUNoQixTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDM0MsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLE9BQU8sTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixRQUFRLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEIsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JGLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0MsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsUUFBUSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JFLE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ3hCLEdBQUc7QUFDSCxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0xBLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQW1ELGNBQWMsQ0FBQyxDQUFDLEdBQTBHLENBQUMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFjLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFjLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFjLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFjLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFjLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSTV3ZSxLQUFLLElBQUksSUFBSSxJQUFJLGVBQWUsRUFBRTtBQUNsQyxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksWUFBWSxLQUFLLEVBQUU7QUFDbEMsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELEdBQUc7QUFDSCxDQUFDO0FBQ2MsTUFBTSxlQUFlLENBQUM7QUFDckMsRUFBRSxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDdEMsSUFBSSxJQUFJLFNBQVMsWUFBWSxTQUFTLEVBQUU7QUFDeEMsTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztBQUM3QixNQUFNLElBQUksQ0FBQyxVQUFVLEdBQUc7QUFDeEIsUUFBUSxNQUFNLEVBQUUsQ0FBQyxRQUFRO0FBQ3pCLFFBQVEsS0FBSyxFQUFFLEVBQUU7QUFDakIsT0FBTyxDQUFDO0FBQ1IsTUFBTSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN2QixNQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLE1BQU0sT0FBTztBQUNiLEtBQUs7QUFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQzVCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3JDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQ25DLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQzdCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDdEIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN2QixJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUc7QUFDdEIsTUFBTSxNQUFNLEVBQUUsQ0FBQyxRQUFRO0FBQ3ZCLE1BQU0sS0FBSyxFQUFFLEVBQUU7QUFDZixLQUFLLENBQUM7QUFDTixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ25DLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDakMsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEIsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEIsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDdkIsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEIsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDdkIsR0FBRztBQUNILEVBQUUsT0FBTyxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7QUFDeEMsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7QUFDckMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNCO0FBQ0EsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQyxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLFFBQVEsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFH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LElBQUksSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDO0FBQ3ZDLFVBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3ZCLFlBQVksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEcsV0FBVztBQUNYLFVBQVUsSUFBSSxDQUFDLEtBQUssVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDMUMsWUFBWSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RyxXQUFXO0FBQ1gsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdEIsWUFBWSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2RyxXQUFXO0FBQ1gsVUFBVSxJQUFJLENBQUMsS0FBSyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMzQyxZQUFZLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxH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VSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hFLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0MsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM1QyxVQUFVLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxVQUFVLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoQyxZQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLFdBQVcsTUFBTTtBQUNqQixZQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3RDLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzFDLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzFDLFdBQVc7QUFDWCxVQUFVLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMs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QUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsT0FBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDO0FBQzdoQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQztBQUN2YixTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQztBQUNwVyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL3RDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sMkxBQTJMLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxbkUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMscUNBQXFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7QUFDMWEsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQzF4QixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUMzbEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pmLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztBQUMxWCxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLDhCQUE4QixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsMkJBQTJCO0FBQ3hmLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRSxDQUFDLElBQUksRUFBRSxDQUFDLGtDQUFrQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDdHRCLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUM7QUFDblcsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxnQ0FBZ0MsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQzlmLEVBQUUsQ0FBQyw4SUFBOEksQ0FBQztBQUNsSixTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDdmYsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyx5QkFBeUIsR0FBRyxDQUFDLENBQUMseUJBQXlCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxrQ0FBa0MsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBa0csTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7OztBQ2JwdUQsSUFBQyxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxLQUFLO0FBQ2xELEVBQUVDLGFBQU8sQ0FBQyxJQUFJLENBQUM7QUFDZixJQUFJLE1BQU0sRUFBRTtBQUNaLE1BQU0sUUFBUSxFQUFFLENBQUMsb0JBQW9CLENBQUM7QUFDdEMsS0FBSztBQUNMLElBQUksTUFBTSxFQUFFLFlBQVk7QUFDeEIsTUFBTSxPQUFPLEVBQUUsQ0FBQztBQUNoQixLQUFLO0FBQ0wsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDOzs7OzsifQ==
