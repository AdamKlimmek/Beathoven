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
        for (let i = 0; i < 8; i++) {
            let button = document.createElement('button');
            button.innerHTML = 'BUTTON';
            button.className = `samples-column-button`;
            sequencerSamplesColumn.appendChild(button)
        }

        let button = document.createElement('button');
        button.innerHTML = 'TOGGLE KIT';
        button.className = 'toggle-sound-kit-button';
        sequencerSamplesColumn.appendChild(button)
    }

    function generateSequencerRows() {
        let sequencerRows = document.getElementsByClassName('sequencer-rows')[0];
        for (let i = 0; i < 8; i++) {
            let row = document.createElement('div');
            row.className = 'sequencer-row';

            for (let j = 0; j < 32; j++) {
                let label = document.createElement('label');

                let input = document.createElement('input');
                input.type = 'checkbox'
                input.className = `sequencer-row-checkbox row-${i} col-${j}`;

                let span = document.createElement('span');
                span.className = 'sequencer-row-pad';

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
            div.className = 'beat-count-number';
            sequencerBeatCountDisplay.appendChild(div)
        }
    }

    const soundKitOne = [];
    function generateSoundKitOne() {
        for (let i = 1; i <= 8; i++) {
            let sound = new Tone.Player(`../dist/samples/sample_0${i}.wav`).toDestination();
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
    const checkboxes = Array.from(document.getElementsByClassName('sequencer-row-checkbox'));
    let columnCounter = 0
    let playing = false;



    const playButton = document.body.querySelector('.play-button');
    playButton.addEventListener('click', () => {
        if (!playing) {
            Tone.Transport.start();
            playing = true;
        } else {
            Tone.Transport.stop();
            playing = false;
            setTimeout(() => { 
                columnCounter = 0;
                checkboxes.forEach(checkbox => { checkbox.classList.remove('active') })
            }, 100);
        }
    })



    const bpmInput = document.body.querySelector('.bpm-input');
    bpmInput.addEventListener('change', (e) => {
        e.preventDefault();
        Tone.Transport.bpm.value = e.currentTarget.value;
    })



    const clearButton = document.body.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        Tone.Transport.stop();
        playing = false;
        setTimeout(() => {
            columnCounter = 0;
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.classList.remove('active');
            })
        }, 100);
    })



    const exampleBeatButton = document.body.querySelector('.example-beat-button');
    exampleBeatButton.addEventListener('click', () => {
        checkboxes.forEach(checkbox => { checkbox.checked = false })
        
        const boxesToCheck = [
            [0, 0], [0, 6], [0, 12], [0, 16], [0, 22],
            [1, 8], [1, 24],
            [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 14], [2, 16], [2, 18], [2, 19], [2, 20], [2, 22], [2, 24],
            [3, 10], [3, 26],
            [4, 8], [4, 14], [4, 24], [4, 28],
            [5, 0], [5, 1], [5, 3], [5, 6],
            [6, 16], [6, 17], [6, 19], [6, 22],
            [7, 28]
        ];

        boxesToCheck.forEach((arr) => {
            let currentBox = document.getElementsByClassName(`row-${arr[0]} col-${arr[1]}`)[0];
            currentBox.checked = true;
        })
    })



    const toggleSoundKitButton = document.body.querySelector('.toggle-sound-kit-button');
    toggleSoundKitButton.addEventListener('click', () => {
        (currentSoundKit === 'one') ? (currentSoundKit = 'two') : (currentSoundKit = 'one');
    })



    Tone.Transport.scheduleRepeat(runSequence, '16n')

    function runSequence(time) {
        let currentColumn = columnCounter % 32

        for (let row = 0; row < rows.length; row++) {
            let currentRow = rows[row];
            let currentPad = currentRow.querySelector(`label:nth-child(${currentColumn + 1})`)
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

        Tone.Draw.schedule(time => {
            let currentColumnPads = Array.from(document.getElementsByClassName(`col-${currentColumn}`));
            currentColumnPads.forEach(pad => {
                pad.classList.add('active');
            })

            let previousColumn = (currentColumn === 0) ? (31) : (currentColumn - 1);
            let previousColumnPads = Array.from(document.getElementsByClassName(`col-${previousColumn}`));
            previousColumnPads.forEach(pad => {
                pad.classList.remove('active');
            })
        }, time)

        columnCounter++;
    }

});
