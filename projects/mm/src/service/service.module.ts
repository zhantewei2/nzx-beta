import {NgModule} from '@angular/core';
import {HammerService} from './hammer.service';
import {RouterService} from './router.service';
import {ToolService} from './tool.service'
@NgModule({
  providers:[
    HammerService,
    ToolService,
    RouterService
  ]
})
export class ServiceModule{

}