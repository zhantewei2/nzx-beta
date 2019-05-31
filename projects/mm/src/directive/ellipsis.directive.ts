import { Directive,ElementRef,Input } from '@angular/core';

@Directive({
  selector: '[cm-ellipsis]'
})
export class EllipsisDirective {
  node:HTMLElement;
  constructor(private el:ElementRef) {
    this.node=el.nativeElement;
  }
  ngOnInit(){
  }
  @Input('cm-ellipsis')set value(val:string){
    this.node.innerText=val;
    const style=window.getComputedStyle(this.node);
    const line=Math.round(+style['height'].slice(0,-2)/+style['line-height'].slice(0,-2));
    console.log(line);
  }
  ngAfterViewInit(){
  }

}
