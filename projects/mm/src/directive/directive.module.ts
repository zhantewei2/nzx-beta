import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AvatarHeaderDirective} from './avatar-header.directive';
import {Cm2DragDirective} from './cm2-drag.directive';
import {CmBadgeDirective} from './cm-badge.directive';
import {CmBottomBarItemDirective} from './cm-bottom-bar-item.directive';
import {EllipsisDirective} from './ellipsis.directive';
import {CmListDirective,CmNavListDirective} from './high.directive';
import {InnerTpDirective} from './inner-tp.directive';
import {IosInertanceDirective} from './ios-inertance.directive';
import {RippleDirective} from './ripple.directive';

@NgModule({
  imports:[CommonModule],
  declarations:[
    AvatarHeaderDirective,
    Cm2DragDirective,
    CmBottomBarItemDirective,
    CmBadgeDirective,
    EllipsisDirective,
    CmListDirective,
    InnerTpDirective,
    IosInertanceDirective,
    RippleDirective,
    CmNavListDirective

  ],
  exports:[
    AvatarHeaderDirective,
    Cm2DragDirective,
    CmBottomBarItemDirective,
    CmBadgeDirective,
    EllipsisDirective,
    CmListDirective,
    InnerTpDirective,
    IosInertanceDirective,
    RippleDirective,
    CmNavListDirective

  ]
})
export class DirectiveModule{

}