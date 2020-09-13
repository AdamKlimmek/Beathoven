import * as Tone from 'tone';
import { a1, a2, a3, b1, b2, b3, b4 } from './presets.js';

window.addEventListener('DOMContentLoaded', () => {

    // Initial Setup

    const soundKitA = [];
    (function generateSoundKitA() {
        for (let i = 1; i <= 8; i++) {
            let sound = new Tone.Player(`./dist/sample_0${i}.wav`).toDestination();
            soundKitA.push(sound);
        }
    })();

    const soundKitB = [];
    const pitches = ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'].reverse();
    (function generateSoundKitB() {
        for (let i = 0; i < 16; i++) {
            let sound = new Tone.Synth().toDestination();
            soundKitB.push(sound);
        }
    })();

    const soundKitAButtonDescriptions = ['Kick', 'Snare', 'Tom', 'Hat', 'Snap', 'Keys 1', 'Keys 2', 'Keys 3'];
    const soundKitBButtonDescriptions = ['G5 - #5', 'F5 - #4', 'E5 - #3', 'D5 - #2', 'C5 - #1', 'B4 - #7', 'A4 - #6', 'G4 - #5', 'F4 - #4', 'E4 - #3', 'D4 - #2', 'C4 - #1', 'B3 - #7', 'A3 - #6', 'G3 - #5'];
    (function generateSampleButtons() {
        let sequencerSamplesColumn = document.body.querySelector('.sequencer-samples-column');
        for (let i = 0; i < 15; i++) {
            let button = document.createElement('button');
            button.className = `samples-column-button`;
            if (i > 7) button.classList.add('hidden');

            let icon = document.createElement('i');
            icon.className = 'fas fa-music';

            let span = document.createElement('span');
            span.innerHTML = soundKitAButtonDescriptions[i];

            button.appendChild(icon);
            button.appendChild(span);
            sequencerSamplesColumn.appendChild(button)
        }
    })();

    const sampleButtons = Array.from(document.body.querySelectorAll('.samples-column-button'));
    let currentSoundKit = 'A';
    (function generateSampleButtonEventListeners() {
        sampleButtons.forEach((button, i) => {
            button.addEventListener('click', () => {
                if (currentSoundKit === 'A') {
                    soundKitA[i].start();
                } else {
                    soundKitB[i].triggerAttackRelease(pitches[i], '16n');
                }
            })
        })
    })();

    (function generateToggleSoundKitButtons() {
        let sequencerSamplesColumn = document.body.querySelector('.sequencer-samples-column');

        let div = document.createElement('div');
        div.className = 'toggle-sound-kit';

        let buttonOne = document.createElement('button');
        buttonOne.className = 'sound-kit-a-toggle active';
        buttonOne.innerHTML = 'A';

        let buttonTwo = document.createElement('button');
        buttonTwo.className = 'sound-kit-b-toggle';
        buttonTwo.innerHTML = 'B';

        div.appendChild(buttonOne);
        div.appendChild(buttonTwo);
        sequencerSamplesColumn.appendChild(div)
    })();

    (function generateRows() {
        let sequencerRows = document.body.querySelector('.sequencer-rows');
        for (let i = 0; i < 15; i++) {
            let row = document.createElement('div');
            row.className = 'sequencer-row';
            if (i > 7) row.classList.add('hidden');
            

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
    })();

    const rows = Array.from(document.body.querySelectorAll('.sequencer-row'));
    const checkboxes = Array.from(document.body.querySelectorAll('.sequencer-row-checkbox'));
    let columnCounter = 0;

    (function generateBeatCounterDisplay() {
        let sequencerBeatCountDisplay = document.body.querySelector('.sequencer-beat-count-display');
        for (let i = 1; i <= 32; i++) {
            let div = document.createElement('div');
            div.className = 'beat-count-number';
            div.innerHTML = `${i}`;
            sequencerBeatCountDisplay.appendChild(div)
        }
    })();

    // Buttons & Button Logic

    const playButton = document.body.querySelector('.fa-play-circle');
    playButton.addEventListener('click', () => play());
    
    const stopButton = document.body.querySelector('.fa-stop-circle');
    stopButton.addEventListener('click', () => stop());

    function play() {
        Tone.Transport.start();
        playButton.classList.add('hidden');
        stopButton.classList.remove('hidden');
    }

    function stop() {
        Tone.Transport.stop();
        playButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
        setTimeout(() => {
            columnCounter = 0;
            checkboxes.forEach(checkbox => { checkbox.classList.remove('active') })
        }, 100);
    }

    const clearButton = document.body.querySelector('.clear-button');
    clearButton.addEventListener('click', () => clear());
        
    function clear() {
        if (playButton.classList.contains('hidden')) {
            stop();
        }

        setTimeout(() => {
            checkboxes.forEach(checkbox => { checkbox.checked = false; })
        }, 150);
    }

    const bpmInput = document.body.querySelector('.bpm-input');
    const bpmOutput = document.body.querySelector('.form-output');

    bpmInput.addEventListener('change', (e) => {
        e.preventDefault();
        updateBPM(e.currentTarget.value);
    })

    function updateBPM(val) {
        bpmInput.value = val;
        bpmOutput.innerHTML = val;
        Tone.Transport.bpm.value = val;
    }

    const soundKitAButton = document.body.querySelector('.sound-kit-a-toggle');
    soundKitAButton.addEventListener('click', () => enableSoundKitA());

    const soundKitBButton = document.body.querySelector('.sound-kit-b-toggle');
    soundKitBButton.addEventListener('click', () => enableSoundKitB());

    function enableSoundKitA() {
        if (!soundKitAButton.classList.contains('active')) {
            currentSoundKit = 'A';
            soundKitAButton.classList.add('active');
            soundKitBButton.classList.remove('active');
            updateSampleButtonDescriptions(soundKitAButtonDescriptions);

            for (let i = 8; i < 15; i++) {
                sampleButtons[i].classList.add('hidden');
                rows[i].classList.add('hidden');
            }
        }
    }

    function enableSoundKitB() {
        if (!soundKitBButton.classList.contains('active')) {
            currentSoundKit = 'B';
            soundKitBButton.classList.add('active');
            soundKitAButton.classList.remove('active');
            updateSampleButtonDescriptions(soundKitBButtonDescriptions);

            for (let i = 8; i < 15; i++) {
                sampleButtons[i].classList.remove('hidden');
                rows[i].classList.remove('hidden');
            }
        }
    }

    function updateSampleButtonDescriptions(descriptions) {
        sampleButtons.forEach((button, i) => {
            button.children[1].innerHTML = descriptions[i];
        })
    }

    const presetsDropdownButton = document.body.querySelector('.fa-caret-square-down');
    const dropdownMenu = document.body.querySelector('.dropdown-menu');
    let dropdownOpen = false;
    presetsDropdownButton.addEventListener('click', () => toggleDropdown());
    
    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
        if (dropdownOpen) {
            dropdownMenu.classList.remove('hidden');
        } else {
            dropdownMenu.classList.add('hidden')
        }
    }
    
    const body = document.body.querySelector('.body');
    body.addEventListener('click', (e) => {
        if (dropdownOpen && !presetsDropdownButton.contains(e.target)) {
           toggleDropdown();
        }
    })

    const presetA1 = document.body.querySelector('.preset-a1');
    presetA1.addEventListener('click', () => initializePreset('A', 120, a1));
    
    const presetA2 = document.body.querySelector('.preset-a2');
    presetA2.addEventListener('click', () => initializePreset('A', 60, a2));

    const presetA3 = document.body.querySelector('.preset-a3');
    presetA3.addEventListener('click', () => initializePreset('A', 90, a3));

    const presetB1 = document.body.querySelector('.preset-b1');
    presetB1.addEventListener('click', () => initializePreset('B', 70, b1));

    const presetB2 = document.body.querySelector('.preset-b2');
    presetB2.addEventListener('click', () => initializePreset('B', 60, b2));

    const presetB3 = document.body.querySelector('.preset-b3');
    presetB3.addEventListener('click', () => initializePreset('B', 60, b3));

    const presetB4 = document.body.querySelector('.preset-b4');
    presetB4.addEventListener('click', () => initializePreset('B', 74, b4));

    function initializePreset(correctSoundKit, correctBPM, correctCheckboxes) {
        clear();

        setTimeout(() => {
            (correctSoundKit === 'A') ? enableSoundKitA() : enableSoundKitB();
        }, 200);
            
        setTimeout(() => {
            if (Tone.Transport.bpm.value !== correctBPM) updateBPM(correctBPM);
        }, 250);

        setTimeout(() => {
            correctCheckboxes.forEach((coords) => {
                let currentBox = document.getElementsByClassName(`row-${coords[0]} col-${coords[1]}`)[0];
                currentBox.checked = true;
            })
    
            play();
        }, 300);
    }

    // Looping Function

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
