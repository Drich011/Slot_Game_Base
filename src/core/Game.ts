require('../main.css')
import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from './Loader';
import {Spine} from 'pixi-spine';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {Howler} from 'howler';
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);
export default class Game{
    private app:PIXI.Application
    private textureArray:any
    private gameContainer:PIXI.Container;
    private baseWidth:number = 0
    private baseHeight:number = 0
    private roulette:PIXI.Sprite

    //background
    private background:PIXI.Sprite
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
        this.app.stage.addChild(this.gameContainer)
    }  

    private createBackground(){
        this.background =  new PIXI.Sprite(this.textureArray.background.textures['background.jpg'])
        console.log(this.background)
        this.gameContainer.addChild(this.background)
    }
}