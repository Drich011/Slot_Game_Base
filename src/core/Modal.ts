import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Functions from './settings/Functions';
import json from './settings/settings.json'
import json2 from './settings/modal-settings.json'

export default class Modal{
        //app settings
        private app:PIXI.Application
        private baseHeight:number
        private baseWidth:number
        public container:PIXI.Container
        private infoFirstPageContainer:PIXI.Container
        private infoSecondPageContainer:PIXI.Container
        private infoThirdPageContainer:PIXI.Container
        private infoFourthPageContainer:PIXI.Container
        private infoFifthPageContainer:PIXI.Container
        private infoSixthPageContainer:PIXI.Container
        private infoSeventhPageContainer:PIXI.Container
        private textureArray:Array<any>
        //containers
        private autoPlaySettingsCont:PIXI.Container
        private systemContainer:PIXI.Container
        private infoContainer:PIXI.Container
        //sprites
        private overlay:PIXI.Sprite
        private modalFrame:PIXI.Sprite
        private titleY:number = 50
        public closeModal:PIXI.Sprite
        public rollBtn:PIXI.Sprite
        public minusBtn:PIXI.Sprite
        public plusBtn:PIXI.Sprite
        public betAmountSpite:PIXI.Sprite
        public musicBtnSprite:PIXI.Sprite
        public sfxBtnSprite:PIXI.Sprite
        private modalTitle:PIXI.Sprite
        //text
        private textStyle:PIXI.TextStyle
        private textStyle2:PIXI.TextStyle
        private textStyle3:PIXI.TextStyle
        private textStyle4:PIXI.TextStyle
        private textStyle4Center:PIXI.TextStyle
        public betAmountText:PIXI.Text
        //
        public betAmount:number = 1
        public totalSpin:number
        public btnArray:Array<any> = []
        private spinBtnTextureOn:PIXI.Texture
        private spinBtnTextureOff:PIXI.Texture
        public betBtns:Array<any> = []
        public soundBtns:Array<any> = []

        public btnContainer:PIXI.Container
        public btn2Container:PIXI.Container
        public bottomContainer:PIXI.Container


