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

        public separator:PIXI.Sprite
        public leftContainer:PIXI.Container
        public rightContainer:PIXI.Container
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
        this.modalFrame = Functions.loadTexture(this.textureArray,'modal_settings_space','modal_frame')

        this.modalFrame.x = (this.overlay.width - this.modalFrame.width)/2
        this.modalFrame.y = (this.overlay.height - this.modalFrame.height)/2
        //close modal
        this.closeModal = Functions.loadTexture(this.textureArray,'modal_settings_space','close_button') 
        this.closeModal.scale.set(1)
        this.closeModal.cursor = 'pointer'
        this.closeModal.interactive = true
        this.closeModal.x = (this.modalFrame.width - this.closeModal.width) - 80
        this.closeModal.y = 45 
        this.closeModal.addListener("pointerdown", () => {
            this.modalFrame.removeChild(this.systemContainer)
            this.modalFrame.removeChild(this.modalTitle)
            this.modalFrame.removeChild(this.autoPlaySettingsCont)
            this.modalFrame.removeChild(this.infoContainer)
            this.app.stage.removeChild(this.container)
            this.modalFrame.removeChild(this.leftContainer)
            this.modalFrame.removeChild(this.rightContainer)
            this.modalFrame.removeChild(this.separator)
            while(this.btnArray.length){
                this.btnArray.pop();
              }  
        })
        this.modalFrame.addChild(this.closeModal)
    }

    public createSystemSettings(betDisable:boolean){
        this.betBtns = []
        this.soundBtns = []
        this.systemContainer = new PIXI.Container
        this.leftContainer = new PIXI.Container
        this.rightContainer = new PIXI.Container
        //title
        this.modalTitle = Functions.loadTexture(this.textureArray,'modal_settings','system_settings_title')
        this.modalTitle.x = (this.modalFrame.width - this.modalTitle.width)/2
        this.modalTitle.y = this.titleY
        //this.modalFrame.addChild(this.modalTitle)
        // middle separator
        this.separator = Functions.loadTexture(this.textureArray,'modal_settings_space','separate')
        this.separator.x = (this.modalFrame.width - this.separator.width)/2
        this.separator.y = (this.modalFrame.height - this.separator.height)/2
       // this.systemContainer.addChild(this.separator)
        this.modalFrame.addChild(this.separator)
        this.systemContainer.y = (this.modalFrame.height - this.systemContainer.height) / 2 

        // left container content
        // bet container
        this.betAmountSpite = Functions.loadTexture(this.textureArray,'modal_settings_space','total_bet_container')
        this.betAmountSpite.x = 0
        this.leftContainer.addChild(this.betAmountSpite)
        // bet amount
        this.betAmountText = new PIXI.Text(`1`, this.textStyle)
        this.betAmountText.x = (this.betAmountSpite.width - this.betAmountText.width)/2
        this.betAmountText.y = (this.betAmountSpite.height - this.betAmountText.height)/2
        this.leftContainer.addChild(this.betAmountText)
        // title
        const totalBetText = new PIXI.Text(`TOTAL BET`, this.textStyle);
        totalBetText.x = (this.betAmountSpite.width - totalBetText.width)/2
        totalBetText.y = -totalBetText.height
        this.leftContainer.addChild(totalBetText)
        // minus btn
        this.minusBtn = Functions.loadTexture(this.textureArray,'modal_settings_space','minus_bet')
        this.minusBtn.x = this.betAmountSpite.x
        this.minusBtn.y= this.betAmountSpite.height + 20
        this.minusBtn.interactive = betDisable?false:true
        this.minusBtn.cursor = 'pointer'
        this.betBtns.push(this.minusBtn)
        this.leftContainer.addChild(this.minusBtn)
        // plus btn
        this.plusBtn = Functions.loadTexture(this.textureArray,'modal_settings_space','add_bet')
        this.plusBtn.x = (this.betAmountSpite.x + this.betAmountSpite.width) - this.plusBtn.width
        this.plusBtn.y = this.minusBtn.y
        this.plusBtn.interactive = betDisable?false:true
        this.plusBtn.cursor = 'pointer'
        this.betBtns.push(this.plusBtn)
        this.leftContainer.x = (this.separator.x - this.leftContainer.width) / 2 
        this.leftContainer.y = (this.modalFrame.height - this.leftContainer.height)/2 + 50
        this.leftContainer.addChild(this.plusBtn)
        //this.systemContainer.addChild(this.leftContainer)
        this.modalFrame.addChild(this.leftContainer)
        
        // right container content
        const ambientTitle = new PIXI.Text(`AMBIENT MUSIC`, this.textStyle);
        ambientTitle.x = 0
        // ambient desc
        const ambientDesc = new PIXI.Text(`Turn on and off background music `, this.textStyle2);
        ambientDesc.x = 0
        ambientDesc.y = 45
        this.rightContainer.addChild(ambientTitle,ambientDesc)
        // ambient toggle
        this.musicBtnSprite = Functions.loadTexture(this.textureArray,'modal_settings_space','off')
        this.musicBtnSprite.interactive = true
        this.musicBtnSprite.cursor = 'pointer'
        this.musicBtnSprite.x = ambientTitle.width +50
        this.musicBtnSprite.y = ambientTitle.y + 15
        this.soundBtns.push(this.musicBtnSprite)
        this.rightContainer.addChild(this.musicBtnSprite)
        // sfx 
        const sfxTitle = new PIXI.Text(`SOUND FX`, this.textStyle);
        sfxTitle.x = 0 
        sfxTitle.y = 120
        // ambient desc
        const sfxDesc = new PIXI.Text(`Turn on and off sound effects`, this.textStyle2);
        sfxDesc.x = sfxTitle.x
        sfxDesc.y = sfxTitle.y + 45
        this.rightContainer.addChild(sfxTitle,sfxDesc)
        // ambient toggle
        this.sfxBtnSprite = Functions.loadTexture(this.textureArray,'modal_settings','off')
        this.sfxBtnSprite.interactive = true
        this.sfxBtnSprite.cursor ='pointer'
        this.sfxBtnSprite.x = sfxTitle.width + 160
        this.sfxBtnSprite.y = sfxTitle.y + 15
        this.soundBtns.push(this.sfxBtnSprite)
        this.rightContainer.addChild(this.sfxBtnSprite)
        this.rightContainer.x = this.separator.x + 60
        this.rightContainer.y = (this.modalFrame.height - this.rightContainer.height)/2 
       // this.systemContainer.addChild(this.rightContainer)
       this.modalFrame.addChild(this.rightContainer)

        this.modalFrame.addChild(this.systemContainer)
        this.container.addChild(this.overlay,this.modalFrame)
        this.app.stage.addChild(this.container)
        
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
            btn.x = data.x *230
            btn.width = 200
            
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
            while(this.btnArray.length){
                this.btnArray.pop();
              }  
        })
    }

}