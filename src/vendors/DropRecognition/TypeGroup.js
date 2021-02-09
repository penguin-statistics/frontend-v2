export default class TypeGroup {
  constructor(Bound) {
    this.Bound = Bound;
    this.Type = "";
    this.Items = [];
  }
  inGroup(Rect) {
    return Math.min(Rect.right, this.Bound.right) - Math.max(Rect.left, this.Bound.left) > 10;
  }
  TypeGuessBaseOnItem() {
    let Types = [];
    let HaveTypeItem = this.Items.filter(a => a.ComparedItems[0].Item.Types.filter(b => b != "ACTIVITY").length != 0);
    for (var [index, Item] of HaveTypeItem.entries()) {
      if (Types.length == 0) {
        Types.push([...HaveTypeItem[0].Item.Types]);
      }
      if (Types.length == index) {
        Types.push([...Item.ComparedItems[0].Item.Types]);
      }
      for (let i = 0; i < index; i++) {
        Types[i] = Types[i].filter(a => Item.ComparedItems[0].Item.Types.includes(a));
      }
    }
    return Types.find(a => a.length !== 0);
  }
  toString() {
    return this.Type;
  }
}
