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

        // this.roulette =  new PIXI.Sprite(this.textureArray.main.textures['roulette.png'])
        // this.roulette.x = 500
        // this.roulette.y = 500
        // this.roulette.scale.set(1)
        // this.roulette.anchor.set(0.5)
        // let tl = gsap.to(this.roulette,{
        //     rotation:300,
        //     duration:5,
        //     onUpdate: function() {
        //         // if (tl.progress() > 0.7898) {
        //         //     tl.timeScale(0.1);
        //         // }
        //         // console.log(this.roulette.rotation)
        //         // tl.timeScale(1);
        //         console.log(tl.progress())
        //     }
        // })
        // this.gameContainer.addChild(this.roulette)

        this.createBackground()
        this.createSlot()
        this.app.stage.addChild(this.gameContainer)

        window.document.addEventListener('keydown', (e)=> { 
            this.startSpin('normal')
        });
    }  

    private createBackground(){
        this.background =  new PIXI.Sprite(this.textureArray.background.textures['background.jpg'])
        this.gameContainer.addChild(this.background)
    }

    private createSlot(){
        this.slotGame = new Slot(this.app,this.textureArray)
        this.gameContainer.addChild(this.slotGame.container)
    }

    private startSpin(spinType:string){
        this.slotGame.startSpin(spinType)
    }

}