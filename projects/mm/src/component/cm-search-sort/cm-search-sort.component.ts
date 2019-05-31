import { HostBinding,Component,HostListener,Output,EventEmitter,OnInit,Input,ViewChild,ContentChildren } from '@angular/core';
import {translateDown2,fade2} from '../../animate/animate';
@Component({
  selector: 'cm-search-sort',
  template:`
<button #btn (document:click)="doc($event)" (click)="toggle()" class="cm-sort-btn">
  <label class="ellipsis2">{{_selectLabel||default}}</label>
  <i class="fa fa-done">arrow_drop_down</i>
</button>
<span #content>
  <div #wrapper class="cm-sort-wrapper" [@Fade2]="isOpen?'show':'hid'">
    <div #wrapperContent class="cm-sort-wrapper-content an_node cm-an_topDown" [class.cm-top-toggle]="!isOpen">
      <ng-content></ng-content>
    </div>
  </div>
</span>
  `,
  animations:[translateDown2,fade2]
})
export class CmSearchSortComponent implements OnInit {
  @ViewChild('btn')btn:any;
  @ViewChild('content')content:any;
  @ViewChild('wrapper')wrapper:any;
  @ViewChild('wrapperContent')wrapperContent:any;
  @Input()for:HTMLElement;
  @Input()default:any;
  activeKey:any;
  _select:any;
  _selectLabel:any;
  @Input('cmSelect')set select(val:any){
    this._select=val;
  };
  @Output('cmSelectChange')selectChange:EventEmitter<any>=new EventEmitter<any>();
  constructor(){ }
  isOpen:boolean;
  insertCompleted:boolean;
  doc(e:any){
    if(this.wrapperContent.nativeElement.contains(e.target)||this.btn.nativeElement.contains(e.target)){

    }else{
      this.close();
    }
  }
  open(){
    if(!this.insertCompleted){
      if(this.for){
        const node=this.wrapper.nativeElement;
        const h:number=window.innerHeight||document.documentElement.clientHeight;
        const forBottom:number=this.for.getBoundingClientRect().bottom;
        node.style.height=h-forBottom+'px';

        this.for.appendChild(this.content.nativeElement);

      }
      this.insertCompleted=true;
    }
    this.isOpen=true;
  }
  close(){
    if(this.isOpen)this.isOpen=false;
  }
  toggle(){
    this.isOpen?this.close():this.open();
  }

  ngOnInit() {}
  setKey(key:any){
    this.selectChange.emit(key);
  }
  //setValue=(value:string)=>this._selectLabel=value;
}
@Component({
  selector:'cm-search-sort-item',
  template:`
<span #content>
  <ng-content></ng-content>
</span>
<i class="fa fa-done"></i>

  `,
  host:{
    '[class]':"'cm-search-sort-item '+(isActive?'active':'')"
  }
})
export class CmSearchSortItemDirective{
  @Input()key;
  @ViewChild('content')content:any;
  get isActive(){
    const active:boolean=this.parent._select==this.key;
    if(active)this.parent._selectLabel=this.content.nativeElement.innerHTML;
    return active;
  }
  @HostListener('click')click(){
    this.parent.setKey(this.key);
    this.parent.close();
  }
  ngOnInit(){}
  constructor(public parent:CmSearchSortComponent){}
}
