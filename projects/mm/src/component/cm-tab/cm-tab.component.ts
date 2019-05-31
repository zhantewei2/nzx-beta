import {
  Component, ViewChild,OnInit,Input,
  ContentChildren,ElementRef,ContentChild,EventEmitter,
  Output,NgZone
} from '@angular/core';

import {Router,ActivatedRoute} from '@angular/router';
import {Cm2TurnComponent} from '../cm2-turn/cm2-turn.component';
import {ToolService} from '../../service/tool.service';

export interface BtnRef{
  width:number;
  left:number;
  halfLeft:number;
  right:number;
  halfW:number;
}
const btnW={
  sm:52,
  md:70,
  lg:100
};

@Component({
  selector:'cm-tabBar-btn',
  template:`
    <ng-content></ng-content>
  `,
  host:{
    class:'cm-tabBar-item'
  }
})
export class CmTabBarBtnComponent{
  constructor(
    public el:ElementRef,
    private tool:ToolService
  ){
    el.nativeElement.addEventListener('click',()=>{
      this.click();
    });
    this.tool.ripple(el.nativeElement,{fontSize:10});
  }
  setActive(){
    this.el.nativeElement.classList.add('tabActive');
  }
  removeActive(){
    this.el.nativeElement.classList.remove('tabActive');
  }
  click=()=>{

  }
}


@Component({
  selector: 'cm-tabBar',
  template:`
<span #content  
  [class.cm-fine-bottom]="borderBottom"
  [ngClass]="['cm-tabBar-'+size,'cm-tabBar-theme-'+theme]"
  class="cm-tabBar-content">
    <ng-content></ng-content>
    <div class="cm-tabBar-bar-content">
      <div #thumb class="cm-tabBar-thumb"></div>
    </div>
</span>
  `,
  host:{
    class:'cm-tabBar-wrapper'
  }
})
export class CmTabComponent implements OnInit {
  constructor(
    private el:ElementRef
  ){}
  scrollTo:Function;
  friendContent:any;
  @Input()borderBottom:any;
  @Input()theme:'light'|'darken'='light';
  @Input()size:'sm'|'md'|'lg'='sm';
  ngOnInit(){

    this.thumbElement=this.thumb.nativeElement;
    this.thumbElement.addEventListener('transitionend',this.clearTransition);
  }
  wrapperEl:HTMLElement;
  activeIndex:number;
  maxIndex:number;
  @ViewChild('content')content:any;
  @ContentChildren(CmTabBarBtnComponent)btns:any;
  @ViewChild('thumb')thumb:any;
  @Input('select')set select(val:number){
    if(val===this.activeIndex)return;
    this.setThumb(this.activeIndex=val);
  }
  @Output('selectChange')selectChange:EventEmitter<number>=new EventEmitter<number>();

  thumbElement:HTMLElement;
  contentWidth:number;
  activeBtn:BtnRef;
  moveThumb(moveX:number){
    moveX=0-moveX;
    if((this.activeIndex==0&&moveX<0)||(this.activeIndex==this.maxIndex&&moveX>0))return;
    this.translateThumb(this.beforeTargetX+moveX*this.activeBtn.width);
  }
  resetThumb(){
    this.setTransition();
    this.translateThumb(this.beforeTargetX);
  }
  btnPos:BtnRef[]=[];
  beforeTargetX:number;
  scrollBoundLeft:number=0;
  scrollBoundRight:number;
  setTransition=()=>this.thumbElement.classList.add('cm-use-transform');
  clearTransition=()=>this.thumbElement.classList.remove('cm-use-transform');
  translateThumb=(targetX:number)=>this.thumbElement.style.transform=`translate3d(${targetX}px,0,0)`;

  focusThumb(index:number){
    const midLine:number=this.btnPos[index].halfLeft;
    let scrollX:number=midLine-this.wrapperWidth/2;
    if(scrollX<this.scrollBoundLeft)scrollX=this.scrollBoundLeft;
    if(scrollX>this.scrollBoundRight)scrollX=this.scrollBoundRight;
    this.scrollTo(scrollX);
  }

