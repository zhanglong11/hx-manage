!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&module.exports?module.exports=t():e.VolumetricFire=t()}(this,(function(){"use strict";var e,t=["attribute vec3 tex;","varying vec3 texOut;","void main ( void ) {","gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );","texOut = tex;","}"].join("\n"),r=["precision highp float;","vec2 mBBS( vec2 val, float modulus ) {","val = mod( val, modulus ); // For numerical consistancy.","return mod(val * val, modulus);","}","uniform sampler2D nzw;","const float modulus = 61.0;  // Value used in pregenerated noise texture.","float mnoise ( vec3 pos ) {","float intArg = floor( pos.z );","float fracArg = fract( pos.z );","vec2 hash = mBBS( intArg * 3.0 + vec2( 0, 3 ), modulus );","vec4 g = vec4 (","texture2D( nzw, vec2( pos.x, pos.y + hash.x ) / modulus ).xy,","texture2D( nzw, vec2( pos.x, pos.y + hash.y ) / modulus ).xy",") * 2.0 - 1.0;","return mix(","g.x + g.y * fracArg,","g.z + g.w * ( fracArg - 1.0 ),","smoothstep( 0.0, 1.0, fracArg )",");","}","const int octives = 4;","const float lacunarity = 2.0;","const float gain = 0.5;","float turbulence( vec3 pos ) {","float sum  = 0.0;","float freq = 1.0;","float amp  = 1.0;","for ( int i = 0; i < 4; i++ ) {","sum += abs( mnoise( pos * freq ) ) * amp;","freq *= lacunarity;","amp *= gain;","}","return sum;","}","const float magnatude = 1.3;","uniform float time;","uniform sampler2D fireProfile;","vec4 sampleFire( vec3 loc, vec4 scale ) {","loc.xz = loc.xz * 2.0 - 1.0;","vec2 st = vec2( sqrt( dot( loc.xz, loc.xz ) ), loc.y );","loc.y -= time * scale.w; // Scrolling noise upwards over time.","loc *= scale.xyz; // Scaling noise space.","float offset = sqrt( st.y ) * magnatude * turbulence( loc );","st.y += offset;","if ( st.y > 1.0 ) {","return vec4( 0, 0, 0, 1 );","}","vec4 result = texture2D( fireProfile, st );","if ( st.y < 0.1 ) {","result *= st.y / 0.1;","}","return result;","}","varying vec3 texOut;","void main( void ) {","vec3 color = sampleFire( texOut, vec4( 1.0, 2.0, 1.0, 0.5 ) ).xyz;","gl_FragColor = vec4( color * 1.5, 1 );","}"].join("\n"),o=function(){if(e)return e;var o=THREE.ImageUtils.loadTexture(n.texturePath+"nzw.png");o.wrapS=THREE.RepeatWrapping,o.wrapT=THREE.RepeatWrapping,o.magFilter=THREE.LinearFilter,o.minFilter=THREE.LinearFilter;var i=THREE.ImageUtils.loadTexture(n.texturePath+"firetex.png");i.wrapS=THREE.ClampToEdgeWrapping,i.wrapT=THREE.ClampToEdgeWrapping,i.magFilter=THREE.LinearFilter,i.minFilter=THREE.LinearFilter;var s={nzw:{type:"t",value:o},fireProfile:{type:"t",value:i},time:{type:"f",value:1}};return e=new THREE.ShaderMaterial({vertexShader:t,fragmentShader:r,uniforms:s,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,transparent:!0})},i=[[1,2,4],[0,5,3],[0,3,6],[1,7,2],[0,6,5],[1,4,7],[2,7,4],[3,5,6]],s=[[-1,2,4,-1,1,-1,-1,-1],[5,-1,-1,0,-1,3,-1,-1],[3,-1,-1,6,-1,-1,0,-1],[-1,7,1,-1,-1,-1,-1,2],[6,-1,-1,-1,-1,0,5,-1],[-1,4,-1,-1,7,-1,-1,1],[-1,-1,7,-1,2,-1,-1,4],[-1,-1,-1,5,-1,6,3,-1]],n=function(e,t,r,i,s){this.camera=s,this._sliceSpacing=i;var n=.5*e,a=.5*t,l=.5*r;this._posCorners=[new THREE.Vector3(-n,-a,-l),new THREE.Vector3(n,-a,-l),new THREE.Vector3(-n,a,-l),new THREE.Vector3(n,a,-l),new THREE.Vector3(-n,-a,l),new THREE.Vector3(n,-a,l),new THREE.Vector3(-n,a,l),new THREE.Vector3(n,a,l)],this._texCorners=[new THREE.Vector3(0,0,0),new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(1,1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(1,0,1),new THREE.Vector3(0,1,1),new THREE.Vector3(1,1,1)],this._viewVector=new THREE.Vector3;var c=new Uint16Array(30*(e+t+r)),p=new Float32Array(30*(e+t+r)*3),d=new Float32Array(30*(e+t+r)*3),u=new THREE.BufferGeometry;u.dynamic=!0,u.addAttribute("index",new THREE.BufferAttribute(c,1)),u.addAttribute("position",new THREE.BufferAttribute(p,3)),u.addAttribute("tex",new THREE.BufferAttribute(d,3));var x=o();this.mesh=new THREE.Mesh(u,x),this.mesh.updateMatrixWorld()};n.prototype.update=function(e){this.updateViewVector(),this.slice(),this.updateGeometry(),this.mesh.material.uniforms.time.value=e},n.prototype.updateGeometry=function(){this.mesh.geometry.attributes.index.array.set(this._indexes),this.mesh.geometry.attributes.position.array.set(this._points),this.mesh.geometry.attributes.tex.array.set(this._texCoords),this.mesh.geometry.attributes.index.needsUpdate=!0,this.mesh.geometry.attributes.position.needsUpdate=!0,this.mesh.geometry.attributes.tex.needsUpdate=!0},n.prototype.updateViewVector=function(){var e=new THREE.Matrix4;e.multiplyMatrices(this.camera.matrixWorldInverse,this.mesh.matrixWorld),this._viewVector.set(-e.elements[2],-e.elements[6],-e.elements[10]).normalize()},n.prototype.slice=function(){var e;this._points=[],this._texCoords=[],this._indexes=[];var t=this._posCorners[0].dot(this._viewVector),r=[t],o=0,n=t,l=t;for(e=1;e<8;e=e+1|0)r[e]=this._posCorners[e].dot(this._viewVector),r[e]>l&&(o=e,l=r[e]),r[e]<n&&(n=r[e]);var c=Math.floor(l/this._sliceSpacing)*this._sliceSpacing,p=[],d=0,u=0,x=new a,h=function(e,t){if(!(u>=12)){var o={expired:!1,startIndex:e,endIndex:t,deltaPos:new THREE.Vector3,deltaTex:new THREE.Vector3,pos:new THREE.Vector3,tex:new THREE.Vector3,cur:u},i=r[e]-r[t];if(0!==i){var s=1/i;o.deltaPos.subVectors(this._posCorners[t],this._posCorners[e]).multiplyScalar(s),o.deltaTex.subVectors(this._texCorners[t],this._texCorners[e]).multiplyScalar(s);var n=r[e]-c;o.pos.addVectors(o.deltaPos.clone().multiplyScalar(n),this._posCorners[e]),o.tex.addVectors(o.deltaTex.clone().multiplyScalar(n),this._texCorners[e]),o.deltaPos.multiplyScalar(this._sliceSpacing),o.deltaTex.multiplyScalar(this._sliceSpacing)}return x.push(o,r[t]),p[u++]=o,o}};for(e=0;e<3;e=e+1|0){(R=h.call(this,o,i[o][e])).prev=(e+2)%3,R.next=(e+1)%3}for(var m=0;c>n;){for(;x.top().priority>=c;){var f=x.pop().object;if(!f.expired)if(f.endIndex!==p[f.prev].endIndex&&f.endIndex!==p[f.next].endIndex){f.expired=!0;var v=h.call(this,f.endIndex,s[f.endIndex][f.startIndex]);v.prev=f.prev,p[f.prev].next=u-1,v.next=u;var E=h.call(this,f.endIndex,s[f.endIndex][v.endIndex]);E.prev=u-2,E.next=f.next,p[E.next].prev=u-1,d=u-1}else{var y,g;f.endIndex===p[f.prev].endIndex?(y=p[f.prev],g=f):(y=f,g=p[f.next]),y.expired=!0,g.expired=!0,(R=h.call(this,f.endIndex,s[f.endIndex][y.startIndex])).prev=y.prev,p[R.prev].next=u-1,R.next=g.next,p[R.next].prev=u-1,d=u-1}}var w=d,T=0;do{++T;var R=p[w];this._points.push(R.pos.x,R.pos.y,R.pos.z),this._texCoords.push(R.tex.x,R.tex.y,R.tex.z),R.pos.add(R.deltaPos),R.tex.add(R.deltaTex),w=R.next}while(w!==d);for(e=2;e<T;e=e+1|0)this._indexes.push(m,m+e-1,m+e);m+=T,c-=this._sliceSpacing}},n.texturePath="/assets/textures/";var a=function(){this.contents=[],this.sorted=!1};return a.prototype={sort:function(){this.contents.sort(),this.sorted=!0},pop:function(){return this.sorted||this.sort(),this.contents.pop()},top:function(){return this.sorted||this.sort(),this.contents[this.contents.length-1]},push:function(e,t){this.contents.push({object:e,priority:t}),this.sorted=!1}},n}));