require('../main.css')
import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from './Loader';
import {Spine} from 'pixi-spine';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {Howler} from 'howler';
import Slot from './Slot';
import Controller from './Controller';
import Modal from './Modal';
import Functions from './settings/Functions';
import json from './settings/settings.json'
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);
export default class Game{
    
    private app:PIXI.Application
    private textureArray:any
    private gameContainer:PIXI.Container;
    private wheelEventContainer:PIXI.Container;
    private baseWidth:number = 0
    private baseHeight:number = 0
    private roulette:PIXI.Sprite
    private roulette_arrow:PIXI.Sprite
    private roulette_circle:PIXI.Sprite

    private slotGame:Slot;
    private controller:Controller;
    private modal:Modal

    //background
    private background:PIXI.Sprite
    private frame:PIXI.Sprite
    private frameBG:PIXI.Sprite

    //buttons hover
    private autoplayHover: PIXI.Texture
    private checkHover: PIXI.Texture
    private exHover: PIXI.Texture
    private infoHover: PIXI.Texture
    private soundOnHover: PIXI.Texture
    private soundOffHover: PIXI.Texture
    private spinHover: PIXI.Texture
    private settingsHover: PIXI.Texture

    // values
    private betAmount:number = 1
    private betIndex:number = 0
    private userCredit:number = 999
    private matchingGameWin:number = 0
    private isAutoPlay:boolean = false
    private isMatchingGame:boolean = false

    //text values
    private buyBonusText:PIXI.Text
    private paylineText:PIXI.Text
    private paylineTextBottom:PIXI.Text
    private paylineGreetings:string
    //text style 
    private textStyle:PIXI.TextStyle
    private textStyle2:PIXI.TextStyle
    private textStyle3:PIXI.TextStyle
    private whiteYellow:PIXI.TextStyle
    private descText:PIXI.TextStyle
    private textStyleSize:number = 40
    //arrays 
    private paylineContainersAnimation:Array<any> = []
    private paylineAnimations:Array<any> = []

    private paylineContainer:PIXI.Container

    //texttures
    private textureToggleOn:PIXI.Texture
    private textureToggleOff:PIXI.Texture
    private textureRollOn:PIXI.Texture
    private textureRollOff:PIXI.Texture
    private spinTextureOn:PIXI.Texture
    private spinTextureOff:PIXI.Texture

    private spinType:string = 'normal'

    //sound 
    private sound:Array<any>;
    private globalSound:Boolean = false;
    private ambientCheck:Boolean = false;
    private sfxCheck:Boolean = false;
    //sound
    private sounBtnSpriteOn:PIXI.Texture
    private sounBtnSpriteOff:PIXI.Texture
    
    //bonus
    private buyBonusBtn:PIXI.Sprite
    private wheelDeg:Array<number> = [3600,3673,3745,3816,3887]

    //spines
    private popGlow:Spine
    private popGlow2:Spine
    private buyBonusFrame:PIXI.Sprite
    private overlay:PIXI.Sprite

    public readonly bonusType:number = 10

    private freeSpinStart:Boolean = false

