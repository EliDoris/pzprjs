//
// パズル固有スクリプト部 アイスバーン版 icebarn.js v3.4.0
//
pzprv3.custom.icebarn = {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	inputedit : function(){
		if(this.mousestart || this.mousemove){
			if     (this.btn.Left) { this.inputarrow();}
			else if(this.btn.Right){ this.inputIcebarn();}
		}
	},
	inputplay : function(){
		if(this.mousestart || this.mousemove){
			if     (this.btn.Left) { this.inputLine();}
			else if(this.btn.Right){ this.inputpeke();}
		}
		else if(this.mouseend && this.notInputted()){
			if(this.btn.Left){ this.inputpeke();}
		}
	},
	inputRed : function(){ this.dispRedLine();},

	inputIcebarn : function(){
		var cell = this.getcell();
		if(cell.isnull || cell===this.mouseCell){ return;}
		if(this.inputData===null){ this.inputData = (cell.ice()?0:6);}

		cell.setQues(this.inputData);
		cell.drawaround();
		this.mouseCell = cell;
	},
	inputarrow : function(){
		var pos = this.borderpos(0);
		if(this.prevPos.equals(pos)){ return;}

		var border = this.getnb(this.prevPos, pos);
		if(border.id!==null && !this.mousestart){
			var dir = this.getdir(this.prevPos, pos);

			if(border.id<bd.bdinside){
				if(this.inputData===null){ this.inputData=((border.getArrow()!==dir)?1:0);}
				border.setArrow((this.inputData===1)?dir:0);
			}
			else{
				if(this.inputData===null){ this.inputarrow_inout(border,dir);}
			}
			border.draw();
		}
		this.prevPos = pos;
	},
	inputarrow_inout : function(border,dir){
		var val = this.checkinout(border,dir), border0=null;
		if     (val===1){ border0 = bd.arrowin;  bd.inputarrowin(border);}
		else if(val===2){ border0 = bd.arrowout; bd.inputarrowout(border);}
		if(border0!==null){
			border0.draw();
			this.mousereset();
		}
	},
	/* 0:どちらでもない 1:IN 2:OUT */
	checkinout : function(border,dir){
		if(border.isnull){ return 0;}
		var bx=border.bx, by=border.by;
		if     ((bx===bd.minbx && dir===bd.RT)||(bx===bd.maxbx && dir===bd.LT)||
				(by===bd.minby && dir===bd.DN)||(by===bd.maxby && dir===bd.UP)){ return 1;}
		else if((bx===bd.minbx && dir===bd.LT)||(bx===bd.maxbx && dir===bd.RT)||
				(by===bd.minby && dir===bd.UP)||(by===bd.maxby && dir===bd.DN)){ return 2;}
		return 0;
	}
},

//---------------------------------------------------------
// 盤面管理系
Border:{
	getArrow : function(){ return this.qdir;},
	setArrow : function(val){ this.setQdir(val);},
	isArrow  : function(){ return (this.qdir>0);}
},

