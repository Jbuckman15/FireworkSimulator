//Creation audio context
let audioCtx;

//Sound arrays (allows for more than one to be played at a time)
let launchSound = [];
let launchVal = 0;
let burstSound = [];
let burstVal = 0;

//Private properties
let sourceNode, analyserNode, gainNode;

//Making enumeration
const DEFAULTS = Object.freeze({
    gain        :      .5,
    numSamples  :      256
});

//Store frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples/2);

function setupWebaudio(filePath1, filePath2) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    analyserNode = audioCtx.createAnalyser();

    //Volume
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    //Creating the launch sounds
    for(let i = 0; i < 10; i++) {
        let newSound = new Audio();

        newSound.src = filePath1;
        sourceNode = audioCtx.createMediaElementSource(newSound);

        // fft stands for Fast Fourier Transform
        analyserNode.fftSize = DEFAULTS.numSamples;

        //Audio graph
        sourceNode.connect(analyserNode);
        analyserNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        launchSound.push(newSound);
    }

    //Creating the burst sounds
    for(let i = 0; i < 10; i++) {
        let newSound = new Audio();

        newSound.src = filePath2;
        sourceNode = audioCtx.createMediaElementSource(newSound);

        // fft stands for Fast Fourier Transform
        analyserNode.fftSize = DEFAULTS.numSamples;

        //Audio graph
        sourceNode.connect(analyserNode);
        gainNode.connect(audioCtx.destination);

        burstSound.push(newSound);
    }

    //Connecting gainNode
    analyserNode.connect(gainNode);
}

//Playing sounds
function playLaunchSound() {
    //Going through the array and playing the new available sound
    launchSound[launchVal].play();

    //Going to next value
    launchVal += 1;
    launchVal = launchVal%10;
}

function playBurstSound() {
    //Going through the array and playing the new available sound
    burstSound[burstVal].play();

    //Going to next value
    burstVal += 1;
    burstVal = launchVal%10;
}

//Setting volume
function setVolume(value) {
    value = Number(value); //Making it an integer instead of a string
    gainNode.gain.value = value;
}

export {audioCtx, setupWebaudio, playLaunchSound, playBurstSound, setVolume, analyserNode};
