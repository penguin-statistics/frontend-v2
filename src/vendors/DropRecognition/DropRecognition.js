import RectRecognition from "./RectRecognition";
import StageRecognition from "./StageRecognition";
import ItemRecognition from "./ItemRecognition";
import RecognitionData from "./Data/RecognitionData";
import TypeGroup from "./TypeGroup";
import DropTypeRecognition from "./DropTypeRecognition";
export default class DropRecognition {
  constructor(img) {
    this.Image = img;
    this.Canvas = document.createElement("canvas");
    //document.body.appendChild(this.Canvas);
    this.Canvas.width = img.width;
    this.Canvas.height = img.height;
    this.lowwidth = img.width < 1000;
    this.ctx = this.Canvas.getContext("2d");
    this.ctx.drawImage(img, 0, 0);
    this.ctx.fillStyle = "#00ff00";
    this.ctx.strokeStyle = "#00ff00";
    this.rawImageData = this.ctx.getImageData(0, 0, img.width, img.height);
    this.BoundData = {};
    this.Stage = {};
    this.Items = [];
    this.TypeGroups = [];
    this.timer = [];
    try {
      this.time("BoundRecognition");
      this.RectRecognition();
      this.timeEnd("BoundRecognition");
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
      this.time("StageRecognition");
      this.detectStage();
      this.timeEnd("StageRecognition");
      this.time("ItemRecognition");
      this.detectItem();
      this.timeEnd("ItemRecognition");
      this.time("DropTypeRecognition");
      new DropTypeRecognition(this.TypeGroups, this.rawImageData);
      this.detectFurniture();
      this.timeEnd("DropTypeRecognition");
      this.time("QuantityRecognition");
      this.detectCount();
      this.timeEnd("QuantityRecognition");
    } catch (e) {
      this.timeEnd(true);
      throw e;
    }
    for (let Item of this.Items) {
      Item.deleteUselessData()
    }
    delete this.ctx;
    delete this.Canvas;
    delete this.rawImageData;
    delete this.Image;
  }
  time(n) {
    if (!window.Recognition_Time) return;
    this.timer.push(n);
    console.time(n);
  }
  timeEnd(n) {
    if (n === true) {
      if (this.timer.length > 0) {
        for (let name of this.timer) {
          console.timeEnd(name);
        }
      }
      return;
    }
    if (this.timer.length == 0 || this.timer.pop() != n || !window.Recognition_Time) return;
    console.timeEnd(n);
  }
  /**
   * 识别图像边界
   */
  RectRecognition() {
    this.BoundData = new RectRecognition(this.rawImageData);
  }
  detectFurniture() {
    let DetectType = ["FURNITURE", "SPECIAL_DROP", "ALL_DROP"];
    if (this.Items.length >= 3) {
      for (let Item of this.Items) {
        let Rect = Item.Bound;
        if (DetectType.includes(Item.Type.Type)) {
          let OtherItems = this.BoundData.Items.filter(a => a != Rect);
          let AreaDiff =
            OtherItems.reduce((a, OtherItem) => {
              return a + Math.abs(OtherItem.area - Rect.area);
            }, 0) / OtherItems.length;
          if (AreaDiff > 1000) {
            Item.Type.Type = "FURNITURE";
            Item._FURNITURE = true;
          } else if (Item.Type.Type == "FURNITURE") {
            Item.Type.Type == "SPECIAL_DROP";
          }
        }
      }
    }
    for (let Item of this.Items) {
      if (Item.Type.Type == "FURNITURE") {
        Item.ComparedItems.unshift({
          Item: { ItemId: "furni", Range: { FURNITURE: [0, 1] }, Types: ["FURNITURE"] },
          Confidence: Item._FURNITURE ? 0.8 : 0.65
        });
        Item.Count = 1;
        Item._NumberConf = [1];
      }
    }
  }
  detectCount() {
    let excludes = ["FIXED_DROP", "FURNITURE"];
    for (let Itema of this.Items) {
      if (!excludes.includes(Itema.Type.Type)) {
        let Item = Itema.Item;
        let CountRange = Item.Range[Itema.Type];
        Itema.Count = Itema.getCount(CountRange);
      }
    }
  }
  detectItem() {
    for (let Bound of this.BoundData.DropType) {
      this.TypeGroups.push(new TypeGroup(Bound));
    }
    let DropList = [];
    if (DropRecognition.Stage[this.Stage.Code] && DropRecognition.Stage[this.Stage.Code].dropInfos) {
      for (let Drop of DropRecognition.Stage[this.Stage.Code].dropInfos) {
        if (Drop.itemId && Drop.dropType != "furni") {
          let FindItem = DropList.find(a => a.ItemId == Drop.itemId);
          if (FindItem) {
            FindItem.Types.push(Drop.dropType);
            FindItem.Range[Drop.dropType] = [Drop.bounds.lower, Drop.bounds.upper];
          } else {
            let idx = DropList.push({ ItemId: Drop.itemId, Range: {}, Types: [Drop.dropType] }) - 1;
            DropList[idx].Range[Drop.dropType] = [Drop.bounds.lower, Drop.bounds.upper];
          }
        }
      }
    }
    // 补充声望/龙门币
    DropList.push({ ItemId: 4001, Range: {}, Types: ["FIXED_DROP"] });
    DropList.push({ ItemId: "EXP_PLAYER", Range: {}, Types: ["FIXED_DROP"] });
    for (let Rect of this.BoundData.Items) {
      let getImageData = this.ctx.getImageData(Rect.left, Rect.top, Rect.width, Rect.height);
      let NowItem = new ItemRecognition(getImageData, Rect);
      NowItem.Type = this.TypeGroups.find(a => a.inGroup(Rect));
      if (NowItem.getItem(DropList).Confidence <= 0.60) {
        NowItem.CompareItem(DropRecognition.ActivityItem);
      }
      NowItem.Type.Items.push(NowItem);
      this.Items.push(NowItem);
    }
  }
  getImageMatrix(x1, y1, x2, y2) {
    let Matrix = [[]];
    let IData = this.ctx.getImageData(x1, y1, x2 - x1 + 1, y2 - y1 + 1);
    for (let index = 0, x = 0, y = 0; index < IData.data.length; index += 4) {
      Matrix[y][x] = [
        IData.data[index],
        IData.data[index + 1],
        IData.data[index + 2]
      ];
      if (++x == IData.width) {
        x = 0;
        if (++y != IData.height) Matrix.push([]);
      }
    }
    return Matrix;
  }
  detectStage() {
    [this.Stage.Code, this.Stage.Confidence] = StageRecognition(
      this.ctx.getImageData(
        this.BoundData.Stage.left,
        this.BoundData.Stage.top,
        this.BoundData.Stage.width,
        this.BoundData.Stage.height
      )
    );
  }
  static CheckDataComplete() {
    if (ItemRecognition.ItemSourceHash && DropRecognition.Stage) {
      for (let v of Object.values(DropRecognition.Stage)) {
        if (v.dropInfos) {
          for (let i of v.dropInfos) {
            if (i.ItemId && !ItemRecognition.ItemSourceHash[i.ItemId]) {
              throw new Error("Data Error");
            }
          }
        }
      }
    }
  }
  static init(dataName, Data) {
    switch (dataName) {
      case "Stage":
        DropRecognition.Stage = Data;
        DropRecognition.CheckDataComplete();
        break;
      case "ItemHashs":
        var Reader = new FileReader();
        Reader.onload = () => {
          Data = RecognitionData.Decode(new Uint8Array(Reader.result));
          DropRecognition.ActivityItem = [];
          var newdata = {};
          for (let [k, v] of Object.entries(Data)) {
            if (/(ACTIVITY|VOUCHER_MGACHA)/.test(v.type))
              DropRecognition.ActivityItem.push({ ItemId: k, Range: { ACTIVITY: [0, 99] }, Types: ["ACTIVITY"] });
            newdata[k] = v.hash;
          }

          ItemRecognition.init(newdata);
          DropRecognition.CheckDataComplete();
        };
        Reader.readAsArrayBuffer(Data);

        break;
    }
  }
}
