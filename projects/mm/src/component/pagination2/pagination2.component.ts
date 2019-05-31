import { Component, OnInit ,ViewChild,
  NgZone,ChangeDetectionStrategy,ChangeDetectorRef,Input,Output,EventEmitter,Inject} from '@angular/core';
import {ToolService} from '../../service/tool.service';
import {fade,scrollP} from '../../animate/animate';
import {drag} from '../../util/touchDrag';

import {Subject} from 'rxjs';
import {HammerService} from '../../service/hammer.service';
//更改判断
import {PaginationToken} from '../../token/token';

const maxTop:number=100;
const refreshTop:number=80;

@Component({
  selector: 'ztw-pagination2',
  templateUrl: './pagination2.component.html',
  styleUrls: ['./pagination2.component.css'],
  host:{
    'class':'cm-scroll-pagination'
  },
  animations:[fade,scrollP],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Pagination2Component implements OnInit {
  @ViewChild('refreshText')refreshTextRef:any;
  @ViewChild('container')container:any;
  @ViewChild('refreshTextContent')refreshContentRef:any;
  @Input()disabledRefresh:boolean;
  @Input()pageChange:Function;
  @Input()emptyMessage:string;
  @Input()errMessage:string;
  //兼容
  @Input()initChange:boolean;
  @Input()disCross:boolean;
  @Input()iosInertance:boolean=true;
  @Input()blur:boolean;
  @Input()bindList:any;
  @Input()set disabledScroll(val:any){
    this.containerMoveFn=val?e=>e.preventDefault():()=>{};
  };
  @Input()useTopSub:boolean;
  scrollTopSub:any=new Subject();
  _disabledScroll:boolean;
  @Output()init:EventEmitter<any>=new EventEmitter();
  @Output()reset:EventEmitter<any>=new EventEmitter();

  nowPage:number=1;
  constructor(
    private tool:ToolService,
    private zone:NgZone,
    private _detector:ChangeDetectorRef,
    private _hammer:HammerService,
    @Inject(PaginationToken)
    private config:any
  ){}
  topLoading:boolean=false;
  bottomLoading:boolean;
  bottomEnd:boolean;
  //scrollTop获取可供父级判断
  scrollTop:number=0;
  //isRefreshing是否正在刷新。可供父级判断

  isRefreshing:boolean;
  runLinear:any;

  // pause(){
  //   this.runLinear&&this.runLinear.pause();
  // }
  // resume(){
  //   this.runLinear&&this.runLinear.resume();
  // }
  springMethod:any={

  };


  refreshEnd=()=>{};
  destroyCross:any;
  ngOnDestroy(){
    this.destroyCross&&this.destroyCross();
  }
  ngAfterViewInit(){
    this.init.emit(this);
  }
  dragOpts={
    limit:true,
    horizontal:false
  };
  containerMoveFn=(e:Event)=>{};

  ngOnInit() {

    const container:any=this.container.nativeElement;
    const refreshText:any=this.refreshTextRef.nativeElement;
    const refreshContent:any=this.refreshContentRef.nativeElement;
    container.cmAddEventListener('touchmove',e=>this.containerMoveFn(e));
    //init
    if(this._disabledScroll)this.containerMoveFn=e=>e.preventDefault();


    //end
    let
      originY:number=0,
      _originY:number=0,
      y:number=0,
      perY:number=0,
      forbidMove:boolean,
      springMethod:any,
      scrollToRefresh:boolean,
      //scroll height==0
      canBeginRefresh:boolean,
      iconShow:boolean,
      //disabled container scroll
      containerDisScroll:boolean,
      //disabled container scroll end;
      disabledNext:boolean;

    if(this.disCross)this.destroyCross=this.tool.disCrossBound(container);


    const defineContainer=(posY:number)=>container.style.transform=`translate3d(0,${posY}px,0)`;
    const closeRefreshIcon=()=>{
      if(iconShow){
        refreshText.style.display='none';
        iconShow=false;
      }
    };
    let iconPercent:number=0,iconRealPercent:number,initCanRefresh:boolean=true;
    const restoreText=()=>{
      if(!initCanRefresh){
        refreshContent.classList.remove('refresh');
        initCanRefresh=true;
      }
    };

    const changeRefreshIcon=(dis:number)=>{

      if(!iconShow){
        refreshText.style.display='block';
        iconShow=true;
      }
      iconPercent=dis/refreshTop;

      if(iconPercent>=1&&iconRealPercent>=1){

        if(initCanRefresh){
          refreshContent.classList.add('refresh');
          initCanRefresh=false;
        }
        return ;
      }
      iconRealPercent=iconPercent>=1?1:iconPercent;
      restoreText();
      refreshContent.style.transform=`scale3d(${iconRealPercent},${iconRealPercent},1) translate3d(0,${30*iconRealPercent}px,0)`;
    };
    const transitionAnimation=new this._hammer.TransformAnimation(container);
    const springBack=(len?:number)=>{
      forbidMove=true;
      closeRefreshIcon();
      transitionAnimation.to('top',()=>{
        forbidMove=false;
        this.isRefreshing=false;
        defineContainer(originY=_originY=0);

      });

    };



    const refreshStart=()=>{

      scrollToRefresh=this.topLoading=true;
      closeRefreshIcon();
      this.handleInitChange(()=>this.refreshEnd(),true);
      this._detector.markForCheck();
    };

    this.refreshEnd=()=>{
      this.topLoading=scrollToRefresh=false;
      springBack();
      this._detector.markForCheck();
    };
    let
      firstMove:boolean,
      debounce:any,
      throttle:any,
      nextDistance:any;
    const nextCatch=()=>{
      this.bottomLoading=true;

      this.pageChange(++this.nowPage)
        .subscribe((res:any)=>{

          this.bottomLoading=false;
          if(this.config.isEnd(res))this.bottomEnd=true;
          this._detector.detectChanges();
        },()=>{
          this.bottomLoading=false;
          this.nowPage--;
          this._detector.detectChanges();
        });
      this._detector.detectChanges();
    };
    const nextRun=()=>{

      if(this.bottomLoading)return;

      nextDistance=container.scrollHeight-this.scrollTop-container.offsetHeight;

      if(nextDistance<25){

        this.zone.run(()=>{
          nextCatch()
        })
      }
    };


      //listener scroll
      const sendScroll=this.useTopSub?()=>this.scrollTopSub.next(this.scrollTop):()=>{};
      container.cmAddEventListener('scroll',()=>{

        // if(this.bottomEnd)return;
        if(!throttle){
            this.scrollTop=container.scrollTop;

            sendScroll();
            throttle=setTimeout(()=>throttle=null,100);
        }
        if(debounce){
          clearTimeout(debounce);
        }
        // nextRun();
        debounce=setTimeout(()=>{
          this.scrollTop=container.scrollTop;
          sendScroll();
          if(!this.bottomEnd)nextRun();
          debounce=null;
        },100)

      },{passive:true});


      this._hammer.verticalTouch({
        element:container,
        begin:(e:any)=>{
          firstMove=true;
          if(forbidMove||this.disabledRefresh)return;
          canBeginRefresh=container.scrollTop==0;
          // if(canBeginRefresh=container.scrollTop==0)y=e.beginY;
          restoreText();
        },

        move:(e:any)=>{
          if(this.disabledRefresh)return;
          if(firstMove&&canBeginRefresh&&e.disY<0)canBeginRefresh=false;
          firstMove=false;
          if(forbidMove||!canBeginRefresh)return;
          this.isRefreshing=true;
          perY=e.perY;
          _originY+=perY;

          if(_originY<0)_originY=0;
          if(_originY>maxTop)_originY=maxTop;
          if(_originY===originY)return;
          if(!containerDisScroll){
            containerDisScroll=true;
            container.style.overflowY='hidden';
          }
          defineContainer(originY=_originY);
          changeRefreshIcon(originY);
        },
        end:(e:any)=>{
          if(this.disabledRefresh)return;

          if(_originY==0)this.isRefreshing=false;
          if(containerDisScroll){
            container.style.overflowY='auto';
            containerDisScroll=false;
          }
          if(originY==0||forbidMove||!canBeginRefresh)return;
          if(originY>refreshTop){
            return refreshStart();
          }else{

          }
          springBack(originY);
        }
      });


    //initEvent
    const forbidScroll=()=>{
      forbidMove=true;
      container.style.overflowY='hidden';
    }
    let time:number=0;
    this.forceRefresh=this.handleInitChange=(cb?:Function,isRefresh?:boolean)=>{
        this.reset.emit();
      this.zone.run(()=>{
        this.bottomEnd=this.isError=this.isEmpty=this.bottomEnd=false;
        this.nowPage=1;
        if(!isRefresh)this.initLoad=true;

        forbidMove=true;
        container.scrollTop=0;
        container.style.overflowY='hidden';
        this._detector.markForCheck();
        this.pageChange(1).subscribe((res:any)=>{
          this.initLoad=false;

          if(this.config.isEmpty(res)){
            this.isEmpty=true;
            //forbidScroll();
          }else{
            forbidMove=false;
            container.style.overflowY='auto';

            if(this.config.isEnd(res))this.bottomEnd=true;
          }
          cb&&cb();
          this._detector.detectChanges();
        },()=>{

          this.initLoad=false;
          this.isError=true;
          forbidScroll();
          cb&&cb();
          this._detector.detectChanges();
        })
      })
    };
   if(!this.bindList||!this.bindList.length)this.handleInitChange();
  }
  initLoad:boolean;
  isEmpty:boolean;
  isError:boolean;
  forceRefresh=()=>{};
  handleInitChange=(cb?:any,isRefresh?:boolean)=>{};
}
