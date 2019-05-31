import { Directive ,ViewContainerRef,TemplateRef,Input} from '@angular/core';

@Directive({
  selector: '[cm-innerTp]'
})
export class InnerTpDirective {

  constructor(
    private _vcr:ViewContainerRef,

  ) { }
  @Input()deps:any;
  @Input('cm-innerTp')set tp(val:TemplateRef<any>){
    try {
      const viewRef: any = this._vcr.createEmbeddedView(val);
      viewRef.context.$implicit = this.deps;
    }catch(e){
      console.log(e);
    }
  }
}
