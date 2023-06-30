import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {Spine} from 'pixi-spine';
import Functions from './settings/Functions';
import json from './settings/settings.json'

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

export default class Slot{

    //app settings
    private app:PIXI.Application
    private textureArray:any
    private baseWidth:number
    private baseHeight:number
    public container:PIXI.Container
    private reelsContainer:PIXI.Container

    public frameBg:PIXI.Sprite
    public frameBorder:PIXI.Sprite

    private blockWidth:number = 280
    private blockHeight:number = 260
    private blockSpacing:number = 258
    private reelPosX:Array<number> = [366.5,668.5,966,1263,1558.5]
    private maskPosX:Array<number> = [220,520,820,1118,1415]
    private reelEffectPosX:Array<number> = [369,666,967.5,1263,1558.5]
    private maskPosY:number = 130
    public reelContainer:Array<any> = []
    private reelsSymbols:Array<any> = []
    private spinCount:number= 0
    public isSpinning:boolean = false
    public notLongPress:boolean = true
    public levelBarContainer:PIXI.Container
    public levelBarIndicator:PIXI.Sprite
    public maskSprite:PIXI.Sprite

    private readonly bonusType:number = 10

    private reelY:number = -6713.7
    // private reelY:number = -6773.7
    public timeScale:number = 0
    public autoPlayCount:number = 0
    private spinType:string = ''
    private spinDuration:number = 0

    private preGeneratedTypes:Array<any> = []
    private reelEffect:Array<any> = []
    private spinReelAnimation:Array<any> = []

    private bonusSymbolsCount:number = 0

    // payline animation
    public paylines:Array<any> = []

    public generateTypeIndex:number = 0

    private animateDone:boolean = true;
    public freeSpinStart:boolean = false

    private reelsValues:Array<Array<number>> = [
        [3,4,3,11,10,1,2,4,11,8,4,11,2,9,3,10,1,4,5,9,2,6,8,6,9,3,9,7,1,7],
        [2,8,3,11,10,7,3,11,9,1,4,2,3,4,4,7,5,10,5,9,2,6,8,6,9,3,9,11,1,7],
        [1,2,9,3,10,2,3,9,8,10,2,4,11,4,2,11,5,9,5,9,2,6,8,6,9,3,11,7,1,7],
        [1,1,1,1,11,4,1,1,11,1,4,10,11,11,1,1,4,1,5,9,2,6,8,11,9,3,9,7,1,7],
        [11,5,9,2,4,6,11,11,2,9,10,5,3,3,8,11,4,5,3,5,8,9,1,6,6,11,3,7,3,2]
    ]




    constructor(app:PIXI.Application,textureArray:any){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container
        this.reelsContainer = new PIXI.Container

        this.init()
    }

    private init(){
        this.createParent()
        this.createReels()

    }

    private createParent(){
        const frameX = 95
        const frameY = 70
        this.frameBg = Functions.loadTexture(this.textureArray,'frame','slot_frame_bg')
        this.frameBg.width = 1490
        this.frameBg.height = 765
        this.frameBg.y = ((this.baseHeight - this.frameBg.height)/2) - 30
        this.frameBg.x = (this.baseWidth - this.frameBg.width)/2 
        this.container.addChild(this.frameBg)

        this.frameBorder = Functions.loadTexture(this.textureArray,'frame','slot_frame')
        this.frameBorder.width = 1682
        this.frameBorder.height = 886
        this.frameBorder.x = this.frameBg.x - frameX
        this.frameBorder.y = this.frameBg.y - frameY - 3
        this.container.addChild(this.frameBorder)
    }

    private createReels(){
        let arr:Array<any> = []
        for(let i=0;i<this.reelsValues.length;i++){
            const container = new PIXI.Container
            container.zIndex = 10000
            arr = this.createReel(i)
            arr.forEach((data,index)=>{
                container.addChild(data.symbol)
                data.symbol.y = index * this.blockSpacing
                data.symbol.width = this.blockWidth
                data.symbol.height = this.blockHeight
            })
            this.reelsSymbols.push(arr)
            this.reelContainer.push(container)
        }
        
        this.reelContainer.forEach((data,index)=>{
            data.x = this.reelPosX[index]
            data.y = this.reelY
            this.reelsContainer.addChild(data)
            this.container.addChild(this.reelsContainer)


        })
        //create mask for reels
        this.maskSprite = Functions.loadTexture(this.textureArray,'frame','mask_big') 
        this.maskSprite.height = 1490 
        this.maskSprite.width = this.frameBorder.width 
        this.maskSprite.x = this.frameBorder.x
        this.maskSprite.y = this.frameBg.y-6
        this.reelsContainer.mask = this.maskSprite
        this.container.addChild(this.maskSprite)
    }

