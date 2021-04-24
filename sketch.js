var sound;

var fft; //Fast Fourier Transform
var smoothing = 0.9; 
var pValue = 1024; 
var particles =  new Array(pValue);

let img_city ;

function preload(){
  sound = loadSound('Fire.mp3');
}

function setup() {
  c = createCanvas(windowWidth, windowHeight);
  noStroke();
  sound.play();
  
  img_city = loadImage('citypop3.jpg')
  // 시티팝 배경

  fft = new p5.FFT(smoothing, pValue);
  fft.setInput(sound);

 for (var i = 0; i < particles.length; i++) {
    var x = map(i, 0, pValue, 0, width * 2);
    var y = random(0, height);
   var position = createVector(x, y);
    particles[i] = new particle(position);
  }
}

function draw() {
  
  background(0, 0, 0, 100);
  
  image(img_city,0,0, img_city.width/2, img_city.height/2) ;

  
  var spectrum = fft.analyze(pValue);
  for (var i = 0; i < pValue; i++) {
    var thisLevel = map(spectrum[i], 0, 255, 0, 1);

   //spectrum
    particles[i].update( thisLevel );
    particles[i].draw(); 
   // particles[i].position.x = map(i, 1, pValue, 0, width * 2);
  }
}


var particle = function(position) {
  this.position = position;
  this.scale = random(0, 1);
  this.speed = createVector(0, random(0, 3) ); 
  // 떨어지는 속도가 조금 빠른 것 같아서 좀 줄였음.
  this.color = [random(100, 255), random(50,255), random(0,255), random(100,150)];
} // bokeh 라는 개념이 생각나서 투명도랑 색깔들을 좀 수정

var theyExpand = 3; //Multiplyer 

particle.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / (someLevel*2);
  if (this.position.y > height) {
    this.position.y = 0;
  }
  this.diameter = map(someLevel, 0, 1, 0, 30) * this.scale * theyExpand;
}

particle.prototype.draw = function() {
  fill(this.color);
  ellipse(this.position.x, this.position.y,this.diameter, this.diameter);
}

// 슬라이더 이용해서 색깔이나 배경을 조금씩 다르게 바꾸는 건 어떨까. 시티팝처럼!