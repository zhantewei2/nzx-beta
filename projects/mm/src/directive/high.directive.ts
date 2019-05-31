import { Directive ,Input} from '@angular/core';

@Directive({
  selector: '[cmList]',
  host:{
    class:'cm-list-item',
  }
})
export class CmListDirective {
}
@Directive({
  selector:'[cmNavList]',
  host:{
    class:'cm-nav-list-item'
  }
})
export class CmNavListDirective{
}
