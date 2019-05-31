import { Component,ViewContainerRef,ViewChild,OnInit,TemplateRef,Input,ChangeDetectorRef,ChangeDetectionStrategy} from '@angular/core';
import {modal} from '../../animate/animate';
import {ToolService} from '../../service/tool.service';


export interface ModalConfig{
  title?:string;
  content:string|TemplateRef<any>;
  onsuccess?:Function;
  oncancel?:Function;
  successLabel?:string;
  cancelLabel?:string;
}


@Component({
  selector: 'cm-modal',
  template:`
  <div (click)="close()" [@Modal] *ngIf="show" class="cm-modalBg center">
      
      <div (click)="$event.stopPropagation()" class="cm-modal-container cm-an_modal">
       
        <header *ngIf="titleStr" class="cm-modal-header align-center font-b">
          {{titleStr}}
        </header>
        <article class="cm-modal-content cm-modal-content-str">
          <span #container></span>
          {{contentStr}}
          <ng-content></ng-content>
        </article>
        <footer *ngIf="!noneFooter" class="cm-modal-footer cm-fine-top flex">
            <div (click)="cancel()" *ngIf="!isAlert" class="flex-1  align-center" cm-ripple size="md">
              <span class=" cm-modal-footer-btn">
              {{cancelLabel}}
              </span>
            </div>
            <div class="cm-v-line"></div>
            <div (click)="success()" class="flex-1  align-center" cm-ripple size="md">
              <span class="color-p cm-modal-footer-btn">
                {{successLabel}}
              </span>
            </div>
            <!--<cm-pure-btn  (click)="cancel()" *ngIf="!isAlert">{{cancelLabel}}</cm-pure-btn>-->
            <!--<cm-pure-btn (click)="success()" >{{successLabel}}</cm-pure-btn>      -->
        </footer>
      </div>
  </div>
  
  `,
  animations:[modal],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CmModalComponent{
  @Input()noneFooter:boolean=false;
  @Input()visible:boolean=false;
  @ViewChild('container',{read:ViewContainerRef})container:ViewContainerRef;
  show:boolean=false;
  isAlert:boolean;
  successLabel:any;
  cancelLabel:any;
  contentStr:string;
  titleStr:string;
  sub:any;
  constructor(
    private _cdr:ChangeDetectorRef,
    private _tool:ToolService
  ){

    this.sub=_tool.routerChange.subscribe(()=>{
      if(this.show)this.close();
    })
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  close(){
    this._cdr.markForCheck();
    this.show=false;
  }
  cancel(){
    this.cancelFn&&this.cancelFn();
    this.show=false;
  }
  success(){
    this.successFn&&this.successFn();
    this.show=false;
  }
  cancelFn:Function;
  successFn:Function;
  open(config:ModalConfig){
    if(!config)return;

    const focusBtn:any=document.querySelector(':focus');
    focusBtn&&focusBtn.blur();
    this.show=true;
    this._cdr.markForCheck();
    setTimeout(()=>{
      this.isAlert=!config.oncancel&&!config.onsuccess;
      this.titleStr=config.title;
      this.cancelFn=config.oncancel;
      this.successFn=config.onsuccess;
      this.successLabel=config.successLabel||'确定';
      this.cancelLabel=config.cancelLabel||'取消';
      const content=config.content;
      this._cdr.markForCheck();
      if(content instanceof TemplateRef){
        this.contentStr=null;
        this.container.createEmbeddedView(content);
      }else{
        this.container.clear();
        this.contentStr=content;
      }
    })
  }

}
