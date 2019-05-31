import { Component, OnInit,Input,ViewChild} from '@angular/core';

@Component({
  selector: 'cm2-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  @ViewChild('sheet')sheet:any;
  @ViewChild('tp')tp;
  open(msg:any){
      this.sheet.open(this.tp);
  }
  constructor() { }
    shareList=[
        {
            name:'微信',
            img:'assets/image/weixin.png',
        },

        {
            name:'朋友圈',
            img:'assets/image/pengy.png'
        },
        {
            name:'qq',
            img:'assets/image/qq.png'
        },
        {
            name:'微博',
            img:'assets/image/weibo.png'
        },
    ];
  ngOnInit() {
  }

}
