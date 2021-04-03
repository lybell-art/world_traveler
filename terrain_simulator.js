let player, tr;
const CHUNK_RADIUS=16;

function between(input, a, b)
{
	return a<=input && input<=b;
}

function changeBG() //The background color changes according to the real time
{
	const today = new Date();
	const offset= -today.getTimezoneOffset() * 60000;
	let t = (today.getTime() + offset)  / 86400000;
	t= ( t - Math.floor(t) ) * 24;
	let col;
	if(between(t,8,13)) col=lerpColor("#D3EDFF", "#53B9FF", map(t, 8, 13, 0, 1));
	else if(between(t,13,18)) col=lerpColor("#53B9FF", "#E1EAED", map(t, 13, 18, 0, 1));
	else if(between(t,18,18.5)) col=lerpColor("#E1EAED", "#FAC275", map(t, 18, 18.5, 0, 1));
	else if(between(t,18.5,19)) col=lerpColor("#FAC275", "#FA6F6E", map(t, 18.5, 19, 0, 1));
	else if(between(t,19,20)) col=lerpColor("#FA6F6E", "#483E8C", map(t, 19, 20, 0, 1));
	else if(between(t,20,24)) col=lerpColor("#483E8C", "#142740", map(t, 20, 24, 0, 1));
	else if(between(t,0,5)) col=color("#142740");
	else if(between(t,5,6)) col=lerpColor("#142740", "#8F77F3", map(t, 5, 6, 0, 1));
	else if(between(t,6,6.5)) col=lerpColor("#8F77F3", "#FDABB5", map(t, 6, 6.5, 0, 1));
	else if(between(t,6.5,7)) col=lerpColor("#FDABB5", "#F5E6CB", map(t, 6.5, 7, 0, 1));
	else col=lerpColor("#F5E6CB", "#D3EDFF", map(t, 7, 8, 0, 1));
	
	background(col);
}

function SCS_to_OCS(radius, xRot, yRot)
{
	return new p5.Vector( radius*Math.sin(xRot)*Math.sin(yRot), radius*Math.cos(yRot), radius*Math.cos(xRot)*Math.sin(yRot) );
}

class Player
{
	constructor(x,y)
	{
		this.camera=createCamera();
		this.pos=new p5.Vector(x,y,100);
		this.baseDist=height / 2 / tan((30 * PI) / 180);
		this.rotX=0;
		this.rotY=0;
	}
	startCamera()
	{
		setCamera(this.camera);
	}
	renderCamera()
	{
		let lookAt=SCS_to_OCS(this.baseDist,this.rotX,this.rotY);
		lookAt.add(this.pos);
		this.camera.setPosition(this.pos.x, this.pos.y, this.pos.z);
		this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
	}
	getPos()
	{
		return {x:parseInt(this.pos.x/CHUNK_RADIUS), z:parseInt(this.pos.z/CHUNK_RADIUS)};
	}
}

