let beatmap = [];
let ievan;
let beatTime = 2;
let beatInput = 0.2;
let gameStarted = false;
let songTime;
let score = 0;
let maxScore;
let nextBeat;
let displayedBeats = [];
let playRate = 1;


function preload() {
  data = loadJSON("./assets/beatmap.json");
  clap = loadSound("./assets/clap.wav")
  ievan = loadSound("./assets/ievan_polkka.m4a");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  angleMode(DEGREES)

  //set possible x/y positions
  var p3 = width/20*3;
  var p4 = width/20*4;
  var p5 = width/20*5;
  var p6 = width/20*6;
  var p7 = width/20*7;
  var p8 = width/20*8;
  var p9 = width/20*9;
  var p10 = width/20*10;
  var p11 = width/20*11;
  var p12 = width/20*12;
  var p13 = width/20*13;
  var p14 = width/20*14;
  var p15 = width/20*15;
  var p16 = width/20*16;
  var p17 = width/20*17;
  var phalf = width/40;
  var h1 = height/12*4;
  var h2 = height/12*5;
  var h3 = height/12*6;
  var h4 = height/12*7;
  var h5 = height/12*8;
  var hhalf = height/24;

  for (let i = 0; i < data.beats.length; i++) {
    maxScore = i+1;
    addBeats(
      i,
      data.beats[i].type,
      data.beats[i].time,
      eval(data.beats[i].posX),
      eval(data.beats[i].posY)
    );
  }
}



function draw() {
  background('black');


  //tutorial
  if (gameStarted == false){
    push();
    textAlign(CENTER,CENTER);

    fill('aqua');
    textFont('Rubik Mono One');
    textSize(60);
    text('Project DIVA\np5.JS', width/2, height/2-70);

    fill('white');
    textFont('Rubik');
    textSize(20);
    text('Press X or S to start', width/2, height/2+70);

    textSize(20);
    textAlign(CENTER,BOTTOM);
    text('♫ Ievan Polkka ♫\narrangement by Otomania\nfeaturing Hatsune Miku', width/2, height-80);
    pop();
  }

  //on screen display
  if (gameStarted){

    //run beatmap
    for(let i = 0; i < beatmap.length; i++) {
        beatmap[i].run();
    }

    //time elapsed
    push();
      fill('aqua');
      songTime = ievan.currentTime();
      let songPercent = songTime / ievan.duration()
      rect (0,0,songPercent*width,30)

    //score
      textFont('Rubik');
      textSize(20);
      let scorePercent = score / maxScore / 10;
      //console.log(scorePercent);
      if (scorePercent == 100){
        fill('magenta')
      }
      else if (scorePercent >= 75){
        fill('rgb(130,230,0)');
      }
      else{
        fill('white');
      }
      text('SCORE / ' + score, 60, height-60);
      rect (0,height-15,scorePercent*width/100,30);
    pop();
  }
}

//create beat istances calling the class
function addBeats(id, type, time, posX, posY) {
  let beatColor;
  if (type == "x") {
    beatColor = "magenta";
  } else {
    beatColor = "aqua";
  }
  const newBeat = new Beat(id, type, time, posX, posY, beatColor)
  beatmap.push(newBeat);
}

