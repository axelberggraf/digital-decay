let canvas2, ctx, canvasContainer2;

let borderTileSize = Math.floor(window.innerWidth / 150);
let borderOffset = 0;
let leftArray = []
let rightArray = []

let numCols = 10;
let randomLimit = 0.5;
let randomLimit2 = 0.2;
let tempX = 0;
let randomIndex;
let i = 0;

(function(window, document, undefined){

  window.onload = init;

  function init(){
    canvas2 = document.createElement('canvas')
    ctx = canvas2.getContext('2d')

    canvasContainer2 = document.getElementById('canvascontainer2')
    canvasContainer2.appendChild(canvas2)
    canvas2.style.pointerEvents ="none"

    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    canvas2.style.cursor = "none"
    generateBorders();
    animate();
  }

})(window, document, undefined);


function animate(){
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight)

  drawBorders();
  requestAnimationFrame(animate);
}


function drawBorders(){
  ctx.fillStyle = "yellow"
  i = 0;

  // draw left borders
  for(let y = 0; y < window.innerHeight + borderTileSize; y += borderTileSize){
    for(let x = 0; x < borderTileSize*numCols; x += borderTileSize){
      if(leftArray[i].draw){
        ctx.fillRect(x ,y - borderOffset,borderTileSize,borderTileSize);
      }
      i+=1;
    }
  }


  // draw right borders
  i = 0;
  for(let y = 0; y < window.innerHeight + borderTileSize; y += borderTileSize){
    for(let x = window.innerWidth - borderTileSize; x >= window.innerWidth - borderTileSize*numCols; x -= borderTileSize){
      if(rightArray[i].draw){
        ctx.fillRect(x ,y - borderOffset,borderTileSize,borderTileSize);
      }
      i+=1;
    }
  }

  borderOffset += scrollSpeed;


//add rows
  if(borderOffset > borderTileSize){
    borderOffset = 0;
    for(let i = 0; i < numCols; i++){
      leftArray.shift();
      rightArray.shift();
    }

    for(let x = 0; x < numCols; x ++){

      if( Math.random()*(x+1) < randomLimit){
        leftArray.push({
          draw: true
        });
      }else{
        leftArray.push({
          draw: false
        })
      }

      if( Math.random()*(x+1) < randomLimit){
        rightArray.push({
        draw: true});
      }else{
        rightArray.push({
        draw: false
      })
      }

      if(Math.random()<randomLimit2){
        randomIndex = Math.floor(Math.random()*rightArray.length)
        rightArray[randomIndex]=rightArray[Math.floor(Math.random()*rightArray.length)]

        randomIndex = Math.floor(Math.random()*leftArray.length)
        leftArray[randomIndex]=leftArray[Math.floor(Math.random()*leftArray.length)]
      }

    }


  randomLimit += 0.0006;
  randomLimit2 += 0.0015
}
}

function generateBorders(){

  for(let y = 0; y < window.innerHeight + borderTileSize; y += borderTileSize){
    for(let x = 0; x < borderTileSize*numCols; x += borderTileSize){
      leftArray[i] = {}
      if( Math.random()*(x+1) < 0.5){
        leftArray[i].draw = true;
      }else{
        leftArray[i].draw = false;
      }
      i += 1;
    }
  }

  i = 0;

  for(let y = 0; y < window.innerHeight + borderTileSize; y += borderTileSize){
    for(let x = window.innerWidth - borderTileSize; x >= window.innerWidth - borderTileSize*numCols; x -= borderTileSize){
      rightArray[i] = {}
      if( Math.random()*(tempX+1) < 0.2){
        rightArray[i].draw = true;
      }else{
        rightArray[i].draw = false;
      }
      i += 1;
      tempX += 1;
    }
    tempX = 0;
  }
}
