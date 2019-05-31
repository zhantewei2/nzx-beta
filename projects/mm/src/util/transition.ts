export class Transform{
  transitionClassName='cm-use-transform';
  el:HTMLElement;
  endFn:Function;
  constructor(el:HTMLElement) {
    this.el=el;
    el.addEventListener('transitionend',(e)=>{
      if(e.currentTarget!=el)return;
      el.classList.remove(this.transitionClassName);
      this.endFn&&this.endFn();
      this.endFn=null;
    })
  }
  to(transformString:string,end:Function){
    this.el.classList.add(this.transitionClassName);
    this.el.style.transform=transformString;
    this.endFn=end;
  }
}

export class TransformAnimation{

  direction:string;
  directionPos={
    left:'-100%',
    center:0,
    right:'100%'
  };
  el:HTMLElement;
  endFn:Function;
  turnName:string;
  constructor(el:HTMLElement) {
      this.el=el;
      const end=(e:any)=>{
        if(e.currentTarget!=el)return;
        const position=this.directionPos[this.direction];
        this.el.classList.remove(this.turnName);
        this.el.style.transform=`translate3d(${position},0,0)`;
        this.endFn&&this.endFn();
        this.endFn=null;
      };
      el.addEventListener('animationend',end);
      el.addEventListener('webkitAnimationEnd',end)
  }
  directionCollection=['left','right','center','top'];
  to(direction:string,end?:Function){
    this.direction=direction;
    this.turnName=this.directionCollection.indexOf(direction)>=0?`cm-component-turn-${direction}`:direction;
    this.el.classList.add(this.turnName);
    this.endFn=end;
  }
}
