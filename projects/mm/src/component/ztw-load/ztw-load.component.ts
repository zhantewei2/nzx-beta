import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'ztw-load',
  template:`
<svg class="lds-dash-ring" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><g transform="rotate(59.1192 50 50)">
  <animateTransform attributeName="transform" type="rotate" values="0 50 50;120 50 50" keyTimes="0;1" dur="0.5s" repeatCount="indefinite"></animateTransform><circle cx="50" cy="50" r="40" stroke="#fdfdfd" fill="none" stroke-dasharray="41.88790204786391 251.32741228718345" stroke-linecap="round" stroke-width="5" transform="rotate(0 50 50)">
  <animate attributeName="stroke" values="#fdfdfd;#85a2b6" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
</circle><circle cx="50" cy="50" r="40" stroke="#85a2b6" fill="none" stroke-dasharray="41.88790204786391 251.32741228718345" stroke-linecap="round" stroke-width="5" transform="rotate(120 50 50)">
  <animate attributeName="stroke" values="#85a2b6;#bbcedd" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
</circle><circle cx="50" cy="50" r="40" stroke="#bbcedd" fill="none" stroke-dasharray="41.88790204786391 251.32741228718345" stroke-linecap="round" stroke-width="5" transform="rotate(240 50 50)">
  <animate attributeName="stroke" values="#bbcedd;#fdfdfd" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
</circle></g></svg>
`,
  host:{
    class:'d-inline'
  },
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ZtwLoadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
