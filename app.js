!function(e){var t={};function i(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)i.d(n,s,function(t){return e[t]}.bind(null,s));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=1)}([function(e,t,i){"use strict";i.d(t,"a",(function(){return n}));class n{constructor(e){this.loaded=!1,this.app=e,this.resources=[]}load(e){if(this.loaded)return this.show(this.app.loader.resources),void(e&&e());this.app.loader.add(this.resources.filter(e=>{if(!this.app.loader.resources[e])return e})),this.app.loader.load(t=>{this.show(t.resources),e&&e()}),this.loaded=!0}show(e){}hide(){}}},function(e,t,i){const{DancingStormtrooper:n}=i(2),{ShatteringEngel:s}=i(3),{Overlay:o}=i(4),{DemoThumb:r}=i(5);PIXI.settings.GC_MODE=PIXI.GC_MODES.MANUAL;let a=new PIXI.Application({backgroundColor:16711680,antialias:!0,view:document.getElementById("demo-canvas"),resizeTo:window}),l=new o("ui-overlay"),h=new o("load-overlay"),d=e=>{document.body.classList.remove("disable-scrolling"),l.hide(()=>{document.getElementById("demo-canvas").classList.remove("show"),e.hide()})},c=e=>{document.body.classList.add("disable-scrolling"),document.onkeypress=t=>{"Escape"===t.key&&d(e)},document.getElementById("ui-close").onclick=()=>{d(e)},h.show(()=>{e.load(()=>{document.getElementById("demo-canvas").classList.add("show"),l.show(()=>{h.hide()})})})};new r("dancing-stormtrooper",new n(a),"<a href='https://sketchfab.com/3d-models/dancing-stormtrooper-12bd08d66fe04a84be446e583d6663ac'>Model created by StrykerDoesAnimation.</a> License: <a href='https://creativecommons.org/licenses/by/4.0/'>CC Attribution</a>.",c),new r("shattering-engel",new s(a),"<a href='https://sketchfab.com/3d-models/engel-c958d74ae18c4734b37dbc3ff0841f8a'>Model created by noe-3d.at.</a> License: <a href='https://creativecommons.org/licenses/by/4.0/'>CC Attribution</a>.",c)},function(e,t,i){"use strict";i.r(t),i.d(t,"DancingStormtrooper",(function(){return s}));var n=i(0);class s extends n.a{constructor(e){super(e),this.resources=["models/dancing_stormtrooper/scene.gltf","environments/photo_studio/diffuse.cubemap","environments/photo_studio/specular.cubemap"]}show(e){this.app.renderer.backgroundColor=39219,this.dirLight=Object.assign(new PIXI3D.Light,{type:"directional",intensity:1.5,x:0,y:0,z:5}),this.dirLight.rotationQuaternion.setEulerAngles(10,180,0);let t=new PIXI3D.ImageBasedLighting(e["environments/photo_studio/diffuse.cubemap"].texture,e["environments/photo_studio/specular.cubemap"].texture);this.lightingEnvironment=new PIXI3D.LightingEnvironment(this.app.renderer,t),this.lightingEnvironment.lights.push(this.dirLight),this.camera=new PIXI3D.Camera(this.app.renderer),this.camera.rotationQuaternion.setEulerAngles(-10,180,0),this.container=this.app.stage.addChild(new PIXI3D.Container3D),this.model=this.container.addChild(PIXI3D.Model.from(e["models/dancing_stormtrooper/scene.gltf"].gltf)),this.model.scale.set(2.3),this.model.y=-5.2,this.model.rotationQuaternion.setEulerAngles(0,0,0),this.model.meshes.forEach(e=>{e.material.camera=this.camera,e.material.lightingEnvironment=this.lightingEnvironment,e.material.exposure=1}),this.model.animations[0].loop=!0,this.model.animations[0].play(),this.shadowCastingLight=new PIXI3D.ShadowCastingLight(this.app.renderer,this.dirLight,1024,15,1,PIXI3D.ShadowQuality.medium),PIXI3D.StandardPipeline.from(this.app.renderer).enableShadows(this.model,this.shadowCastingLight)}hide(){this.shadowCastingLight.destroy(),this.model.meshes.forEach(e=>{e.destroy()}),PIXI3D.StandardPipeline.from(this.app.renderer).shadowPass.removeShadowCastingLight(this.shadowCastingLight),this.app.stage.removeChildren()}}},function(e,t,i){"use strict";i.r(t),i.d(t,"ShatteringEngel",(function(){return s}));var n=i(0);class s extends n.a{constructor(e){super(e),this.resources=["models/engel/engel1.gltf","models/engel/engel2.gltf"]}show(e){document.getElementById("ui-content").innerHTML="<i class='far fa-hand-pointer fa-6x hand-pointer'></i>",this.app.renderer.backgroundColor=8895433,this.ambientLight=Object.assign(new PIXI3D.Light,{type:"ambient",intensity:1,color:[.8,.8,1]}),this.spotLight=Object.assign(new PIXI3D.Light,{type:"spot",intensity:100,x:0,y:2,z:5,color:[1,1,1],range:30}),this.spotLight.rotationQuaternion.setEulerAngles(0,180,0),this.lightingEnvironment=new PIXI3D.LightingEnvironment(this.app.renderer),this.lightingEnvironment.lights.push(this.spotLight),this.lightingEnvironment.lights.push(this.ambientLight),this.camera=new PIXI3D.Camera(this.app.renderer),this.camera.rotationQuaternion.setEulerAngles(-10,180,0),this.container=this.app.stage.addChild(new PIXI3D.Container3D),this.container.y=-3.3,this.container.scale.set(.85),this.model1=this.container.addChild(PIXI3D.Model.from(e["models/engel/engel1.gltf"].gltf)),this.model1.visible=!0,this.model1.interactive=!0,this.model1.buttonMode=!0,this.model1.hitArea=new PIXI3D.PickingHitArea(this.app.renderer,this.model1,this.camera),this.model1.on("pointerdown",()=>{this.model2.animations.forEach(e=>{e.play(),e.position=.63}),this.model1.visible=!1,this.model2.visible=!0,document.getElementById("ui-content").innerHTML=""}),this.model1.meshes.forEach(e=>{e.material.camera=this.camera,e.material.lightingEnvironment=this.lightingEnvironment,e.material.exposure=1}),this.model2=this.container.addChild(PIXI3D.Model.from(e["models/engel/engel2.gltf"].gltf)),this.model2.visible=!1,this.model2.meshes.forEach(e=>{e.material.camera=this.camera,e.material.lightingEnvironment=this.lightingEnvironment,e.material.exposure=1}),this.model2.animations.forEach(e=>{e.speed=1.5,e.on("complete",()=>{this.model1.visible=!0,this.model2.visible=!1})})}hide(){this.model1.meshes.forEach(e=>{e.destroy()}),this.model2.meshes.forEach(e=>{e.destroy()}),this.app.stage.removeChildren(),document.getElementById("ui-content").innerHTML=""}}},function(e,t,i){"use strict";i.r(t),i.d(t,"Overlay",(function(){return n}));class n{constructor(e){this.element=document.getElementById(e),this.element.classList.add("overlay")}show(e){this.element.classList.add("overlay-show"),e&&setTimeout(()=>{e()},.5)}hide(e){this.element.classList.remove("overlay-show"),e&&setTimeout(()=>{e()},.5)}}},function(e,t,i){"use strict";i.r(t),i.d(t,"DemoThumb",(function(){return n}));class n{constructor(e,t,i,n){this.demo=t,this.element=document.getElementById(e),this.element.addEventListener("click",()=>{n(t),document.getElementById("ui-license").innerHTML=i})}select(){this.element.click()}}}]);