    constructor(app:PIXI.Application,textureArray:Array<any>){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container()

        this.spinBtnTextureOn =  Functions.loadTexture(this.textureArray,'modal_autoplay','spin_amount_btn_active').texture
        this.spinBtnTextureOff =  Functions.loadTexture(this.textureArray,'modal_autoplay','spin_amount_btn').texture

        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 36,
            fontWeight: 'bold',
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
            fontFamily: 'Arial',
            fontSize: 20,
            fontWeight: 'normal',
            fill: '#a7a7a7', 
            wordWrapWidth: 440,
        });
        this.textStyle3 = new PIXI.TextStyle({  
            fontFamily: 'Arial',
            fontSize: 30,
            fontWeight: 'normal',
            fill: '#ffffff', 
            wordWrap: true,
            wordWrapWidth: 1000,
            align:'center'
        });
        this.textStyle4 = new PIXI.TextStyle({  
            fontFamily: 'Arial',
            fontSize: 20,
            fontWeight: 'normal',
            fill: '#fff', 
            wordWrap: true,
            wordWrapWidth: 400,
        });
        this.textStyle4Center = new PIXI.TextStyle({  
            fontFamily: 'Arial',
            fontSize: 20,
            fontWeight: 'normal',
            fill: '#fff', 
            wordWrap: true,
            wordWrapWidth: 600,
            align:'center'
        });

        this.init()

    }

    private init(){
        this.createParent()
    }
    private createParent(){
        this.overlay = Functions.loadTexture(this.textureArray,'modal_main','overlay')
        this.modalFrame = Functions.loadTexture(this.textureArray,'modal_main','modal_frame')
        this.modalFrame.x = (this.overlay.width - this.modalFrame.width)/2
        this.modalFrame.y = (this.overlay.height - this.modalFrame.height)/2
        //close modal
        this.closeModal = Functions.loadTexture(this.textureArray,'modal_main','close_button') 
        this.closeModal.scale.set(.8)
        this.closeModal.cursor = 'pointer'
        this.closeModal.interactive = true
        this.closeModal.x = (this.modalFrame.width - this.closeModal.width) - 30
        this.closeModal.y = 30 
        this.closeModal.addListener("pointerdown", () => {
            this.modalFrame.removeChild(this.systemContainer)
            this.modalFrame.removeChild(this.modalTitle)
            this.modalFrame.removeChild(this.autoPlaySettingsCont)
            this.modalFrame.removeChild(this.infoContainer)
            this.app.stage.removeChild(this.container)
            while(this.btnArray.length){
                this.btnArray.pop();
              }  
        })
        this.modalFrame.addChild(this.closeModal)
    }

    public createAutoPlaySettings(){
        this.btnContainer = new PIXI.Container
        this.btn2Container = new PIXI.Container
        this.autoPlaySettingsCont = new PIXI.Container
        this.bottomContainer = new PIXI.Container
        const toggleX = 500
        let btns:Array<any> = []
        let btns2:Array<any> = []
        // btns 
        json.auto_play_values.forEach((data,index)=>{
            const btn = Functions.loadTexture(this.textureArray,'modal_autoplay','spin_amount_btn')
            const textValue = new PIXI.Text(`${data.value}`, this.textStyle)
            textValue.x = (btn.width - textValue.width)/2 
            textValue.y = (btn.height - textValue.height)/2 
            btn.addChild(textValue)
            btn.x = data.x *250
            btn.cursor = 'pointer'
            btn.interactive = true
            if(index >=5){
                btn.y = 110
            }
            btn.addEventListener('pointerdown',()=>{
                this.totalSpin = data.value
                btns.forEach(data=>{
                    data.texture = this.spinBtnTextureOff
                })
                btn.texture = this.spinBtnTextureOn
            })
            btns.push(btn)
            this.btnContainer.addChild(btn)
            this.autoPlaySettingsCont.addChild(this.btnContainer)
        })

        // quick spin
        const quickTitle = new PIXI.Text(`QUICK SPIN`, this.textStyle);
        quickTitle.y = 250
        this.bottomContainer.addChild(quickTitle)
        const quickDesc = new PIXI.Text(`Reduce the overall spin time to play quickly`, this.textStyle2);
        quickDesc.y = quickTitle.y * 1.2
        this.bottomContainer.addChild(quickDesc)
        // turbo spin
        const turboTitle = new PIXI.Text(`TURBO SPIN`, this.textStyle);
        turboTitle.y = 350
        this.bottomContainer.addChild(turboTitle)
        const turboDesc = new PIXI.Text(`Reduce the overall spin time to play quickly`, this.textStyle2);
        turboDesc.y = turboTitle.y * 1.13
        this.bottomContainer.addChild(turboDesc)
        // quick spin toggle
        const quickSprite =  Functions.loadTexture(this.textureArray,'modal_autoplay','off')
        quickSprite.interactive = true
        quickSprite.cursor = 'pointer'
        quickSprite.x = toggleX
        quickSprite.y = quickTitle.y *1.05
        this.btnArray.push(quickSprite)
        this.bottomContainer.addChild(quickSprite)
        // turbo spin toggle
        const turboSprite =  Functions.loadTexture(this.textureArray,'modal_autoplay','off')
        turboSprite.interactive = true
        turboSprite.cursor = 'pointer'
        turboSprite.x = toggleX
        turboSprite.y = turboTitle.y*1.05
        this.btnArray.push(turboSprite)
        this.bottomContainer.addChild(turboSprite)
        // roll sprite  
        this.rollBtn =  Functions.loadTexture(this.textureArray,'modal_autoplay','roll')
        this.rollBtn.interactive = true
        this.rollBtn.cursor = 'pointer'
        this.rollBtn.x = (this.bottomContainer.width - this.rollBtn.width)/2
        this.rollBtn.y = turboDesc.y * 1.2
        // roll btn text 
        const rollBtnText = new PIXI.Text(`Let's Roll!`, this.textStyle);
        rollBtnText.x = (this.rollBtn.width - rollBtnText.width)/2
        rollBtnText.y = (this.rollBtn.height - rollBtnText.height)/2
        this.rollBtn.addChild(rollBtnText)
        this.bottomContainer.addChild(this.rollBtn)
        // bottom container positioning
        this.bottomContainer.x = (this.autoPlaySettingsCont.width - this.bottomContainer.width)/2
        //container positioning
        this.autoPlaySettingsCont.addChild(this.bottomContainer)
        this.autoPlaySettingsCont.x = (this.modalFrame.width - this.autoPlaySettingsCont.width)/2
        this.autoPlaySettingsCont.y = (this.modalFrame.height - this.autoPlaySettingsCont.height)/2
        this.modalFrame.addChild(this.autoPlaySettingsCont)
        this.container.addChild(this.overlay,this.modalFrame)
        this.app.stage.addChild(this.container)    

        //events
        this.rollBtn.addEventListener('pointerdown',()=>{
            this.modalFrame.removeChild(this.autoPlaySettingsCont)
            this.app.stage.removeChild(this.container)   
        })
    }

}