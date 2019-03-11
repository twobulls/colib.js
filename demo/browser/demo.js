import { globalScheduler, repeatForever, waitForSeconds, changeToColor, Ref, ColorLerpMode } from './colib.min.js';

const box = document.getElementById('box');
//box.style.color = '#FF0000';

console.log(box.style.color);
const ref = new Ref(
  () => box.style.getPropertyValue('background-color'),
  val => {
    box.style.setProperty('background-color', val);
  }
);

globalScheduler().add(
  repeatForever(
    () => console.log('Howdy'),
    waitForSeconds(3),
    changeToColor(ref, '#00FF00', 1, ColorLerpMode.HSV),
    waitForSeconds(0.5),
    changeToColor(ref, '#0000FF', 1, ColorLerpMode.HSV),
    waitForSeconds(0.5),
    changeToColor(ref, '#FF0000', 1, ColorLerpMode.HSV)
  )
);
