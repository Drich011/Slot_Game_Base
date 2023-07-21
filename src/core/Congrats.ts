import 'pixi-spine'
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import Functions from './settings/Functions';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
export default class Congrats{
    //app settings
    private app:PIXI.Application
    private textureArray:any
    private baseWidth:number
    private baseHeight:number
    public container:PIXI.Container
    public middleContainer:PIXI.Container
    private coinsContainer:PIXI.Container
    private overlay:PIXI.Sprite
    private popGlow:Spine
    public logo:Spine
    private leftCoinAnimation: any;
    private rightCoinAnimation: any;
    //text styles
    private textStyle:PIXI.TextStyle
    private textStyle2:PIXI.TextStyle
    private textStyle3:PIXI.TextStyle
    private textStyleYellow:PIXI.TextStyle
    //text
    private descText:PIXI.Text
    private money:PIXI.Text
    private spins:PIXI.Text
    //value 
    private amount:number = 20000
    private noOfSpin:number = 5
    //duration of count
    public durationCount:number = 0.1
    public textAnimation: GSAPAnimation;
    constructor(app:PIXI.Application,textureArray:any,amount:number, noOfSpin:number){
        this.app = app
        this.container = new PIXI.Container
        this.amount = amount
        this.noOfSpin = noOfSpin
        this.middleContainer = new PIXI.Container
        this.coinsContainer = new PIXI.Container
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 100,
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
        this.textStyle2 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 60,
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
        this.textStyleYellow = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 100,
            fontWeight: 'bolder',
            fill: ['#ffeaa0', '#ffc260'], // gradient
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
        this.init()
    }
    private init(){
        this.createParent()
        this.createPopup()
        this.createMoney()
        this.createSpins()
        this.createCoin()
    }
    private createParent(){
        this.overlay = Functions.loadTexture(this.textureArray,'modal_main','overlay')
        this.overlay.width = this.baseWidth
        this.overlay.height = this.baseHeight
        this.container.addChild(this.overlay)
    }
    private createPopup(){
        // create glow back drop
        this.popGlow = new Spine(this.textureArray.pop_glow.spineData)
        this.popGlow.position.x = (this.overlay.width)/2        
        this.popGlow.position.y = (this.overlay.height)*1.15
        this.popGlow.scale.x = 1.4
        this.popGlow.scale.y = 1.7
        // animate glow
        Functions.loadSpineAnimation(this.popGlow,'glow',true,0.1)
        this.middleContainer.addChild(this.popGlow)

        //create pop logo
        this.logo = new Spine(this.textureArray.congrats.spineData)
        this.logo.x = (this.overlay.width)/2
        this.logo.y = (this.overlay.height)/1.2
   
        // animate glow
        Functions.loadSpineAnimation(this.logo,'animation',true,0.2)
        this.middleContainer.addChild(this.logo)

        //create text
        this.descText = new PIXI.Text('YOU WON', this.textStyle)
        this.descText.x = (this.overlay.width - this.descText.width)/2
        this.descText.y = ((this.overlay.height - this.descText.height)/2)*0.74
        this.middleContainer.addChild(this.descText)
        this.container.addChild(this.middleContainer)
    }

    private createMoney(){
        this.money = new PIXI.Text('5', this.textStyleYellow)
        this.money.x = (this.overlay.width - this.money.width)/2
        this.money.y= ((this.overlay.height - this.money.height)/2)*1.06
        this.middleContainer.addChild(this.money)

        // Set up animation
        const startValue = 0;
        const endValue = this.amount;
        this.durationCount = 30;
        const delay = 0.4;
        const ease = "power1.out";

        // Animate text value
        this.textAnimation = gsap.to(this.money, {
            pixi: {
                text: endValue,
            },
            duration: this.durationCount,
            delay: delay,
            ease: ease,
            onStart: () => {
                this.money.text = startValue.toString();
            },
            onUpdate: () => {
                this.money.text = Functions.numberWithCommas(parseInt(this.money.text)).toString();
                this.money.x = (this.overlay.width - this.money.width)/2
                this.money.y= ((this.overlay.height - this.money.height)/2)*1.06
            },
            onComplete:()=>{
                this.textAnimation.kill()
            }
        });
    }