Board:{
	qcols : 8,
	qrows : 8,

	isborder : 2,

	arrowin  : null,
	arrowout : null,

	initBoardSize : function(col,row){
		this.SuperFunc.initBoardSize.call(this,col,row);

		this.arrowin  = this.border[0];
		this.arrowout = this.border[1];

		this.disableInfo();
		if(col>=3){
			this.inputarrowin (this.getb(this.minbx+1, this.minby));
			this.inputarrowout(this.getb(this.minbx+5, this.minby));
		}
		else{
			this.inputarrowin (this.getb(1, this.minby));
			this.inputarrowout(this.getb(1, this.maxby));
		}
		this.enableInfo();
	},

	inputarrowin : function(border){
		var old_in=this.arrowin, old_out=this.arrowout;
		if(old_out===border){ this.setarrowout(old_in);}else{ old_in.setArrow(0);}
		this.setarrowin(border);
	},
	inputarrowout : function(border){
		var old_in=this.arrowin, old_out=this.arrowout;
		if(old_in===border){ this.setarrowin(old_out);}else{ old_out.setArrow(0);}
		this.setarrowout(border);
	},

	setarrowin : function(border){
		if(um.isenableRecord()){
			um.addOpe_InOut('in', this.arrowin.bx,this.arrowin.by, border.bx,border.by);
		}
		this.arrowin = border;

		this.setarrowin_arrow(border);
	},
	setarrowin_arrow : function(border){
		if     (border.by===this.maxby){ border.setArrow(this.UP);}
		else if(border.by===this.minby){ border.setArrow(this.DN);}
		else if(border.bx===this.maxbx){ border.setArrow(this.LT);}
		else if(border.bx===this.minbx){ border.setArrow(this.RT);}
	},

	setarrowout : function(border){
		if(um.isenableRecord()){
			um.addOpe_InOut('out', this.arrowout.bx,this.arrowout.by, border.bx,border.by);
		}
		this.arrowout = border;

		this.setarrowout_arrow(border);
	},
	setarrowout_arrow : function(border){
		if     (border.by===this.minby){ border.setArrow(this.UP);}
		else if(border.by===this.maxby){ border.setArrow(this.DN);}
		else if(border.bx===this.minbx){ border.setArrow(this.LT);}
		else if(border.bx===this.maxbx){ border.setArrow(this.RT);}
	},

	posinfo_in  : {},
	posinfo_out : {},
	adjustBoardData : function(key,d){
		this.adjustBorderArrow(key,d);

		this.posinfo_in  = this.getAfterPos(key,d,this.arrowin);
		this.posinfo_out = this.getAfterPos(key,d,this.arrowout);
	},
	adjustBoardData2 : function(key,d){
		var info1 = this.posinfo_in, info2 = this.posinfo_out;
		this.arrowin  = this.getb(info1.bx2, info1.by2);
		this.arrowout = this.getb(info2.bx2, info2.by2);

		if((key & this.REDUCE) && !um.undoExec && !um.redoExec){
			um.forceRecord = true;
			if(info1.isdel){
				um.addOpe_InOut('in', info1.bx1,info1.by1, info1.bx2,info1.by2);
				this.setarrowin_arrow (this.arrowin);
			}
			if(info2.isdel){
				um.addOpe_InOut('out', info2.bx1,info2.by1, info2.bx2,info2.by2);
				this.setarrowout_arrow(this.arrowout);
			}
			um.forceRecord = false;
		}
	}
},

"InOutOperation:Operation":{
	property : '',

	setData : function(property, x1, y1, x2, y2){
		this.property = property;
		this.bx1 = x1;
		this.by1 = y1;
		this.bx2 = x2;
		this.by2 = y2;
	},
	decode : function(str){
		if(strs[0]!=='PI' && strs[0]!=='PO'){ return false;}
		this.property = (strs[0]=='PI'?'in':'out');
		this.bx1 = +strs[1];
		this.by1 = +strs[2];
		this.bx2 = +strs[3];
		this.by2 = +strs[4];
		return true;
	},
	toString : function(){
		return [(this.property=='in'?'PI':'PO'), this.bx1, this.by1, this.bx2, this.by2].join(',');
	},

	undo : function(){ this.exec(this.bx1, this.by1);},
	redo : function(){ this.exec(this.bx2, this.by2);},
	exec : function(bx, by){
		var border0, border = bd.getb(bx,by);
		if     (this.property==='in') { border0 = bd.arrowin;  bd.arrowin  = border;}
		else if(this.property==='out'){ border0 = bd.arrowout; bd.arrowout = border;}
		border0.draw();
		border.draw();
	}
},

OperationManager:{
	addOpe_InOut : function(property, x1, y1, x2, y2){
		// 操作を登録する
		this.addOpe_common(function(){
			var ope = this.owner.newInstance('InOutOperation');
			ope.setData(property, x1, y1, x2, y2);
			return ope;
		});
	},
	decodeOpe : function(strs){
		var ope = this.owner.newInstance('InOutOperation');
		if(ope.decode(strs)){ return ope;}

		return this.SuperFunc.decodeOpe.call(this, strs);
	}
},

LineManager:{
	isCenterLine : true,
	isLineCross  : true
},

"AreaIcebarnData:AreaData":{
	isvalid : function(cell){ return cell.ice();}
},

