import { Component,NgZone,OnInit ,ViewChild,Input,Output,EventEmitter} from '@angular/core';
import {scrollToMethod} from '../../util/scroll';
import {drag} from '../../util/touchDrag';

const itemH:number=30;
const a:number=10;
const maxOffset:number=60;

@Component({
  selector: 'cm-picker',
  template:`
<div class="cm-picker-title center" [class.sm]="sm===''||sm">
  <span class="cm-picker-title-content">{{title}}</span>
</div>
<div class="cm-picker-container" [class.sm]="sm===''||sm" #container>
  <div #content class="cm-picker-content" >
  
    <li (click)="itemClick(index)"  
    *ngFor="let i of _list;index as index"
     trackBy:trackByFn
    >{{i}}</li>
  </div>
    <div class="cm-picker-top-block"></div>
    <div class="cm-picker-show-block"></div>
    <div class="cm-picker-bottom-block"></div>
</div>
  `,

})
export class CmPickerComponent implements OnInit {

  constructor(
    private _nz:NgZone
  ){}
  scrollMethod:Function=scrollToMethod();
  trackByFn(index:any,item:any){
    return item;
  }
  @Input()sm:any;
  @ViewChild('content')content:any;
  @ViewChild('container')container:any;
  @Input()title:any;
  @Input()cmSelect:number;
  @Output('cmSelectChange')cmSelectChange:EventEmitter<any>=new EventEmitter<any>();
  _list:Array<any>;
  //li node Array
  lis:Array<any>;
  //li node top position array
  lisPos:Array<any>;
  //content translateY value
  contentNode:any;
  //
  contentBoundTop:number;
  contentBoundBottom:number;
  //active index when scrolling changes
  _activeIndex:number=0;
  //real active index
  activeIndex:number=0;
  preActiveIndex:number;
  baseLine:number;
  translateY:number=0;
  topLine:number;
  bottomLine:number;
  scrollInterval:any;
  calLis(){
    this.lis=this.contentNode.querySelectorAll('li');
    let childBaseLine:number;
    this.lisPos=Array.prototype.map.call(this.lis,v=>{
      childBaseLine=v.offsetTop+v.offsetHeight/2;
      const childRef:any={
        top:v.offsetTop,
        baseLine:childBaseLine,
        scrollOffset:this.baseLine-childBaseLine
      }
      return childRef;
    });
    this.topLine=this.lisPos[0]['scrollOffset'];
    this.bottomLine=this.lisPos[this.lisPos.length-1]['scrollOffset'];

    this.contentBoundTop=maxOffset*2;
    this.contentBoundBottom=0-this.contentNode.offsetHeight+maxOffset;
  }

  ngOnChanges(e:any){
    const {list,cmSelect:select}=e;
    if(list&&list.currentValue!=list.previousValue){
      this._list=list.currentValue;
      setTimeout(()=>{
        this.cal();
        this.calLis();
        this.skipTo(select?select.currentValue:0);
      })
    }else if(select&&!list){
      const index=select.currentValue;
      if(index!=this.activeIndex)this.skipTo(index);
    }
  }
  skipTo(index:number,animate?:boolean){
    const targetLine:number=this.lisPos[index]['scrollOffset'];

    if(!animate||targetLine==this.translateY){
      this.locationTo(this.translateY=targetLine);
      this._activeIndex=index;
      this._nz.run(()=>{
        this.focusIndex();
        this.cmSelectChange.emit(this.activeIndex=index);
      });

    }else{
      this.scrollInterval=this.scrollMethod(this.translateY,targetLine,(e:any)=>{
       this.locationTo(this.translateY=e);
      },500,()=>{
        this._nz.run(()=>{
          this._activeIndex=index;
          this.focusIndex();
          this.cmSelectChange.emit(this.activeIndex=index);
        })
      });
    }
  }
  @Input()list:Array<any>;
  contentHeight:any;
  cal(){
    this.contentHeight=this.contentNode.offsetHeight;
  }
  ngOnInit(){
    this.contentNode=this.content.nativeElement;

  }
  locationTo(n:number){
    this.contentNode.style.transform=`translate3d(0,${n}px,0)`
  }
  ngAfterViewInit(){
    this.baseLine=this.container.nativeElement.offsetHeight/2;

    let disY0:number=0,changeDis:number;


    drag(this.container.nativeElement,{
      useSpeed:'y',
      prevent:true,
      start:()=>{
        disY0=0;
        this.scrollInterval&&clearInterval(this.scrollInterval);
      },
      move:({disY}:any,e:any)=>{
       // e.stopPropagation();
        changeDis=disY-disY0;
        let targetPos=this.translateY-changeDis*2;

        if(targetPos>this.contentBoundTop){
          targetPos=this.contentBoundTop;
        }else if(targetPos<=this.contentBoundBottom){
          targetPos=this.contentBoundBottom;
        }
        this.locationTo(this.translateY=targetPos);
        //this.judgeIndex(targetPos);
        disY0=disY;
      },
      end:(speed:number)=>{
        let _target:number;
        if(speed){
          const dis=(speed*speed)/(2*a);

          _target=speed>0?this.translateY-dis:this.translateY+dis;
          if(_target<this.bottomLine)_target=this.bottomLine;
          if(_target>this.topLine)_target=this.topLine;
        }else{
          _target=this.translateY;

        }

        this.skipTo(this._judgeIndex(_target),true);
        // if(this._activeIndex!=this.activeIndex){

       // this.skipTo(this._activeIndex,true);
        // }
      }
    })
  }
  _judgeIndex(translateY:number){
    let index:number=0,posArr=this.lisPos,activeIndex:number;
    for(let i=0,len=posArr.length;i<len;i++){
      if(posArr[i].top+translateY>=this.baseLine)break;
      index++;
    }
    activeIndex=index-1;

    return activeIndex<0?0:activeIndex;
  }
  judgeIndex(translateY:number){
    this._activeIndex=this._judgeIndex(translateY);
    //this.focusIndex();
  }
  focusIndex(){
    if(this._activeIndex!=this.preActiveIndex){
     this.lis[this._activeIndex].classList.add('active');
      if(this.preActiveIndex!==undefined){
        try{
         this.lis[this.preActiveIndex].classList.remove('active');
        }catch(e){}
      }
      this.preActiveIndex=this._activeIndex;
    }
  }
  itemClick(index:number){
    //不做点击定位
    // if(index!=this.activeIndex){
    //
    // }
  }

}
