import {ChangeDetectionStrategy, Component, OnInit,Input} from '@angular/core';

@Component({
  selector: 'ztw-load2',
  template:`    
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-eclipse"><path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" [attr.fill]="color" transform="rotate(59.0328 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path></svg>
  `,
  styleUrls:['./ztw-load2.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ZtwLoad2Component implements OnInit {
  @Input()color:any='#ffffff';
  constructor() {

  }

  ngOnInit() {
  }

}