Menu:{
	menufix : function(){
		this.addRedLineToFlags();
	}
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	bdmargin       : 1.00,
	bdmargin_image : 1.00,

	irowake : 1,

	setColors : function(){
		this.gridcolor = this.gridcolor_LIGHT;
		this.linecolor = this.linecolor_LIGHT;
		this.errcolor1 = "red";
		this.setBGCellColorFunc('icebarn');
		this.setBorderColorFunc('ice');

		this.maxYdeg = 0.70;
	},
	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid();

		this.drawBorders();

		this.drawLines();
		this.drawPekes(1);

		this.drawBorderArrows();

		this.drawChassis();

		this.drawInOut();
	},

	drawBorderArrows : function(){
		var g = this.vinc('border_arrow', 'crispEdges');

		var ll = this.cw*0.35;				//LineLength
		var lw = Math.max(this.cw/36, 1);	//LineWidth
		var lm = lw/2;						//LineMargin

		var headers = ["b_ar_","b_tipa_","b_tipb_"]; /* 1つのidでは2方向しかとれないはず */
		var blist = this.range.borders;
		for(var i=0;i<blist.length;i++){
			var border = blist[i], id = border.id, dir=border.getArrow();

			this.vhide([headers[0]+id, headers[1]+id, headers[2]+id]);
			if(dir>=1 && dir<=4){
				var px=border.px, py=border.py;

				g.fillStyle = (border.error===3 ? this.errcolor1 : this.cellcolor);
				if(this.vnop(headers[0]+id,this.FILL)){
					switch(dir){
						case bd.UP: case bd.DN: g.fillRect(px-lm, py-ll, lw, ll*2); break;
						case bd.LT: case bd.RT: g.fillRect(px-ll, py-lm, ll*2, lw); break;
					}
				}

				if(this.vnop(headers[((dir+1)&1)+1]+id,this.FILL)){
					switch(dir){
						case bd.UP: g.setOffsetLinePath(px,py ,0,-ll ,-ll/2,-ll*0.4 ,ll/2,-ll*0.4, true); break;
						case bd.DN: g.setOffsetLinePath(px,py ,0,+ll ,-ll/2, ll*0.4 ,ll/2, ll*0.4, true); break;
						case bd.LT: g.setOffsetLinePath(px,py ,-ll,0 ,-ll*0.4,-ll/2 ,-ll*0.4,ll/2, true); break;
						case bd.RT: g.setOffsetLinePath(px,py , ll,0 , ll*0.4,-ll/2 , ll*0.4,ll/2, true); break;
					}
					g.fill();
				}
			}
		}
	},
	drawInOut : function(){
		var g = this.currentContext, border;

		border = bd.arrowin;
		if(border.id>=bd.bdinside && border.id<bd.bdmax){
			g.fillStyle = (border.error===3 ? this.errcolor1 : this.cellcolor);
			var bx = border.bx, by = border.by, px = border.px, py = border.py;
			if     (by===bd.minby){ this.dispnum("string_in", 1, "IN", 0.55, "black", px,             py-0.6*this.ch);}
			else if(by===bd.maxby){ this.dispnum("string_in", 1, "IN", 0.55, "black", px,             py+0.6*this.ch);}
			else if(bx===bd.minbx){ this.dispnum("string_in", 1, "IN", 0.55, "black", px-0.5*this.cw, py-0.3*this.ch);}
			else if(bx===bd.maxbx){ this.dispnum("string_in", 1, "IN", 0.55, "black", px+0.5*this.cw, py-0.3*this.ch);}
		}
		border = bd.arrowout;
		if(border.id>=bd.bdinside && border.id<bd.bdmax){
			g.fillStyle = (border.error===3 ? this.errcolor1 : this.cellcolor);
			var bx = border.bx, by = border.by, px = border.px, py = border.py;
			if     (by===bd.minby){ this.dispnum("string_out", 1, "OUT", 0.55, "black", px,             py-0.6*this.ch);}
			else if(by===bd.maxby){ this.dispnum("string_out", 1, "OUT", 0.55, "black", px,             py+0.6*this.ch);}
			else if(bx===bd.minbx){ this.dispnum("string_out", 1, "OUT", 0.55, "black", px-0.7*this.cw, py-0.3*this.ch);}
			else if(bx===bd.maxbx){ this.dispnum("string_out", 1, "OUT", 0.55, "black", px+0.7*this.cw, py-0.3*this.ch);}
		}
	},

	repaintParts : function(blist){
		this.range.borders = blist;

		this.drawBorderArrows();
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	pzlimport : function(type){
		if     (type==0){ this.decodeIcebarn();}
		else if(type==1){
			if(this.checkpflag("c")){ this.decodeIcebarn_old2();}
			else                    { this.decodeIcebarn_old1();}
		}
	},
	pzlexport : function(type){
		if     (type==0){ return this.encodeIcebarn();}
		else if(type==1){ return this.encodeIcebarn_old1();}
	},

	decodeIcebarn : function(){
		var barray = this.outbstr.split("/");

		var a=0, c=0, twi=[16,8,4,2,1];
		for(var i=0;i<barray[0].length;i++){
			var num = parseInt(barray[0].charAt(i),32);
			for(var w=0;w<5;w++){
				if(c<bd.cellmax){
					bd.cell[c].ques = (num&twi[w]?6:0);
					c++;
				}
			}
			if(c>=bd.cellmax){ a=i+1; break;}
		}

		bd.disableInfo();
		var id=0;
		for(var i=a;i<barray[0].length;i++){
			var ca = barray[0].charAt(i);
			if(ca!=='z'){
				id += parseInt(ca,36);
				if(id<bd.bdinside){ bd.border[id].setArrow(bd.border[id].isHorz()?bd.UP:bd.LT);}
				id++;
			}
			else{ id+=35;}
			if(id>=bd.bdinside){ a=i+1; break;}
		}

		id=0;
		for(var i=a;i<barray[0].length;i++){
			var ca = barray[0].charAt(i);
			if(ca!=='z'){
				id += parseInt(ca,36);
				if(id<bd.bdinside){ bd.border[id].setArrow(bd.border[id].isHorz()?bd.DN:bd.RT);}
				id++;
			}
			else{ id+=35;}
			if(id>=bd.bdinside){ break;}
		}

		bd.inputarrowin (bd.border[parseInt(barray[1])+bd.bdinside]);
		bd.inputarrowout(bd.border[parseInt(barray[2])+bd.bdinside]);
		bd.enableInfo();

		this.outbstr = "";
	},
	encodeIcebarn : function(){
		var cm = "", num=0, pass=0, twi=[16,8,4,2,1];
		for(var c=0;c<bd.cellmax;c++){
			if(bd.cell[c].ques===6){ pass+=twi[num];} num++;
			if(num==5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}

		num=0;
		for(var id=0;id<bd.bdinside;id++){
			var dir = bd.border[id].getArrow();
			if(dir===bd.UP||dir===bd.LT){ cm+=num.toString(36); num=0;}
			else{
				num++;
				if(num>=35){ cm+="z"; num=0;}
			}
		}
		if(num>0){ cm+=num.toString(36);}

		num=0;
		for(var id=0;id<bd.bdinside;id++){
			var dir = bd.border[id].getArrow();
			if(dir===bd.DN||dir===bd.RT){ cm+=num.toString(36); num=0;}
			else{
				num++;
				if(num>=35){ cm+="z"; num=0;}
			}
		}
		if(num>0){ cm+=num.toString(36);}

		cm += ("/"+(bd.arrowin.id-bd.bdinside)+"/"+(bd.arrowout.id-bd.bdinside));

		this.outbstr += cm;
	},

	decodeIcebarn_old2 : function(){
		var barray = this.outbstr.split("/");

		var a=0, c=0, twi=[16,8,4,2,1];
		for(var i=0;i<barray[0].length;i++){
			var num = parseInt(barray[0].charAt(i),32);
			for(var w=0;w<5;w++){
				if(c<bd.cellmax){
					bd.cell[c].ques = (num&twi[w]?6:0);
					c++;
				}
			}
			if(c>=bd.cellmax){ a=i+1; break;}
		}

		bd.disableInfo();
		var id=0;
		for(var i=a;i<barray[2].length;i++){
			var ca = barray[2].charAt(i);
			if     (ca>='0' && ca<='9'){ var num=parseInt(ca); bd.border[id].setArrow(((num&1)?bd.UP:bd.DN)); id+=((num>>1)+1);}
			else if(ca>='a' && ca<='z'){ var num=parseInt(ca,36); id+=(num-9);}
			else{ id++;}
			if(id>=(bd.qcols-1)*bd.qrows){ a=i+1; break;}
		}
		id=(bd.qcols-1)*bd.qrows;
		for(var i=a;i<barray[2].length;i++){
			var ca = barray[2].charAt(i);
			if     (ca>='0' && ca<='9'){ var num=parseInt(ca); bd.border[id].setArrow(((num&1)?bd.LT:bd.RT)); id+=((num>>1)+1);}
			else if(ca>='a' && ca<='z'){ var num=parseInt(ca,36); id+=(num-9);}
			else{ id++;}
			if(id>=bd.bdinside){ break;}
		}

		bd.inputarrowin (bd.border[parseInt(barray[0])+bd.bdinside]);
		bd.inputarrowout(bd.border[parseInt(barray[1])+bd.bdinside]);
		bd.enableInfo();

		this.outbstr = "";
	},
	decodeIcebarn_old1 : function(){
		var barray = this.outbstr.split("/");

		var a=0, c=0, twi=[8,4,2,1];
		for(var i=0;i<barray[0].length;i++){
			var num = parseInt(barray[0].charAt(i),32);
			for(var w=0;w<4;w++){
				if(c<bd.cellmax){
					bd.cell[c].ques = (num&twi[w]?6:0);
					c++;
				}
			}
			if(c>=bd.cellmax){ break;}
		}

		bd.disableInfo();
		if(barray[1]!=""){
			var array = barray[1].split("+");
			for(var i=0;i<array.length;i++){ bd.cell[array[i]].db().setArrow(bd.UP);}
		}
		if(barray[2]!=""){
			var array = barray[2].split("+");
			for(var i=0;i<array.length;i++){ bd.cell[array[i]].db().setArrow(bd.DN);}
		}
		if(barray[3]!=""){
			var array = barray[3].split("+");
			for(var i=0;i<array.length;i++){ bd.cell[array[i]].rb().setArrow(bd.LT);}
		}
		if(barray[4]!=""){
			var array = barray[4].split("+");
			for(var i=0;i<array.length;i++){ bd.cell[array[i]].rb().setArrow(bd.RT);}
		}

		bd.inputarrowin (bd.border[parseInt(barray[5])+bd.bdinside]);
		bd.inputarrowout(bd.border[parseInt(barray[6])+bd.bdinside]);
		bd.enableInfo();

		this.outbstr = "";
	},
	encodeIcebarn_old1 : function(){
		var cm = "", num=0, pass=0, twi=[8,4,2,1];
		for(var c=0;c<bd.cellmax;c++){
			if(bd.cell[c].ques===6){ pass+=twi[num];} num++;
			if(num===4){ cm += pass.toString(16); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(16);}
		cm += "/";

		cm += (bd.cell.filter(function(cell){ return (cell.db().getArrow()===bd.UP);}).join("+") + "/");
		cm += (bd.cell.filter(function(cell){ return (cell.db().getArrow()===bd.DN);}).join("+") + "/");
		cm += (bd.cell.filter(function(cell){ return (cell.rb().getArrow()===bd.LT);}).join("+") + "/");
		cm += (bd.cell.filter(function(cell){ return (cell.rb().getArrow()===bd.RT);}).join("+") + "/");

		cm += ((bd.arrowin.id-bd.bdinside)+"/"+(bd.arrowout.id-bd.bdinside));

		this.outbstr += cm;
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		bd.disableInfo();
		bd.inputarrowin (bd.border[parseInt(this.readLine())]);
		bd.inputarrowout(bd.border[parseInt(this.readLine())]);
		bd.enableInfo();

		this.decodeCell( function(obj,ca){
			if(ca==="1"){ obj.ques = 6;}
		});
		bd.disableInfo();
		this.decodeBorder( function(obj,ca){
			if(ca!=="0"){
				var val = parseInt(ca), isvert = obj.isVert();
				if(val===1&&!isvert){ obj.setArrow(bd.UP);}
				if(val===2&&!isvert){ obj.setArrow(bd.DN);}
				if(val===1&& isvert){ obj.setArrow(bd.LT);}
				if(val===2&& isvert){ obj.setArrow(bd.RT);}
			}
		});
		bd.enableInfo();
		this.decodeBorder( function(obj,ca){
			if     (ca==="1" ){ obj.line = 1;}
			else if(ca==="-1"){ obj.qsub = 2;}
		});
	},
	encodeData : function(){
		this.datastr += (bd.arrowin.id+"/"+bd.arrowout.id+"/");
		this.encodeCell( function(obj){
			return (obj.ques===6?"1 ":"0 ");
		});
		this.encodeBorder( function(obj){
			var dir = obj.getArrow();
			if     (dir===bd.UP||dir===bd.LT){ return "1 ";}
			else if(dir===bd.DN||dir===bd.RT){ return "2 ";}
			else                             { return "0 ";}
		});
		this.encodeBorder( function(obj){
			if     (obj.line===1){ return "1 ";}
			else if(obj.qsub===2){ return "-1 ";}
			else                 { return "0 ";}
		});
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checkAns : function(){

		if( !this.checkLcntCell(3) ){
			this.setAlert('分岐している線があります。','There is a branch line.'); return false;
		}

		if( !this.checkAllCell(function(cell){ return (cell.lcnt()===4 && !cell.ice());}) ){
			this.setAlert('氷の部分以外で線が交差しています。', 'A Line is crossed outside of ice.'); return false;
		}
		if( !this.checkIceLines() ){
			this.setAlert('氷の部分で線が曲がっています。', 'A Line curve on ice.'); return false;
		}

		var flag = this.checkLine();
		if( flag==-1 ){
			this.setAlert('スタート位置を特定できませんでした。', 'The system can\'t detect start position.'); return false;
		}
		if( flag==1 ){
			this.setAlert('INに線が通っていません。', 'The line doesn\'t go through the \'IN\' arrow.'); return false;
		}
		if( flag==2 ){
			this.setAlert('途中で途切れている線があります。', 'There is a dead-end line.'); return false;
		}
		if( flag==3 ){
			this.setAlert('盤面の外に出てしまった線があります。', 'A line is not reached out the \'OUT\' arrow.'); return false;
		}
		if( flag==4 ){
			this.setAlert('矢印を逆に通っています。', 'A line goes through an arrow reverse.'); return false;
		}

		if( !this.checkOneLoop() ){
			this.setAlert('線がひとつながりではありません。', 'Lines are not countinuous.'); return false;
		}

		var iarea = this.owner.newInstance('AreaIcebarnData').getAreaInfo();
		if( !this.checkLinesInArea(iarea, function(w,h,a,n){ return (a!=0);}) ){
			this.setAlert('すべてのアイスバーンを通っていません。', 'A icebarn is not gone through.'); return false;
		}

		if( !this.checkAllArrow() ){
			this.setAlert('線が通っていない矢印があります。', 'A line doesn\'t go through some arrows.'); return false;
		}

		if( !this.checkLcntCell(1) ){
			this.setAlert('途中で途切れている線があります。', 'There is a dead-end line.'); return false;
		}

		return true;
	},

	checkAllArrow : function(){
		var result = true;
		for(var id=0;id<bd.bdmax;id++){
			var border = bd.border[id];
			if(border.isArrow() && !border.isLine()){
				if(this.inAutoCheck){ return false;}
				border.seterr(3);
				result = false;
			}
		}
		return result;
	},

	checkLine : function(){
		var pos = bd.arrowin.getaddr(), dir=0;
		if     (pos.by===bd.minby){ dir=2;}else if(pos.by===bd.maxby){ dir=1;}
		else if(pos.bx===bd.minbx){ dir=4;}else if(pos.bx===bd.maxbx){ dir=3;}
		if(dir==0){ return -1;}
		if(!bd.arrowin.isLine()){ bd.arrowin.seterr(3); return 1;}

		bd.border.seterr(2);
		bd.arrowin.seterr(1);

		while(1){
			pos.movedir(dir,1);
			if(pos.oncell()){
				var cell = pos.getc();
				if(cell.isnull){ continue;}
				else if(!cell.ice()){
					if     (cell.lcnt()!==2){ dir=dir;}
					else if(dir!=1 && cell.db().isLine()){ dir=2;}
					else if(dir!=2 && cell.ub().isLine()){ dir=1;}
					else if(dir!=3 && cell.rb().isLine()){ dir=4;}
					else if(dir!=4 && cell.lb().isLine()){ dir=3;}
				}
			}
			else{
				var border = pos.getb();
				border.seterr(1);
				if(!border.isLine()){ return 2;}
				if(bd.arrowout===border){ break;}
				else if(border.id>=bd.bdinside){ return 3;}
				if(dir===[0,2,1,4,3][border.getArrow()]){ return 4;}
			}
		}

		bd.border.seterr(0);

		return 0;
	}
}
};
