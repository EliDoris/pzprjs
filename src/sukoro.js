//
// パズル固有スクリプト部 数コロ・ヴィウ・数コロ部屋版 sukoro.js v3.4.0
//
pzprv3.custom.sukoro = {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	inputedit : function(){
		if(this.owner.pid==='sukoro' || this.owner.pid==='view'){
			if(this.mousestart){ this.inputqnum();}
		}
		else if(this.owner.pid==='sukororoom'){
			if(this.mousestart || (this.mousemove && this.btn.Left)){
				this.inputborder();
			}
			else if(this.mouseend && this.notInputted()){
				this.inputqnum();
			}
		}
	},
	inputplay : function(){ if(this.mousestart){ this.inputqnum();}}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,
	enableplay : true,

	keyinput : function(ca){
		this.key_sukoro(ca);
	},
	key_sukoro : function(ca){
		if(this.owner.playmode){
			var cell=tc.getTCC();
			if     (ca==='q'||ca==='a'||ca==='z')          { ca=(cell.getQsub()===1?'1':'s1');}
			else if(ca==='w'||ca==='s'||ca==='x')          { ca=(cell.getQsub()===2?'2':'s2');}
			else if(ca==='e'||ca==='d'||ca==='c'||ca==='-'){ ca=' '; }
			else if(ca==='1' && cell.getAnum()===1)        { ca='s1';}
			else if(ca==='2' && cell.getAnum()===2)        { ca='s2';}
		}
		this.key_inputqnum(ca);
	},

	enablemake_p : true,
	enableplay_p : true,
	generate : function(mode,type){
		var mbcolor = this.owner.classes.Graphic.prototype.mbcolor;
		if(this.owner.pid==='sukoro'||this.owner.pid==='sukororoom'){
			this.inputcol('num','knum1','1','1');
			this.inputcol('num','knum2','2','2');
			this.inputcol('num','knum3','3','3');
			this.inputcol('num','knum4','4','4');
			this.insertrow();
			if(mode==1){
				this.inputcol('num','knum.','-','?');
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('empty','','','');
				this.inputcol('empty','','','');
				this.insertrow();
			}
			else{
				this.tdcolor = mbcolor;
				this.inputcol('num','knumq','q','○');
				this.inputcol('num','knumw','w','×');
				this.tdcolor = "black";
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('empty','','','');
				this.insertrow();
			}
		}
		else if(this.owner.pid=='view'){
			if(mode==3){
				this.tdcolor = mbcolor;
				this.inputcol('num','knumq','q','○');
				this.inputcol('num','knumw','w','×');
				this.tdcolor = "black";
				this.inputcol('empty','','','');
				this.inputcol('empty','','','');
				this.insertrow();
			}
			this.inputcol('num','knum0','0','0');
			this.inputcol('num','knum1','1','1');
			this.inputcol('num','knum2','2','2');
			this.inputcol('num','knum3','3','3');
			this.insertrow();
			this.inputcol('num','knum4','4','4');
			this.inputcol('num','knum5','5','5');
			this.inputcol('num','knum6','6','6');
			this.inputcol('num','knum7','7','7');
			this.insertrow();
			this.inputcol('num','knum8','8','8');
			this.inputcol('num','knum9','9','9');
			this.inputcol('num','knum_',' ',' ');
			((mode==1)?this.inputcol('num','knum.','-','?'):this.inputcol('empty','','',''));
			this.insertrow();
		}
	}
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	numberWithMB : true,

	nummaxfunc : function(){
		return (this.owner.pid==='view' ? Math.min(bd.qcols+bd.qrows-2, this.maxnum) : 4);
	},

	// 正答判定用
	getViewClist : function(){
		var sx=this.bx, sy=this.by, clist=this.owner.newInstance('PieceList');
		for(var dir=1;dir<=4;dir++){
			var pos = this.owner.newInstance('Address',[sx,sy]);
			while(1){
				pos.movedir(dir,2);
				var cell = pos.getc();
				if(!cell.isnull && cell.noNum() && cell.getQsub()!==1){ clist.add(cell);}
				else{ break;}
			}
		}
		return clist;
	}
},
Board:{
	initialize : function(){
		this.SuperFunc.initialize.call(this);

		if(this.owner.pid==='view' || this.owner.pid==='sukororoom'){
			this.qcols = 8;
			this.qrows = 8;
		}
		if(this.owner.pid==='view'){
			this.owner.classes.Cell.prototype.minnum = 0;
		}
		if(this.owner.pid==='sukororoom'){
			this.isborder = 1;
		}
	}
},

