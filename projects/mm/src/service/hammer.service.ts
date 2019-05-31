import { Injectable } from '@angular/core';
import {touch,horizontalTouch,verticalTouch} from '../util/hammer';
import {Transform,TransformAnimation} from '../util/transition';

@Injectable()
export class HammerService {
  constructor() { }
  touch:any=touch;
  horizontalTouch:any=horizontalTouch;
  verticalTouch:any=verticalTouch;
  Transform:any=Transform;
  TransformAnimation:any=TransformAnimation;
}
