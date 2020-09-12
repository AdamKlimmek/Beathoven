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
        let sampleDescriptions = ['Kick', 'Snare', 'Tom', 'Hat', 'Snap', 'Keys 1', 'Keys 2', 'Keys 3'];
        let sequencerSamplesColumn = document.body.querySelector('.sequencer-samples-column');
        for (let i = 0; i < 8; i++) {
            let button = document.createElement('button');
            button.className = `samples-column-button`;

            let icon = document.createElement('i');
            icon.className = 'fas fa-music';

            let span = document.createElement('span');
            span.innerHTML = sampleDescriptions[i];

            button.appendChild(icon);
            button.appendChild(span);
            sequencerSamplesColumn.appendChild(button)
        }

        let div = document.createElement('div');
        div.className = 'toggle-sound-kit';

        let buttonOne = document.createElement('button');
        buttonOne.className = 'sound-kit-a-toggle active';
        buttonOne.innerHTML = 'A';

        let buttonTwo = document.createElement('button');
        buttonTwo.innerHTML = 'B';
        buttonTwo.className = 'sound-kit-b-toggle';

        div.appendChild(buttonOne);
        div.appendChild(buttonTwo);
        sequencerSamplesColumn.appendChild(div)
    }

    function generateSequencerRows() {
        let sequencerRows = document.body.querySelector('.sequencer-rows');
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
        let sequencerBeatCountDisplay = document.body.querySelector('.sequencer-beat-count-display');
        for (let i = 1; i <= 32; i++) {
            let div = document.createElement('div');
            div.innerHTML = `${i}`;
            div.className = 'beat-count-number';
            sequencerBeatCountDisplay.appendChild(div)
        }
    }

    const soundKitA = [];
    function generateSoundKitOne() {
        for (let i = 1; i <= 8; i++) {
            let sound = new Tone.Player(`../dist/samples/sample_0${i}.wav`).toDestination();
            soundKitA.push(sound);
        }
    }

    const soundKitB = [];
    const pitches = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].reverse();
    function generateSoundKitTwo() {
        for (let i = 0; i < 8; i++) {
            let sound = new Tone.Synth().toDestination();
            soundKitB.push(sound);
        }
    }

    let currentSoundKit = 'A';
    function generateSampleButtonEventListeners() {
        let sampleButtons = Array.from(document.body.querySelectorAll('.samples-column-button'));
        sampleButtons.forEach((button, i) => {
            button.addEventListener('click', () => {
                if (currentSoundKit === 'A') {
                    soundKitA[i].start();
                } else {
                    soundKitB[i].triggerAttackRelease(pitches[i], '16n');
                }
            })
        })
    }

    generateSequencer()



    // reorganize / refactor 

    const rows = Array.from(document.body.querySelectorAll('.sequencer-row'));
    const checkboxes = Array.from(document.body.querySelectorAll('.sequencer-row-checkbox'));
    let columnCounter = 0
    


    const playButton = document.body.querySelector('.fa-play-circle');
    const stopButton = document.body.querySelector('.fa-stop-circle');
    const togglePlayback = document.body.querySelector('.toggle-playback');
    togglePlayback.addEventListener('click', () => { togglePlay() });
    function togglePlay() {
        if (stopButton.classList.contains('hidden')) {
            Tone.Transport.start();
            playButton.classList.add('hidden');
            stopButton.classList.remove('hidden');
        } else {
            Tone.Transport.stop();
            playButton.classList.remove('hidden');
            stopButton.classList.add('hidden');
            setTimeout(() => {
                columnCounter = 0;
                checkboxes.forEach(checkbox => { checkbox.classList.remove('active') })
            }, 100);
        }
    }
    


    const bpmInput = document.body.querySelector('.bpm-input');
    bpmInput.addEventListener('change', (e) => {
        e.preventDefault();
        Tone.Transport.bpm.value = e.currentTarget.value;
    })



    const clearButton = document.body.querySelector('.clear-button');
    clearButton.addEventListener('click', () => {
        Tone.Transport.stop();
        setTimeout(() => {
            columnCounter = 0;
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.classList.remove('active');
            })
            if (playButton.classList.contains('hidden')) togglePlay();
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

        bpmInput.value = 120;
        let bpmOutput = document.body.querySelector('.form-output');
        bpmOutput.innerHTML = 120;
        Tone.Transport.bpm.value = 120;
    })

    const soundKitAButton = document.body.querySelector('.sound-kit-a-toggle');
    const soundKitBButton = document.body.querySelector('.sound-kit-b-toggle');
    soundKitAButton.addEventListener('click', () => {
        if (!soundKitAButton.classList.contains('active')) {
            soundKitAButton.classList.add('active');
            soundKitBButton.classList.remove('active');
            currentSoundKit = 'A';
        }
    })

    soundKitBButton.addEventListener('click', () => {
        if (!soundKitBButton.classList.contains('active')) {
            soundKitBButton.classList.add('active');
            soundKitAButton.classList.remove('active');
            currentSoundKit = 'B';
        }
    })
  
    // end reorganize / refactor 



    Tone.Transport.scheduleRepeat(runSequence, '16n')

    function runSequence(time) {
        let currentColumn = columnCounter % 32

        for (let row = 0; row < rows.length; row++) {
            let currentRow = rows[row];
            let currentPad = currentRow.querySelector(`label:nth-child(${currentColumn + 1})`)
            let currentCheckBox = currentPad.querySelector('input')
            
            if (currentSoundKit === 'A') {
                let currentSound = soundKitA[row];
                if (currentCheckBox.checked) currentSound.start(time);
            } else {
                let currentSynth = soundKitB[row];
                let currentPitch = pitches[row]
                if (currentCheckBox.checked) currentSynth.triggerAttackRelease(currentPitch, '16n');
            }
        }

        Tone.Draw.schedule(time => {
            let currentColumnPads = Array.from(document.getElementsByClassName(`col-${currentColumn}`));
            currentColumnPads.forEach(pad => { pad.classList.add('active'); })

            let previousColumn = (currentColumn === 0) ? (31) : (currentColumn - 1);
            let previousColumnPads = Array.from(document.getElementsByClassName(`col-${previousColumn}`));
            previousColumnPads.forEach(pad => { pad.classList.remove('active'); })
        }, time)

        columnCounter++;
    }

});
