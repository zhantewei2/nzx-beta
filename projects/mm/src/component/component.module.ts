import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {
  CmBtnDirective,
  CmbtnComponent,
  CmPureBtnComponent,
  CmOutlineComponent,
  CmBorderComponent
} from './cmBtn/cmbtn.component';

import {Cm2InputComponent} from './cm2-input/cm2-input.component';

import {CmSearchInputComponent} from './cm-search-input/cm-search-input.component';
import {BlockLoadComponent} from './block-load/block-load.component';
import {CmActiveSheetComponent} from './cm-active-sheet/cm-active-sheet.component';
import {CmAvatarComponent} from './cm-avatar/cm-avatar.component';
import {CmBottomSheetComponent} from './cm-bottom-sheet/cm-bottom-sheet.component';
import {CmDatePickerComponent} from './cm-date-picker/cm-date-picker.component';
import {CmEmpty2Component} from './cm-empty2/cm-empty2.component';
import {CmErr2Component} from './cm-err2/cm-err2.component';
import {CmImageComponent} from './cm-image/cm-image.component';
import {CmLineContentComponent} from './cm-line-content/cm-line-content.component';
import {CmLineComponent} from './cm-line/cm-line.component';
import {CmModalComponent} from './cm-modal/cm-modal.component';
import {CmPickerComponent} from './cm-picker/cm-picker.component';
import {CmScrollContainerDirective,CmScrollControlDirective} from './cm-scroll/cm-scroll.component';
import {CmSearchSortComponent,CmSearchSortItemDirective} from './cm-search-sort/cm-search-sort.component';
import {CmSideRightComponent} from './cm-side-right/cm-side-right.component';
import {CmSnackComponent} from './cm-snack/cm-snack.component';
import {Cm2TurnComponent,Cm2TurnItemDirective} from './cm2-turn/cm2-turn.component';
import {TurnPageComponent,TurnPageItemDirective} from './turn-page/turn-page.component';
import {ZtwLoadComponent} from './ztw-load/ztw-load.component';
import {ZtwLoad2Component} from './ztw-load2/ztw-load2.component';
import {CmTabBarBtnComponent,CmTabComponent,CmTabGroup} from './cm-tab/cm-tab.component';

import {
  CmCheckComponent,
  CmRadioComponent,
  CmSliderComponent,
} from './form/form.component';

import {InputToggleComponent} from './input-toggle/input-toggle.component';
import {Pagination2Component} from './pagination2/pagination2.component';
import {ShareComponent} from './share/share.component';
import {ToastComponent} from './toast/toast.component';
import {StepComponent,StepItemComponent} from './step/step.component';
import {MessageComponent} from './message/message.component';

import {DirectiveModule} from '../directive/directive.module';

@NgModule({
  declarations:[
    CmSearchSortItemDirective,
    Cm2TurnItemDirective,
    CmTabBarBtnComponent,
    CmTabComponent,
    CmTabGroup,
    CmCheckComponent,
    CmRadioComponent,
    CmSliderComponent,
    InputToggleComponent,
    Pagination2Component,
    ShareComponent,
    ToastComponent,
    StepComponent,
    StepItemComponent,
    MessageComponent,
    CmBtnDirective,
    CmbtnComponent,
    CmPureBtnComponent,
    CmOutlineComponent,
    CmBorderComponent,
    Cm2InputComponent,
    CmSearchInputComponent,

    BlockLoadComponent,
    CmActiveSheetComponent,
    CmAvatarComponent,
    CmBottomSheetComponent,
    CmDatePickerComponent,
    CmEmpty2Component,
    CmErr2Component,
    CmImageComponent,
    CmLineContentComponent,
    CmLineComponent,
    CmModalComponent,
    CmPickerComponent,
    CmScrollContainerDirective,
    CmScrollControlDirective,
    CmSearchSortComponent,
    CmSideRightComponent,
    CmSnackComponent,
    Cm2TurnComponent,
    TurnPageComponent,
    TurnPageItemDirective,
    ZtwLoadComponent,
    ZtwLoad2Component
  ],
  imports:[
    RouterModule,
    CommonModule,
    FormsModule,
    DirectiveModule
  ],
  exports:[
    CmSearchSortItemDirective,
    Cm2TurnItemDirective,
    CmTabBarBtnComponent,
    CmTabComponent,
    CmTabGroup,
    CmCheckComponent,
    CmRadioComponent,
    CmSliderComponent,
    InputToggleComponent,
    Pagination2Component,
    ShareComponent,
    ToastComponent,
    StepComponent,
    StepItemComponent,
    MessageComponent,
    CmBtnDirective,
    CmbtnComponent,
    CmPureBtnComponent,
    CmOutlineComponent,
    CmBorderComponent,
    Cm2InputComponent,
    CmSearchInputComponent,

    BlockLoadComponent,
    CmActiveSheetComponent,
    CmAvatarComponent,
    CmBottomSheetComponent,
    CmDatePickerComponent,
    CmEmpty2Component,
    CmErr2Component,
    CmImageComponent,
    CmLineContentComponent,
    CmLineComponent,
    CmModalComponent,
    CmPickerComponent,
    CmScrollContainerDirective,
    CmScrollControlDirective,
    CmSearchSortComponent,
    CmSideRightComponent,
    CmSnackComponent,
    Cm2TurnComponent,
    TurnPageComponent,
    TurnPageItemDirective,
    ZtwLoadComponent,
    ZtwLoad2Component
  ]
})
export class ComponentModule{

}

