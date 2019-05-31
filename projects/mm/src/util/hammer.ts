export interface TouchOpts{
    element:any;
    begin?:Function;
    move?:Function;
    end?:Function;
    moment?:number;
    capture?:boolean;
    test?:any;
}

const momentSpeedActive=3;
const momentInterval=30;
export const touch=(
    opts:TouchOpts,
    )=>{
    let
    touchstart:Function,
    touchmove:Function,
    touchend:Function,
    startMove:boolean;    
    const clear=()=>{
        startMove=undefined;
    }

    let beginX,beginY,movePos:any,moveX:number,moveY:number,preMoveX:number,preMoveY:number,perX:number,perY:number;
    

    touchstart=event=>{
        clear();
        const pos=event.touches[0];
        beginX=pos.pageX;
        beginY=pos.pageY;
        opts.begin({beginX,beginY,event});
    }
    touchmove=event=>{

        movePos=event.touches[0];
        moveX=movePos.pageX;
        moveY=movePos.pageY;
        if(startMove){

            opts.move({
                moveX,
                moveY,
                disX:moveX-beginX,
                disY:moveY-beginY,
                perX:moveX-preMoveX,
                perY:moveY-preMoveY,
                event
            })
        }
        preMoveX=moveX;
        preMoveY=moveY;
        startMove=true;
    }
    touchend=event=>opts.end({event});

    opts.element.cmAddEventListener('touchstart',touchstart,opts.capture);
    opts.element.cmAddEventListener('touchmove',touchmove,opts.capture);
    opts.end&&opts.element.cmAddEventListener('touchend',touchend,opts.capture)
};

export class Moment{
    momentSpeed:number=0;
    interval:any;
    constructor(horizontal?:boolean){
        if(horizontal){
            let previousX:number=0;
            let moveNum:number=0;
            this.momentMove=({moveX})=>{
                moveNum=moveX;
                if(!this.interval)this.interval=setInterval(()=>{

                    this.momentSpeed=moveNum-previousX;
                    previousX=moveNum;
                },momentInterval)
            }
        }else{
            let previousY:number=0;
            let moveNum:number=0;
            this.momentMove=({moveY})=>{
                moveNum=moveY;
                if(!this.interval)this.interval=setInterval(()=>{
                    this.momentSpeed=moveNum-previousY;
                    previousY=moveNum
                },momentInterval)
            }
        }
    }
    clear(){
        if(this.interval)clearInterval(this.interval);
        this.interval=null;
    }
    resetSpeed=()=>this.momentSpeed=0;
    momentBegin=()=>{
        this.interval&&this.clear();
    }
    momentMove:Function;
    momentEnd(activeCb:Function){
        this.interval&&this.clear();
        activeCb(Math.abs(this.momentSpeed)>=momentSpeedActive,this.momentSpeed)
    }
}

export const forwardTouch=({element,begin,move,end,moment}:TouchOpts,horizontal:boolean)=>{
  let
    moveFn:Function,
    beginFn:Function,
    endFn:Function,
    momentMethod:Moment,
    pristine:boolean=true;
  if(moment)momentMethod=new Moment(horizontal);
    let clear=()=>{
        pristine=true;
        moment&&momentMethod.clear();
    }
  beginFn=e=>{
      clear();
      begin&&begin(e);
      moment&&momentMethod.momentBegin();
  };
  moveFn=e=>{
      if(pristine===undefined)return momentMethod&&momentMethod.resetSpeed();
      if(pristine){
        const perX=Math.abs(e.perX),perY=Math.abs(e.perY);
        if((horizontal&&perX>perY)||(!horizontal)&&perX<=perY){
          move(e);
          moment&&momentMethod.momentMove(e);
          pristine=false;
        }else{
          pristine=undefined;
        }
      }else{
        move(e);
        moment&&momentMethod.momentMove(e);
      }
  };
  endFn=e=>{
    clear();
    moment?momentMethod.momentEnd((momentActive:boolean,momentSpeed:number)=>end&&end({...e,momentActive,momentSpeed})):end&&end(e);
  };

  touch({
    element,
    begin:beginFn,
    move:moveFn,
    end:endFn
  })
};

export const horizontalTouch=(opts:TouchOpts)=>forwardTouch(opts,true);
export const verticalTouch=(opts:TouchOpts)=>forwardTouch(opts,false);
