import './styles/index.css'

import * as Tone from 'tone';

window.addEventListener('DOMContentLoaded', () => {

    function generateSequencer() {
        let sequencerSamplesColumn = document.getElementsByClassName('sequencer-samples-column')[0];
        for (let i = 1; i <= 8; i++) {
            let button = document.createElement('button');
            button.innerHTML = "BUTTON";
            button.className = `samples-column-button ${i}`;
            sequencerSamplesColumn.appendChild(button)
        }

        let sequencerRows = document.getElementsByClassName('sequencer-rows')[0];
        for (let i = 1; i <= 8; i++) {
            let row = document.createElement('div');
            row.classList.add('sequencer-row');

            for (let j = 1; j<= 16; j++) {
                let label = document.createElement('label');
        
                let input = document.createElement('input');
                input.type = "checkbox"
                input.classList.add('sequencer-row-checkbox')
        
                let span = document.createElement('span');
                span.classList.add('sequencer-row-pad')

                label.appendChild(input);
                label.appendChild(span);
                row.appendChild(label);
            }

            sequencerRows.appendChild(row)
        }

        let sequencerBeatCount = document.getElementsByClassName('sequencer-beat-count')[0];
        for (let i = 1; i <= 16; i++) {
            let div = document.createElement('div');
            div.innerHTML = `${i}`;
            div.classList.add('beat-count-number')
            sequencerBeatCount.appendChild(div)
        }
    }

    generateSequencer()

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

    let playing = false;
    let col = 0

    const playButton = document.body.querySelector('.play-button');
    playButton.addEventListener('click', () => {
        if (!playing) {
            Tone.Transport.start();
            playing = true;
        } else {
            Tone.Transport.stop();
            col = 0;
            playing = false;
        }
    })

    

    Tone.Transport.bpm.value = 120;
    const bpmInput = document.body.querySelector('.bpm-input');
    bpmInput.addEventListener('change', (e) => {
        e.preventDefault();
        Tone.Transport.bpm.value = e.currentTarget.value;
    })

    const resetButton = document.body.querySelector('.reset-button');
    resetButton.addEventListener('click', () => {
        Tone.Transport.stop();
        col = 0;
        playing = false;

        let checkBoxes = Array.from(document.getElementsByClassName('sequencer-row-checkbox'));
        checkBoxes.forEach(checkbox => {
            checkbox.checked = false
        })
    })

    Tone.Transport.scheduleRepeat(runSequence, "16n")

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
