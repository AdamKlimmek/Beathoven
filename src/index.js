import './styles/index.css'

import * as Tone from 'tone';

window.addEventListener('DOMContentLoaded', () => {

    function generateSequencer() {
        generateSequencerSampleButtons();
        generateSequencerRows();
        generateSequencerBeatCountDisplay();
        generateSoundKitOne();
        generateSoundKitTwo();
        generateSampleButtonEventListeners();
    }

    function generateSequencerSampleButtons() {
        let sequencerSamplesColumn = document.getElementsByClassName('sequencer-samples-column')[0];
        for (let i = 1; i <= 8; i++) {
            let button = document.createElement('button');
            button.innerHTML = "BUTTON";
            button.className = `samples-column-button ${i}`;
            sequencerSamplesColumn.appendChild(button)
        }
    }

    function generateSequencerRows() {
        let sequencerRows = document.getElementsByClassName('sequencer-rows')[0];
        for (let i = 1; i <= 8; i++) {
            let row = document.createElement('div');
            row.classList.add('sequencer-row');

            for (let j = 1; j <= 32; j++) {
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
    }

    function generateSequencerBeatCountDisplay() {
        let sequencerBeatCountDisplay = document.getElementsByClassName('sequencer-beat-count-display')[0];
        for (let i = 1; i <= 32; i++) {
            let div = document.createElement('div');
            div.innerHTML = `${i}`;
            div.classList.add('beat-count-number')
            sequencerBeatCountDisplay.appendChild(div)
        }
    }

    const soundKitOne = [];
    function generateSoundKitOne() {
        for (let i = 0; i < 8; i++) {
            let sound = new Tone.Player(`../dist/samples/sample_0${i + 1}.wav`).toDestination();
            soundKitOne.push(sound);
        }
    }

    const soundKitTwo = [];
    const pitches = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
    function generateSoundKitTwo() {
        for (let i = 0; i < 8; i++) {
            let sound = new Tone.Synth().toDestination();
            soundKitTwo.push(sound);
        }
    }

    let currentSoundKit = 'one';
    function generateSampleButtonEventListeners() {
        let sampleButtons = Array.from(document.getElementsByClassName('samples-column-button'));
        sampleButtons.forEach((button, i) => {
            button.addEventListener('click', () => {
                if (currentSoundKit === 'one') {
                    soundKitOne[i].start();
                } else {
                    soundKitTwo[i].triggerAttackRelease(pitches[i], '16n');
                }
            })
        })
    }

    generateSequencer()



    const rows = Array.from(document.getElementsByClassName('sequencer-row'));
    let playing = false;
    let col = 0

    const playButton = document.body.querySelector('.play-button');
    playButton.addEventListener('click', () => {
        if (!playing) {
            Tone.Transport.start();
            playing = true;
        } else {
            Tone.Transport.stop();
            playing = false;
            setTimeout(() => { col = 0 }, 250);
        }
    })

    const bpmInput = document.body.querySelector('.bpm-input');
    bpmInput.addEventListener('change', (e) => {
        e.preventDefault();
        Tone.Transport.bpm.value = e.currentTarget.value;
    })

    const resetButton = document.body.querySelector('.reset-button');
    resetButton.addEventListener('click', () => {
        Tone.Transport.stop();
        playing = false;
        setTimeout(() => { col = 0 }, 250);

        let checkBoxes = Array.from(document.getElementsByClassName('sequencer-row-checkbox'));
        checkBoxes.forEach(checkbox => {
            checkbox.checked = false
        })
    })

    const toggleSoundKitButton = document.body.querySelector('.toggle-sound-kit-button');
    toggleSoundKitButton.addEventListener('click', () => {
        (currentSoundKit === 'one') ? (currentSoundKit = 'two') : (currentSoundKit = 'one');
    })





    Tone.Transport.scheduleRepeat(runSequence, '16n')

    // needs to be adjusted still
    function runSequence(time) {
        // if (currentSoundKit === 'one') {
        //     for (let row = 0; row < rows.length; row++) {
        //         let currentSound = soundKitOne[row];
    
        //         let currentRow = rows[row];
        //         let currentPad = currentRow.querySelector(`label:nth-child(${col + 1})`)
        //         let currentCheckBox = currentPad.querySelector('input')
                
        //         if (currentCheckBox.checked) currentSound.start(time);
        //     }
        // } else {
        //     for (let row = 0; row < rows.length; row++) {
        //         let currentSynth = soundKitTwo[row];
        //         let currentPitch = pitches[row]
    
        //         let currentRow = rows[row];
        //         let currentPad = currentRow.querySelector(`label:nth-child(${col + 1})`)
        //         let currentCheckBox = currentPad.querySelector('input')
    
        //         if (currentCheckBox.checked) currentSynth.triggerAttackRelease(currentPitch, '16n');
        //     }
        // }

        for (let row = 0; row < rows.length; row++) {
            let currentRow = rows[row];
            let currentPad = currentRow.querySelector(`label:nth-child(${col + 1})`)
            let currentCheckBox = currentPad.querySelector('input')
            
            if (currentSoundKit === 'one') {
                let currentSound = soundKitOne[row];
                if (currentCheckBox.checked) currentSound.start(time);
            } else {
                let currentSynth = soundKitTwo[row];
                let currentPitch = pitches[row]
                if (currentCheckBox.checked) currentSynth.triggerAttackRelease(currentPitch, '16n');
            }
        }

        (col === 31) ? (col = 0) : col++;
    }
});
