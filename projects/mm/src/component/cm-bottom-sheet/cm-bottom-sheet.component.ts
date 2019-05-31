import { Output,EventEmitter,Component,ViewContainerRef,OnInit,TemplateRef,ViewChild,Input} from '@angular/core';
import {Router,NavigationStart} from '@angular/router';

@Component({
  selector: 'cm-bottom-sheet',
  template:`
<div [ngClass]="[closing?'bottom-closing':'',show?'bottom-show':'cm-hidden']" 
  (animationend)="end()"
  #container 
  class="cm-bottom-sheet-bg"
  (click)="close()"
>
  <div (click)="stop($event)" class="cm-bottom-sheet-content parent" [style.bottom.px]="bottomH">
     <div class=" between" *ngIf="useConfirm">
        <cm-pure-btn (click)="close()">取消</cm-pure-btn>
        <cm-pure-btn (click)="submit()">确定</cm-pure-btn>
     </div>
    <i (click)="close()" *ngIf="useClose" class="fa fa-close-border fa-lg close"></i>
    
     <div [class.p-2]="useConfirm">
      <span #content></span>
     </div>
   </div>
</div>  
  `,
})
export class CmBottomSheetComponent implements OnInit {
  @ViewChild('container')container:any;
  @ViewChild('content',{read:ViewContainerRef})content:ViewContainerRef;
  @Input()useClose:boolean;
  @Input()useConfirm:boolean;
  @Input()set bottomHeight(val:number){
    this.bottomH=val;
  };
  bottomH:number=0;
  @Output()sure:EventEmitter<any>=new EventEmitter<any>();
  @Output()shut:EventEmitter<any>=new EventEmitter<any>();

  sub:any;
  constructor(
    private router:Router
  ) {
    this.sub=router.events.subscribe((e:any)=>{
      if(e instanceof NavigationStart&&this.isOpen){
        try{
          this.body.removeChild(this.containerNode);
          this.close();
        }catch(e){

        }
      }
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  containerNode:any;
  isOpen:boolean;
  show:boolean;
  body:any;
  preTp:TemplateRef<any>;
  stop(e:any){
    e.stopPropagation();
  }
  ngOnInit(){
    this.body=document.querySelector('body');
    this.containerNode=this.container.nativeElement;

  }
  open(tp:TemplateRef<any>){
    if(this.isOpen||!tp)return;
    this.show=true;
    if(tp!==this.preTp){
      if(this.preTp)this.content.clear();
      this.content.createEmbeddedView(this.preTp=tp);
    }
    this.isOpen=true;
    this.body.appendChild(this.containerNode);
    this.body.classList.add('bodyFix');

    // document.body.addEventListener('touchmove',(e)=>{
    //   e.preventDefault();
    // },{passive:false});

  }
  closing:boolean=false;
  close(){

    this.closing=true;
    this.isOpen=false;
    this.body.classList.remove('bodyFix');
    this.shut.emit('');
  }
  end(){
    if(!this.isOpen&&this.closing){
      this.closing=false;
      this.show=false;
      this.body.removeChild(this.containerNode);
    }
  }
  submit(){
    this.close();
    this.sure.emit('');
  }

}
