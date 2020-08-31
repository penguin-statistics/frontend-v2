import RectRecognition from "./RectRecognition";
import StageRecognition from "./StageRecognition";
import ItemRecognition from "./ItemRecognition";
export default class DropsRecognition {
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
  static CheckDataComplete(){
    if(ItemRecognition.ItemSourceHash && DropsRecognition.Stage) {
      for(let v of Object.values(DropsRecognition.Stage)) {
        if(v.dropInfos){
        for (let i of v.dropInfos){
          if (!(i.ItemId in ItemRecognition.ItemSourceHash)){
            throw Error() //数据不完整
          }
        }
        }
      }
    }
  }
  static init(dataName, Data) {
    switch (dataName) {
      case "Stage":
        DropsRecognition.Stage = Data;
        DropsRecognition.CheckDataComplete();
        break;
      case "ItemHashs":
        ItemRecognition.init(Data).then(()=>{
          DropsRecognition.CheckDataComplete();
        });
        break;
    }
  }
}
