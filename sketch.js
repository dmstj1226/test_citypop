var sound;

var fft; //Fast Fourier Transform
var smoothing = 0.7; // 반짝반짝?
var pValue = 128 ; // 원들의 갯수
var particles =  new Array(pValue);

let img_city ; // 배경 이미지

function preload(){
  sound = loadSound('Fire.mp3');
}

let slider;

function keyTyped() {
  if (key === 'p') {
  sound.play();
  }
} // 자동으로 재생되는 게 안 된다고 해서 p누르면 음악 나오도록 설정함

function setup() {
  c = createCanvas(windowWidth, windowHeight);
  noStroke();
  //sound.play();
  
  
  img_city = loadImage('citypop3.jpg')
  // 시티팝 배경 로드
  
  slider = createSlider(0, 255, 190);
  slider.position(windowWidth/2 , 10);
  slider.style('width', '100px');
  // 슬라이더 설정하고 위치 고름

  fft = new p5.FFT(smoothing, pValue);
  fft.setInput(sound);

 for (var i = 0; i < particles.length; i++) {
    var x = map(i, 0, pValue, 0, width * 2 );
    var y = random(0, height);
   var position = createVector(x, y);
    particles[i] = new particle(position);
  }
}



function draw() {
  
  background(0, 0, 0, 100);
  
  image(img_city,0,0, img_city.width/4, img_city.height/3) ;
  // 배경 이미지 불러옴
  
  let val = slider.value();
  fill(0,0,0,val) ;
  rect(0,0,windowWidth, windowHeight) ;
  

  
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
  this.speed = createVector(0, random(0, 2) ); 
  // 떨어지는 속도가 조금 빠른 것 같아서 좀 줄였음.
  let val = slider.value();
  this.color = [random(150, 255), random(100,255), random(100,255), val-100];
} // bokeh 생각나서 투명도랑 색깔을 좀 수정



var theyExpand = 3; //Multiplyer 



particle.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / (someLevel*2);
  if (this.position.y > height) {
    this.position.y = 0;
  }
  
  let val = slider.value();
  this.diameter = map(someLevel, 0, 1, 0, 30) * this.scale * theyExpand + val/8 ;
}

particle.prototype.draw = function() {
  fill(this.color);
  ellipse(this.position.x, this.position.y,this.diameter, this.diameter);
}