    private createReel(index:number){
        let arr:Array<any> = []
        let reelValue = this.reelsValues[index]
        for(let i = 0;i<reelValue.length;i++){
            const index = reelValue[Math.floor(Math.random() * reelValue.length)]
            const value = json.symbolAssets[index-1].symbol
            const type = json.symbolAssets[index-1].type
            const payout = json.symbolAssets[index-1].pay
            const symbol = new Spine(this.textureArray[`${value}`].spineData)
            symbol.skeleton.setSkinByName('no_blur')
            let data = {
                type:type,
                symbol:symbol,
                payout:payout
            }
            arr.push(data)
        }
        return arr
    }

    public startSpin(spinType:string){
         this.bonusSymbolsCount = 0
         //this.soundStop(5)
         this.spinType = spinType
        //  this.symbolCount = 0
        //  this.symbolCount2 = 0
        //  this.symbolCount3 = 0
         this.paylines = []
         let hiddenReelY = -100
         let dY = 250
         let bounceOffset = this.reelY-30
         let durationBounceUp:number;
         let delay:number;
         let bounceContainerArr:Array<any> = []
        // this.onSpin()
         switch(spinType){
             case 'normal':
                 durationBounceUp = 0.4
                 this.spinDuration = 1
                 delay = 0.3
             break;
             case 'quick':
                 durationBounceUp = 0.2
                 this.spinDuration = 0.3
                 delay = 0.1
             break;
             case 'turbo':
                 durationBounceUp = 0.2
                 this.spinDuration = 0.1
                 delay = 0
             break;
             default:
                 durationBounceUp = 0.4
                 this.spinDuration = 1
                 delay = 0.5
             break
         }
         
         this.reelContainer.forEach((data,index)=>{
             this.isSpinning = true
             let bounceStart = gsap.to(data, {
                 delay:index*delay,
                 duration:durationBounceUp,
                 y:bounceOffset,
                 onStart:()=>{
                     if(this.timeScale == 10 && spinType !== 'turbo'){
                         bounceContainerArr[0].delay(0)
                         bounceContainerArr[1].delay(0)
                         bounceContainerArr[2].delay(0)
                         bounceContainerArr[3].delay(0)
                         bounceContainerArr[4].delay(0)
                     }
                     // reset the alpha value of symbols to 1 on spin
                     this.resetTopSymbolsAlpha(index)
                 },
                 onComplete:()=>{
                     bounceStart.kill()
                     let spin = gsap.to(data, {
                         duration: this.spinDuration,
                         y: dY+50,
                         ease: "bounce.in",
                         onStart:()=>{
                             this.applyMotionBlur(index,true)
                             this.spinReelAnimation.push(spin)
                               this.generateTypes(this.generateTypeIndex) 
                               
                             this.generateTypeIndex++
                         },
                         onUpdate:()=>{
                             //this.onSpinning()
                             if(spin.repeat() !== 2 && spin.repeat() !== 4 && spin.repeat() !== 6){
                                 if(data.y > hiddenReelY){
                                     this.reelContainer[index].children[27].y = 0
                                     this.reelContainer[index].children[28].y = 260
                                     this.reelContainer[index].children[29].y = 520
                                 }
                             }
                             if(this.timeScale == 10 && spinType !== 'turbo'){
                                 spin.timeScale(this.timeScale)
                             }
                         },
                         onComplete:()=>{
                            //  if(!this.isFreeSpin || this.freeSpinStart){
                            //  this.reelEffectShow(index)
                            //  }
                             //this.playSound(4);
                             spin.kill()               
                                 this.generateNewSymbols(index)
                             let bounceStop = gsap.to(data,{
                                 y: dY,
                                 duration:0.3,
                                 ease: "power1.out",
                                 onComplete:()=>{
                                     bounceStop.kill()
                                     this.spinCount++
                                     data.y = this.reelY
                                     this.updateVisibleBlocks(index)
                                     this.applyMotionBlur(index,false)
                                     if(this.spinCount == 5){
                                         this.maskSprite.height = this.frameBorder.height 
                                         this.maskSprite.y = this.frameBorder.y 
                                         this.spinReelAnimation = []
                                         this.generateTypeIndex = 0
                                        // this.checkPattern()            
                                         this.spinCount = 0
                                         this.isSpinning = false
                                         //this.checkBalance()
                                         if(this.autoPlayCount > 1){
                                             let spinSpeed = 1000;
                                             if(spinType == 'turbo'){
                                                 spinSpeed = 200
                                             }else{
                                                 1000
                                             }
                                             if(!this.animateDone){
                                                 let settime = setTimeout(() => {
                                                     this.animateDone=true
                                                     this.startSpin(spinType)   
                                                     clearTimeout(settime);
                                                 }, spinSpeed);
                                             }else{
                                                 this.startSpin(spinType) 
                                             }
                                         }
                                         this.autoPlayCount--
                                        // set the credit base 
                                        // this.onSpinEnd()
                                        //console.log(this.autoPlayCount, " z")
                                        //  if(this.autoPlayCount == 0 && !this.autoplayDoneEvent) {
                                        //      this.createCongrats()
                                        //  }
                                     }
                                 }
                             })
                         }
                     })
                 }
             })
             bounceContainerArr.push(bounceStart)
             this.timeScale = 0
         })
     }
     private generateTypes(i:number){
        let arr = Functions.arrayRandomizer(this.reelsValues[i])      
        this.preGeneratedTypes.push(arr)
        if(i >= 2 ){
            if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType)){
                this.reelEffect[2].visible = true 
                Functions.loadSpineAnimation(this.reelEffect[2],'animation',true,1)
                if(!this.freeSpinStart){
                this.spinReelAnimation[2].repeat(2)
                }

            }
        }
    }
    public generateNewSymbols(i:number){
        this.reelContainer[i].removeChildren()
        this.preGeneratedTypes[i].forEach((data:any,index:number)=>{
            let symbolIndex = data
            let type = json.symbolAssets[symbolIndex-1].type
            let payout = json.symbolAssets[symbolIndex-1].pay
            let symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
            symbol.y = index * this.blockSpacing
            let el ={
                type:type,
                symbol:symbol,
                payout:payout
            }
            data = el
            this.reelsSymbols[i][index].type = data.type
            this.reelsSymbols[i][index].symbol = data.symbol
            this.reelsSymbols[i][index].payout = data.payout
            this.reelsSymbols[i][index].symbol.skeleton.setSkinByName('no_blur')
            this.reelContainer[i].addChild(data.symbol)
            symbol.width = this.blockWidth
            symbol.height = this.blockHeight
        })
    }
    private updateVisibleBlocks(index:number){
        let firstPosY = 6966
        let secondPosY = 7224
        let thirdPosY = 7482
        let topThree = this.reelsSymbols[index].filter((data:any,index:number)=> index < 3)
        this.reelsSymbols[index].forEach((data:any,i:number)=>{
            // hide the top symbols
            if(i > 2){
                data.symbol.alpha = 0
            }
            // show the visible symbols
            if(i == 27){
                data.type = topThree[0].type
                data.symbol = topThree[0].symbol
                data.payout = topThree[0].payout
                this.reelContainer[index].children[27] = data.symbol
                this.reelContainer[index].children[27].y = firstPosY
            }
            if(i == 28){
                data.type = topThree[1].type
                data.symbol = topThree[1].symbol
                data.payout = topThree[1].payout
                this.reelContainer[index].children[28] = data.symbol
                this.reelContainer[index].children[28].y = secondPosY
            }
            if(i == 29){
                data.type = topThree[2].type
                data.symbol = topThree[2].symbol
                data.payout = topThree[2].payout
                this.reelContainer[index].children[29] = data.symbol
                this.reelContainer[index].children[29].y = thirdPosY
            }
            data.symbol.width = this.blockWidth
            data.symbol.height = this.blockHeight
        })
    }
     private resetTopSymbolsAlpha(index:number){
        this.maskSprite.height = this.frameBg.height - 8
        this.maskSprite.y = this.frameBg.y + 8
        this.reelsSymbols[index].forEach((data:any,i:number)=>{
            data.symbol.alpha = 1
        })
    }
    private applyMotionBlur(index:number,onSpin:boolean){
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            data.symbol.skeleton.setSkinByName(onSpin?'blur':'no_blur')
        })
    }
}