    private createSpins(){
        this.spins = new PIXI.Text(`FREE SPINS`, this.textStyle2)
        this.spins.x = (this.overlay.width - this.spins.width)/2
        this.spins.y = (this.overlay.height - this.spins.height)/1.5
        this.middleContainer.addChild(this.spins)

        const clickAnyTxt = new PIXI.Text(`click anywhere to continue`, this.textStyle3)
        clickAnyTxt.x = (this.overlay.width - clickAnyTxt.width)/2
        clickAnyTxt.y = (this.overlay.height - clickAnyTxt.height)/1.4
        this.middleContainer.addChild(clickAnyTxt)
    }

    private createCoin(){
        // LEFTCOINS
        for(let count = 0; count < 10; count++){
            let coin: any = Functions.animatedSprite(this.textureArray['coins'],'new_coin_spinning');
            let accelX = this.randMinMax(7.5, 11.5);
            let coinSpeed = 0.15;
            const gravity = 0.15;
            coin.scale.set(this.randMinMax(0.2, 0.3));
            coin.anchor.set(0.5);
            coin.animationSpeed = this.randMinMax(0.3, 0.5);
            coin.x += coin.width;
            coin.y += coin.height;
            coin.x = - coin.width;
            coin.y = this.app.screen.height - this.randMinMax(100,550);
        
            this.coinsContainer.addChild(coin);
  
            this.leftCoinAnimation = gsap.to(coin, {
                rotation: Math.random() * 20,
                duration: 3,
                ease: "sine.in",
                repeat: -1,
                delay: this.randMinMax(0, 5),
                onStart: () => {
                    coin.play();
                },
                onUpdate: () => {
                    coin.y += coinSpeed;
                    coin.x += accelX;
                    coinSpeed += gravity;
        
                    if(accelX > 0)
                    accelX -= gravity/3;
                    if(accelX < 0)
                    accelX = 0
        
                    if(coin.y > this.app.screen.height){
                    coinSpeed = 0.15;
                    accelX = this.randMinMax(7.5, 11.5);
                    coin.y = this.app.screen.height - this.randMinMax(100,550);
                    coin.scale.set(this.randMinMax(0.2, 0.3));
                    coin.x = - coin.width;
                    this.leftCoinAnimation.repeat();
                    }
                }
            })
        }

        // RIGHTCOINS
        for(let count = 0; count < 10; count++){
            let coin: any = Functions.animatedSprite(this.textureArray['coins'],'new_coin_spinning');
            let accelX = this.randMinMax(7.5, 11.5);
            let coinSpeed = 0.15;
            const gravity = 0.15;
            coin.scale.set(this.randMinMax(0.2, 0.3));
            coin.anchor.set(0.5);
            coin.x += coin.width;
            coin.y += coin.height;
            coin.x = this.app.screen.width + (coin.width/2);
            coin.y = this.app.screen.height - this.randMinMax(100,550);
        
            this.coinsContainer.addChild(coin);
  
            this.rightCoinAnimation = gsap.to(coin, {
                rotation: Math.random() * 20,
                duration: 3,
                ease: "sine.in",
                repeat: -1,
                delay: this.randMinMax(0, 5),
                onStart: () => {
                    coin.play();
                },
                onUpdate: () => {
                    coin.y += coinSpeed;
                    coin.x -= accelX;
                    coinSpeed += gravity;
        
                    if(accelX > 0)
                    accelX -= gravity/3;
                    if(accelX < 0)
                    accelX = 0
        
                    if(coin.y > this.app.screen.height){
                        coinSpeed = 0.15;
                        accelX = this.randMinMax(7.5, 11.5);
                        coin.y = this.app.screen.height - this.randMinMax(100,550);
                        coin.scale.set(this.randMinMax(0.2, 0.3));
                        coin.x = this.app.screen.width;
                        this.rightCoinAnimation.repeat();
                    }
                }
            })
        }
        this.container.addChild(this.coinsContainer);
    }
    private randMinMax(min:number, max:number){
        let random = Math.random() * (max - min) + min;
    
        return random;
    }
}   