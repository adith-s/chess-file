

"use strict";
CsBoard.coin = {};



(function(){

    /**
     * 
     * @param {chessboard map} map 
     * @param {position of the coin} pos 
     * @param {does it need to highlight possible moves} highlightPossibleMove 
     */
    function CoinAction(map,pos,highlightPossibleMove,white){
        this.map = map;  
        this.pos = pos;
        this.possibleMoves=[];
        this.white = white;
        highlightPossibleMove && this.highlightPossibleMove();

    }
    CoinAction.prototype.increamentChar=function(chr){
        return String.fromCharCode(chr.charCodeAt(0)+1);
    }
    CoinAction.prototype.decreamentChar = function(chr){
        return String.fromCharCode(chr.charCodeAt(0)-1);
    }
    CoinAction.prototype.increamentCharToN = function(chr,n){
        return String.fromCharCode(chr.charCodeAt(0)+n);
    }
    CoinAction.prototype.decreamentCharToN = function(chr,n){
        return String.fromCharCode(chr.charCodeAt(0)-n);
    }
    CoinAction.prototype.hasCoinOrAddToPossibleMove = function(range){

        var rangeEle = this.map.get(range);
        rangeEle.getDiv().classList.remove("on-check");
        if (rangeEle.coin){
            this.isKingOnCheck(rangeEle);
            (rangeEle.isWhite() != this.white) && this.addPossibleMove(range);
            return true;
        }

        this.addPossibleMove(range);
        return false;

    }
    CoinAction.prototype.isKingOnCheck = function(cardEle){
        var crdDiv = cardEle.getDiv();
        if((cardEle.getCoin() == "king") && (cardEle.isWhite() != this.white)){
            crdDiv.classList.add("on-check");
            return true;
        }
        return false;
    }
    CoinAction.prototype.highlightPossibleMove=function(){
        
    }
    CoinAction.prototype.addPossibleMove = function(possibleMove){
        this.possibleMoves.push(possibleMove) ;
    }
    CoinAction.prototype.getPossibleMoves = function(){
        return this.possibleMoves;
    }



    /**
     * Bishop Class inherits CoinAction
     */
    function Bishop(map,pos,highlightPossibleMove,white){
        CoinAction.call(this,map,pos,highlightPossibleMove,white);
    }
    Bishop.prototype = Object.create(CoinAction.prototype);
    
    // d1 => topLft , d2 => topRgt , d3 => dwnLft , d4 => dwnRgt

    Bishop.prototype.getValidRanges=function(){
        var d1Found = false, d2Found= false, d3Found = false, d4Found = false;
        var lft = this.pos.charAt(0),rgt = this.pos.charAt(0), up = this.pos.charAt(1), dwn = this.pos.charAt(1);
        while(!d1Found || !d2Found || !d3Found || !d4Found){

            //setting up positions
            (!d1Found || !d3Found) && (lft>="A") && (lft = this.decreamentChar(lft)); 
            (!d2Found || !d4Found) && (rgt<="H") && (rgt = this.increamentChar(rgt));
            (!d1Found || !d2Found) && (up<="8") && (up = this.increamentChar(up));
            (!d3Found || !d4Found) && (dwn>="1") && (dwn = this.decreamentChar(dwn));

            //validating limit
            (lft < "A" || up > "8") && (d1Found=true);
            (lft < "A" || dwn < "1") && (d3Found = true);
            (rgt > "H" || up > "8") && (d2Found = true);
            (rgt > "H" || dwn < "1") && (d4Found = true);

            //performing validation
            !d1Found &&  (d1Found = this.hasCoinOrAddToPossibleMove(lft+up));
            !d2Found && (d2Found = this.hasCoinOrAddToPossibleMove(rgt+up));
            !d3Found && (d3Found = this.hasCoinOrAddToPossibleMove(lft+dwn));
            !d4Found && (d4Found = this.hasCoinOrAddToPossibleMove(rgt+dwn));

        }

        return this.getPossibleMoves();
        
    }



    /**
     * Rook Class inherits CoinAction
     */
    function Rook(map,pos,highlightPossibleMove,white){
        CoinAction.call(this,map,pos,highlightPossibleMove,white);

    }
    Rook.prototype = Object.create(CoinAction.prototype);

    Rook.prototype.getValidRanges = function(){
        var foundTop = false , foundbottom = false , foundLeft = false,foundRight = false;
        var lft = this.pos.charAt(0),rgt = this.pos.charAt(0), up = this.pos.charAt(1), dwn = this.pos.charAt(1);
        var startRow = up , startCol = lft;

        while(!foundLeft || !foundRight || !foundTop || !foundbottom){

            //updating position
            !foundTop && (up = this.increamentChar(up));
            !foundbottom && (dwn = this.decreamentChar(dwn));
            !foundLeft && (lft = this.decreamentChar(lft));
            !foundRight && (rgt = this.increamentChar(rgt));

            //validating position
            !foundTop && (up > "8") && (foundTop = true);
            !foundbottom && (dwn < "1") && (foundbottom = true);
            !foundLeft && (lft < "A") && (foundLeft = true);
            !foundRight && (rgt > "H") && (foundRight = true);

            //performing validation
            !foundTop && (foundTop = this.hasCoinOrAddToPossibleMove(startCol+up,this.white));
            !foundbottom && (foundbottom = this.hasCoinOrAddToPossibleMove(startCol+dwn));
            !foundLeft && (foundLeft = this.hasCoinOrAddToPossibleMove(lft+startRow));
            !foundRight && (foundRight = this.hasCoinOrAddToPossibleMove(rgt+startRow));

        }

        return this.getPossibleMoves();
    }


    /**
     * Queen Class inherits CoinAction
     */
    function Queen(map,pos,highlightPossibleMove,white){
        CoinAction.call(this,map,pos,highlightPossibleMove,white);

    }
    Queen.prototype = Object.create(CoinAction.prototype);
    Queen.prototype.straightLineValidation = Rook.prototype.getValidRanges;
    Queen.prototype.diagonalValidation = Bishop.prototype.getValidRanges;

    Queen.prototype.getValidRanges = function(){
        
        this.straightLineValidation();
        this.diagonalValidation();

        return this.getPossibleMoves();
    }


    /**
     * Knight Class inherits CoinAction
     */
    function Knight(map,pos,highlightPossibleMove,white){
        CoinAction.call(this,map,pos,highlightPossibleMove,white);

    }
    Knight.prototype = Object.create(CoinAction.prototype);

    Knight.prototype.getValidRanges = function(){

        //init
        var col = this.pos.charAt(0), row = this.pos.charAt(1);
        var topMost = this.increamentCharToN(row,2), top = this.increamentChar(row), dwn = this.decreamentChar(row), dwnMost = this.decreamentCharToN(row,2);
        var rightMost = this.increamentCharToN(col,2), right = this.increamentChar(col), lftMost = this.decreamentCharToN(col,2), lft = this.decreamentChar(col);

        //validating
        !(topMost>"8") && !(lft<"A") && this.hasCoinOrAddToPossibleMove(lft+topMost);
        !(topMost>"8") && !(right>"H") && this.hasCoinOrAddToPossibleMove(right+topMost);
        !(top>"8") && !(lftMost<"A") &&  this.hasCoinOrAddToPossibleMove(lftMost+top);
        !(top>"8") && !(rightMost>"H") && this.hasCoinOrAddToPossibleMove(rightMost+top);
        !(dwn<"1") && !(lftMost<"A") && this.hasCoinOrAddToPossibleMove(lftMost+dwn);
        !(dwn<"1") && !(rightMost>"H") && this.hasCoinOrAddToPossibleMove(rightMost+dwn);
        !(dwnMost<"1") && !(lft<"A") && this.hasCoinOrAddToPossibleMove(lft+dwnMost);
        !(dwnMost<"1") && !(right>"H") && this.hasCoinOrAddToPossibleMove(right+dwnMost);

        return this.getPossibleMoves();

    }

    /**
     * King Class inherits CoinAction
     */
    function King(map,pos,highlightPossibleMove,white,occupiedPos){
        this.occupiedPos = occupiedPos;
        CoinAction.call(this,map,pos,highlightPossibleMove,white);

    }
    King.prototype = Object.create(CoinAction.prototype);

    King.prototype.getValidRanges = function(){
        var col = this.pos.charAt(0), row = this.pos.charAt(1);
        var top = this.increamentChar(row),dwn = this.decreamentChar(row),lft = this.decreamentChar(col),right = this.increamentChar(col);

        console.log(this.occupiedPos);
        //validating
        !(top>"8") && !(lft<"A") && (this.isOccupied(lft+top)) && this.hasCoinOrAddToPossibleMove(lft+top);
        !(top>"8") && !(right>"H") && (this.isOccupied(right+top)) && this.hasCoinOrAddToPossibleMove(right+top);
        !(dwn<"1") && !(lft<"A") && (this.isOccupied(lft+dwn)) && this.hasCoinOrAddToPossibleMove(lft+dwn);
        !(dwn<"1") && !(right>"H") && (this.isOccupied(right+dwn)) && this.hasCoinOrAddToPossibleMove(right+dwn);
        !(top>"8") && (this.isOccupied(col+top)) && this.hasCoinOrAddToPossibleMove(col+top);
        !(dwn<"1") && (this.isOccupied(col+dwn)) && this.hasCoinOrAddToPossibleMove(col+dwn);
        !(lft<"A") && (this.isOccupied(lft+row)) && this.hasCoinOrAddToPossibleMove(lft+row);
        !(right>"H") && (this.isOccupied(right+row)) && this.hasCoinOrAddToPossibleMove(right+row);
        return this.getPossibleMoves();
    }

    King.prototype.isOccupied = function(pos){
        console.log(this.occupiedPos.has(pos),pos);
        return this.occupiedPos.has(pos);
    }
    /**
     * Pawn Class inherits CoinAction
     */
    function Pawn(map,pos,highlightPossibleMove,white){
        this.pawnDevelop = false;
        CoinAction.call(this,map,pos,highlightPossibleMove,white);
    }
    Pawn.prototype = Object.create(CoinAction.prototype);

    Pawn.prototype.getValidRanges = function(){
        var col = this.pos.charAt(0), row = this.pos.charAt(1);
        var prevRow = row;
        
        this.white ? (row = this.increamentChar(row)):(row = this.decreamentChar(row));

        if(!(row<"1"&&row>"8")){
            if((this.map.get(col+row).coin)== undefined){
                this.addPossibleMove(col+row);
                this.isFirstMove(col,prevRow);
            }
            this.validateDiagonalMove(row,col);
        }
        this.pawnDevelop =  this.white ? row == "8" : row == "1";
        
        return this.getPossibleMoves();
    }
    //add to possible moves if it is first move
    Pawn.prototype.isFirstMove = function(col,row){
        var isValid= this.white ? (row == "2" && (row=this.increamentCharToN(row,2))) : (row == "7" && (row = this.decreamentCharToN(row,2)));
        if(isValid){
            var rangeEle = this.map.get(col+row);
            (rangeEle.coin == undefined) && this.addPossibleMove(col+row);
        }
    }
    Pawn.prototype.validateDiagonalMove = function(row,col){
        var lft = this.decreamentChar(col),rgt = this.increamentChar(col);
        !(lft<"A") &&  this.moveDiagonal(lft+row);
        !(rgt>"H") &&  this.moveDiagonal(rgt+row);
    }
    Pawn.prototype.moveDiagonal = function(pos){
        var rangeEle = this.map.get(pos);
        if((rangeEle.coin != undefined) && (rangeEle.isWhite() != this.white)){
            this.addPossibleMove(pos);
            this.isKingOnCheck(rangeEle);
        }
    }
    
    Pawn.prototype.canPawnDevelop = function(){
        return this.pawnDevelop;
    }
    Pawn.prototype.isEmpessantMovePossible = function(){

    }

    CsBoard.coin.Bishop = Bishop;
    CsBoard.coin.Rook = Rook;
    CsBoard.coin.Queen = Queen;
    CsBoard.coin.Knight = Knight;
    CsBoard.coin.King = King;
    CsBoard.coin.Pawn = Pawn;
    

})();