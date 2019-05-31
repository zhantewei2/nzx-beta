import { Directive ,ElementRef,Output,EventEmitter,NgZone} from '@angular/core';
import {HammerService} from '../service/hammer.service';
import {dragConfig} from '../config';
import {Subject} from 'rxjs';

@Directive({
  selector: '[cm2-drag]'
})
export class Cm2DragDirective {
    @Output('useDrag')useDrag:EventEmitter<any>=new EventEmitter();
    @Output('cancelDrag')cancelDrag:EventEmitter<any>=new EventEmitter();
  height:number;
  moveBoundChange:Subject<number>=new Subject<number>();
  stopRestore:boolean;
  disabledDrag:boolean;
  _realyX:number;
  _realyY:number;
  transition:any;
  _dragEnd=()=>{};
  ngOnInit(){
      this.height=this.el.nativeElement.offsetHeight;
  }
  constructor(
      public el:ElementRef,
      private hammer:HammerService,
      private _nz:NgZone
  ){
      const node:any=el.nativeElement;

      node.cmAddEventListener('contextmenu',e=>e.preventDefault());
    let
    longTapInterval:any,
    isDrag:boolean;

    let
    realyX:number=0,
    realyY:number=0;
    //视窗高，用以判断删除区域
    let rectHeight:number;

    const transition=this.transition=new hammer.Transform(node);
    const dragMove=(perX:number,perY:number)=>{
      node.style.transform=`translate3d(${this._realyX=realyX+=perX}px,${this._realyY=realyY+=perY}px,0)`;
    };
    const clearTapTimeout=()=>{

        if(longTapInterval){
            clearTimeout(longTapInterval);
            longTapInterval=null;
        }
    };
    const allowDrag=()=>{
        if(isDrag)return;
        isDrag=true;

        const rect=node.getBoundingClientRect();
        const left=rect.left;
        rectHeight=rect.top;
        // node.style.position='fixed';
        // node.style.top=rectHeight;
        // node.style.left=left;

        node.classList.add(dragConfig.longTapClass);
        this._nz.run(()=>{
            this.useDrag.emit(this);
        })
    };
    const cancelDrag=()=>{
        if(!isDrag)return;
        isDrag=false;
        node.classList.remove(dragConfig.longTapClass);
        // node.style.left=node.style.top=node.style.position=null;

        this._nz.run(()=>{
            this.cancelDrag.emit();
        })
    };
    const restoration=()=>{
        this.disabledDrag=true;
        transition.to('translate3d(0,0,0)',()=>{
            this.disabledDrag=false;
            realyY=realyX=0;
        })
    };
    const endMethod=()=>{
        cancelDrag();
        if(this.disabledDrag)return;

        clearTapTimeout();

        this._dragEnd&&this._dragEnd();
        if(realyX!==0&&realyY!==0&&!this.stopRestore)restoration();
    };

    hammer.touch({
        element:node,
        begin:()=>{
            if(this.disabledDrag)return;
            this.stopRestore=false;
            clearTapTimeout();
            longTapInterval=setTimeout(allowDrag,dragConfig.longTapTime);
        },
        move:(e:any)=>{
            if(!isDrag||this.disabledDrag)return;
            dragMove(e.perX,e.perY);

            this.moveBoundChange.next(rectHeight+e.disY+this.height);
        },
        end:()=>endMethod()
    })

    node.cmAddEventListener('touchcancel',()=>endMethod());

  }

}
