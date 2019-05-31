import {ChangeDetectionStrategy,Input,Component,OnInit,ElementRef,ChangeDetectorRef,HostListener} from '@angular/core';
import {fade2,sheet} from '../../animate/animate';
import {ToolService} from '../../service/tool.service';

export interface ActiveSheetItem{
  iconFa?:string;
  iconMd?:string;
  html?:string;
  content?:string;
  key?:string;
  disabled?:boolean;
  checked?:boolean;
  ref?:any;
  $checked?:boolean;
}

export interface OpenOpts{
  list:Array<ActiveSheetItem>;
  activeKey?:string;
  title?:string;
  filter?:any;
  confirm?:boolean;
  type?:'default'|'check'|'multipleCheck'|'select';
  success?:Function;
  theme?:'light'|'darken'
}

@Component({
  selector: 'cm-active-sheet',
  template:`
  <div class='cm-sheet-bg' [@Fade2]='showStatus'>
  </div>
  <div class='cm-sheet-content' *ngIf='isAppend' (click)='$event.stopPropagation()' [@Sheet]='showStatus' [ngClass]='[theme]'>
    <div class='cm-sheet-content-wrapper'>
      <div class='cm-fine-bottom cm-sheet-header'>
        {{titleContent}}
      </div>
      <div class='cm-sheet-body ios-scroll'>
        <div (click)='itemClick(i,index)' cm-ripple  [ngClass]="type=='default'?'align-center':'between'" class='z-list-item' *ngFor='let i of list;index as index'>
          <!--<span>-->
            <!--<i class='fa fa-{{i.iconFa}}' *ngIf='i.iconFa'></i>-->
            <!--<i class='mat-icon material-icons' *ngIf='i.iconMd'>{{i.iconMd}}</i>-->
            <!--<span [innerHTML]='i.html' *ngIf='i.html'></span>-->
          <!--</span>-->
          <span [class.color-blue]='i.$checked'>
            {{i.content}}
          </span>
          <span *ngIf='type=="select"'>
            <i class='fa fa-i-success color-blue cm-an_pop' [class.cm-hidden]='!i.$checked'></i>
            <i class='cm-sheet-placeholder' [class.cm-hidden]='i.$checked'></i>
          </span>
          <span *ngIf='type=="check"||type=="multipleCheck"'>
            <cm-check disabledTap='true' [cmSelect]='i.$checked'></cm-check>
          </span>
        </div>
      </div>
    </div>

    <div *ngIf="isConfirm||type=='multipleCheck'" class='cm-sheet-content-footer flex'>
      <div cm-ripple size='md' class='flex-1 align-center' (click)='close()'>取消</div>
      <div class='cm-fine-vertical'></div>
      <div cm-ripple size='md' class='flex-1 align-center' (click)='sure()'>确认</div>
    </div>
  </div>
    `,
  animations:[fade2,sheet],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CmActiveSheetComponent implements OnInit {

  constructor(
    private el:ElementRef,
    private _cdr:ChangeDetectorRef,
    private _tool:ToolService
  ){
    _tool.routerChange.subscribe(()=>{
      if(this.showStatus=='show')this.close()
    })
  }
  @Input()theme:'light'|'darken'='light';
  showStatus:'show'|'hid'='hid';
  @HostListener('click')click(){
    this.close();
  }
  wrapperNode:HTMLElement;
  containerNode:HTMLElement;
  titleContent:string;
  blurRef:any=new this._tool.blurContainer();
  ngOnDestroy(){
      const node=this.el.nativeElement;
      this.blurRef.remove();
      node.parentNode.removeChild(node);
  }
  ngOnInit(){
    this.containerNode=document.body;
   // this.containerNode.appendChild(this.el.nativeElement);
   
  }
  list:Array<ActiveSheetItem>;
  isAppend:boolean;
  isConfirm:boolean;
  type:'default'|'check'|'multipleCheck'|'select'='default';
  _successCallback:Function;
  _open(opts:OpenOpts){
    this.showStatus='show';
    this.list=opts.list||[];
    this.titleContent=opts.title||'';
    this._successCallback=opts.success;
    this.isConfirm=opts.confirm;
    this.handleType(opts);
    this._cdr.markForCheck();
    this.theme=opts.theme||'light';
    this.blurRef.add();
  }
  open(opts:OpenOpts){
    if(!this.isAppend){
      this.containerNode.appendChild(this.el.nativeElement);
      this.isAppend=true;
      this._cdr.markForCheck();
      setTimeout(()=>this._open(opts));
    }else{
      this._open(opts);
    }
  }
  close(){
    this._cdr.markForCheck();
    this.showStatus='hid';
    this.blurRef.remove();
    this.closeAttach&&this.closeAttach();
  }
  selectClose(){
    setTimeout(()=>this.close(),100);
  }
  handleCheckItem(){

  }
  handleType({type,list,activeKey,confirm}:any){
    type=type||'default';
    this.type=type;
    if(type=='default'){
      this.closeAttach=null;
      this.itemClick=(item,index)=>{
        this._successCallback({item,index});
        this.close();
      }
    }else if(type=='check'||type=='select'){
      let preItem:any;
      list.forEach(i=>{
        if(i.$checked=i.key===activeKey)preItem=i;
      })

      this.itemClick=(item,index)=>{
        let activeKey;
        if(item==preItem){
          
          activeKey=(preItem.$checked=!preItem.$checked)?item.key:null;
        }else{
          if(preItem)preItem.$checked=false;
          item.$checked=true;
          preItem=item;
          activeKey=item.key;
        }
        const end=()=>{
          this.selectClose();
          this._successCallback({activeKey,item,index});
        }
        if(!confirm){
          end()
          this.closeAttach=null;
        }else{
          this.sure=()=>end();
          this.closeAttach=()=>{
            preItem.$checked=false;
          }
        }
      }
    }else if(type='multipleCheck'){

    }
  }
  itemClick=(i,event)=>{}
  sure=()=>{}
  closeAttach:Function;
}
