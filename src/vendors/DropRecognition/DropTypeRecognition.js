import rgb2hsv from "./rgb2hsv.js";
export default class DropTypeRecognition {
  constructor(DropGroups, ImageData) {
    this.DropGroups = DropGroups;
    this.ImageData = ImageData;
    this.DropTypeList = [
      {
        name: "FIXED_DROP",
        color(H, S) {
          return H > 45 && H < 61 && S > 75;
        },
        index: 0,
        have: false
      },
      {
        name: "FURNITURE",
        color(H, S, V) {
          return H > 18 && H < 30 && S > 50 && V > 50;
        },
        index: 1,
        have: false
      },
      {
        name: "NORMAL_DROP",
        color(H, S) {
          return S < 10;
        },
        index: 2,
        have: false
      },
      {
        name: "SPECIAL_DROP",
        color(H) {
          return H > 23 && H < 27;
        },
        index: 3,
        have: false
      },
      {
        name: "EXTRA_DROP",
        color(H, S, V) {
          return H > 60 && H < 73 && S < 82 && V < 95;
        },
        index: 4,
        have: false
      }
    ];
    this.NowIndex = -1;
    this.getDropType(DropGroups);
    delete this.DropType;
  }
  Matrix(y, x) {
    let idx = (y * this.ImageData.width + x) * 4;
    return [this.ImageData.data[idx], this.ImageData.data[idx + 1], this.ImageData.data[idx + 2]]
  }
  get FURNITURE() {
    return this.DropTypeList.find(a => a.name == "FURNITURE");
  }
  CompareType(Rect, GuessType) {
    let Type
    if (GuessType) {
      Type = this.DropTypeList.filter(a => GuessType.includes(a.name));
    } else {
      Type = this.DropTypeList
    }
    let XCenter = (Rect.left + Rect.right) >> 1;
    for (let y = Rect.top; y <= Rect.bottom; y++) {
      let rgb = this.Matrix(y,XCenter);
      for (let type of Type) {
        if (type.color(...rgb2hsv(...rgb)) && this.checkOrder(type.name)) {
          if (Number.isFinite(type.index)) {
            this.NowIndex = type.index;
          }
          type.have = true;
          return type.name;
        } else if (Type.length == 1) {
          if (!this.FURNITURE.have) {
            if (this.checkOrder("FURNITURE") && this.FURNITURE.color(...rgb2hsv(...rgb))) {
              this.FURNITURE.have = true;
              this.NowIndex = this.FURNITURE.index
              return "FURNITURE";
            }
          }
          if (this.checkOrder(type.name)) {
            if (Number.isFinite(type.index)) {
              this.NowIndex = type.index;
              type.have = true;
            }
            return type.name;
          }
        }
      }
    }
    for (let type of this.DropTypeList) {
      if (this.checkOrder(type.name) && type.name !== "FURNITURE" && type.name !== "SPECIAL_DROP") {
        for (let y = Rect.top; y <= Rect.bottom; y++) {
          let rgb = this.Matrix(y,XCenter);
          if (type.color(...rgb2hsv(...rgb))) {
            if (Number.isFinite(type.index)) {
              this.NowIndex = type.index;
            }
            type.have = true;
            return type.name;
          }
        }
      }
    }
    return "ALL_DROP";
  }
  checkOrder(TypeName) {
    let Type = this.DropTypeList.find(a => a.name == TypeName);
    if ((Type.index > this.NowIndex || Number.isFinite(Type.index)) && !Type.have) {
      return true;
    }
    return false;
  }
  getDropType(DropType) {
    for (let Type of DropType) {
      Type.Type = this.CompareType(Type.Bound, Type.TypeGuessBaseOnItem());
    }
  }
}
