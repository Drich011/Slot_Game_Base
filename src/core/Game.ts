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
import Functions from './settings/Functions';
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);
export default class Game{
    private app:PIXI.Application
    private textureArray:any
    private gameContainer:PIXI.Container;
    private baseWidth:number = 0
    private baseHeight:number = 0
    private roulette:PIXI.Sprite

    private slotGame:Slot;
    private controller:Controller;

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

    constructor(){
        this.gameContainer = new PIXI.Container
        this.gameContainer.sortableChildren = true
        new Loader(this.init.bind(this))
    }
    private init(res:any,app:PIXI.Application){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = res

                //buttons Hover
        this.autoplayHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','autoplay_hover').texture
        this.infoHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','info_hover').texture
        this.soundOnHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','volume_hover').texture
       // this.soundOffHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','sound_off_button_hover').texture
        this.spinHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','spin_hover').texture
        this.settingsHover = Functions.loadTexture(this.textureArray,'slot_frame_controller','settings_hover').texture

        this.createBackground()
        this.createSlot()
        this.createController()
        this.events()
        this.app.stage.addChild(this.gameContainer)

        window.document.addEventListener('keydown', (e)=> {
            if(!this.slotGame.isSpinning){
                if(this.slotGame.notLongPress === true) {
                    this.slotGame.notLongPress = false;
                    this.startSpin('normal')
                    this.slotGame.timeScale = 0
                }else{
                    this.startSpin('normal')
                    this.slotGame.timeScale = 10
                }
            }else{
                this.slotGame.timeScale = 10
            }
        });

        window.document.addEventListener('touchstart', (e)=> {
            if(!this.slotGame.isSpinning){
                if(this.slotGame.notLongPress === true) {
                    //this.slotGame.notLongPress = false;
                    this.startSpin('normal')
                    this.slotGame.timeScale = 0
                }else{
                    this.startSpin('normal')
                    this.slotGame.timeScale = 10
                }
            }else{
                this.slotGame.timeScale = 10
            }
        });
        

        window.document.addEventListener('keyup', ()=> {
            this.slotGame.notLongPress = true;
        });
    }  

    private createBackground(){
        this.background =  new PIXI.Sprite(this.textureArray.background.textures['background.png'])
        this.gameContainer.addChild(this.background)
        this.background.height = this.app.screen.height
        this.background.width = this.app.screen.width+500
    }

    private createSlot(){
        this.slotGame = new Slot(this.app,this.textureArray)
        this.gameContainer.addChild(this.slotGame.container)
        this.slotGame.container.y = +80
    }

    private createController(){
        this.controller = new Controller(this.app,this.textureArray)
        this.gameContainer.addChild(this.controller.container)

    }

    private startSpin(spinType:string){
        this.slotGame.startSpin(spinType)
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


        this.controller.autoPlay.addEventListener('mouseenter',()=>{
            this.controller.autoPlay.texture = this.autoplayHover
        })
        this.controller.autoPlay.addEventListener('mouseleave',()=>{
            this.controller.autoPlay.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','autoplay').texture
        })


        this.controller.spinBtnSprite.addEventListener('mouseenter',()=>{
            this.controller.spinBtnSprite.texture = this.spinHover
        })
        this.controller.spinBtnSprite.addEventListener('mouseleave',()=>{
            this.controller.spinBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','spin').texture
        })

        this.controller.soundBtnSprite.addEventListener('mouseenter',()=>{
            this.controller.soundBtnSprite.texture = this.soundOnHover
          
        })
        this.controller.soundBtnSprite.addEventListener('mouseleave',()=>{
            this.controller.soundBtnSprite.texture = Functions.loadTexture(this.textureArray,'slot_frame_controller','volume').texture
           
        })





    }

}