    constructor(){
        this.gameContainer = new PIXI.Container
        this.wheelEventContainer = new PIXI.Container
        this.gameContainer.sortableChildren = true
        this.paylineContainer = new PIXI.Container
        this.whiteYellow = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 120,
            fontWeight: 'bolder',
            fill: ['#fffdfa', '#fec159'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: this.textStyleSize,
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
        this.textStyle2 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 120,
            fontWeight: 'bolder',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle3 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 30,
            fontWeight: 'bolder',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.descText = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 25,
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        new Loader(this.init.bind(this))
    }
    
    private init(res:any,app:PIXI.Application){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = res

        this.textureToggleOn = Functions.loadTexture(this.textureArray,'modal_settings_space','on').texture
        this.textureToggleOff = Functions.loadTexture(this.textureArray,'modal_settings_space','off').texture
        this.textureRollOn = Functions.loadTexture(this.textureArray,'modal_autoplay','roll_active').texture
        this.textureRollOff = Functions.loadTexture(this.textureArray,'modal_autoplay','roll').texture
        this.spinTextureOn = Functions.loadTexture(this.textureArray,'slot_frame_controller','spin').texture
        this.spinTextureOff = Functions.loadTexture(this.textureArray,'slot_frame_controller','spin_stop').texture
        this.sounBtnSpriteOff =  Functions.loadTexture(this.textureArray,'slot_frame_controller','volume_off').texture
        this.sounBtnSpriteOn =  Functions.loadTexture(this.textureArray,'slot_frame_controller','volume').texture

        //buttons Hover
        this.autoplayHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','autoplay_hover').texture
        this.infoHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','info_hover').texture
        this.soundOnHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','volume_hover').texture
        this.soundOffHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','volume_off_hover').texture
        this.spinHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','spin_hover').texture
        this.settingsHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','settings_hover').texture

        this.popGlow = new Spine(this.textureArray.pop_glow.spineData)
        this.popGlow2 = new Spine(this.textureArray.pop_glow.spineData)


        //overlay
        this.overlay = Functions.loadTexture(this.textureArray,'modal_main','overlay')
       // this.gameContainer.addChild(this.roulette)

        this.createBackground()
        this.createSlot()
        this.createController()
        this.createModal()
        this.events()
        this.createBuyBonus()
        this.updateTextValues()
        

        this.app.stage.addChild(this.gameContainer)
        this.gameContainer.addChild(this.wheelEventContainer)

          
        // this.app.stage.addChild(this.roulette)
        // this.app.stage.addChild(this.roulette_arrow)


       
        window.document.addEventListener('keydown', (e)=> {
            if(e.code === 'Space'  || e.key === 'Enter'){       
                if(!this.slotGame.isSpinning && !this.isAutoPlay){
                    this.controller.spinBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','spin_stop').texture
                    if(this.slotGame.notLongPress === true) {
                        this.slotGame.notLongPress = false;
                        this.startSpinAutoPlay(1)
                        this.slotGame.timeScale = 0
                    }else{
                        this.startSpinAutoPlay(1)
                        this.slotGame.timeScale = 10
                    }
                }else{
                    this.slotGame.timeScale = 10
                }
            }
           

        });

        window.document.addEventListener('keyup', ()=> {
            this.slotGame.notLongPress = true;
        });

        window.document.addEventListener('touchstart', (e)=> {
            if(!this.slotGame.isSpinning){
                if(this.slotGame.notLongPress === true) {
                    this.startSpinAutoPlay(5)
                    this.slotGame.timeScale = 0
                }else{
                    this.startSpinAutoPlay(5)
                    this.slotGame.timeScale = 10
                }
            }else{
                this.slotGame.timeScale = 10
            }
        });

    }  

    private createBackground(){
        this.background =  new PIXI.Sprite(this.textureArray.background.textures['background.png'])
        this.gameContainer.addChild(this.background)
        this.background.height = this.app.screen.height
        this.background.width = this.app.screen.width+500
    }

    private createSlot(){
        this.slotGame = new Slot(this.app,this.textureArray,this.onSpinEnd.bind(this),this.onSpinning.bind(this),this.reelContainWildAndBonus.bind(this))
        this.gameContainer.addChild(this.slotGame.container)
        this.slotGame.container.y = +80
    }

    private createController(){
        this.controller = new Controller(this.app,this.textureArray)
        this.createPaylineAnimation()
        this.gameContainer.addChild(this.controller.container)

    }

    private createModal(){
        this.modal = new Modal(this.app,this.textureArray)
        this.modal.closeModal.addEventListener('pointerdown',() =>{
           // this.playSound(1)
            
            this.controller.settingBtnSpite.interactive = true
            this.controller.autoPlay.interactive = true
        })
        // this.modal.closeModal.addListener('mouseover',() =>{
        //     this.playSound(2)
        // })
    }
    
    private createBuyBonus(){
        this.buyBonusBtn = Functions.loadTexture(this.textureArray,'bonus','buy_free_spin_btn')
        this.buyBonusBtn.interactive = true
        this.buyBonusBtn.cursor = 'pointer'
        this.buyBonusBtn.y = (this.baseHeight - this.buyBonusBtn.height)/2
        this.buyBonusText = new PIXI.Text(`${this.betAmount}`, this.textStyle)
        this.buyBonusText.x = (this.buyBonusBtn.width - this.buyBonusText.width)/2
        this.buyBonusText.y = (this.buyBonusBtn.height - this.buyBonusText.height) - 20
        this.buyBonusBtn.addChild(this.buyBonusText)
        this.gameContainer.addChild(this.buyBonusBtn)

        this.buyBonusBtn.addEventListener('pointerdown',()=>{
            this.buyBonusPopUp()
        })
    }

    private buyBonusPopUp(){
        let glowX = 956
        let glowY = 1044
        let dY = 420

        // buy bonus modal 
        // glow animation
        this.popGlow.x = glowX
        this.popGlow.y = glowY
        this.popGlow.alpha = 0
        this.popGlow.scale.x = 1.1
        this.popGlow.scale.y = 1.3
        Functions.loadSpineAnimation(this.popGlow,'glow',true,0.1)
        this.overlay.addChild(this.popGlow)
        
        this.buyBonusFrame = Functions.loadTexture(this.textureArray,'bonus','get_free_spin')
        this.buyBonusFrame.x = (this.baseWidth - this.buyBonusFrame.width)/2
        this.buyBonusFrame.y = dY
        //amount
        const amount = new PIXI.Text(`${this.betAmount}`, this.textStyle2)
        amount.x = (this.buyBonusFrame.width - amount.width)/2
        amount.y = (this.buyBonusFrame.height - amount.height) * 0.85
        this.buyBonusFrame.addChild(amount)
        //close buy btn
        const close = Functions.loadTexture(this.textureArray,'bonus','ex')
        close.interactive = true
        close.cursor = 'pointer'
        close.x = (close.width)
        close.y = (this.buyBonusFrame.height - close.height)*.84
        this.buyBonusFrame.addChild(close)
        //close buy btn
        const check = Functions.loadTexture(this.textureArray,'bonus','check')
        check.interactive = true
        check.cursor = 'pointer'
        check.x = (this.buyBonusFrame.width - check.width)*.85
        check.y = (this.buyBonusFrame.height - check.height)*.84
        this.buyBonusFrame.addChild(check)
        let sY = -this.buyBonusFrame.height
        // close.addListener('mouseover',() =>{
        //     this.playSound(2)
        // })
        // reject bonus
        // close.addEventListener('mouseenter',()=>{
        //     close.texture = this.exHover
        //  })
        //  close.addEventListener('mouseleave',()=>{
        //     close.texture =Functions.loadTexture(this.textureArray,'bonus','ex').texture
        //  })
        close.addEventListener('pointerdown',()=>{
            close.interactive = false
            close.texture =Functions.loadTexture(this.textureArray,'bonus','ex').texture
            //this.playSound(13) 
            this.hideBonusPopUp(dY,sY);
            //this.isOpenModal = false
        })
        // check.addListener('mouseover',() =>{
        //     this.playSound(2)
        // })
        // accept bonus
        // check.addEventListener('mouseenter',()=>{
        //    check.texture = this.checkHover
        // })
        // check.addEventListener('mouseleave',()=>{
        //     check.texture = Functions.loadTexture(this.textureArray,'bonus','check').texture
        // })
        check.addEventListener('pointerdown',()=>{
            check.texture = Functions.loadTexture(this.textureArray,'bonus','check').texture
           // this.playSound(12)
            this.slotGame.freeSpinStart = true
            this.slotGame.isFreeSpin = true
            this.hideBonusPopUp(dY,sY)
            check.interactive = false
            let timeOut = setTimeout(()=>{
                this.startSpinAutoPlay(1)
                //this.createEventSpin()
                clearTimeout(timeOut)
            },1000)
            let timeOut1 = setTimeout(()=>{
                check.interactive = true
                this.buyBonusFrame.removeChild(check)
                this.buyBonusFrame.removeChild(close)
                clearTimeout(timeOut1)
            },5000)
           
        })
        let bonusFrameShow = gsap.from(this.buyBonusFrame, {
            delay:.3,
            y:sY,
            onComplete:()=>{
                bonusFrameShow.kill()
                let bounceUp = gsap.to(this.buyBonusFrame,{
                    y:dY-160,
                    onComplete:()=>{
                        bounceUp.kill()
                        let fadeInGlow = gsap.to(this.popGlow,{
                            delay:0,
                            duration:1,
                            alpha:1,
                            onComplete:()=>{
                                fadeInGlow.kill()
                            }
                        }) 
                    }
                })
            }
        })
        this.overlay.addChild(this.buyBonusFrame)
        this.gameContainer.addChild( this.overlay)
    }

    private hideBonusPopUp(dY:number,sY:number){
       // this.enableButtons(true)
        let fadeOutGlow = gsap.to(this.popGlow,{
            duration:0.3,
            alpha:0,
            onComplete:()=>{
                fadeOutGlow.kill()
                this.overlay.removeChild(this.popGlow)
                let bonusFrameHide = gsap.to(this.buyBonusFrame, {
                    delay:0.2,
                    duration:0.2,
                    y:dY*1.2,
                    onComplete:()=>{
                        bonusFrameHide.kill()
                        let bounceDown = gsap.to(this.buyBonusFrame,{
                            duration:0.2,
                            y:sY,
                            onComplete:()=>{
                                bounceDown.kill()
                                this.gameContainer.removeChild(this.overlay)
                            }
                        })
                    }
                })
            }
        }) 
    }

    private createEventSpin(){
        
        this.roulette_arrow =  new PIXI.Sprite(this.textureArray.wheel.textures['roulette_arrow.png'])
        this.roulette =  new PIXI.Sprite(this.textureArray.wheel2.textures['wheel2.png'])
        this.roulette_circle =  new PIXI.Sprite(this.textureArray.wheel.textures['roulette_circle.png'])
        this.roulette.x = 960
        this.roulette.y = 500
        this.roulette.scale.set(0.1)
        this.roulette.anchor.set(0.5)
        this.roulette_arrow.x = this.roulette.x - (this.roulette_arrow.width/2)
        this.roulette_arrow.y = 130
        this.roulette_arrow.alpha = 0
        this.roulette_circle.alpha = 0
        this.roulette_circle.scale.set(0.84)

        this.roulette_circle.x = this.roulette.x - ( this.roulette_circle.width / 2)
       
        this.roulette_circle.y = this.roulette.y - ( this.roulette_circle.width / 2)

        this.wheelEventContainer.addChild(this.roulette)
        this.wheelEventContainer.addChild(this.roulette_arrow)
        this.wheelEventContainer.addChild(this.roulette_circle)
        this.gameContainer.addChild(this.wheelEventContainer)

        let wheelShow = gsap.to(this.roulette.scale,{
            x: 1,
            y: 1, 
            duration: 1, 
            ease: 'power2.out',
            onComplete:()=>{
                this.roulette_arrow.alpha = 1
                this.roulette_circle.alpha = 1
                wheelShow.kill()
            }
        })
        let timeOut = setTimeout(()=>{
            let tl = gsap.to(this.roulette,{
                //rotation:PIXI.DEG_TO_RAD*1800,
                rotation:PIXI.DEG_TO_RAD*this.wheelDeg[Math.floor(Math.random()*5)],
                duration:5,
                onUpdate: function() {
                    // if (tl.progress() > 0.7898) {
                    //     tl.timeScale(0.1);
                    // }
                    // console.log(this.roulette.rotation)
                    // tl.timeScale(1);
                   // console.log(tl.progress())
                   // console.log(this.wheelDeg[Math.random()*3])
                },
                onComplete:()=>{ 
                    let timeOut = setTimeout(()=>{
                        this.roulette_arrow.alpha = 0
                        this.roulette_circle.alpha = 0
                        let wheelShow2 = gsap.to(this.roulette.scale,{
                            x: 0.01,
                            y: 0.01, 
                            duration: 1, 
                            ease: 'power2.out',
                            onComplete:()=>{
                                wheelShow2.kill()
                            }
                        })
                        let timeOut2 = setTimeout(()=>{
                            this.gameContainer.removeChild(this.wheelEventContainer)
                            this.wheelEventContainer.removeChild(this.roulette)
                            this.wheelEventContainer.removeChild(this.roulette_arrow)
                            clearTimeout(timeOut2)
                        },1000)
                      
                        clearTimeout(timeOut)
                    },1500)
                }
            })
            clearTimeout(timeOut)
        },3000)


    }

    private startSpin(spinType:string){
        this.slotGame.startSpin(spinType)
    }

    private startSpinAutoPlay(spinCount:number){
        this.slotGame.autoPlayCount = spinCount
        this.startSpin(this.spinType)
       // this.modal.totalSpin = 0 
    }

    private events(){
        this.controller.infoBtnSprite.addEventListener('mouseenter',()=>{
            this.controller.infoBtnSprite.texture = this.infoHover
        })
        this.controller.infoBtnSprite.addEventListener('mouseleave',()=>{
            this.controller.infoBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','info').texture
        })


        this.controller.settingBtnSpite.addEventListener('mouseenter',()=>{
            this.controller.settingBtnSpite.texture = this.settingsHover
        })
        this.controller.settingBtnSpite.addEventListener('mouseleave',()=>{
            this.controller.settingBtnSpite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','settings').texture
        })
        this.controller.settingBtnSpite.addEventListener('pointerdown',()=>{
            this.controller.settingBtnSpite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','settings').texture
            //this.isOpenSetting = true
            //this.playSound(1)

            this.controller.infoBtnSprite.interactive = false
            this.controller.settingBtnSpite.interactive = false
            this.controller.autoPlay.interactive = false

            // call settings modal
            this.modal.createSystemSettings(this.isAutoPlay)
            // spin type toggle
            this.modal.betBtns.forEach((data,index)=>{
                data.addEventListener('pointerdown',()=>{
                   // this.playSound(1)
                    // data.addListener('mouseover',() =>{
                    //     this.playSound(2)
                    // })
                    
                    if(index == 0){
                        this.betIndex--
                        this.betAmount = json.bet_amounts[this.betIndex]
                        if(this.betIndex == 0){
                            this.modal.betBtns[0].interactive = false
                        }else{
                            this.modal.betBtns[0].interactive = true
                            this.modal.betBtns[1].interactive = true
                        }
                    }else{
                        this.betIndex++
                        this.betAmount = json.bet_amounts[this.betIndex]
                        if(this.betIndex == 5){
                            this.modal.betBtns[1].interactive = false
                        }else{
                            this.modal.betBtns[0].interactive = true
                            this.modal.betBtns[1].interactive = true
                        }
                    }
                    this.modal.betAmountText.text = this.betAmount
                    this.modal.betAmountText.x = (this.modal.betAmountSpite.width - this.modal.betAmountText.width)/2
                    this.betTextValue()
                })
            })
            // disable click for adjusting bet buttons
            if(this.betIndex == 0){
                this.modal.betBtns[0].interactive = false
            }
            if(this.betIndex == 5){
                this.modal.betBtns[1].interactive = false
            }
            //sound events
            if(this.ambientCheck){
                this.modal.soundBtns[0].texture = this.textureToggleOn
            }else{
                this.modal.soundBtns[0].texture = this.textureToggleOff
            }
            if(this.sfxCheck){
                this.modal.soundBtns[1].texture = this.textureToggleOn
            }else{
                this.modal.soundBtns[1].texture = this.textureToggleOff
            }

            this.modal.soundBtns.forEach((data,index)=>{
                // data.addListener('mouseover',() =>{
                //     this.playSound(2)
                // })
                data.addEventListener('pointerdown',()=>{
                    //this.playSound(1)
                    if(data.texture == this.textureToggleOff){
                        Howler.mute(false)
                        this.controller.soundBtnSprite.texture = this.sounBtnSpriteOn
                        data.texture = this.textureToggleOn
                        if(index == 0){
                           this.ambientCheck = true
                        }else{
                           this.sfxCheck = true
                        }
                    }else{
                        data.texture = this.textureToggleOff
                        this.controller.soundBtnSprite.texture = this.sounBtnSpriteOff
                        if(index == 0){
                            this.ambientCheck = false 
                        }else{
                            this.sfxCheck = false
                        }  
                    }
                    //this.checkSoundToggle()
                })
            })
            // re position bet amount tex on click
            this.modal.betAmountText.text = this.betAmount
            this.modal.betAmountText.x = (this.modal.betAmountSpite.width - this.modal.betAmountText.width)/2
        })



        this.controller.autoPlay.addEventListener('mouseenter',()=>{
            this.controller.autoPlay.texture = this.autoplayHover
        })
        this.controller.autoPlay.addEventListener('mouseleave',()=>{
            this.controller.autoPlay.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','autoplay').texture
        })
        this.controller.autoPlay.addEventListener('pointerdown',()=>{    
            this.controller.autoPlay.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','autoplay').texture
            //this.controller.autoPlay.interactive = false   
            if(this.isAutoPlay){
                this.controller.spinBtnSprite.interactive = true 
                this.controller.spinBtnSprite.cursor = 'pointer' 
                this.isAutoPlay = false
                this.controller.spinBtnSprite.texture = this.spinTextureOn 
                this.slotGame.autoPlayCount = 0
            }else{
                this.controller.autoPlay.interactive = false
                this.modal.createAutoPlaySettings()
                //MODAL AUTOPLAY
                this.modal.rollBtn.addEventListener('pointerdown',()=>{
                //this.playSound(1)
                //this.buyBonusBtn.interactive = false
                this.controller.autoPlay.interactive = true
                this.controller.spinBtnSprite.texture = this.spinTextureOff
                //this.controller.spinBtnSprite.interactive = false
                this.isAutoPlay = true
                this.modal.rollBtn.texture = this.textureRollOn
                    if(!this.slotGame.isSpinning){
                            // this.startSpinAutoPlay(this.modal.totalSpin)
                        if(this.modal.totalSpin >= 1){
                            this.startSpinAutoPlay(this.modal.totalSpin)
                        }else{
                            alert("Please choose a spin count!");
                        }
                    }  
                })
                //toggle spin type
                this.modal.btnArray.forEach((data,index)=>{
                //data.addListener('mouseover',() =>{
                //this.playSound(2)
                //     })
                    data.addEventListener('pointerdown',()=>{
                        // this.playSound(1)
                        if(index == 0){
                            this.modal.btnArray[1].texture = this.textureToggleOff
                            if(data.texture == this.textureToggleOff){
                                data.texture = this.textureToggleOn
                                this.spinType = 'quick'
                            }else{
                                this.spinType = 'normal'
                                data.texture = this.textureToggleOff
                            }
                        }else{
                            this.modal.btnArray[0].texture = this.textureToggleOff
                            if(data.texture == this.textureToggleOff){
                                this.spinType = 'turbo'
                                data.texture = this.textureToggleOn
                            }else{
                                this.spinType = 'normal'
                                data.texture = this.textureToggleOff
                            }
                        }
                    })
                })
                // initialize active spintype button
                if(this.spinType == 'quick'){
                    this.modal.btnArray[0].texture = this.textureToggleOn
                }else if(this.spinType == 'turbo'){
                    this.modal.btnArray[1].texture = this.textureToggleOn
                }else{
                    this.modal.btnArray[0].texture = this.textureToggleOff
                    this.modal.btnArray[1].texture = this.textureToggleOff
                }
            }

        })


        this.controller.spinBtnSprite.addEventListener('mouseenter',()=>{
            if(!this.slotGame.isSpinning && !this.isAutoPlay){
                this.controller.spinBtnSprite.texture = this.spinHover
            }
        })
        this.controller.spinBtnSprite.addEventListener('mouseleave',()=>{
            if(!this.slotGame.isSpinning && !this.isAutoPlay){
                this.controller.spinBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','spin').texture
            }
           
        })
        this.controller.spinBtnSprite.addEventListener('pointerdown',()=>{
            // console.log(this.slotGame.isSpinning,"this.slotGame.isSpinning")
            // console.log(this.isAutoPlay,"this.isAutoPlay")
            if(!this.slotGame.isSpinning && !this.isAutoPlay){
                this.controller.spinBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','spin_stop').texture
                if(this.slotGame.notLongPress === true) {
                    //this.slotGame.notLongPress = false;
                    this.startSpinAutoPlay(1)
                    this.slotGame.timeScale = 0
                }else{
                    this.startSpinAutoPlay(1)
                    this.slotGame.timeScale = 10
                }
            }else{
                this.slotGame.timeScale = 10
            }
        })

        this.controller.soundBtnSprite.addEventListener('mouseenter',()=>{
           if(this.controller.soundBtnSprite.texture == Functions.loadTexture(this.textureArray,'slot_frame_controller','volume').texture ||  this.controller.soundBtnSprite.texture == this.soundOnHover ){
            this.controller.soundBtnSprite.texture = this.soundOnHover
            }else{
                this.controller.soundBtnSprite.texture = this.soundOffHover
            }
          
        })
        this.controller.soundBtnSprite.addEventListener('mouseleave',()=>{
           // this.controller.soundBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','volume').texture 
           if(this.controller.soundBtnSprite.texture == Functions.loadTexture(this.textureArray,'slot_frame_controller','volume').texture ||  this.controller.soundBtnSprite.texture == this.soundOnHover ){
            this.controller.soundBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','volume').texture 
            }else{
                this.controller.soundBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','volume_off').texture 
            } 
        })
        this.controller.soundBtnSprite.addEventListener('pointerdown',()=>{
            if(this.controller.soundBtnSprite.texture == Functions.loadTexture(this.textureArray,'slot_frame_controller','volume').texture ||  this.controller.soundBtnSprite.texture == this.soundOnHover ){
                this.controller.soundBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','volume_off').texture
            }else{
                this.controller.soundBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','volume').texture
            }        
        })


    }

    private onSpinning(){
        this.paylineGreetings = 'GOOD LUCK'
        this.paylineContainersAnimation.forEach(data=>{
            this.controller.parentSprite.removeChild(data)
        })
        this.updatePaylineAnimation(this.paylineGreetings)
    }

    private onSpinEnd(){
        this.paylineGreetings = 'SPIN TO WIN'
        this.updatePaylineAnimation(this.paylineGreetings)
     
        this.userCredit += this.slotGame.totalWin 
        this.slotGame.totalWin = 0
        this.updateCreditValues()

        if(this.slotGame.autoPlayCount == 0){
            this.isAutoPlay = false
            this.controller.spinBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','spin').texture
        }
        if(this.slotGame.autoPlayCount == 0 && this.freeSpinStart){
            this.freeSpinStart = false
        }
        if(this.slotGame.isBonusTick && !this.freeSpinStart ){
            this.freeSpinEvent()
            this.slotGame.isBonusTick = false
            this.isAutoPlay = false
            this.slotGame.autoPlayCount = 0
        }
    }

    private updateTextValues(){
        this.betTextValue()    
        this.updateCreditValues()
     }

    private betTextValue(){
        //bet value
        this.controller.betText.text = this.betAmount 
        this.controller.betText.x = (this.controller.betContainerSprite.width - this.controller.betText.width)/2 
        //bet value buy bonus
         this.buyBonusText.text = this.betAmount
         this.buyBonusText.x = (this.buyBonusBtn.width - this.buyBonusText.width)/2
         this.buyBonusText.y = (this.buyBonusBtn.height - this.buyBonusText.height) - 20
    }

    private updateCreditValues(){
        //credit value
        this.controller.creditText.text = Functions.numberWithCommas(this.userCredit) 
        this.controller.creditText.x = (this.controller.creditContainerSprite.width - this.controller.creditText.width)/2  
    }

    private createPaylineAnimation(){
        this.paylineText =  new PIXI.Text('SPIN TO WIN', this.textStyle)
        this.paylineTextBottom = new PIXI.Text('Tap space or enter to skip', this.textStyle3)
        this.paylineContainer.addChild(this.paylineText,this.paylineTextBottom)
        this.updatePaylineText(this.paylineTextBottom.text,this.paylineText.text)
        this.controller.parentSprite.addChild(this.paylineContainer)
    }

    private updatePaylineAnimation(greetings:string){
        this.paylineContainersAnimation = []
        this.paylineAnimations.forEach(data=>{data.kill()})
        let paylineContent:any = this.slotGame.paylines
        let parentContainer = this.controller.parentSprite
        this.paylineText.text = greetings
        let paylineTotal = 0
        let bottomText = this.isAutoPlay?`Spin left ${this.slotGame.autoPlayCount}`:'Tap space or enter to skip'
        if(this.slotGame.paylines.length !== 0){
            for(let i=0;i<paylineContent.length;i++){
                bottomText = ''
                this.updatePaylineText(bottomText,this.paylineText.text)
                let payline = paylineContent[i].payline
                let payout = Functions.numberWithCommas(paylineContent[i].payout)
                const container = new PIXI.Container
                const containerWithText = new PIXI.Container
                const greetingText = new PIXI.Text(`line ${payline} pays ${payout}`, this.descText)
                paylineContent[i].symbols.forEach((data:any,index:number)=>{
                    let assetFrom:any;
                    assetFrom = json.symbolAssets[data-1]
                    let symbols = Functions.loadTexture(this.textureArray,'slot',`${assetFrom.symbol}`)
                    symbols.x = index*65
                    container.addChild(symbols)
                    // paylineTotal+=assetFrom.pay
                })
                container.x = greetingText.width
                containerWithText.addChild(container,greetingText)
                containerWithText.alpha = 0
                greetingText.y = (containerWithText.height - greetingText.height)/2
                this.paylineContainersAnimation.push(containerWithText)
                this.animatePaySymbols(containerWithText,i)
                parentContainer.addChild(containerWithText)
            }
            this.updatePaylineText(bottomText,`WIN ${Functions.numberWithCommas(this.slotGame.totalWin)}`)
        }
        this.updatePaylineText(bottomText,this.paylineText.text)
    }

    private animatePaySymbols(containerWithText:any,i:number){
        let lastIndex = i+1
        let parentContainer = this.controller.parentSprite
        let fadeIn = gsap.to(containerWithText,{
            delay:i*2,
            duration:1,
            alpha:1,
            onStart:()=>{
                containerWithText.x = (parentContainer.width - containerWithText.width)/2
                containerWithText.y = (parentContainer.height - containerWithText.height)-10
            },
            onComplete:()=>{
                containerWithText.alpha = 0
                fadeIn.kill()
                let timeOut = setTimeout(()=>{
                    if(lastIndex == this.slotGame.paylines.length){
                        this.paylineContainersAnimation.forEach((data,index)=>{
                            this.animatePaySymbols(data,index)
                        })
                    }
                    clearTimeout(timeOut)
                },3000)
            }
        })
        this.paylineAnimations.push(fadeIn)
    }

    private updatePaylineText(bottomText:string,topText:string){
        this.paylineTextBottom.text = bottomText
        this.paylineText.text = topText 
        this.paylineText.x = (this.paylineContainer.width - this.paylineText.width)/2
        this.paylineText.y = 20
        this.paylineTextBottom.x = (this.paylineContainer.width - this.paylineTextBottom.width)/2
        this.paylineTextBottom.y = (this.paylineText.height)+ 15
        this.paylineContainer.x = (this.controller.parentSprite.width - this.paylineContainer.width)/2
        this.paylineContainer.y = 38
    }

    private freeSpinEvent(){
        this.freeSpinStart = true
        this.createEventSpin()
    }

    private reelContainWildAndBonus(i:number){
        this.slotGame.reelsSymbols[i].forEach((data:any,index:number)=>{
            if(index > 8){
                if(data.type == 10){ 
                   // this.playSound(18)
                    //this.soundVolume(18,0.2)
                    Functions.loadSpineAnimation(data.symbol,'open',false,1.1)
                    const globalPos = data.symbol.getGlobalPosition() 
                   
                    this.createWildCoin(this.slotGame.reelContainer[i].x,globalPos.y-100)
                   // this.levelBarIndicator.width++
                   // Math.round(this.levelBarIndicator.width)
                    // reset level bar and start matching game
                    // if( Math.round(this.levelBarIndicator.width) == this.levelBarWidth){
                    //     this.autoPlayCount = 0
                    //     this.levelBarIndicator.width = this.levelBarWidth
                    //     this.isMatchingGame = true
                    //   //  this.matchingGame()
                    // }
                }
                if(data.type == this.slotGame.bonusType){
                    this.slotGame.bonusSymbolsCount++
                    if(this.slotGame.bonusSymbolsCount > 1){
                  //      this.playSound(10)
                    }else{
                   //     this.playSound(9)
                    }
                    Functions.loadSpineAnimation(data.symbol,'fall',false,0.6)
                }
            }
        })
    }

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
                            this.slotGame.container.removeChild(coin)
                        }
                    })
                }
            })
            this.slotGame.container.addChild(coin)
        }
    }
}