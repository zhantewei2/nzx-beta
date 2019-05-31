import {Directive,ElementRef,Input,Output,EventEmitter,NgZone} from '@angular/core';
import {fromEvent,Subject} from 'rxjs';


import {ToolService} from '../../service/tool.service';

export interface ScrollOffset{
  top:number;
  offsetHeight?:number;
}
export interface ControlOffset{
  lineTop?:number;
  lineBottom?:number;
  bottom?:number;
  height?:number;
  top?:number;
}
@Directive({
  selector: '[cm-scroll-container]',
  host:{
    style:'overflow-y:auto'
  },
  exportAs:'cmScrollContainer',
})
export class CmScrollContainerDirective  {
  el:any;
  activeValue:any;
  preVal:any;
  controls=[];
  afterViewInit:boolean=false;
  scrollOffsetObserver:Subject<ScrollOffset>=new Subject();
  offsets:Array<any>=[];
  @Output('selectChange')selectChange:EventEmitter<any>=new EventEmitter<any>();
  @Input()transition:boolean;
  @Input('select')set select(val){
    if(this.selfChange)return;
    this.activeValue=val;
    if(this.afterViewInit)this.scrollTo(val);
  }
  constructor(
    public _elRef:ElementRef,
    private tool:ToolService,
    private _nz:NgZone
  ){
   this.el=this._elRef.nativeElement;
   this._nz.runOutsideAngular(()=>{
    fromEvent(this.el,'scroll').subscribe(
      ()=>{
        this.scrollOffsetObserver.next(this.sendEvent());
      }
    )
   })
  }
  check(){
    this.calControlsOffset();
  }
  calControlsOffset(){
    let contentHeight:number=0,scrollHeight:number;
    
    this.controls.forEach((control)=>{
      control.getOffset();
      contentHeight+=control.offset.height;
    });
    scrollHeight=contentHeight-this.el.clientHeight;
    let
     percent:number=0,
     preControlOffset:ControlOffset,
     controlOffset:ControlOffset;
    this.controls.forEach((control:any)=>{
      controlOffset=control.offset;
      controlOffset.lineTop=Math.floor(scrollHeight*percent);
      if(preControlOffset)preControlOffset.lineBottom=controlOffset.lineTop;
      percent+=controlOffset.height/contentHeight;
      preControlOffset=controlOffset;
    })
    preControlOffset.lineBottom=scrollHeight;
    
  }
  ngAfterViewInit(){
    this.afterViewInit=true;
    this.calControlsOffset();
    if(this.activeValue)this.scrollTo(this.activeValue,true);
  }
  scrollTo(controlValue:any,disabledTransition:boolean=false){
    const control=this.controls.find((control:any)=>control.controlValue===controlValue);
    if(!control)return;
    if(!disabledTransition&&this.transition){
      const beginTop:number=this.el.scrollTop;
      this.tool.linear({
          distance:control.offset.lineTop-beginTop,
      },n=>{
        this.el.scrollTop=beginTop+n;
      })
    }else{
      this.el.scrollTop=control.offset.lineTop;
    }
  }

  sendEvent=()=>({
    top:this.el.scrollTop
  });
  selfChange:any;

  catchValue(val:any){
    if(val==this.preVal)return;
    this._nz.run(()=>{
      this.selectChange.emit(this.preVal=val);
      //avoid self triggering
      this.selfChange=setTimeout(()=>{this.selfChange=null});  
    })
  }
}



@Directive({
  selector:'[cm-scroll-control]'
})
export class CmScrollControlDirective{
  el:any;
  offset:ControlOffset={};

  @Input('cm-scroll-control')controlValue:any;
  @Input()useCheck:boolean=false;
  //remove control from parent container
  removeControl(){
    const controls=this.container.controls;
    controls.splice(1,controls.indexOf(this));
  }

  constructor(
   private container:CmScrollContainerDirective,
   private _elRef:ElementRef,
   private _nz:NgZone
  ){
    this.el=_elRef.nativeElement;
    this.removeControl();
    container.controls.push(this);
  }
 
  getOffset=()=>{
    this.offset.top=this.el.offsetTop;
    this.offset.height=this.el.offsetHeight;
    this.offset.bottom=this.offset.top+this.offset.height;
  };
  ngOnInit(){
    // this.getOffset();
    // this.container.offsets.push(this.offset);
    const subEvent=({top}:ScrollOffset)=>{
      if(top>=this.offset.lineTop&&top<this.offset.lineBottom){
  
        this.container.catchValue(this.controlValue);
      }
    };
    this.container.scrollOffsetObserver.subscribe(subEvent);
    // //Init check value..Rule out activeValue exist!
    if(!this.container.activeValue)setTimeout(()=>subEvent(this.container.sendEvent()));
  }
  ngDoCheck(){
    // if(this.useCheck)this.getOffset();
  };
  ngOnDestroy(){
    this.removeControl();
  }


}
