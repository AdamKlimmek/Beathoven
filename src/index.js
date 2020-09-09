import './styles/index.css'

import * as Tone from 'tone';

window.addEventListener('DOMContentLoaded', () => {
  
    const sounds = [];
    for (let i = 0; i < 8; i++) {
        let sound = new Tone.Player(`../dist/samples/sample_0${i + 1}.wav`).toDestination();
        sounds.push(sound);
    }

    const buttons = Array.from(document.getElementsByClassName('samples-column-button'));

    buttons.forEach((button, i) => {
        button.addEventListener('click', () => {
            sounds[i].start();
        })
    })
});
