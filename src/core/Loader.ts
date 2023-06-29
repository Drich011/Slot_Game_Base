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
                    {name: 'main',srcs: 'assets/roulette.json'}
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