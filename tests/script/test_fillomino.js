/* test_fillomino.js */

ui.debug.addDebugData('fillomino', {
	url : '6/6/h4j53g2k5233k2g14j3h',
	failcheck : [
		['bkSizeLt', "pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . . /. . . . . . /. . . . 5 . /. . . . . . /. . . . . . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 1 1 /0 0 0 1 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 1 0 /0 0 0 0 0 0 /0 0 0 0 1 0 /0 0 0 0 0 0 /"],
		['bsSameNum',"pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . . /. 3 3 3 . . /. . . . 5 . /. . . . . . /. . . . . . /0 0 0 0 0 /0 1 1 0 0 /1 1 0 1 1 /0 1 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 0 /0 1 0 1 1 0 /1 0 1 1 0 0 /1 1 0 0 1 0 /0 0 0 0 0 0 /"],
		['bkSizeGt', "pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . . /. . 3 3 . . /. . 5 5 5 . /. . 5 . . . /. . 5 . . . /0 0 0 0 0 /0 1 1 0 0 /0 1 0 1 1 /0 1 0 0 1 /1 1 1 0 0 /0 1 1 0 0 /0 0 1 0 0 0 /0 0 0 1 1 0 /1 1 1 1 0 0 /0 1 0 1 1 0 /1 0 0 0 0 0 /"],
		['bkSizeLt', "pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . 1 /. . 3 3 . . /. . 5 5 5 . /3 . 5 . . . /1 2 3 . . . /0 1 0 0 0 /0 1 1 0 1 /0 1 0 1 1 /0 1 0 0 1 /1 1 1 1 0 /1 1 0 0 1 /0 0 1 1 1 1 /0 0 0 1 1 1 /1 1 1 1 0 0 /0 1 0 1 1 1 /1 0 1 1 1 0 /"],
		['ceNoNum',  "pzprv3/fillomino/6/6/. . - . . . /. - 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . 2 . . /3 . 3 3 . . /. . 5 5 5 2 /2 . 5 . . 4 /. 3 3 . 4 4 /0 0 0 0 0 /0 1 1 0 1 /1 1 0 1 1 /0 1 0 0 1 /0 1 1 1 0 /1 0 0 1 0 /0 0 1 1 1 0 /1 0 0 1 1 1 /0 1 1 1 0 0 /1 1 0 1 1 1 /1 1 1 1 0 0 /"],
		[null,       "pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /5 5 . 4 4 4 /5 . . 2 . 1 /3 5 3 3 . . /. . 5 5 5 2 /2 . 5 . . 4 /1 3 3 . 4 4 /0 1 0 0 0 /0 1 1 0 1 /1 1 0 1 1 /0 1 0 0 1 /0 1 1 1 0 /1 0 0 1 0 /0 0 1 1 1 1 /1 0 0 1 1 1 /0 1 1 1 0 0 /1 1 0 1 1 1 /1 1 1 1 0 0 /"]
	],
	inputs : [
		/* 問題入力はbosanowaと同じなので省略 */
		/* 回答入力テスト */
		{ input:["newboard,4,2", "editmode", "cursor,1,1", "key,3", "playmode"] },
		{ input:["mouse,right, 1,1, 5,1"],
		  result:"pzprv3/fillomino/2/4/3 . . . /. . . . /. . . . /. . . . /-1 -1 0 /0 0 0 /0 0 0 0 /" },
		{ input:["mouse,left, 1,1, 5,1"],
		  result:"pzprv3/fillomino/2/4/3 . . . /. . . . /. 3 3 . /. . . . /-1 -1 0 /0 0 0 /0 0 0 0 /" },
		{ input:["mouse,left, 7,1, 1,1"],
		  result:"pzprv3/fillomino/2/4/3 . . . /. . . . /. . . . /. . . . /-1 -1 0 /0 0 0 /0 0 0 0 /" },
		{ input:["mouse,left, 2,0, 2,2, 0,2"],
		  result:"pzprv3/fillomino/2/4/3 . . . /. . . . /. . . . /. . . . /2 -1 0 /0 0 0 /1 0 0 0 /" }
	]
});
