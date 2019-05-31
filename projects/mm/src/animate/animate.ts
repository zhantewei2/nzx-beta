import {
  trigger,
  transition,
  style,
  state,
  animate,
  query,
  stagger,
  group,
    keyframes
} from '@angular/animations';

// import {mainColor} from '../config/config';
const time='0.3s ease';
const time2='0.2s ease-out';
const time3='.3s cubic-bezier(0.645, 0.045, 0.355, 1)';
const timeQuick='.2s cubic-bezier(0.645, 0.045, 0.355, 1)';
export const toast=trigger('Toast',[
    state('show',style({display:'',opacity:1})),
    state('hidden',style({display:'none',opacity:0})),
    transition('show=>hidden',animate('0.2s ease')),
    transition('hidden=>show',animate('0.2s ease'))

  //safari不兼容
     // transition('hidden=>show',[
     //    query(':self',[style({opacity:0}),animate(time3,style({opacity:1}))]),
     //   //  query('.cm-modalToast',style({opacity:0,transform:'scale(.8,.8)'})),
     //   //  query('.cm-toast-status',style({transform:'translateX(-100%)'})),
     //   //  query('.cm-toast-content',style({transform:'translateX(100%)'})),
     //   //  query(':self',[
     //   //    animate('.2s ease',style({opacity:1}))
     //   //  ]),
     //   // group([
     //   //   query('.cm-modalToast',animate(time2)),
     //   //   query('.cm-toast-status',animate(time2)),
     //   //   query('.cm-toast-content',animate(time2)),
     //   // ])
     // ])
]);

export const fade=trigger('Fade',[
  transition(':leave',animate(time,style({opacity:0}))),
  transition(':enter',[style({opacity:0}),animate(time)])
]);
export const scrollP=trigger('ScrollP',[
  transition('void=>*',[style({transform:'translateX(-10%)',opacity:0}),animate(time)]),
  transition('*=>void',animate(time,style({transform:'translateX(10%)',opacity:0})))
]);

export const modal=trigger('Modal',[
  transition(':leave',[
    query(':self',style({opacity:1})),
    group([
      query(':self',animate(time2,style({opacity:0}))),
      query('.cm-modal-container',animate(time3,style({transform:'translate3d(0,30%,0)'})))

    ])
  ]),
  transition(':enter', [style({opacity:0}),animate(time3)])
]);
export const modal2=trigger('Modal2',[
    state('hidden',style({display:'none'})),
   state('show',style({display:''})),
   transition('hidden=>show',[
      style({opacity:0}),animate(timeQuick)
      //  query(':self',style({opacity:0})),
      //  group([
      //      query(':self',animate(timeQuick,style({opacity:1}))),
      //      query('.modal2',[
      //          style({transform:'scale3d(.8,.8,.8) translateY(30%)'}),
      //          animate(timeQuick,
      //           style({transform:'scale3d(1,1,1) translateY(0)'})
      //          )
      //      ])
      //  ])
   ]),
    transition('show=>hidden',[
        query(':self',style({opacity:1})),
        group([
            query(':self',animate(timeQuick,style({opacity:0}))),
            query('.modal2',animate(timeQuick,style({transform:'scale3d(.8,.8,.8) translateY(30%)'})))
        ])
    ])
]);
export const closePop=trigger('ClosePop',[
  state('hid',style({display:'none'})),
  state('show',style({display:''})),
  transition('hid=>show',[style({opacity:0,transform:'scale(.6,.6)'}),animate(time3)]),
  transition('show=>hid',animate(time3,style({opacity:0,transform:'scale(.6,.6)'})))
])
export const pop=trigger('Pop',[
  transition(':enter',[style({opacity:0,transform:'translateY(-50%)'}),animate(time)]),
  transition(':leave',animate(time3,style({opacity:0,transform:'translateY(-20%)'})))
])
export const filtrateContent=trigger('FiltrateContent',[
  state('hid',style({display:'none'})),
  state('show',style({display:'block'})),
  transition('hid=>show',[style({transform:'translateY(-50%)',opacity:0}),animate(time3)]),
  transition('show=>hid',animate(time3,style({opacity:0,transform:'translateY(-50%)'})))
])
export const fade2=trigger('Fade2',[
  state('hid',style({display:'none'})),
  state('show',style({display:''})),
  transition('hid=>show',[style({opacity:0}),animate(time3)]),
  transition('show=>hid',animate(time3,style({opacity:0})))
])
export const page=trigger('Page',[
  transition('void=>enter',[style({opacity:0,transform:'translate3d(100%,0,0)'}),animate('1s')]),
  transition('back=>void',animate(time,style({opacity:0,transform:'translate3d(50%,0,0)'}))),
  transition(':leave',[style({transform:'translateY(50%)'}), animate('.5s')])
]);

export const slideDown=trigger('SlideDown',[
  transition(':enter',[style({opacity:0,transform:'translate3d(0,50px,0) scale(.5,.5)'}),animate(time)]),
  transition(':leave',animate(time,style({opacity:0,transform:'translate3d(0,50px,0) scale(.9,.9)'})))
]);

export const translateDown=trigger('TranslateDown',[
  transition(':enter',[style({opacity:0,transform:'translate3d(0,-100%,0)'}),animate(time3)]),
  transition(':leave',animate(time3,style({opacity:0,transform:'translate3d(0,-100%,0)'})))
]);
export const shrink=trigger('Shrink',[
    transition(':enter',[style({opacity:0,transform:'scale3d(.5,.5,.5)'}),animate(time3)]),
    transition(':leave',animate(time3,style({opacity:0,transform:'scale3d(.5,.5,.5)'})))
]);
export const translateDown2=trigger('TranslateDown2',[
  state('hid',style({display:'none'})),
  state('show',style({display:''})),
  transition('hid=>show',[style({height:0}),animate(time3,style({height:'*'}))]),
  transition('show=>hid',animate(time3,style({height:'0'})))
]);
export const sheet=trigger('Sheet',[
  state('hid',style({display:'none'})),
  state('show',style({display:'block'})),
  transition('hid=>show',[style({transform:'translate3d(0,100%,0) scale(.9,.9)'}),animate(timeQuick)]),
  transition('show=>hid',animate(timeQuick,style({transform:'translate3d(0,100%,0)'})))
]);
export const snack=trigger('Snack',[
  state('hid',style({display:'none'})),
  state('show',style({display:''})),
  transition('hid=>show',[style({transform:'translate3d(0,-100%,0)'}),animate(time3)]),
  transition('show=>hid',animate(time3,style({transform:'translate3d(0,-100%,0)'})))
])

export const listEnter=trigger('ListEnter',[
  transition ('*=>*',[
    query('.ztwItem:enter',[
      style({transform:'scale(.8,.8)',opacity:0}),
      stagger(100,[
        animate('.3s ease-out',style({transform:'scale(1,1)',opacity:1}))
      ])
    ],{optional:true})
  ])
]);
export const page2=trigger('Page2',[
  // transition('void=>enter',[
  //   style({'z-index':1,transform:'translate3d(10%,0,0)'}),
  //   animate('.2s ease-out',style({'z-index':1,transform:'translate3d(0,0,0)'}))
  // ]),
  transition(':leave',[
    style({'z-index':1}),
    animate('.3s',style({'z-index':1}))
  ]),
  // transition('stayOut=>void',[
  //   animate('.3s ease-out',style({transform:'translate3d(-50%,0,0)'}))
  // ]),
  transition('void=>stayIn',[
    style({transform:'translate3d(-50,0,0)'}),
    animate('.3s ease-out')
  ])
])