import { Component, OnInit,Input,ViewChild,ViewContainerRef,TemplateRef} from '@angular/core';

@Component({
  selector:'cm-step-item',
  template:`

<span class="cm-step-badge" [class.isEnd]="isEnd">
  <span class="cm-step-text">
  </span>
  <span class="cm-step-line"></span>
</span>
<div class="flex-1">
  <div class="cm-step-title">
    <div #titleView></div>
  </div>
  
  
  <article class="cm-step-content"> 
    <span #contentView></span>
  </article>
</div>


  `,
  host:{
    class:'cm-step-item'
  }
})
export class StepItemComponent{

  @ViewChild('contentView',{read:ViewContainerRef})contentChild:ViewContainerRef;
  @ViewChild('titleView',{read:ViewContainerRef})titleChild:ViewContainerRef;
  @Input()isEnd:boolean;
  @Input()deps:any;
  @Input()index:number;
  @Input()set content(val:any){
    this.setValue(val,'contentChild');
  }
  @Input()set title(val:any){
    this.setValue(val,'titleChild');
  }
  setValue(val:any,attr:any){
    if(val instanceof TemplateRef){
      const viewRef:any=this[attr].createEmbeddedView(val);
      viewRef.context.$implicit=this.deps;

    }else{
      this[attr].element.nativeElement.innerHTML=val;
    }
  }
}

@Component({
  selector: 'cm-step',
  template:`
<cm-step-item [isEnd]="index==list.length-1" [content]="contentTp" [title]="titleTp" [deps]="i" [index]="index" *ngFor="let i of list;index as index">

</cm-step-item>
  `,

  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit {
  @Input()titleTp:TemplateRef<any>;
  @Input()contentTp:TemplateRef<any>;
  @Input()list:Array<any>;
  constructor(){}
  ngOnInit() {
  }

}
