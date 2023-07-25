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

    private blockWidth:number = 250
    private blockHeight:number = 230
    private blockSpacing:number = 250
    private reelPosX:Array<number> = [384,672,966,1263,1538.5]
    private maskPosX:Array<number> = [220,520,820,1118,1415]
    private reelEffectPosX:Array<number> = [369,666,967.5,1263,1558.5]
    private maskPosY:number = 130
    public reelContainer:Array<any> = []
    public reelsSymbols:Array<any> = []
    private spinCount:number= 0
    public isSpinning:boolean = false
    public notLongPress:boolean = true
    public levelBarContainer:PIXI.Container
    public levelBarIndicator:PIXI.Sprite
    public maskSprite:PIXI.Sprite

    public readonly bonusType:number = 10

    private reelY:number = -2005.2
    // private reelY:number = -6773.7
    public timeScale:number = 0
    public autoPlayCount:number = 0
    private spinType:string = ''
    private spinDuration:number = 0

    private preGeneratedTypes:Array<any> = []
    private reelEffect:Array<any> = []
    private spinReelAnimation:Array<any> = []

    public bonusSymbolsCount:number = 0

    // payline animation
    public paylines:Array<any> = []

    public generateTypeIndex:number = 0

    private animateDone:boolean = true;

    // payout
    public totalWin:number = 0

    //methods
    private onSpinEnd:(index:number)=>void
    private onSpinning:()=>void
    private reelContainWildAndBonus:(index: number)=>void

    private reelsSymbolsTop1:Array<any> = []
    private reelsSymbolsTop2:Array<any> = []
    private reelsSymbolsTop3:Array<any> = []
    private reelsSymbolsTop4:Array<any> = []
    private reelsSymbolsTop5:Array<any> = []

    //freespin
    private symbolCount = 0
    private symbolCount2 = 0
    private symbolCount3= 0
    public winFreeSpin = 0
    public isFreeSpin:boolean = false
    public isFreeSpinDone:boolean = true
    public freeSpinStart:boolean = false
    public autoplayDoneEvent:boolean = true
    public startCountWinFreeSpin:boolean = false
    public isMatchingGame:boolean = false
    public isBonusTick:boolean = false

    public wheelIndex:number;
    public testText:PIXI.Text;

    private reelsValues:Array<Array<number>> = [
        // [3,4,3,11,10,1,2,4,11,8,4,11,2,9,3,10,1,4,5,9,2,6,8,6,9,3,9,7,1,7],
        // [2,8,3,11,10,7,3,11,9,1,4,2,3,4,4,7,5,10,5,9,2,6,8,6,9,3,9,11,1,7],
        // [1,2,9,3,10,2,3,9,8,10,2,4,11,4,2,11,5,9,5,9,2,6,8,6,9,3,11,7,1,7],
        // [1,1,1,1,11,4,1,1,11,1,4,10,11,11,1,1,4,1,5,9,2,6,8,11,9,3,9,7,1,7],
        // [11,5,9,2,4,6,11,11,2,9,10,5,3,3,8,11,4,5,3,5,8,9,1,6,6,11,3,7,3,2]
        // [3,4,3,2,2,1,3,10,5,11,6,1],
        // [2,8,3,11,10,7,11,1,1,11,3,1],
        // [1,2,9,3,2,2,11,1,1,11,10,1],
        // [1,1,1,1,11,4,11,2,1,11,10,1],
        // [11,5,9,2,4,6,11,3,1,11,10,1]
        [4,4,4,4,4,1,3,4,5,11,6,1],
        [2,8,3,4,4,4,4,1,1,11,3,1],
        [1,2,9,3,4,4,4,1,1,4,10,1],
        [1,1,4,1,4,4,4,2,4,4,10,1],
        [11,5,9,2,4,6,11,3,1,11,10,1]
    ]

    private textStyle:PIXI.TextStyle
    public eventStart:boolean = false

    constructor(app:PIXI.Application,textureArray:any,onSpinEnd:(index:number)=>void,onSpinning:()=>void,reelContainWildAndBonus:(index: number)=>void){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container
        this.reelsContainer = new PIXI.Container

        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 50,
            fontWeight: 'bolder',
            fill: ['#95EBFF', '#44C6ED'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 0,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });

        this.onSpinEnd = onSpinEnd
        this.onSpinning = onSpinning
        this.reelContainWildAndBonus = reelContainWildAndBonus

        this.init()
    }

    private init(){
        this.createParent()
        this.createReels()
    }

    private createParent(){
        const frameX = 95
        const frameY = 70
        this.frameBg = Functions.loadTexture(this.textureArray,'slot_frame_controller','frame_bg')
        this.frameBg.width = 1510
        this.frameBg.height = 765
        this.frameBg.y = ((this.baseHeight - this.frameBg.height)/2) - 30
        this.frameBg.x = (this.baseWidth - this.frameBg.width)/2 
        this.container.addChild(this.frameBg)

        this.frameBorder = Functions.loadTexture(this.textureArray,'slot_frame_controller','frame')
        this.frameBorder.width = 1682
        this.frameBorder.height = 886
        this.frameBorder.x = this.frameBg.x - frameX + 8
        this.frameBorder.y = this.frameBg.y - frameY
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

            const reelEffect = new Spine(this.textureArray.reel_effect.spineData)
            reelEffect.height = this.frameBorder.height *1.08
            reelEffect.width*=1.1
            reelEffect.x = this.reelEffectPosX[index]
            reelEffect.y = 535
            reelEffect.visible = false
            this.reelEffect.push(reelEffect)
            this.container.addChild(reelEffect)  
            reelEffect.zIndex = 1000
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
        while(this.reelsSymbolsTop1.length){
            this.reelsSymbolsTop1.pop()
            this.reelsSymbolsTop2.pop()
            this.reelsSymbolsTop3.pop()
            this.reelsSymbolsTop4.pop()
            this.reelsSymbolsTop5.pop()
        }
        // this.reelsSymbols.forEach((data:any,index:number)=>{
        //     this.checkReelTopValue(index)
        // })
         this.bonusSymbolsCount = 0
         //this.soundStop(5)
         this.spinType = spinType
         this.symbolCount = 0
         this.symbolCount2 = 0
         this.symbolCount3 = 0
         this.paylines = []
         let hiddenReelY = -100
         let dY =250
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
                     //reset the alpha value of symbols to 1 on spin
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
                             this.onSpinning()
                             if(spin.repeat() !== 2 && spin.repeat() !== 4 && spin.repeat() !== 6){
                                 if(data.y > hiddenReelY){
                                     this.reelContainer[index].children[3].y = 0
                                     this.reelContainer[index].children[4].y = 260
                                     this.reelContainer[index].children[5].y = 520
                                 }
                             }
                             if(this.timeScale == 10 && spinType !== 'turbo'){
                                 spin.timeScale(this.timeScale)
                             }
                         },
                         onComplete:()=>{
                             if(!this.isFreeSpin || this.freeSpinStart){
                             this.reelEffectShow(index)
                             }
                             //this.playSound(4);
                             spin.kill()         
                             if(this.isFreeSpin && !this.isFreeSpinDone){
                                this.generateNewSymbolsEvent(index)
                                //console.log("GENERATE SYMBOLS EVENT")  
                            }else{
                                this.generateNewSymbols(index)
                                //console.log("GENERATE SYMBOLS")  
                            }      
                               
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
                                     if(this.isFreeSpin){
                                        this.reelContainWildAndBonus(index)
                                    }
                                     if(this.spinCount == 5){
                                         this.maskSprite.height = this.frameBorder.height 
                                         this.maskSprite.y = this.frameBorder.y 
                                         this.spinReelAnimation = []
                                         this.generateTypeIndex = 0
                                         this.checkPattern()            
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
                                         this.onSpinEnd(index)
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
                // if(!this.sound[11].playing()){
                //     this.playSound(11)
                // }
                Functions.loadSpineAnimation(this.reelEffect[2],'animation',true,1)
                if(!this.freeSpinStart){
                this.spinReelAnimation[2].repeat(2)
                }
                if(i == 3){
                    if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType) && (this.preGeneratedTypes[2][0] == this.bonusType || this.preGeneratedTypes[2][1] == this.bonusType || this.preGeneratedTypes[2][2] == this.bonusType)){
                        if(!this.freeSpinStart){
                            this.spinReelAnimation[3].repeat(4)
                        }
                        this.isBonusTick = true
                    }
                }
                if(i == 4){
                    if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && 
                    (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType) && 
                    (this.preGeneratedTypes[2][0] == this.bonusType || this.preGeneratedTypes[2][1] == this.bonusType || this.preGeneratedTypes[2][2] == this.bonusType) &&
                    (this.preGeneratedTypes[3][0] == this.bonusType || this.preGeneratedTypes[3][1] == this.bonusType || this.preGeneratedTypes[3][2] == this.bonusType)){
                        if(!this.freeSpinStart){
                         this.spinReelAnimation[4].repeat(6)
                        }
                        this.isBonusTick = true
                    }
                }
            }
            if(this.isFreeSpin){
               // this.playSound(11)
                Functions.loadSpineAnimation(this.reelEffect[2],'animation',true,1)
            }
        }
    }
    public generateNewSymbols(i:number){
        this.reelContainer[i].removeChildren()
        // let testText = new PIXI.Text('99', this.textStyle)
        // testText.x =  -30
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
        
        this.checkReelTopValue(i)
    }
    private generateNewSymbolsEvent(i:number){
        let arr:Array<any> = new Array(12).fill(null)
        this.reelContainer[i].removeChildren()
        arr.forEach((data,index)=>{
            let reelValue = this.reelsValues[i]
            let symbolIndex = reelValue[Math.floor(Math.random() * reelValue.length)]
            
            let newSymbol1 = [9,0,4,2,3]
            let newSymbol2 = [1,9,6,1,4]
            let newSymbol3 = [4,3,9,2,2]
            let type:any;
            let payout:any;
            let symbol:any;
           
            if(index==0){
               
                type = json.symbolAssets[newSymbol1[this.symbolCount]].type
                payout = json.symbolAssets[newSymbol1[this.symbolCount]].pay
                symbol = new Spine(this.textureArray[`${json.symbolAssets[newSymbol1[this.symbolCount]].symbol}`].spineData)
                this.symbolCount++     
            }
            else if(index ==1){
                type = json.symbolAssets[newSymbol2[this.symbolCount2]].type
                payout = json.symbolAssets[newSymbol2[this.symbolCount2]].pay
                symbol = new Spine(this.textureArray[`${json.symbolAssets[newSymbol2[this.symbolCount2]].symbol}`].spineData)
                this.symbolCount2++ 
            }
            else if(index ==2){
                type = json.symbolAssets[newSymbol3[this.symbolCount3]].type
                payout = json.symbolAssets[newSymbol3[this.symbolCount3]].pay
                symbol = new Spine(this.textureArray[`${json.symbolAssets[newSymbol3[this.symbolCount3]].symbol}`].spineData)
                this.symbolCount3++ 
            }
            else{
                 type = json.symbolAssets[symbolIndex-1].type
                 payout = json.symbolAssets[symbolIndex-1].pay
                 symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
            }
            
            // let type = json.symbolAssets[symbolIndex-1].type
            // let payout = json.symbolAssets[symbolIndex-1].pay
            // let symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
           
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
    private reelEffectShow(index:number){
        if(index == 2 && !this.isFreeSpin){
            this.reelEffect[2].visible = false
            if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType) && (this.preGeneratedTypes[2][0] == this.bonusType || this.preGeneratedTypes[2][1] == this.bonusType || this.preGeneratedTypes[2][2] == this.bonusType)){
                this.reelEffect[3].visible = true
                Functions.loadSpineAnimation(this.reelEffect[3],'animation',true,1)
               // this.playSound(11)
            }
        }
        if(index == 3 && !this.isFreeSpin){
            this.reelEffect[2].visible = false
            this.reelEffect[3].visible = false
            if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && 
            (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType) && 
            (this.preGeneratedTypes[2][0] == this.bonusType || this.preGeneratedTypes[2][1] == this.bonusType || this.preGeneratedTypes[2][2] == this.bonusType) &&
            (this.preGeneratedTypes[3][0] == this.bonusType || this.preGeneratedTypes[3][1] == this.bonusType || this.preGeneratedTypes[3][2] == this.bonusType)){
                this.reelEffect[4].visible = true
                Functions.loadSpineAnimation(this.reelEffect[4],'animation',true,1)
              //  this.playSound(11)
                
            }
        }
        if(index == 4  && !this.isFreeSpin){
            this.reelEffect[4].visible = false
        }

        if(this.isFreeSpin && index == 0){
            this.reelEffect[2].visible = true
            this.isBonusTick = true
        }

        if(index == 4  && this.isFreeSpin){
            this.reelEffect[2].visible = false
        }
    }
    // private reelContainWildAndBonus(i:number){
    //     this.reelsSymbols[i].forEach((data:any,index:number)=>{
    //         if(index > 8){
    //             if(data.type == 10){ 
    //                // this.playSound(18)
    //                 //this.soundVolume(18,0.2)
    //                 Functions.loadSpineAnimation(data.symbol,'open',false,1.1)
    //                 const globalPos = data.symbol.getGlobalPosition() 
                   
    //                 this.createWildCoin(this.reelContainer[i].x,globalPos.y-100)
    //                // this.levelBarIndicator.width++
    //                // Math.round(this.levelBarIndicator.width)
    //                 // reset level bar and start matching game
    //                 // if( Math.round(this.levelBarIndicator.width) == this.levelBarWidth){
    //                 //     this.autoPlayCount = 0
    //                 //     this.levelBarIndicator.width = this.levelBarWidth
    //                 //     this.isMatchingGame = true
    //                 //   //  this.matchingGame()
    //                 // }
    //             }
    //             if(data.type == this.bonusType){
    //                 this.bonusSymbolsCount++
    //                 if(this.bonusSymbolsCount > 1){
    //               //      this.playSound(10)
    //                 }else{
    //                //     this.playSound(9)
    //                 }
    //                 Functions.loadSpineAnimation(data.symbol,'fall',false,0.6)
    //             }
    //         }
    //     })
    // }
    private createWildCoin(coinX:number,coinY:number){
        // let levelBarX = this.levelBarIndicator.getGlobalPosition().x
        // let levelBarY = this.levelBarIndicator.y
        let barPosX = 0
        let barPosY = 0
        let duration = 1

        barPosX = 130
        barPosY = 450

        for(let i = 0;i<=3;i++){
            const coin = Functions.animatedSprite(this.textureArray['coins'],'new_coin_spinning')
            coin.scale.set(0.15)
            coin.x = (coinX)
            coin.y = (coinY)
            coin.alpha = 0.4
            coin.animationSpeed = 0.5
            coin.play();
            let coinAnimation = gsap.to(coin,{
                y:barPosY,
                x:barPosX - (coin.width/2),
                alpha:1,
                delay:i*0.1,
                duration:duration,
                onComplete:()=>{
                    coinAnimation.kill()
                    if(i == 0){
                      //  this.playSound(19)
                      //  this.soundVolume(19,0.2)
                    }
                    let coinFade = gsap.to(coin,{
                        delay:0.5,
                        duration:0.3,
                        alpha:0,
                        onComplete:()=>{
                            coinFade.kill()
                            this.container.removeChild(coin)
                        }
                    })
                }
            })
            this.container.addChild(coin)
        }
    }
    private checkReelTopValue(i:number){
        let j = 0
      // console.log( this.reelContainer[i])
       
       if(i==0){
        this.reelsSymbols[i].forEach((data:any,index:number)=>{
            if(index<3){
                this.reelsSymbolsTop1.push(this.reelsSymbols[i][index].type)
            }
        })
       // console.log(this.reelsSymbolsTop1,"1")
       }
       if(i==1){
        this.reelsSymbols[i].forEach((data:any,index:number)=>{
            if(index<3){
                this.reelsSymbolsTop2.push(this.reelsSymbols[i][index].type)
            }
        })
      //  console.log(this.reelsSymbolsTop2,"2")
       }
       if(i==2){
        this.reelsSymbols[i].forEach((data:any,index:number)=>{
            if(index<3){
                this.reelsSymbolsTop3.push(this.reelsSymbols[i][index].type)
            }
        })
       // console.log(this.reelsSymbolsTop3,"3")
       }
       if(i==3){
        this.reelsSymbols[i].forEach((data:any,index:number)=>{
            if(index<3){
                this.reelsSymbolsTop4.push(this.reelsSymbols[i][index].type)
            }
        })
       // console.log(this.reelsSymbolsTop4,"4")
       }
       if(i==4){
        this.reelsSymbols[i].forEach((data:any,index:number)=>{
            if(index<3){
                this.reelsSymbolsTop5.push(this.reelsSymbols[i][index].type)
            }
        })
      //  console.log(this.reelsSymbolsTop5,"5")
       }

    }
    private updateVisibleBlocks(index:number){
        let firstPosY =  2250
        let secondPosY = 2500
        let thirdPosY = 2750
  
        let topThree = this.reelsSymbols[index].filter((data:any,index:number)=> index < 3)
        this.reelsSymbols[index].forEach((data:any,i:number)=>{
            this.testText = new PIXI.Text('99', this.textStyle)
            this.testText.x =  -30
            this.testText.y =  30
            
            
            // hide the top symbols
            if(i > 2){
                data.symbol.alpha = 0
            }

            //Will Occur when Event Start
            if(this.eventStart){
                if(data.type == this.wheelIndex){
                    this.reelContainer[index].children[i].addChild(this.testText)
                    this.animatePatterns(index,i)
                }
            }
        
            // show the visible symbols
            if(i == 9){
                data.type = topThree[0].type
                data.symbol = topThree[0].symbol
                data.payout = topThree[0].payout
                this.reelContainer[index].children[9] = data.symbol
                this.reelContainer[index].children[9].y = firstPosY
            }
            if(i == 10){
                data.type = topThree[1].type
                data.symbol = topThree[1].symbol
                data.payout = topThree[1].payout
                this.reelContainer[index].children[10] = data.symbol
                this.reelContainer[index].children[10].y = secondPosY
            }
            if(i == 11){
                data.type = topThree[2].type
                data.symbol = topThree[2].symbol
                data.payout = topThree[2].payout
                this.reelContainer[index].children[11] = data.symbol
                this.reelContainer[index].children[11].y = thirdPosY
            }
   
            data.symbol.width = this.blockWidth
            data.symbol.height = this.blockHeight
        })

        if(this.autoPlayCount == 0){
            this.onSpinEnd(index)
        }
    }
    private checkPattern(){
        let arr = Array.from({length: json.pattern.length}, (_, index) => index)
        this.paylines = []
        let countsArray:Array<any> = []

        json.pattern.forEach((blocks,index)=>{
            let pattern:Array<any> = []
            if(index == arr[index]){
                this.containPattern(blocks,pattern)
            }
           
            countsArray.push(Functions.hasConsecutiveSameValues(pattern))
        })

        countsArray.forEach((data,index)=>{
            if(index == arr[index] && data.count>2){
                let totalLinePay:number = 0
                let notWild:number = 0
                let eventMultiplier:number = 0
                let lineSymbols:Array<any> = []
                    for(let i=0;i<data.count;i++){
                        //add animation
                        lineSymbols.push(data.blocks[i].type)
                        // validate not to match bonus and wild symbol
                        if(lineSymbols.length == data.count){
                            if(!lineSymbols.includes(10) || !lineSymbols.includes(11)){
                                lineSymbols.forEach((el,i)=>{
                                        if(data.blocks[i].type != 11){
                                            notWild = i
                                        }
                                        if(data.blocks[i].type == 11){
                                            data.blocks[i].payout = data.blocks[notWild].payout
                                        }
                                        totalLinePay+=data.blocks[i].payout
                                        this.totalWin += data.blocks[i].payout
                                        this.animatePatterns(i,data.blocks[i].block)              
                              
                                })
                            }
                        }
                    }
                if(data.arrTypes == this.bonusType && !this.freeSpinStart){
                    this.freeSpinStart = true
                }
                // validate not to add payline bonus and wild symbol
                if(lineSymbols.length == data.count){
                    if(!lineSymbols.includes(10) || !lineSymbols.includes(11)){
                        this.paylines.push({payline:index+1,symbols:lineSymbols,payout:totalLinePay})
                    }
                }
            }
        })
    }
    private containPattern(blocks:Array<number>,arr:Array<any>){
        blocks.forEach((blockNo,index)=>{
            arr.push({pattern:this.reelsSymbols[index][blockNo],blockNo:blockNo})
        })
    }
    private animatePatterns(reelIndex:number,blockIndex:number){
        let symbol = this.reelsSymbols[reelIndex][blockIndex]
        Functions.loadSpineAnimation(symbol.symbol,'animation',true,0.8)
        //this.playSound(5);
        this.animateDone = false
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