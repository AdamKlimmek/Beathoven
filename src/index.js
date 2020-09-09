import './styles/index.css'

import * as Tone from 'tone';

window.addEventListener('DOMContentLoaded', () => {
  
    const synths = [
        new Tone.Synth(),
        new Tone.Synth(),
        new Tone.Synth(),
        new Tone.Synth(),
        new Tone.Synth(),
        new Tone.Synth(),
        new Tone.Synth(),
        new Tone.Synth()
    ];
    synths.forEach(synth => synth.toDestination());
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']


    const sounds = [];
    for (let i = 0; i < 8; i++) {
        let sound = new Tone.Player(`../dist/samples/sample_0${i + 1}.wav`).toDestination();
        sounds.push(sound);
    }

    const rows = Array.from(document.getElementsByClassName('sequencer-row'));

    const sampleButtons = Array.from(document.getElementsByClassName('samples-column-button'));
    sampleButtons.forEach((button, i) => {
        button.addEventListener('click', () => {
            sounds[i].start();
        })
    })

    const startButton = document.body.querySelector('.start-button');
    startButton.addEventListener('click', () => {
        Tone.Transport.start();
    })

    let col = 0

    const stopButton = document.body.querySelector('.stop-button');
    stopButton.addEventListener('click', () => {
        Tone.Transport.stop();
        col = 0;
    })

    const resetButton = document.body.querySelector('.reset-button');
    resetButton.addEventListener('click', () => {
        Tone.Transport.stop();
        col = 0;

        let checkBoxes = Array.from(document.getElementsByClassName('sequencer-row-checkbox'));
        checkBoxes.forEach(checkbox => {
            checkbox.checked = false
        })
    })

    Tone.Transport.scheduleRepeat(runSequence, "16n")

    Tone.Transport.bpm.value = 80
    // beats on 1, 5, 9, 13
    // 4 beats per 16 columns

    function runSequence(time) {
        // console.log('col: ', col);
       
        for (let row = 0; row < rows.length; row++) {
            // console.log('row: ', row);
            // let currentSynth = synths[row];
            let currentSound = sounds[row];
            let currentRow = rows[row];
            let currentPad = currentRow.querySelector(`label:nth-child(${col + 1})`)
            // console.log('currentPad: ', currentPad);
            let currentCheckBox = currentPad.querySelector('input')
            
            if (currentCheckBox.checked) currentSound.start(time);
        
        }

        (col === 15) ? (col = 0) : col++;
    }
});
