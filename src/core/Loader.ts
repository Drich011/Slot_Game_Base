import 'pixi-spine' // Do this once at the very start of your code. This registers the loader!
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import WebFont from 'webfontloader';
import {Howl} from 'howler';

export default class Loader{
    private app:PIXI.Application
    private loadingContainer:PIXI.Container
    private loadingAssets:any
    private gameAssets:any
    public isMute: Boolean;
    constructor(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        this.app = new PIXI.Application({ width: 1920, height: 1080});
        (globalThis as any).__PIXI_APP__ = this.app;
        document.body.appendChild(this.app.view as any);
        this.init(loadedAssets)
        WebFont.load({
            custom: {
              families: ['Eras ITC'],
            },
        });
    }

    private async init(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        // manifest
        const manifest = {
            bundles: [
            {
                name: 'game-screen',
                assets: [
                    {name: 'main',srcs: 'assets/roulette.json'},
                    {name: 'slot',srcs: 'assets/slot/sprites/slot.json'},
                    {name: 'modal_main',srcs: 'assets/modal/sprites/modal_main.json'},
                    {name: 'modal_autoplay',srcs: 'assets/modal/sprites/modal_autoplay.json'},
                    {name: 'modal_settings',srcs: 'assets/modal/sprites/modal_settings.json'},
                    {name: 'background',srcs: 'assets/main/background.json'},
                    {name: 'frame',srcs: 'assets/main/frame.json'},
                    {name: 'slot_frame_controller',srcs: 'assets/main/slot_frame_controller.json'},
                    {name: 'bird',srcs: 'assets/slot/sprites/bird.json'},
                    {name: 'blue_crystal',srcs: 'assets/slot/sprites/blue_crystal.json'},
                    {name: 'bonus_symbol',srcs: 'assets/slot/sprites/bonus.json'},
                    {name: 'cameleon',srcs: 'assets/slot/sprites/cameleon.json'},
                    {name: 'snake',srcs: 'assets/slot/sprites/snake.json'},
                    {name: 'violet_crystal',srcs: 'assets/slot/sprites/violet_crystal.json'},
                    {name: 'monkey',srcs: 'assets/slot/sprites/monkey.json'},
                    {name: 'tiger',srcs:'assets/slot/sprites/tiger.json'},
                    {name: 'green_crystal',srcs: 'assets/slot/sprites/green_crystal.json'},
                    {name: 'orange_crystal',srcs: 'assets/slot/sprites/orange_crystal.json'},
                    {name: 'wild',srcs: 'assets/slot/sprites/wild.json'},
                ],
            }],
        };

        await PIXI.Assets.init({ manifest: manifest });
        
        PIXI.Assets.backgroundLoadBundle(['game-screen']);

        this.loadingScreen(loadedAssets)
    }
    private async loadingScreen(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        this.gameAssets = await PIXI.Assets.loadBundle('game-screen');
        
        loadedAssets(this.gameAssets,this.app)
    }
}