class ChunkRenderer
{
	constructor(_x, _z, _type, _y)
	{
		this.start_x=_x*CHUNK_RADIUS;
		this.end_x=(_x+1)*CHUNK_RADIUS;
		this.start_z=_z*CHUNK_RADIUS;
		this.end_z=(_z+1)*CHUNK_RADIUS;
		this.type=0;
		this._y=_y;
	}
	_plainDraw(plainCol, oceanCol)
	{
		const _y = (this.y < 0 ? 0 : this.y);
		const mid_x = (this.start_x + this.end_x) /2;
		const mid_z = (this.start_z + this.end_z) /2;
		push();
		if(this.y<0) fill(oceanCol);
		else fill(plainCol);
		translate(mid_x, -(1000+_y)/2, mid_z);
		box(CHUNK_RADIUS, 1000+_y, CHUNK_RADIUS);
		pop();
	}
}
class SnowyTaigaRenderer extends ChunkRenderer
{
	static _plain_color = color(240,252,255);
	static _ocean_color = color(57, 56, 201);
	constructor(_x, _z, _type, _y)
	{
		super(_x, _z, _type, _y);
		if(_type < 2) this.type=0;
		else if(_type < 4) this.type=1;
		else this.type=2;
	}
	render()
	{
		super._plainDraw(SnowyTaigaRenderer._plain_color, SnowyTaigaRenderer._ocean_color);
	}
}
class TaigaRenderer extends ChunkRenderer
{
	static _plain_color = color(61, 175, 126);
	static _ocean_color = color(58, 112, 218);
	constructor(_x, _z, _type, _y)
	{
		super(_x, _z, _type, _y);
		if(_type < 2) this.type=0;
		else if(_type < 4) this.type=1;
		else this.type=2;
	}
	render()
	{
		super._plainDraw(TaigaRenderer._plain_color, TaigaRenderer._ocean_color);
	}
}
class PlainRenderer extends ChunkRenderer
{
	static _plain_color = color(110, 189, 89);
	static _ocean_color = color(69, 173, 242);
	constructor(_x, _z, _type, _y)
	{
		super(_x, _z, _type, _y);
		if(_type < 3) this.type=0;
		else if(_type < 6) this.type=1;
		else this.type=2;
	}
	render()
	{
		super._plainDraw(PlainRenderer._plain_color, PlainRenderer._ocean_color);
	}
}
class SavannaRenderer extends ChunkRenderer
{
	static _plain_color = color(172, 183, 101);
	static _ocean_color = color(67, 238, 200);
	constructor(_x, _z, _type, _y)
	{
		super(_x, _z, _type, _y);
		if(_type < 6) this.type=0;
		else this.type=1;
	}
	render()
	{
		super._plainDraw(SavannaRenderer._plain_color, SavannaRenderer._ocean_color);
	}
}
class DesertRenderer extends ChunkRenderer
{
	static _plain_color = color(235,198,160);
	constructor(_x, _z, _type, _y)
	{
		super(_x, _z, _type, _y);
		if(_type < 5) this.type=0;
		else if(_type < 7) this.type=1;
		else this.type=2;
	}
	_plainDraw()
	{
		const _y = this.y;
		const mid_x = (this.start_x + this.end_x) /2;
		const mid_z = (this.start_z + this.end_z) /2;
		push();
		fill(DesertRenderer._plain_color);
		translate(mid_x, -(1000+_y)/2, mid_z);
		box(CHUNK_RADIUS, 1000+_y, CHUNK_RADIUS);
		pop();
	}
	render()
	{
		_plainDraw();
	}
}

class TerrainRenderer
{
	constructor()
	{
		this.chunkAmount=8;
	}
	_getBiome(noise)
	{
		if(between(noise,0,0.1)) return SnowyTaigaRenderer;
		else if(between(noise,0.1,0.3)) return TaigaRenderer;
		else if(between(noise,0.3,0.6)) return PlainRenderer;
		else if(between(noise,0.6,0.8)) return SavannaRenderer;
		else if(between(noise,0.8,1)) return DesertRenderer;
	}
	_getBiomeType(noise)
	{
		const seed=parseInt(noise*(1 << 16));
		return seed & 7;
	}
	_renderBiome(x, z, chunk, altitude)
	{
		const biome=_getBiome(chunk);
		const biome_hidden=_getBiomeType(chunk);
		new biome(x,z,biome_hidden,altitude).render();
	}
	render(cx,cz)
	{
		const noiseScale=0.001;
		const oceanFactor= 993217;
		let N=this.chunkAmount;
		for(var z=-N, z<=N; z++)
		{
			for(var x=-N; x<=N; x++)
			{
				let chunk_noise=noise((x+cx)*noiseScale, (z+cz)*noiseScale);
				let y_noise=noise((x+cx)*noiseScale +oceanFactor, (z+cz)*noiseScale +oceanFactor);
				y_noise=map(y_noise,0,1,-5, 20);
				_renderBiome(chunk_noise, y_noise);
			}
		}
	}
}

function setup()
{
	createCanvas(windowWidth,windowHeight,WEBGL);
	player=new Player(0,0);
	player.startCamera();
	tr=new TerrainRenderer();
}

function draw()
{
	changeBG();
	player.renderCamera();
	const pos=player.getPos();
	tr.render(pos.x, pos.z);
}