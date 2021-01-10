import Rectangle from "./Rectangle";
import ConnectedAreaRecognition from "./ConnectedAreaRecognition";
import NumbersHashList from "./Data/NumberHashList.json";
for (let hash of NumbersHashList) {
  if (hash.hash instanceof Array) {
    hash.hash = hash.hash.map(v => v / hash.count);
  }
}
export default class ItemRecognition {
  constructor(ImageData, Rect) {
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
    this._NumberConf = [];
    this.ComparedItems = [];
    this.prepare();
  }
  deleteUselessData() {
    this.ComparedItems.splice(1);
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
  CompareItem(Items) {
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
    for (let Item of Items) {
      if (!ItemRecognition.ItemSourceHash[Item.ItemId]) continue;
      ItemSourceHash.push([Item, ItemRecognition.ItemSourceHash[Item.ItemId]]);
    }
    for (let ItemHash of ItemSourceHash) {
      let Conf = this.CompareItemHash(ItemHash[1], this.getRGBDHash(tempIData));
      if (!isNaN(Number(ItemHash[0].ItemId)) && Conf > 0.68) {
        let ItemId = Number(ItemHash[0].ItemId);
        let PId = Math.floor(ItemId / 1000);
        let DId = (ItemId % 1000) - 1;
        if (PId == 2) {
          let ColorList = [
            [215, 240, 9],
            [10, 175, 241],
            [242, 217, 11],
            [255, 249, 225]
          ];
          let dis = this.RGBDiff(this.Matrix[this.Height >> 1][this.Width >> 1], ColorList[DId]);
          Conf = (Conf + 0.1) * (1 - dis / (255 * 3));
        }
      }
      this.ComparedItems.push({ Item: ItemHash[0], Confidence: Conf });
    }
    return this.ComparedItems.sort((a, b) => b.Confidence - a.Confidence);
  }
  getItem(Items) {
    return this.CompareItem(Items)[0];
  }
  get ItemId() {
    return this.ComparedItems[0].Item.ItemId;
  }
  get Item() {
    return this.ComparedItems[0].Item;
  }
  get Confidence() {
    return {
      ItemId: this.ComparedItems[0].Confidence,
      Count: this._NumberConf
    };
  }
  RGBDiff(rgb1, rgb2) {
    return rgb1.map((v, i) => Math.abs(v - rgb2[i])).reduce((a, b) => a + b);
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
    return (
      (Math.max(Hash1String.length, Hash2String.length) - Distance) / Math.max(Hash1String.length, Hash2String.length)
    );
  }
  getCount(Range = [1,9]) {
    let NumRange = [Math.max(Range[0], 1), Math.min(Range[1], 9)];
    let NumList = [];
    for (let i = NumRange[0]; i <= NumRange[1]; i++) {
      NumList.push(i);
    }
    if (NumList.length == 1) {
      this._NumberConf = [1];
      return NumList[0];
    }
    let XStart = false,
      XEnd = false,
      EndWait = 0,
      YStart = 0,
      Find = false;
    let NumberRect = new Rectangle();

    for (let y = this.Height >> 1; y < this.Height; y++) {
      XStart = false;
      XEnd = false;
      EndWait = 0;
      for (let x = this.Width >> 1; x < this.Width; x++) {
        let [R, G, B] = this.Matrix[y][x];
        let RGBUp = distance => this.Matrix[y - distance][x];
        let GreyUp = distance => RGBUp(distance).reduce((a, b) => a + b) / 3;
        let GreyNow = (R + G + B) / 3;

        let SpecialRule = {
          "3301": () =>
            Math.max(Math.abs(GreyNow - GreyUp(1)), Math.abs(GreyNow - GreyUp(2)), GreyNow - GreyUp(3)) > 20,
          default: () =>
            (Math.abs(GreyNow - GreyUp(1)) > 15 ||
              Math.abs(R - RGBUp(1)[0]) > 30 ||
              Math.abs(G - RGBUp(1)[1]) > 30 ||
              Math.abs(B - RGBUp(1)[2]) > 30) &&
            GreyNow < 90
        };
        if (this.ItemId in SpecialRule ? SpecialRule[this.ItemId]() : SpecialRule.default()) {
          if (!XStart) {
            XStart = x;
          } else {
            XEnd = x;
            EndWait = 0;
          }
        } else {
          if (XStart) {
            if (EndWait++ < 1 && x != this.Width - 1) {
              continue;
            }
          }
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
      this._NumberConf.push(NumberResult.Confidence);
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
  static init(data) {
    ItemRecognition.ItemSourceHash = data;
  }
}
