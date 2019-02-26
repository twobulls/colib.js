import * as commands from './core/commands';

export * from 'core';
const square = document.getElementById('square');
const co: commands.Command = () => {
  return {
    deltaTime: 3,
    complete: true
  };
};
const animateOut = () => {
  if (square) {
    square.style.backgroundColor = 'red';
  }
};
setTimeout(() => {
  animateOut();
}, 3000);
