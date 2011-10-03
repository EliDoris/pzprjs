//
// パズル固有スクリプト部 フィルマット・ウソタタミ版 fillmat.js v3.4.0
//
pzprv3.custom.fillmat = {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	inputedit : function(){
		if(this.mousestart){ this.inputqnum();}
	},
	inputplay : function(){
		if(this.mousestart || this.mousemove){
			if     (this.btn.Left) { this.inputborderans();}
			else if(this.btn.Right){ this.inputQsubLine();}
		}
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,

	enablemake_p : true,
	generate : function(mode,type){
		if(this.owner.pid==='fillmat'){
			this.inputcol('num','knum1','1','1');
			this.inputcol('num','knum2','2','2');
			this.inputcol('num','knum3','3','3');
			this.insertrow();
			this.inputcol('num','knum4','4','4');
			this.inputcol('num','knum_',' ',' ');
			this.inputcol('num','knum.','-','?');
			this.insertrow();
		}
		else if(this.owner.pid==='usotatami'){
			this.gentable10(mode,10);
		}
	}
},

//---------------------------------------------------------
// 盤面管理系
Board:{
	isborder : 1,

	initialize : function(){
		this.SuperFunc.initialize.call(this);
		if(this.owner.pid==='fillmat'){
			this.owner.classes.Cell.prototype.maxnum = 4;
		}
		else if(this.owner.pid==='usotatami'){
			this.qcols = 8;
			this.qrows = 8;
		}
	}
},

AreaManager:{
	hasroom : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	setColors : function(){
		this.gridcolor = this.gridcolor_DLIGHT;
		this.setBorderColorFunc('qans');
	},
	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid();
		this.drawBorders();

		this.drawNumbers();
		this.drawBorderQsubs();

		this.drawChassis();

		this.drawTarget();
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	pzlimport : function(type){
		this.decodeNumber10();
	},
	pzlexport : function(type){
		this.encodeNumber10();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum();
		this.decodeBorderAns();
	},
	encodeData : function(){
		this.encodeCellQnum();
		this.encodeBorderAns();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checkAns : function(){

		if( !this.checkLcntCross(4,0) ){
			this.setAlert('十字の交差点があります。','There is a crossing border line.'); return false;
		}

		var rinfo = bd.areas.getRoomInfo();
		if( (this.owner.pid==='fillmat') && !this.checkSideAreaSize(rinfo, function(rinfo,r){ return rinfo.getclist(r).length;}) ){
			this.setAlert('隣り合うタタミの大きさが同じです。','The same size Tatami are adjacent.'); return false;
		}

		if( (this.owner.pid==='fillmat') && !this.checkAllArea(rinfo, function(w,h,a,n){ return (w==1||h==1)&&a<=4;}) ){
			this.setAlert('「幅１マス、長さ１～４マス」ではないタタミがあります。','The width of Tatami is over 1 or the length is over 4.'); return false;
		}

		if( (this.owner.pid==='usotatami') && !this.checkNoNumber(rinfo) ){
			this.setAlert('数字の入っていないタタミがあります。','A tatami has no numbers.'); return false;
		}

		if( !this.checkDoubleNumber(rinfo) ){
			this.setAlert('1つのタタミに2つ以上の数字が入っています。','A tatami has plural numbers.'); return false;
		}

		if( (this.owner.pid==='fillmat') && !this.checkNumberAndSize(rinfo) ){
			this.setAlert('数字とタタミの大きさが違います。','The size of Tatami and the number written in Tatami is different.'); return false;
		}

		if( (this.owner.pid==='usotatami') && !this.checkAllArea(rinfo, function(w,h,a,n){ return (n<0||n!=a);}) ){
			this.setAlert('数字とタタミの大きさが同じです。','The size of the tatami and the number is the same.'); return false;
		}

		if( !this.checkLcntCross(1,0) ){
			this.setAlert('途切れている線があります。','There is a dead-end border line.'); return false;
		}

		if( (this.owner.pid==='usotatami') && !this.checkAllArea(rinfo, function(w,h,a,n){ return (w==1||h==1);} ) ){
			this.setAlert('幅が１マスではないタタミがあります。','The width of the tatami is not one.'); return false;
		}

		return true;
	}
}
};
