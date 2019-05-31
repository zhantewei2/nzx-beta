import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServiceModule} from './service/service.module';
import {ComponentModule} from './component/component.module';

@NgModule({
  declarations:[

  ],
  imports:[
    ServiceModule,
    CommonModule,
    ComponentModule
  ],
  providers:[],
  exports:[
    ComponentModule
  ]
})
export class NzxModule{

}