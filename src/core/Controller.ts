import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Functions from './settings/Functions';

export default class Controller{
    //app settings
    private app:PIXI.Application
    private baseHeight:number
    private baseWidth:number
    public container:PIXI.Container
    private textureArray:Array<any>
    //sprites
    public parentSprite:PIXI.Sprite
    public infoBtnSprite:PIXI.Sprite
    public soundBtnSprite:PIXI.Sprite
    public spinBtnSprite:PIXI.Sprite
    public autoPlay:PIXI.Sprite
    public settingBtnSpite:PIXI.Sprite
    public betContainerSprite:PIXI.Sprite
    public creditContainerSprite:PIXI.Sprite
    //text 
    private textStyle:PIXI.TextStyle
    private textStyle2:PIXI.TextStyle
    public betText:PIXI.Text
    public creditText:PIXI.Text

    constructor(app:PIXI.Application,textureArray:Array<any>){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container()
        this.container.sortableChildren = true
        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 55,
            fontWeight: 'bolder',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle2 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 20,
            fontWeight: 'normal',
            fill: '#a7a7a7', 
            wordWrapWidth: 440,
        });
        this.init()
    }

    private init(){
        this.createParent()
        this.createChildren()
    }

    private createParent(){
        this.parentSprite = Functions.loadTexture(this.textureArray,'slot_frame_controller','controller')
        this.parentSprite.y = this.baseHeight - this.parentSprite.height
        this.container.addChild(this.parentSprite)
    }

    private createChildren(){
        //sprites
        let infoBtnSprite =  Functions.loadTexture(this.textureArray,'slot_frame_controller','info')
        let sounBtnSprite =  Functions.loadTexture(this.textureArray,'slot_frame_controller','volume')
        let spinBtnSprite =  Functions.loadTexture(this.textureArray,'slot_frame_controller','spin')
        let autoPlaySprite =  Functions.loadTexture(this.textureArray,'slot_frame_controller','autoplay')
        let settingsBtnSpite =  Functions.loadTexture(this.textureArray,'slot_frame_controller','settings')
        let betContSpite =  Functions.loadTexture(this.textureArray,'slot_frame_controller','balance_container')
        let creditContSprite =  Functions.loadTexture(this.textureArray,'slot_frame_controller','bet_container')
        //info btn
        this.infoBtnSprite = infoBtnSprite
        this.infoBtnSprite.y = this.parentSprite.y+10
        this.infoBtnSprite.x = this.infoBtnSprite.width*1.64
        this.infoBtnSprite.interactive = true
        this.infoBtnSprite.cursor = 'pointer'
        this.container.addChild(this.infoBtnSprite)
        //sound
        this.soundBtnSprite = sounBtnSprite
        this.soundBtnSprite.y = ((this.parentSprite.y + this.parentSprite.height) - this.soundBtnSprite.height) - 20
        this.soundBtnSprite.x = this.soundBtnSprite.width*1.01 - 25 
        this.soundBtnSprite.interactive = true
        this.soundBtnSprite.cursor = 'pointer'
        this.container.addChild(this.soundBtnSprite)
        //spin
        this.spinBtnSprite = spinBtnSprite
        this.spinBtnSprite.y = this.parentSprite.y + 30
        this.spinBtnSprite.x = (this.parentSprite.width - this.spinBtnSprite.width) - 157
        this.spinBtnSprite.interactive = true
        this.spinBtnSprite.cursor = 'pointer'
        this.container.addChild(this.spinBtnSprite)
        //autoplay
        this.autoPlay = autoPlaySprite
        this.autoPlay.y = (this.parentSprite.y + this.parentSprite.height) - this.autoPlay.height*1.2
        this.autoPlay.x = (this.parentSprite.width - this.autoPlay.width) - 50
        this.autoPlay.interactive = true
        this.autoPlay.cursor = 'pointer'
        this.container.addChild(this.autoPlay)
        //settings
        this.settingBtnSpite = settingsBtnSpite
        this.settingBtnSpite.y = this.parentSprite.y+90
        this.settingBtnSpite.x = this.settingBtnSpite.width *2.1
        this.settingBtnSpite.interactive = true
        this.settingBtnSpite.cursor = 'pointer'
        this.container.addChild(this.settingBtnSpite)
        // bet container
        this.betContainerSprite = betContSpite
        this.betContainerSprite.y = this.parentSprite.y + 105
        this.betContainerSprite.x = this.betContainerSprite.width*1.05
        //bet text
        this.betText = new PIXI.Text(`1`, this.textStyle)
        this.betText.x = (this.betContainerSprite.width - this.betText.width)/2 
        this.betText.y = (this.betContainerSprite.height - this.betText.height)/2 + 2
        this.betContainerSprite.addChild(this.betText)
        this.container.addChild(this.betContainerSprite)
        // credit container
        this.creditContainerSprite = creditContSprite
        this.creditContainerSprite.y = this.parentSprite.y + 105 
        this.creditContainerSprite.x = (this.parentSprite.width - this.creditContainerSprite.width)*0.81
        //credit text
        this.creditText = new PIXI.Text(`0`, this.textStyle)
        this.creditText.x = (this.creditContainerSprite.width - this.creditText.width)/2
        this.creditText.y = (this.creditContainerSprite.height - this.creditText.height)/2+2
        // this.creditText.y = 0
        this.creditContainerSprite.addChild(this.creditText)
        this.container.addChild(this.creditContainerSprite)
    }
}