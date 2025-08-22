//Importing other important JavaScript files
import * as audio from './audio.js';

//Attributes
let canvas, ctx, canvasWidth, canvasHeight, FPS, timer, rateOfFire, colorSettings;

//List of firework objects
let fireworksList = [];

//Calling init after the window loads
window.onload = init;

function init() {
    //Creating the canvas
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    //Filling in the background
	ctx.save();
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.restore();

    //Setting up audio
    audio.setupWebaudio("audio/Firework_launch.ogg", "audio/Firework_blast.ogg");

    //Setting up the UI
    setupUI();

    //Loading in default values from JSON
    fetch("data/presets.json")
		.then(response => {
			if(response.ok) {
				return response.json();
			}

			return response.text().then(text => {
				throw text;
			})
		})
		.then(json => {
            //Filling in the values
            FPS = json.defaultFPS;
            rateOfFire = json.rateOfFire;
            timer = json.timerStart;
            colorSettings = json.defaultColors;

		}).catch(error => {
			//Letting the user know nothing was found
            console.log("JSON File Missing!");
		});

    
    //Starting the loop
    update();
}

function setupUI() {
    //COLOR OPTIONS
    let colorRed = document.querySelector("#colorRed");
    colorRed.onclick = e => {
        colorSettings.red = colorRed.checked;
    }
    let colorOrange = document.querySelector("#colorOrange");
    colorOrange.onclick = e => {
        colorSettings.orange = colorOrange.checked;
    }
    let colorYellow = document.querySelector("#colorYellow");
    colorYellow.onclick = e => {
        colorSettings.yellow = colorYellow.checked;
    }
    let colorGreen = document.querySelector("#colorGreen");
    colorGreen.onclick = e => {
        colorSettings.green = colorGreen.checked;
    }
    let colorBlue = document.querySelector("#colorBlue");
    colorBlue.onclick = e => {
        colorSettings.blue = colorBlue.checked;
    }
    let colorPurple = document.querySelector("#colorPurple");
    colorPurple.onclick = e => {
        colorSettings.purple = colorPurple.checked;
    }

    //Firework rate of fire
    let rateOfFireSetting = document.querySelector("#rateOfFire");
    rateOfFireSetting.onchange = e => {
        rateOfFire = parseFloat(e.target.value);
        timer = 1000*rateOfFire;
    }

    //FPS changer
    let selectFPS = document.querySelector("#selectFPS");
    selectFPS.onchange = e => {
        FPS = parseInt(e.target.value);
    }

    //Volume slider
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    volumeSlider.oninput = e => {
        //set the gain
        audio.setVolume(e.target.value);
        //update the value of the label
        volumeLabel.innerHTML = Math.round((e.target.value/2*100));
    }
	
    //set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));
}

function update(){
    //The program loop
	setTimeout(update, 1000/FPS);

    //Drawing transparent black to make fireworks dissappear
    fadeEffect();

    //Spawning new fireworks every second
    timer -= 1000/FPS;
    if(timer <= 0) {
        let spawnX = (Math.random()*100) + canvasWidth/2 - 50;
        fireworksList.push(new Firework(spawnX, canvasHeight, (Math.random()*10) - 5, (Math.random()*6) + 22, getRandomColor()));
        timer = 1000*rateOfFire;
    }
    
    //Updating the firework objects
    for(let i = 0; i < fireworksList.length; i++) {
        fireworksList[i].update();
    }

    //Removing "dead" fireworks
    fireworksList = fireworksList.filter(e=>e.isAlive);
}

function drawCircle(ctx,x,y,radius,color){
	ctx.save();
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x,y,radius,0,Math.PI * 2);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function fadeEffect() {
	ctx.save();
	ctx.fillStyle = "black";
	ctx.globalAlpha = 4/FPS;
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.restore();
}

function getRandomColor() {

    //White if no colors are selected
    if(!(colorSettings.red || colorSettings.orange || colorSettings.yellow || colorSettings.green || colorSettings.blue || colorSettings.purple)) {
        return "white";
    }

    while(true) {
        //Picks a number from 0-5
        let colorNum = Math.floor(Math.random()*6);

        //Checking if the color is enabled
        switch(colorNum) {
            case 0:
                if(colorSettings.red)
                    return "red";
                break;
            case 1:
                if(colorSettings.orange)
                    return "orange";
                break;
            case 2:
                if(colorSettings.yellow)
                    return "yellow";
                break;
            case 3:
                if(colorSettings.green)
                    return "green";
                break;
            case 4:
                if(colorSettings.blue)
                    return "blue";
                break;
            case 5:
                if(colorSettings.purple)
                    return "purple";
                break;
        }
    }
}


class Firework {
    constructor(Xpos, Ypos, Xvel, Yvel, c = "white") {
        this.Xpos = Xpos;
        this.Ypos = Ypos;
        this.Xvel = Xvel;
        this.Yvel = Yvel;
        this.color = c;

        this.isAlive = true;

        //Creating the states the firework can be in
        this.fireworkStates = {
            LAUNCH: 'launch',
            EXPLODE: 'explode'
        }

        //Default state
        this.currentState = this.fireworkStates.LAUNCH;

        this.blastRadius = 0;

        //Launch sound
        audio.playLaunchSound();
    }

    //Determining which function to call based on the firework's current state
    update() {
        switch(this.currentState) {
            case this.fireworkStates.LAUNCH:
                this.launch();
                break;
            case this.fireworkStates.EXPLODE:
                this.explode();
                break;
        }
    }

    //Launching the firework until its Y velocity is 0
    launch() {
        //Moving along the X axis
        this.Xpos += this.Xvel * (60/FPS);

        //Moving along the Y axis
        this.Ypos -= this.Yvel * (60/FPS);

        if(this.Yvel > 0) {
            this.Yvel -= 1 * (60/FPS);
        } else {
            this.currentState = this.fireworkStates.EXPLODE;

            //Burst sound effect
            audio.playBurstSound();
        }

        //Drawing the rocket
        drawCircle(ctx, this.Xpos, this.Ypos, 5, this.color);
    }

    //Explode effect
    explode() {
        this.blastRadius += 2 * (60/FPS);
        let angle = 0;

        for(let i = 0; i < 12; i++) {
            let X = this.blastRadius*Math.cos(angle);
            let Y = this.blastRadius*Math.sin(angle);
            drawCircle(ctx, this.Xpos + X/2, this.Ypos + Y/2, 5, this.color);
            drawCircle(ctx, this.Xpos + X, this.Ypos + Y, 5, this.color);
            angle += Math.PI*2/12;
        }

        //Exstinguishing the firework after a pariod of time
        if(this.blastRadius > 125) {
            this.isAlive = false;
        }
    }
}