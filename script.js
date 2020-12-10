var database;
var trace = [];
var start = 0;
var date = new Date();

let amountOfEntries = 0;
let loopAmt;
let tileSize = 10;
let displaceMap = [];
let displacementMapImg;
let tempImg;
let visitorAmt;
let cursorImg;
let cursorSize = 1;

let lastY = 0;
let currentY = 0;
let scrollSpeed = 1;

let skipStep = 7;

let traceDrawn = false;

let showing = false;

let loadingContainer = document.getElementById('loading')
let loadingText = document.getElementById('loadtext')
let visitor = document.getElementById('visitor')
let bgImage;

let offset = 0;
let audio;
let isLoaded = false;

let mobileDevice = false;

let bye = document.getElementById('bye')

var processImg, processImg2, processImg3, processImg4;

let drawingProcess = false;
let timer = 0;

function preload(){
  audio = loadSound('assets/audio-lowest.mp3');
  bgImage = loadImage('img/bgbg.jpg');
  if(getOS() == 'Mac OS'){
    cursorImg = loadImage('macCursor.png')
    cursorSize = 2;
  }else{
    cursorImg = loadImage('windowsCursor.png')
    cursorSize = 1;
  }
}

function setup(){
  canvas = createCanvas(window.innerWidth,window.innerHeight);
  canvas.id('mycanvas');
  canvas.parent("canvascontainer")
  canvas.style("cursor","none");

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    mobileDevice = true;
  }


  var firebaseConfig = {
    // Personal firebase data goes here


  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  database = firebase.database();

  var ref = database.ref('trace')
  ref.on('value', gotData, errData);
  background(0,0,0);
  if(mobileDevice){
    drawContent();
  }

}

function draw(){

  if(isLoaded){
    animateText();
  }

}

function mouseMoved(){

  if(isLoaded && !showing && !mobileDevice){
    var point = {
      x: mouseX/canvas.width,
      y: mouseY/canvas.height
    }
    noStroke();
    fill('black');

    imageMode(CORNER);
    image(cursorImg, mouseX,mouseY,cursorImg.width/cursorSize,cursorImg.height/cursorSize);

    trace.push(point);
  }


}

function saveDrawing(){
  var ref = database.ref('trace')
  var data = {
    date: date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear(),
    trace: trace,
    scrollAmount: offset
  }
  var result = ref.push(data, dataSent)
  function dataSent(status){
  }
}

function gotData(data){

  var traces = data.val();
  var keys = Object.keys(traces);
  visitorAmt = keys.length;
  visitor.innerHTML = visitorAmt;
  if(!traceDrawn && !mobileDevice){
    for(var i = 80; i < keys.length; i++){
      var key = keys[i];
      showDrawing(key)
      if(i>=start){
        start = i;
      }
      amountOfEntries += 1;
    }

    let index = 0;
    for(var x = 0; x < canvas.width; x += tileSize){
      for(var y = 0; y < canvas.height; y+= tileSize){
        displaceMap[index] = brightness(get(x,y));
        index += 1;
      }
    }
    drawDisplace();
  }
  if(mobileDevice){
    loadingText.innerHTML = "Open"
    loadingText.style.textDecoration = "underline"
    loadingText.style.cursor ="pointer"
  }
}

function errData(err){
  console.log(err);
}

function showDrawing(key){
  var ref = database.ref('trace/' + key);
  ref.on('value',addTrace);
  function addTrace(data){
    var dbtrace = data.val();
    if(dbtrace.trace){
      drawTrace(dbtrace.trace);
    }

  }

}

//draw displacement map
function drawTrace(tr){
  noStroke();
  fill('rgba(255,255,255, 0.01)');
  for(var j = 0; j < tr.length; j+= skipStep){
    ellipse(tr[j].x*canvas.width,tr[j].y*canvas.height,15,15)
  }
  displacementMapImg = get(0,0,width,height);
  traceDrawn = true;

}



