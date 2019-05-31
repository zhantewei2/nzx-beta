export interface DragOpts{
  useSpeed?:'x'|'y';
  start?:Function;
  end?:Function;
  move?:Function;
  prevent?:boolean;
}

export interface DragOpts2{
  horizontal?:boolean;
  limit?:boolean;  
}


const drag=(node:any,opts:DragOpts,opts2:DragOpts2={})=>{
  //vconst body:Element=document.querySelector('body');
  let
    bodyMove:any,
    bodyEnd:any,
    collectSpeed:any,
    disabled:boolean,
    moveStart:boolean;

  const clear=()=>{
    if(bodyMove){
      node.removeEventListener('touchmove',bodyMove);
      bodyMove=null;

    }
    if(bodyEnd){
      node.removeEventListener('touchend',bodyEnd);
      bodyEnd=null;
    }
    if(collectSpeed){
      clearTimeout(collectSpeed);
      collectSpeed=null;
    }
  }
  node.cmAddEventListener('touchstart',e=>{
    clear();

    let {pageX:x0,pageY:y0}=e.changedTouches[0];
    let
      event:any,x1:number=x0,y1:number=y0,preX:number=x0,preY:number=y0,
      speed:number;
    opts.start&&opts.start({x0,y0});
    disabled=false;
    moveStart=true;
    if(opts.useSpeed){
      collectSpeed=(window as any).cmSetInterval(()=>{
        speed=opts.useSpeed=='x'?preX-x1:preY-y1;
        preX=x1;
        preY=y1;
      },70);
    }

    bodyMove=e=>{
     // e.stopPropagation();
      // opts.prevent&&e.preventDefault();
      if(disabled)return;
      event=e.changedTouches[0];
      x1=event.pageX;
      y1=event.pageY;
      if(moveStart){
        moveStart=false;
        if(opts2.limit){
          disabled=opts2.horizontal?Math.abs(y1-y0)>=Math.abs(x1-x0):Math.abs(y1-y0)<Math.abs(x1-x0);
          if(disabled)return;
        }
      }
      //console.log(y1)
      opts.move&&opts.move({
        x0,y0,x1,y1,disX:x0-x1,disY:y0-y1
      },e)
    }
    bodyEnd=e=>{

      clear();
      opts.end&&opts.end(speed);
    };
    node.cmAddEventListener('touchmove',bodyMove,{passive:false});
    node.cmAddEventListener('touchend',bodyEnd);
  })
}
export {drag};
