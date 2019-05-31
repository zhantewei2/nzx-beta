import { Directive ,HostBinding} from '@angular/core';

@Directive({
  selector: '[cm-bottomBar-item]',
  host:{
    class:'cm-bottomBar-item'
  }
})
export class CmBottomBarItemDirective {
  @HostBinding('routerLinkActive')active='active';
  constructor(

  ) {

  }

}
