import {
  Component, ViewChild,OnInit,
  Directive,ContentChildren,Input,Output,EventEmitter,ViewContainerRef,
  TemplateRef,ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef
} from '@angular/core';

import {drag} from '../../util/touchDrag';


@Directive({
  selector:'[ztw-turn-page-item]',
})
export class TurnPageItemDirective {
  constructor(
    public tp:TemplateRef<any>
  ){}

}


export interface ContainerRef{
  node:any;
  base:number;
  move:number;
  viewContainer:ViewContainerRef;
  reload?:boolean;
}

const changeDis=50;

const debL:number=-30;
const debR:number=30;


@Component({
  selector: 'ztw-turn-page',
  template:`
  <ng-content></ng-content>
  <div #primary class="abs-tl full over-y">
    <span #pContainer></span>
  </div>
  <div #secondary class="abs-tl full over-y">
    <span #sContainer></span>
  </div>
  <div #thirdly class="abs-tl full over-y">
    <span #tContainer></span>
  </div> 
  `,
  host:{
    'class':'ztw-turn-page'
  },
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TurnPageComponent implements OnInit {
  @Input()cycle:boolean=true;
  @Input()preventMove:boolean;
  _ztwSelect:number=0;
  afterinitEnd:boolean;
  @Input()set ztwSelect(val){
    if(this.disabledTouch)return;
    if(!this.afterinitEnd){
      this.activeIndex=this._ztwSelect=val;
    }else{
      if(val==this.activeIndex)return;
      const end=()=>{
        this.containers[0].reload=false;
        this.containers[2].reload=false;
        this.disabledTouch=false;
        this.ztwSelectChange.emit(this.activeIndex);

      };
      this.disabledTouch=true;
      if(val>this.activeIndex){
        this.setTransition();
        this.createView(2,this.activeIndex=val);
        this.next(end);
      }else{
        this.setTransition();
        this.createView(0,this.activeIndex=val);
        this.pre(end)
      }
    }

  }
  @Output('ztwSelectChange')ztwSelectChange:EventEmitter<number>=new EventEmitter<number>();

  @ContentChildren(TurnPageItemDirective)items:any;
  @ViewChild('primary')primary:any;
  @ViewChild('secondary')secondary:any;
  @ViewChild('thirdly')thirdly:any;

  @ViewChild('pContainer',{read:ViewContainerRef})pContainer:ViewContainerRef;
  @ViewChild('sContainer',{read:ViewContainerRef})sContainer:ViewContainerRef;
  @ViewChild('tContainer',{read:ViewContainerRef})tContainer:ViewContainerRef;

  @Output('dragMove')dragMove:EventEmitter<number>=new EventEmitter<number>();
  @Output('immediateChange')immediateChange:EventEmitter<number>=new EventEmitter<number>();
  constructor(
    private _cdr:ChangeDetectorRef,
    private _nz:NgZone,
    private _el:ElementRef
  ){ }

  //move element width base on percent;
  width:any;
  containers:Array<ContainerRef>;

  //control active index
  _activeIndex:number;
  set activeIndex(val:number){
    this._activeIndex=val>this.controlsMax?0:(val<0?this.controlsMax:val);
  }
  get activeIndex(){return this._activeIndex}

  firstLoad:boolean=true;
  lastLoad:boolean=true;


  ngOnInit() {

    this.containers=[
      {
        node:this.primary.nativeElement,
        base:-100,
        move:null,
        viewContainer:this.pContainer,

      },
      {
        node:this.secondary.nativeElement,
        base:0,
        move:null,
        viewContainer:this.sContainer,

      },
      {
        node:this.thirdly.nativeElement,
        base:100,
        move:null,
        viewContainer:this.tContainer,

      }
    ];

    this.width=Math.ceil(this._el.nativeElement.offsetWidth/2);

  }




  definePos=(posArr:Array<number>,append?:Function)=>{
    posArr.forEach((num:number,index:number)=>{
      const containerItem:ContainerRef=this.containers[index];
      containerItem.node.style.transform=`translate3d(${containerItem['move']=num}%,0,0)`;
      append&&append(containerItem,num);
    });
  };

  redefinePos=(posArr:Array<number>)=>this.definePos(posArr,(containerItem:ContainerRef,num:number)=>containerItem.base=num);

  setTransition=()=>this.containers.forEach((item:ContainerRef)=>item.node.style.transition='transform .3s ease');


  createView=(viewIndex:number,controlIndex:number,created:boolean=true)=>{
    controlIndex=Number(controlIndex);
    this._nz.run(()=>{
      const container:ContainerRef=this.containers[viewIndex];
      const view:ViewContainerRef=container.viewContainer;
      let viewRef:any=this.viewRefs[controlIndex];
      const innerViewRef=view.get(0);
      if(innerViewRef&&innerViewRef==viewRef)return;
      if(innerViewRef)view.detach(0);
      // if(controlIndex==1){
      //   this.containers[0].viewContainer.createEmbeddedView(this.controls[1].tp);
      // }

      if(!viewRef){
        const item=this.controls[controlIndex];
        if(item){
          this.viewRefs[controlIndex]=viewRef=view.createEmbeddedView(item.tp);
          if(this._tpList){
            viewRef.context.$implicit=this._tpList[controlIndex];
            viewRef.context.index=controlIndex;
          }
        }
      }else{
        view.insert(viewRef,0);
      }
    })
  };

  controls:Array<TurnPageItemDirective>;
  viewRefs:Array<any>;
  controlsMax:number;
  disabledTouch:boolean;
  getPreIndex=()=>this.activeIndex-1<0?this.controlsMax:this.activeIndex-1;

  getNextIndex=()=>this.activeIndex+1>this.controlsMax?0:this.activeIndex+1;

  listenEnd:Function=()=>{};

  handleItemMove=(el:any,pos:number)=>{
    el.style.transform=`translate3d(${pos}%,0,0)`;
  };

  clearBetween=()=>{
    if(this.cycle)return;
    this._nz.run(()=>{

      if(this.activeIndex==0)this.containers[0].viewContainer.detach(0);
      if(this.activeIndex==this.controlsMax){
        this.containers[2].viewContainer.detach(0);
      }
    })
  };

  pre=(cb:Function,noTransition?:boolean)=>{
    this.redefinePos([0,100,200]);
    const _next=()=>{
      const lastItem:ContainerRef=this.containers.pop();
      this.handleItemMove(lastItem.node,lastItem.base=-100);
      this.containers.unshift(lastItem);
      cb();
     this.clearBetween();
    };
    noTransition?_next():this.listenEnd(_next)
  };
  next=(cb:Function,noTransition?:boolean)=>{

    this.redefinePos([-200,-100,0]);
    const _next=()=>{
      const firstItem:ContainerRef=this.containers.shift();
      this.handleItemMove(firstItem.node,firstItem.base=100);
      this.containers.push(firstItem);
      cb();
     this.clearBetween();
    };
    noTransition?_next():this.listenEnd(_next)
  };
  _tpList:any[];
  @Input()tp:TemplateRef<any>;
  @Input()set tpList(val:any[]){
    if(!val||!val.length)return;
    this._tpList=val;
    const handle=()=>{
      this.controls=val.map(()=>({tp:this.tp}));
      this.initItem();
    };
    if(this.afterContentTrigger){
      handle()
    }else{
      this.afterContentTrigger=()=>handle();
    }
  };

  initItem(){
    this.viewRefs=new Array(this.controls.length);
    this.controlsMax=this.controls.length-1;
    //Cancel cycle automatically when max is less than 2;
    if(this.pristineCycleValue)this.cycle=this.controlsMax>=2;


    if(this.activeIndex>this.controlsMax){
      this.activeIndex=this.controlsMax;
      this.ztwSelectChange.emit(this.activeIndex);
    }
    this.createView(1,this.activeIndex);
  };
  afterContentTrigger:Function;
  pristineCycleValue:boolean;
  ngAfterContentInit(){
      this.pristineCycleValue=this.cycle;
      this.definePos([-100,0,100]);
      const items=this.items['_results'];
      if(items&&items.length){
        this.controls=items;
        this.initItem();
      }
      if(this.afterContentTrigger){
        this.afterContentTrigger();
      }else{
        this.afterContentTrigger=()=>{}
      }

      this._nz.runOutsideAngular(()=>{
        let
          x0:number,
          disX:number,
          //is allowed drag begin
          canDrag:boolean,
          //element move distance
          moveX:number=0;

        //listen transition end:
        let transitionEndCount:number=0;
        let endCb:Function;
        const listenEnd=this.listenEnd=(cb:Function)=>{
          transitionEndCount=0;
          endCb=cb;
        };

        const clearMove=()=>this.containers.forEach((i:ContainerRef)=>i.move=null);

        this.containers.forEach(({node}:any)=>{
          node.addEventListener('transitionend',(e:any)=>{
            if(e.target!=node)return;
            node.style.transition='transform 0s';
            if(++transitionEndCount>=3){
              if(endCb){
                endCb();
                endCb=null;
              }
            }
          })
        });
        let preMoveX:number;
        if(this.preventMove)return;
        drag(this._el.nativeElement,{
          useSpeed:'x',
          start:e=>{
            if(this.disabledTouch)return;
            canDrag=false;
            x0=e.x0;
          },
          move:e=>{
            if(this.disabledTouch)return;
            disX=e.x1-x0;
            if(Math.abs(disX)>=changeDis&&!canDrag){
              canDrag=true;
              x0=e.x1;
              disX=0;
            }
            if(!canDrag)return;
            moveX=Math.ceil(disX/this.width*100);
            if(moveX>100)moveX=100;
            if(moveX<-100)moveX=-100;
            if(moveX==preMoveX)return;
            preMoveX=moveX;
            this.dragMove.emit(moveX);
            //no cycle return;
            if(!this.cycle&&((this.activeIndex==0&&moveX>50)||(this.activeIndex==this.controlsMax&&moveX<-50)))return;
       

            this.containers.forEach((i:ContainerRef)=>{
              i.node.style.transform=`translate3d(${i.move=i.base+moveX}%,0,0)`
            });

            if(moveX>0&&!this.containers[0].reload){
            
              if(this.activeIndex==0&&!this.cycle)return;
              this.containers[0].reload=true;
              this.createView(0,this.getPreIndex(),false);

            }else if(moveX<0&&!this.containers[2].reload){
              if(this.activeIndex==this.controlsMax&&!this.cycle)return;
              this.containers[2].reload=true;
              this.createView(2,this.getNextIndex(),false);
            }

          },
          end:speed=>{
            if(this.disabledTouch)return;
            const activeItem:any=this.containers[1];
            if(!activeItem.move)return this.immediateChange.emit(-1);
            //enc completed to empty;
            this.disabledTouch=true;
            listenEnd(()=>{});
            const send=()=>{
              this._nz.run(()=>{
                this.ztwSelectChange.emit(this.activeIndex);
              })
            };
            if((activeItem.move>=50||speed<-25)&&!(this.activeIndex===0&&!this.cycle)){
              if(activeItem.move!=100)this.setTransition();
              this.activeIndex--;
              this.immediateChange.emit(this.activeIndex);
              this.pre(()=>{
                //this.createView(1,this.activeIndex);
                this.containers[0].reload=false;
                this.disabledTouch=false;
                send();
              },activeItem.move==100);

            }else if((activeItem.move<=-50||speed>25)&&!(this.activeIndex===this.controlsMax&&!this.cycle)){
              if(activeItem.move!=-100)this.setTransition();
              this.activeIndex++;
              this.immediateChange.emit(this.activeIndex);
              this.next(()=>{
                //this.createView(1,this.activeIndex);
                this.containers[2].reload=false;
                this.disabledTouch=false;
                send();
              },activeItem.move==-100);
            }else if(activeItem.move==0){
              this.disabledTouch=false;
            }else{
              this.immediateChange.emit(-1);
              this.setTransition();
              this.redefinePos([-100,0,100]);
              this.listenEnd(()=>{
                this.disabledTouch=false;
              })
            }
            clearMove();
          }
        },this.dragOpts)
      });
      this.afterinitEnd=true;

  }
  dragOpts={
    horizontal:true,
    limit:true
  };
}
