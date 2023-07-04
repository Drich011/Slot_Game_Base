require('../main.css')
import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from './Loader';
import {Spine} from 'pixi-spine';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {Howler} from 'howler';
import Slot from './Slot';
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

    //background
    private background:PIXI.Sprite
    private frame:PIXI.Sprite
    private frameBG:PIXI.Sprite
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

        this.createBackground()
        this.createSlot()
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
        this.background =  new PIXI.Sprite(this.textureArray.background.textures['background.jpg'])
        this.gameContainer.addChild(this.background)
        this.background.height = this.baseHeight
        this.background.width = this.baseWidth
    }

    private createSlot(){
        this.slotGame = new Slot(this.app,this.textureArray)
        this.gameContainer.addChild(this.slotGame.container)
        this.slotGame.container.y = -40
    }

    private startSpin(spinType:string){
        this.slotGame.startSpin(spinType)
    }

}