  setThumb(index:number){
    const next=()=>{
      const btnRef:BtnRef=this.btnPos[index];
      const targetX:number=btnRef.halfLeft-this.thumbElement.offsetWidth/2;
      if(this.beforeTargetX&&this.beforeTargetX!==targetX){
        this.setTransition();
      }
      this.translateThumb(targetX);
      this.beforeTargetX=targetX;
      this.activeBtn=this.btnPos[index];
      this.focusThumb(index);
      this.setActiveControl();
    };
    if(this.afterInit){
      next()
    }else{
      this.afterInit=next;
    }
  }
  afterInit:Function;
  wrapperWidth:number;
  activeControl:CmTabBarBtnComponent;
  setActiveControl(){
    let nowControl=this.btns['_results'][this.activeIndex];
    nowControl.setActive();
    if(this.activeControl)this.activeControl.removeActive();
    this.activeControl=nowControl;
  }
  ngAfterViewInit(){

    const wpEl:HTMLElement=this.wrapperEl=this.el.nativeElement;

    this.scrollTo=wpEl.scrollTo?
      (x:number)=>wpEl.scrollTo({left:x,behavior:'smooth'})
      :(x:number)=>wpEl.scrollLeft=x;

    const contentEl:HTMLElement=this.content.nativeElement;

    const checkAutoFlex=(init:boolean)=>{
      const wpW=this.wrapperWidth=wpEl.offsetWidth;
      const baseItemWidth=btnW[this.size];
      const _itemW=wpW/this.btns.length;
      this.maxIndex=this.btns.length-1;
      let width:number;
      if(baseItemWidth<_itemW){
        width=_itemW;
        contentEl.style.width=wpW+'px';
      }else{
        contentEl.style.width=null;
        width=baseItemWidth;
      }
      this.contentWidth=width*this.btns.length;
      this.scrollBoundRight=this.contentWidth-this.wrapperWidth;
      let length:number=0;
      this.btnPos=this.btns.map((control:CmTabBarBtnComponent,index:number)=>{

          const result={
            width,
            halfW:width/2,
            halfLeft:width/2+length,
            left:length,
            right:length+=width
          };
          //rewrite click event
          control.click=()=>{
            if(this.friendContent&&this.friendContent.disabledTouch)return;
            this.selectChange.emit(index);
          };
          return result;
      });

      if(init&&this.afterInit){
        this.afterInit();
      }else{
        this.setThumb(this.activeIndex);
        this.afterInit=()=>{};
      }
        // contentEl.style.width=contentEl.offsetWidth<=wpEl.offsetWidth?wpEl.offsetWidth+'px':null;
        // registryList();
    };
    checkAutoFlex(true);
    this.btns.changes.subscribe(checkAutoFlex);
  }
}
@Component({
  selector:'cm-tab-group',
  template:`
  <ng-content></ng-content>
  `
})
export class CmTabGroup{
  constructor(
    public _nz:NgZone,
    private router:Router,
    private route:ActivatedRoute,
    public _el:ElementRef
  ){}
  @ContentChild(CmTabComponent)tabBar:CmTabComponent;
  @ContentChild(Cm2TurnComponent)tabContent:Cm2TurnComponent;
  @Input()set size(val:any){
    if(!val)return;
    if(this.tabBar)this.tabBar.size=val;
    this._size=val;
  }
  _size:'sm'|'md'|'lg'='md';
  @Input()set cmSelect(val:any){
    this._selectIndex=val;
  }
  @Output('cmSelectChange')cmSelectChange:EventEmitter<number>=new EventEmitter<number>();
  _selectIndex:number=0;
  ngAfterContentInit(){
    if(!this.tabContent||!this.tabBar)return;
    this.tabBar.size=this._size;
    const setIndex=(index:number,handleContent?:boolean)=>{

      this.tabBar.select=this._selectIndex=index;
      if(handleContent)this.tabContent.select=index;
      this._nz.run(()=>{
        this.cmSelectChange.emit(index);
        const query=this.route.snapshot.queryParams;
        this.router.navigate(['./'],
          {
            relativeTo:this.route,
            queryParams:Object.assign({},query,{cmTab:index},),
            replaceUrl:true
          })
      });
    };
    const query=this.route.snapshot.queryParams;
    setIndex(Number(query.cmTab||0),true);
    this.tabContent.infinite=false;
    this.tabContent.useDragMove=true;
    this.tabBar.friendContent=this.tabContent;
    this.tabContent.immediateChange.subscribe((activeIndex:number)=>{
      if(activeIndex>=0){
        setIndex(activeIndex);
      }else{
        this.tabBar.resetThumb();
      }
    });

    this.tabContent.dragMove.subscribe((moveX:number)=>{
      this.tabBar.moveThumb(moveX);
    });

    this.tabBar.selectChange.subscribe((activeIndex:number)=>{
        this.tabContent.select=activeIndex;
      // setIndex(activeIndex,true);
    });

  }
}
