export default class TypeGroup {
  constructor(Bound){
    this.Bound=Bound;
    this.Type="";
    this.Items=[];
  }
  inGroup(Rect){
    return Math.min(Rect.right,this.Bound.right)-Math.max(Rect.left,this.Bound.left)>10;
  }
  get TypeGuessBaseOnItem(){
    if(this.Items[0].ComparedItems[0].Item.length == 0) return []
    let Types=[]
    for(let [index,Item] of this.Items.entries()){
      if(Item.ComparedItems[0].Item.Types.length == 0) continue;
      if(Types.length == 0){
        Types.push([...Item.ComparedItems[0].Item.Types])
      }
      if(Types.length==index) {
        Types.push([...this.Items[0].ComparedItems[0].Item.Types])
      }
      for(let i=0;i<index;i++){
        Types[i]=Types[i].filter((a)=>Item.ComparedItems[0].Item.Types.includes(a))
      }
    }
    return Types.find(a=>a.length!==0)
  }
  toString(){
    return this.Type;
  }
}