import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HammerService} from '../../service/hammer.service';

@Directive({
  selector:'[cm2-turn-item]',
})
export class Cm2TurnItemDirective{
  constructor(
   public tp:TemplateRef<any>
  ){}

}
const detectionDistance=30;


@Component({
  selector: 'cm2-turn',
  template:`  
  <ng-content></ng-content>
  <div #a class="cm2-turn-page-item">
    <span #_a></span>
  </div>
  <div #b class="cm2-turn-page-item">
    <span #_b></span>
  </div>
  <div #c class="cm2-turn-page-item">
    <span #_c></span>
  </div>
  `,
  host:{
    class:'ztw-turn-page'
  },
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Cm2TurnComponent implements OnInit {

  @ViewChild('a')a:any;
  @ViewChild('b')b:any;
  @ViewChild('c')c:any;
  @ViewChild('_a',{read:ViewContainerRef})_a:ViewContainerRef;
  @ViewChild('_b',{read:ViewContainerRef})_b:ViewContainerRef;
  @ViewChild('_c',{read:ViewContainerRef})_c:ViewContainerRef;
  @ContentChildren(Cm2TurnItemDirective)turnItems:Cm2TurnItemDirective;
  @Input()infinite:boolean;
  @Input()tpList:Array<any>;
  selectValue:number=0;
  afterViewInitFn:Function;

  @Input()set select(val:number){

    if(val==this.selectValue)return;
    val=Number(val);
    if(this.afterViewInitFn){
      this.afterViewInitFn(val);
    }else{
      this.selectValue=val;
    }
  }
  @Input()useDragMove:boolean;
  @Output('immediateChange')immediateChange:EventEmitter<number>=new EventEmitter<number>();
  @Output('selectChange')selectChange:EventEmitter<number>=new EventEmitter<number>();
  @Output('dragMove')dragMove:EventEmitter<number>=new EventEmitter<number>();

  disabledTouch:boolean;
  constructor(
    private _el:ElementRef,
    private _hammer:HammerService,
    private _nz:NgZone,
    private _cdr:ChangeDetectorRef,
    private route:ActivatedRoute
  ){
      //init cmTab
      const params=route.snapshot.queryParams;
      if(params&&params.cmTab!==undefined)this.selectValue=Number(params.cmTab);
    //----end
  }
  ngOnInit(){}
  afterViewInitEnd:boolean;
  ngAfterContentInit(){
    const controls:Array<Cm2TurnItemDirective>=this.turnItems['_results'];
    const controlCounts:number=controls.length;
    const controlMax=controlCounts-1;
    const views:any=new Array(controlCounts);
    //redefine infinite
    if(controlCounts<3)this.infinite=false;
    // this._a.createEmbeddedView(c)
    const
    wrapper:HTMLElement=this._el.nativeElement,
    wrapperWidth:number=wrapper.clientWidth,
    forwardWidth:number=wrapperWidth/2,
    backWidth:number=0-wrapperWidth/2,
    centerBound:number=0,
    backBound:number=0-wrapperWidth,
    forwardBound:number=wrapperWidth,
    wrapperMin:number=0-wrapperWidth;
    const
    collection={
      pre:{
        node:this.a.nativeElement,
        position:0,
        transform:new this._hammer.TransformAnimation(this.a.nativeElement),
        viewRef:undefined,
        containerRef:this._a,
        displayShow:false,
      },
      active:{
        node:this.b.nativeElement,
        position:0,
        transform:new this._hammer.TransformAnimation(this.b.nativeElement),
        viewRef:undefined,
        containerRef:this._b,
        displayShow:false,
      },
      next:{
        node:this.c.nativeElement,
        position:0,
        transform:new this._hammer.TransformAnimation(this.c.nativeElement),
        viewRef:undefined,
        containerRef:this._c,
        displayShow:false,
      }
    };
    let useItem:any;
    const setControlPos=(name:string,perX:number)=>{
      useItem=collection[name];
      useItem.position=useItem.position+perX;
      useItem.node.style.transform=`translate3d(${useItem.position}px,0,0)`;
    };
    const transformTo=(name:string,pos:number,cb?:Function)=>{
      if(cb)this.disabledTouch=true;
      useItem=collection[name];
      const animationPos=pos==0?'center':(pos>0?'right':'left');
      useItem.transform.to(animationPos,cb?()=>{this.disabledTouch=false;cb()}:null);
      useItem.position=pos;
    };
    const specifyControlPos=(name:string,pos:number)=>{
      useItem=collection[name];
      useItem.node.style.transform=`translate3d(${pos}px,0,0)`;
      useItem.position=pos;
    };
    const showControl=(name:string)=>{
      useItem=collection[name];
      if(!useItem.displayShow){
        useItem.node.classList.add('active');
        useItem.displayShow=true;
      }
    };
    const hidControl=(name:string)=>{
      useItem=collection[name];
      if(useItem.displayShow){
        useItem.node.classList.remove('active');
        useItem.displayShow=false;
      }
    };
    const hidBoth=()=>{
      hidControl('pre');
      hidControl('next');
    };
    const createView=(action:'active'|'pre'|'next'|number,name:string,force?:boolean)=>{
      let index:number;
      if(typeof action=='number'){
        index=action;
      }else{
        switch(action){
          case 'active':
            index=this.selectValue;
            break;
          case 'pre':
            index=this.selectValue-1;
            if(index<0){
              if(!this.infinite)return;
              index=controlMax;
            }
          break;
          case 'next':
            index=this.selectValue+1;
            if(index>controlMax){
              if(!this.infinite)return;
              index=0;
            }
          break;
        }
      }

      showControl(name);

      let innerViewRef:ViewRef=views[index];
      const item=collection[name];
      const viewExists=item.viewRef;
      if(viewExists&&!force)return;
      const containerRef:ViewContainerRef=item.containerRef;

      let firstCreated:boolean;
      this._nz.run(()=>{
        containerRef.detach(0);
        if(!innerViewRef){
          //handle current not equal previous
          if(!firstCreated){
            setTimeout(()=>innerViewRef=views[index]=containerRef.createEmbeddedView(controls[index].tp));
          }else{
            innerViewRef=views[index]=containerRef.createEmbeddedView(controls[index].tp);
          }
          firstCreated=true;
        }else{
          containerRef.insert(innerViewRef,0);
        }
        item.viewRef=innerViewRef;
      })
    };

    //init position----
    setControlPos('pre',backBound);
    setControlPos('active',centerBound);
    setControlPos('next',forwardBound);

    //init end------
    let activeItem:any=collection.active;
    let activePosition:number;
    //for not infinite;
    let forwardEnd:boolean;
    let backEnd:boolean;
    const detectEnd=()=>{

      forwardEnd=this.selectValue==controlMax;
      backEnd=this.selectValue==0;
    };
    createView('active','active');

    detectEnd();

    const forward=(cb,targetValue?:number)=>{
      transformTo('active',forwardBound,cb);
      transformTo('pre',0);
      specifyControlPos('next',backBound);
      if(this.useDragMove)this.immediateChange.emit(targetValue!==undefined?targetValue:this.selectValue-1);
    };
    const sperateCollection=()=>{
      let pre,active,next;
      let value;
      for(let i in collection){
        value=collection[i];
        if(value.position==0){
          active=value;
        }else if(value.position>0){
          next=value;
        }else{
          pre=value;
        }
      }
      return {pre,active,next};
    };
    const forwardReplace=(targetValue?:number)=>{
      // const {pre,active,next}=collection;
      const {pre,active,next}=sperateCollection();
      collection.active=active;
      collection.next=next;
      collection.pre=pre;
      collection.pre.viewRef=undefined;
      if(targetValue===undefined){
        this.selectValue=this.selectValue-1;
        this.selectValue=this.selectValue<0?controlMax:this.selectValue;
        this.selectChange.emit(this.selectValue);
      }else{
        this.selectValue=targetValue;
      }
      detectEnd();
      hidBoth();
      activeItem=collection.active;
    };
    const back=(cb,targetValue?:number)=>{

      transformTo('active',backBound,cb);
      transformTo('next',centerBound);
      specifyControlPos('pre',forwardBound);
      if(this.useDragMove)this.immediateChange.emit(targetValue!==undefined?targetValue:this.selectValue+1);

    };
    const backReplace=(targetValue?:number)=>{
      // const {pre,active,next}=collection;

      const {pre,active,next}=sperateCollection();
      collection.active=active;
      collection.pre=pre;
      collection.next=next;
      collection.next.viewRef=undefined;
      if(targetValue===undefined){
        this.selectValue=this.selectValue+1;
        this.selectValue=this.selectValue>controlMax?0:this.selectValue;
        this.selectChange.emit(this.selectValue);
      }else{
        this.selectValue=targetValue;
      }
      detectEnd();
      hidBoth();
      activeItem=collection.active;
    };

    const reset=(isForward,cb)=>{
      transformTo('active',centerBound,cb);
      if(isForward){
        transformTo('pre',backBound);
        specifyControlPos('next',forwardBound);
      }else{
        transformTo('next',forwardBound);
        specifyControlPos('pre',backBound);
      }
      this.immediateChange.emit(-1);
    };
    //handle input select value
    const clearBothView=()=>{
      collection.next.viewRef=collection.pre.viewRef=undefined;
    }
    this.afterViewInitFn=(val:number)=>{

      if(val>this.selectValue){
        createView(val,'next',true);

        back(()=>{
          backReplace(val);
          // if((val-this.selectValue)>1){
          clearBothView();
        },val);


      }else{
        createView(val,'pre',true);

        forward(()=>{
          forwardReplace(val);
          clearBothView();
          // if((this.selectValue-val)>1)clearBothView();
        },val);
      }
    }

    let dirtyForward:boolean,dirtyBack:boolean,dirtyMove:boolean,_activePosition:number;
    this._hammer.horizontalTouch({
      moment:true,
      element:wrapper,
      capture:true,
      begin:()=>{
        dirtyMove=dirtyBack=dirtyForward=false;
        if(activeItem.activePosition==0)this.disabledTouch=false;
      },
      move:(e)=>{
        event.preventDefault();
        if(this.disabledTouch)return;
        if(Math.abs(e.disX)<detectionDistance&&!dirtyMove)return;
        dirtyMove=true;
        _activePosition=activeItem.position+e.perX;
        if(_activePosition>wrapperWidth||_activePosition<wrapperMin)return;
        if(!this.infinite){
          if((forwardEnd&&_activePosition<0)||(backEnd&&_activePosition>0))return;
        }
        if(this.useDragMove)this.dragMove.emit(e.disX/wrapperWidth);
        activeItem.node.style.transform=`translate3d(${activeItem.position=_activePosition}px,0,0)`;

        // setControlPos('active',e.perX);
        setControlPos('pre',e.perX);
        setControlPos('next',e.perX);
        //insert view
        if(e.disX>0&&!dirtyForward){
          dirtyForward=true;
          createView('pre','pre');
        }else if(e.disX<0&&!dirtyBack){
          dirtyBack=true;
          createView('next','next');
        }
      },
      end:e=>{
        if(this.disabledTouch)return;
        activePosition=activeItem.position;

        //direction turn
        if(activePosition>=forwardWidth||(e.momentActive&&activePosition>0)){
          //forward
          if(activePosition!=forwardBound){
            forward(()=>{
              forwardReplace();
            });
          }else{
            forwardReplace();
          }
        }
        else if(activePosition<=backWidth||(e.momentActive&&activePosition<0)){
          //back
          if(activePosition!=backBound){
            back(()=>{
              backReplace();
            })
          }else{
            backReplace();
          }
        }else{
          if(activePosition!=0){
            reset(activePosition>0,()=>{
              activeItem=collection['active'];
              hidBoth();
            })
          }
        }
      }
    })
  }
}