AreaManager:{
	initialize : function(){
		this.SuperFunc.initialize.call(this);
		if(this.owner.pid==='sukororoom'){ this.hasroom = true;}
	},
	linkNumber : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	setColors : function(){
		if(this.owner.pid==='view'){
			this.errbcolor2 = "rgb(255, 255, 127)";
			this.setBGCellColorFunc('error2');
		}
	},
	paint : function(){
		this.drawBGCells();
		this.drawGrid();

		if(this.owner.pid==='sukororoom'){ this.drawBorders();}

		this.drawMBs();
		this.drawNumbers();

		this.drawChassis();

		this.drawCursor();
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	pzlimport : function(type){
		var pid = this.owner.pid;
		if(pid==='sukoro'||pid==='sukororoom'){
			if(pid==='sukororoom'){ this.decodeBorder();}
			this.decodeNumber10();
		}
		else if(pid==='view'){
			this.decodeNumber16();
		}
	},
	pzlexport : function(type){
		var pid = this.owner.pid;
		if(pid==='sukoro'||pid==='sukororoom'){
			if(pid==='sukororoom'){ this.encodeBorder();}
			this.encodeNumber10();
		}
		else if(pid==='view'){
			this.encodeNumber16();
		}
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		if(this.owner.pid==='sukororoom'){ this.decodeBorderQues();}
		this.decodeCellQnum();
		this.decodeCellAnumsub();
	},
	encodeData : function(){
		if(this.owner.pid==='sukororoom'){ this.encodeBorderQues();}
		this.encodeCellQnum();
		this.encodeCellAnumsub();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checkAns : function(){

		if( (this.owner.pid!=='sukororoom') && !this.checkSideCell(function(cell1,cell2){ return cell1.sameNumber(cell2);}) ){
			this.setAlert('同じ数字がタテヨコに連続しています。','Same numbers are adjacent.'); return false;
		}

		if(this.owner.pid==='sukororoom'){ var rinfo = bd.areas.getRoomInfo();}
		if( (this.owner.pid==='sukororoom') && !this.checkDifferentNumberInRoom(rinfo, function(cell){ return cell.getNum();}) ){
			this.setAlert('1つの部屋に同じ数字が複数入っています。','A room has two or more same numbers.'); return false;
		}

		if( (this.owner.pid==='sukororoom') && !this.checkSameObjectInRoom(rinfo, function(cell){ return (cell.isNumberObj()?1:2);}) ){
			this.setAlert('数字のあるなしが混在した部屋があります。','A room includes both numbered and non-numbered cells.'); return false;
		}

		if( (this.owner.pid!=='view') && !this.checkDir4Cell(function(cell){ return cell.isNumberObj();},0) ){
			this.setAlert('数字と、その数字の上下左右に入る数字の数が一致していません。','The number of numbers placed in four adjacent cells is not equal to the number.'); return false;
		}

		if( (this.owner.pid==='view') && !this.checkViewNumber() ){
			this.setAlert('数字と、他のマスにたどり着くまでのマスの数の合計が一致していません。','Sum of four-way gaps to another number is not equal to the number.'); return false;
		}

		if( !this.checkOneArea( bd.areas.getNumberInfo() ) ){
			this.setAlert('タテヨコにつながっていない数字があります。','Numbers are devided.'); return false;
		}

		if( !this.checkAllCell(function(cell){ return (cell.getQsub()===1);}) ){
			this.setAlert('数字の入っていないマスがあります。','There is a cell that is not filled in number.'); return false;
		}

		return true;
	},

	checkViewNumber : function(){
		var result = true;
		for(var c=0;c<bd.cellmax;c++){
			var cell = bd.cell[c];
			if(!cell.isValidNum()){ continue;}

			var clist = cell.getViewClist();
			if(cell.getNum()!==clist.length){
				if(this.inAutoCheck){ return false;}
				cell.seterr(1);
				clist.seterr(2);
				result = false;
			}
		}
		return result;
	}
}
};