//Displace content for glitchy effect
function drawDisplace(){
  drawContent();
  rectMode(CORNER);
  noStroke();

  processImg = get(0,0,canvas.width,canvas.height)

  loopAmt = Math.ceil(amountOfEntries/10);
  for(var i = 0; i < loopAmt; i += 1){
    let index = 0;
    for(var x = 0; x < canvas.width; x += tileSize){
      for(var y = 0; y < canvas.height; y+= tileSize){
        let offset = displaceMap[index]*1;
        if(offset > 0){
          let tile = get(x,y,tileSize,tileSize)
          fill(255);



          image(tile,x - offset*Math.random(),y - offset*Math.random(),tileSize*0.7,tileSize*0.7);
          image(tile,x - offset*Math.random()*2,y,tileSize*0.8,tileSize*0.8);
          image(tile,x + offset*5.5*Math.random(),y + offset*5.5*Math.random(),tileSize,tileSize);
          image(tile,x + offset*Math.random()*1,y + offset*Math.random()*2);
        }
        index += 1;
      }
    }
    if(i == 0){
      prcoessImg2 = get(0,0,canvas.width,canvas.height);
    }else if(i == 1){
      prcoessImg3 = get(0,0,canvas.width,canvas.height);
    }else if(i == 2){
      prcoessImg4 = get(0,0,canvas.width,canvas.height);
    }
  }

  loadingText.innerHTML = "Open"
  loadingText.style.textDecoration = "underline"
  loadingText.style.cursor ="pointer"

}



loadingText.onclick = function(){
  loadingContainer.style.display = "none";
  loadingContainer.remove();
  drawingProcess = true;
  timer = millis();
  isLoaded = true;
  audio.play();
  audio.setVolume(0.1);

};


function drawContent(){


  background(0,0,0);
  textSize(400);
  textAlign(CENTER, CENTER);
  fill(0);

  let scale = 0.8;
  if(mobileDevice){
    scale = 0.4;
  }
  imageMode(CENTER);
  if(bgImage){
    image(bgImage,width/2,height/2,scale*bgImage.width*height/bgImage.height,scale*height);
  }



}





window.onbeforeunload = function () {
  saveDrawing();
};



function showDisplacementMap(){
  imageMode(CORNER);
  tempImg = get(0,0,canvas.width,canvas.height);
  image(displacementMapImg,0,0,canvas.width,canvas.height);
  fill('rgba(255,255,255, 0.02)');
  for(var i = 0; i < trace.length; i+=1){
    ellipse(trace[i].x*canvas.width,trace[i].y*canvas.height,15,15)
  }
  showing = true;
}

function removeDisplacementMap(){
  if(tempImg){
    imageMode(CORNER);
    image(tempImg,0,0,canvas.width,canvas.height);
    showing = false;
  }
}




function getOS() {
  var userAgent = window.navigator.userAgent,
  platform = window.navigator.platform,
  macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
  windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
  iosPlatforms = ['iPhone', 'iPad', 'iPod'],
  os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}



function animateText(){
  let textContainer = document.getElementById('textContainer')
  textContainer.style.top = window.innerHeight - offset + "px";
  offset += scrollSpeed;
  if(bye.getBoundingClientRect().top <= window.innerHeight/2 + 20){
    bye.style.fontSize = "100px"
  }
  if(bye.getBoundingClientRect().top <= window.innerHeight/2 + 10){
    bye.style.fontSize = "200px"
  }
  if(bye.getBoundingClientRect().top <= window.innerHeight/2){
    bye.style.fontSize = "500px"
    window.open('','_parent','');
    window.close();
  }
}


window.onresize = function() {
  // assigns new values for width and height variables
  tempImg = get(0,0,windowWidth,windowHeight)
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.size(w,h);
  imageMode(CORNER)
  image(tempImg,0,0,w,h)
}


document.addEventListener("wheel", function (e) {
  e.preventDefault();
  offset += e.deltaY/3;
}, { passive: false });

document.addEventListener("touchstart", function (e) {
  lastY = e.touches[0].screenY;
}, { passive: false });

document.addEventListener("touchmove", function (e) {
  e.preventDefault();
  currentY = e.touches[0].screenY;
  offset += (lastY - currentY)/8

}, { passive: false });


function deleteEntries(ref){
  ref.remove();
}