//beat class
class Beat {
  constructor(temp_id, temp_type, temp_time, temp_posX, temp_posY, temp_beatColor) {
    this.id = temp_id;
    this.type = temp_type;
    this.time = temp_time;
    this.x = temp_posX;
    this.y = temp_posY;
    this.color = temp_beatColor;

    this.beatStatus = null;
    this.countPercent = 0;
    this.count = 0;
  }
  display() { //builds the beat visualization
    push();
    if (this.id != beatmap.length-1){
      noFill();
      stroke(color('rgba(255,255,255,0.4)'));
      strokeWeight(10);
      if(this.id >= 1 && this.id <= beatmap.length-3){
        curve(beatmap[this.id-1].x,beatmap[this.id-1].y,this.x,this.y,beatmap[this.id+1].x,beatmap[this.id+1].y,beatmap[this.id+2].x,beatmap[this.id+2].y)
      }
      else{line(this.x,this.y,beatmap[this.id+1].x,beatmap[this.id+1].y);}
    }
    pop();
    //beat text
    push();
      textAlign(CENTER, CENTER);
      textSize(55);
      textFont('Rubik Mono One')
      fill(this.color);
      noStroke();
      text(this.type, this.x,this.y+5);
    pop();

    //beat ext circle
    push();
      noFill();
      strokeWeight(8);
      stroke(this.color);
      ellipse(this.x, this.y, 100);
    pop();

    //beat int circle
    push();
      noFill();
      if (this.beatStatus != null){
        stroke(this.color);
      }
      else{
        stroke('white');
      }
      strokeWeight(8);
      ellipse(this.x, this.y, this.countPercent*playRate)
      console.log(this.x);
    pop();
  }

  gameInput(){ //checks for input and whether it's correct
    if (songTime >= this.time - beatInput && keyIsPressed == true && this.beatStatus == null && key == this.type){ //correct
        this.beatStatus = 'correct';
        score = score + 1000;
        /*console.log(score);
        console.log(this.id + ' / ' + this.beatStatus);*/
      }
    /* wrong (can't implement correctly HELP)
    else if (songTime >= this.time - beatInput && keyIsPressed == true && this.beatStatus == null){ //wrong (key)
        this.beatStatus = 'wrong';
        console.log(this.id + ' / ' + this.beatStatus + 'Key');
      }
    else if (songTime >= this.time - beatTime && songTime <= this.time - beatInput && keyIsPressed == true && this.beatStatus == null){ //wrong (time)
      if(this.id == 0 || beatmap[this.id-1].nextBeat == true){
        this.beatStatus = 'wrong'
        key = null;
        console.log(this.id + ' / ' + this.beatStatus + 'Time');
      }
    }*/
    else { //voids other presses
      key = null;
    }
  }

  result(){
    if (songTime <= this.time + beatInput + 0.3 && this.beatStatus == 'correct'){
      //correct beat effect
        this.color = 'rgb(130,230,0)';
        push();
          fill(this.color);
          noStroke();
          textFont('Rubik Mono One');
          textSize(20);
          textAlign(CENTER, CENTER);
          text("Cool!", this.x, this.y-50);
        pop();
      }
    else if (songTime >= this.time + beatInput && songTime <= this.time + beatInput + 0.3 && this.beatStatus == null){
      //miss beat effect
        this.color = 'rgb(120,120,120)';
        push();
          fill(this.color);
          noStroke();
          textFont('Rubik Mono One');
          textSize(20);
          textAlign(CENTER, CENTER);
          text("Miss", this.x, this.y-50);
        pop();
    }
    else if (songTime <= this.time + beatInput + 0.3 && this.beatStatus == 'wrong'){
      //wrong beat effect
        this.color = 'rgb(120,60,120)';
        push();
          fill(this.color);
          noStroke();
          textFont('Rubik Mono One');
          textSize(20);
          textAlign(CENTER, CENTER);
          text("Wrong", this.x, this.y-50);
        pop();
    }
  }
  run(){
    if (songTime >= this.time - beatTime && songTime <= this.time + beatInput){
      this.display();
      if (songTime <= this.time){
        this.count += 1;
        this.countPercent = this.count*100/(beatTime*60);
      }
      this.gameInput();
    }
    this.result()
  }
}

//start the game and play the sound effects when pressing
function keyTyped(){
  if (key == 'x' || key == 's'){
  if (ievan.isPlaying() == false && gameStarted == false){
    ievan.play();
    //ievan.rate(2);
    gameStarted = true;
    //console.log("game started")
  }
  else {
  clap.play();
}}
  else if (key == 'd') { //debug change song speed
      playRate = 4
      ievan.rate(playRate);

  }
  else if (key == 'c') { //debug change song speed
      playRate = 1
      ievan.rate(playRate);
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}
