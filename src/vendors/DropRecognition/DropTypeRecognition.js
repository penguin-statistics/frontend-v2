export default class DropTypeRecognition {
  constructor(DropGroups, ImageData) {
    this.DropGroups = DropGroups;
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
          return H < 5 && S < 5;
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
    this.getDropType(DropGroups, ImageData);
    delete this.DropType;
  }
  get FURNITURE(){
    return this.DropTypeList.find(a=>a.name=="FURNITURE");
  }
  CompareType(ImageData, Rect, GuessType) {
    let Type = this.DropTypeList.filter(a => GuessType.includes(a.name));
    let XCenter = (Rect.left + Rect.right) >> 1;
    for (let y = Rect.top; y <= Rect.bottom; y++) {
      let rgb = ImageData[y][XCenter];
      for (let type of Type) {
        if (type.color(...rgb2hsv(...rgb)) && this.checkOrder(type.name)) {
          if (Number.isFinite(type.index)) {
            this.NowIndex = type.index;
          }
          type.have = true;
          return type.name;
        } else if (Type.length == 1) {
          if(!this.FURNITURE.have) {
            if (this.checkOrder("FURNITURE")&&this.FURNITURE.color(...rgb2hsv(...rgb))) {
              this.FURNITURE.have =true;
              this.NowIndex=this.FURNITURE.index
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
      if (this.checkOrder(type.name)&&type.name!=="FURNITURE"&&type.name!=="SPECIAL_DROP") {
        for (let y = Rect.top; y <= Rect.bottom; y++) {
          let rgb = ImageData[y][XCenter];
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
  getDropType(DropType, ImageData) {
    for (let Type of DropType) {
      if(Type.TypeGuessBaseOnItem.length == 1 && Type.TypeGuessBaseOnItem[0]=="ACTIVITY" && Type.Items.length == 1 && Type.Items[0].Confidence.ItemId>0.60) {
        Type.Type="FIXED_DROP";
        continue;
      }
      Type.Type = this.CompareType(ImageData, Type.Bound, Type.TypeGuessBaseOnItem);
    }
  }
}
function rgb2hsv(r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  (v = Math.max(rabs, gabs, babs)), (diff = v - Math.min(rabs, gabs, babs));
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb;
    } else if (babs === v) {
      h = 2 / 3 + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return [Math.round(h * 360), percentRoundFn(s * 100), percentRoundFn(v * 100)];
}
