import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';

function combinations(arr:any, k:any) {
  const result:any = [];
  
  function backtrack(temp:any, start:any) {
    if (temp.length === k) {
      result.push([...temp]);
      return;
    }
    
    for (let i = start; i < arr.length; i++) {
      temp.push(arr[i]);
      backtrack(temp, i + 1);
      temp.pop();
    }
  }
  
  backtrack([], 0);
  return result;
}

const numbers = [27, 28, 29];
const groupSize = 5;


//RESPONSIVE SCREEN
const screenSize = () => {
    let isSafe
    var game = {
      width : 0,
      height : 0,
      safeWidth : 0,
      safeHeight: 0
    }
  
    var viewport, newGameWidth, newGameHeight, newGameX, newGameY, baseWidth, baseHeight, screentype;
  
    if(window.innerWidth>window.innerHeight){
      screentype = "landscape";
      baseWidth = 1920;
      baseHeight = 1080
      game = {
          width: 1280,
          height: 800,
          safeWidth: 1024,
          safeHeight: 720
      }
    }else{
      screentype = "portrait";
      baseWidth= 1180;
      baseHeight = 1920; 
      game = {
          width: 800,
          height: 1280,
          safeWidth: 720,
          safeHeight: 1024
      }
    }
  
    viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  
    // Determine game size
    if (game.height / game.width > viewport.height / viewport.width) {
      if (game.safeHeight / game.width > viewport.height / viewport.width) {
        // A
        newGameHeight = viewport.height * game.height / game.safeHeight;
        newGameWidth = newGameHeight * game.width / game.height;
        isSafe = 'A'
      } else {
        // B
        // triggers when landscape mode starts scaling
        newGameWidth = viewport.width;
        newGameHeight = newGameWidth * game.height / game.width;
        isSafe = 'B'
      }
    } else {
      if (game.height / game.safeWidth > viewport.height / viewport.width) {
        // C
        newGameHeight = viewport.height;
        newGameWidth = newGameHeight * game.width / game.height;
        isSafe = 'C'
      } else {
        // D
        newGameWidth = viewport.width * game.width / game.safeWidth;
        newGameHeight = newGameWidth * game.height / game.width;
        isSafe = 'D'
      }
    }
  
    newGameX = (viewport.width - newGameWidth) / 2;
    newGameY = (viewport.height - newGameHeight) / 2;
  
    return {
      screentype,
      newGameX,
      newGameY,
      newGameWidth,
      newGameHeight,
      baseWidth,
      baseHeight,
      game,
      isSafe
    }
  }

const arrayRandomizer = (array:any)=> {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}
const symbolRandomizer = (arr:Array<any>) =>{
    let val = arr[Math.floor(Math.random()*arr.length)]
    return val - 1;
}
const random2Number = (min:number,max:number)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min
}
const loadTexture = (textureArray:any,objKey:string,texture:string) =>{
   return PIXI.Sprite.from(textureArray[`${objKey}`].textures[`${texture}.png`]);
}
//GET SPRITE
const animatedSprite = (spritesheet:any,animationName:string) => {
    const sprite = new PIXI.AnimatedSprite(spritesheet.animations[`${animationName}`]);
    return sprite
}
const loadSpine = (textureArray:any,objKey:string)=>{
   return new Spine(textureArray[`${objKey}`].spineData)
}
const loadSpineAnimation = (spine:any,animation:string,loop:boolean,animationSpeed:number)=>{
    if (spine.state.hasAnimation(`${animation}`)) {
        // run animation
        spine.state.setAnimation(1, `${animation}`, loop);
        // animation spee
        spine.state.timeScale = animationSpeed;
        // update yourself
        spine.autoUpdate = true;
        // return spine.stage
        return spine
    }
}
const hasConsecutiveSameValues=(arr:Array<any>)=> {
  let count = 1; 
  let arrRes:Array<any> = []
  let arrType:number = 0 ;
  let zeroWild:number = 0;
  for (let i = 0; i < arr.length; i++) {
      arrRes.push({block:arr[i].blockNo,payout:arr[i].pattern.payout,type:arr[i].pattern.type,symbol:arr[i].pattern.symbol})
  }
  for (let i = 1; i < arr.length; i++) {
      if(i-1 == 0 && arr[0].pattern.type == 11){
          count++;
          zeroWild++
      }
      if(zeroWild>0){
          if(i > 1){
              if(i<3){
                  if (arr[i].pattern.type == arr[i-1].pattern.type || arr[i].pattern.type == 11 || arr[i-1].pattern.type == 11  ) {
                      count++;
                      arrType = arr[i-1].pattern.type
                  } else {
                      break; 
                  } 
              }
              else{
                  if (arr[i].pattern.type == arr[i-1].pattern.type || arr[i].pattern.type == 11 || arr[i].pattern.type == arr[i-2].pattern.type  ) {
      
                      count++;
                      arrType = arr[i-1].pattern.type
                  } else {
                      break; 
                  } 
              }
                          
          }
      }else{
          if (arr[i].pattern.type == arr[i-1].pattern.type || arr[i].pattern.type == 11   ) {
              count++;
              arrType = arr[i-1].pattern.type
          } else {
              break; 
          }
      }
  } 
  return {count:count,blocks:arrRes,arrTypes:arrType};      
}  
const numberWithCommas =(x:number)=> {
    let num:any = Math.round(x * 100) / 100
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//RANDMON INT
const getRandomInt = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}
  
// const textt
export default{
    arrayRandomizer,
    symbolRandomizer,
    loadTexture,
    hasConsecutiveSameValues,
    numberWithCommas,
    getRandomInt,
    loadSpineAnimation,
    loadSpine,
    animatedSprite,
    random2Number,
    screenSize
}