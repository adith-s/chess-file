"use strict";
var CsBoard ={} ;

(function(){

    function ChessBoard(dom,img,row,card){
        this.dom = dom;
        this.chessBoardRangeElement = new Map();
        this.isRotated = false;
        this.rowEle = row || this.createRowElement();
        this.cardEle = card || this.createCardElement();
        this.img = img || this.createImgElement();
        this.fromCard = undefined;
        this.fromCardEle = undefined;
        this.whiteOccupiedRanges = new Set();
        this.blackOccupiedRanges = new Set();
        // this.prevMove = 
       /* this.svg = svg || this.createSvgElement();
        this.use = this.createUseElement();*/
    }
    ChessBoard.prototype.loadCoin = function(range,coinId){
       /* var svg = this.svg.cloneNode(true);
        var use = this.use.cloneNode(true);
        use.setAttribute("href","#"+coinId);
        svg.appendChild(use);*/
        var img = this.img.cloneNode(true);
        img.setAttribute("src",this.getAsImgUrl(coinId));

        var cardObj = this.chessBoardRangeElement.get(range);
        var obj = cardObj.getDiv();
        cardObj.setCoin(coinId.substring(0,coinId.length-2));
        cardObj.setInverted("I"==coinId.substr(coinId.length-1));
        cardObj.setWhite("W"==coinId.substr(coinId.length-2,1));
        obj && (obj.childNodes[0] ? obj.replaceChild(img , obj.childNodes[0]):obj.appendChild(img)) ; 
    }
    ChessBoard.prototype.removeCoin = function(range){
        var cardEle = this.chessBoardRangeElement.get(range);
        cardEle.resetCard();
    }

    ChessBoard.prototype.moveCoin = function(from,to){
        var fromCardEle = this.chessBoardRangeElement.get(from);
        var toCardEle = this.chessBoardRangeElement.get(to);
        if(fromCardEle!=toCardEle && fromCardEle.hasCoin()){
        toCardEle.copy(fromCardEle);
        this.removeCoin(from);
        this.loadCoin(to,toCardEle.getCoinName());
        }
    }
    ChessBoard.prototype.createImgElement = function(){
        var img = document.createElement("img");
        img.classList.add("img-coin");
        return img;
    }
   /* ChessBoard.prototype.createSvgElement = function(){
        var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.style.width="40px";
        svg.style.height="40px";
        return svg;
    }
    ChessBoard.prototype.createUseElement = function(coinId){
        var use = document.createElementNS("http://www.w3.org/2000/svg","use");
        coinId && use.setAttribute("href",coinId);
        use.classList.add("chessCoin");
        use.setAttribute("viewbox","0 0 40px 40px");
        return use;
    }*/
    ChessBoard.prototype.createRowElement = function(){
        var rowEle = document.createElement("div");
        rowEle.classList.add("row");
        return rowEle;
    }
    ChessBoard.prototype.createCardElement= function(){
        var colEle = document.createElement("div");
        colEle.classList.add("card");
        return colEle;
    }

    ChessBoard.prototype.createRow = function(index){
        var rowE = this.rowEle.cloneNode(true);
        for (var i = 0; i < 8; i++) {
            var range = String.fromCharCode(65+i)+index;
            var ele = this.cardEle.cloneNode(true);
            ele.range = range;
            var cardObj = new Card(ele);
            this.chessBoardRangeElement.set(range,cardObj);
            rowE.appendChild(this.chessBoardRangeElement.get(range).getDiv());   
        }
        return rowE;
    }
    ChessBoard.prototype.createChessBoard = function(){
        for (var i = 1; i <= 8; i++) {
            this.dom.insertBefore(this.createRow(i),this.dom.childNodes[0]);
        }
        this.addRangeToDiv();
        this.dom.addEventListener("click",this.moveCoinListener.bind(this),true);
        this.createChessBoard = function(){};
    }
    ChessBoard.prototype.addRangeToDiv = function(){
        this.chessBoardRangeElement.forEach((card,key)=>{
            var cardDiv = card.getDiv()
            cardDiv.range = key;
            Object.defineProperty(cardDiv,"range",{writable:false,configurable:false});
        });
         
    }
    ChessBoard.prototype.moveCoinListener = function(event){
        var pos = event.target.closest(".card").range;
        var rangeEle = this.chessBoardRangeElement.get(pos);

        if(this.fromCard==undefined){
            this.fromCard = pos;
            this.fromCardEle = rangeEle;
            this.fromCardEle.getDiv().classList.add("active-move");
            
        }
        else {
            var possibleMoves = this.fromCardEle.getPossibleMoves();
            if(possibleMoves.includes(pos)){
                this.moveCoin(this.fromCard , pos);
            }
            else {
                console.log("invalid moves");
                this.showAlert("invalidMove",true);
            }
            this.fromCardEle.getDiv().classList.remove("active-move");
            this.fromCard = undefined;
            this.setPossibleMovesInCards();
        }
    }
    ChessBoard.prototype.showAlert = function(type,show){
        switch (type) {
            case "invalidMove":
                
                break;
        
            default:
                break;
        }
    }
    ChessBoard.prototype.resetOccupiedRanges = function(){
        this.blackOccupiedRanges.clear();
        this.whiteOccupiedRanges.clear();
    }
    ChessBoard.prototype.setPossibleMovesInCards = function(){
        this.resetOccupiedRanges();
        this.chessBoardRangeElement.forEach((crd,pos)=>{
            var cn = crd.getCoin();
            var white = crd.isWhite();
            var occupiedRanges = white ? this.whiteOccupiedRanges : this.blackOccupiedRanges;
            var possibleMovs = this.getValidMoves(cn,pos,white);
            crd.setPossibleMoves(possibleMovs);
            possibleMovs.forEach((v)=>{
                occupiedRanges.add(v);
            });
        });
    }
    ChessBoard.prototype.getValidMoves = function(cn,pos,white){
        var coin = CsBoard.coin;
        var valMovs ;
        switch (cn) {
            case "bishop":
                var bishop = new coin.Bishop(this.chessBoardRangeElement,pos,false,white);
                valMovs = bishop.getValidRanges();
                break;
            case "rook":
                var rook = new coin.Rook(this.chessBoardRangeElement,pos,false,white);
                valMovs = rook.getValidRanges();
                break;
                
            case "queen":
                var queen = new coin.Queen(this.chessBoardRangeElement,pos,false,white);
                valMovs = queen.getValidRanges();
                break;
            case "knight":
                var knight = new coin.Knight(this.chessBoardRangeElement,pos,false,white);
                valMovs = knight.getValidRanges();
                break;
            case "king":
                var occupiedRanges = white?this.blackOccupiedRanges:this.whiteOccupiedRanges;
                var king = new coin.King(this.chessBoardRangeElement,pos,false,white,occupiedRanges);
                valMovs = king.getValidRanges();
                break;
            case "pawn":
                var pawn = new coin.Pawn(this.chessBoardRangeElement,pos,false,white);
                valMovs = pawn.getValidRanges();
                break;
            default:
                valMovs = [];
                break;
        }
        return valMovs;
    }
    ChessBoard.prototype.init = function(){
        this.chessBoardRangeElement.forEach((card,range)=>{
            range.charAt(1)=="2" && this.loadCoin(range,"pawnWS");
            range.charAt(1)=="7" && this.loadCoin(range,"pawnBS");
            if(range.charAt(1)=="8"){
                switch(range.charAt(0)){
                    case "A":
                    case "H":
                        this.loadCoin(range,"rookBS");break;
                    case "B":
                    case "G":
                        this.loadCoin(range,"knightBS");break;
                    case "C":
                    case "F":
                        this.loadCoin(range,"bishopBS");break;
                    case "D":
                        this.loadCoin(range,"queenBS");break;
                    case "E":
                        this.loadCoin(range,"kingBS");break;
                }
            }
            else if(range.charAt(1)=="1"){
                switch(range.charAt(0)){
                    case "A":
                    case "H":
                        this.loadCoin(range,"rookWS");break;
                    case "B":
                    case "G":
                        this.loadCoin(range,"knightWS");break;
                    case "C":
                    case "F":
                        this.loadCoin(range,"bishopWS");break;
                    case "D":
                        this.loadCoin(range,"queenWS");break;
                    case "E":
                        this.loadCoin(range,"kingWS");break;
                }
            }
        });
        this.setPossibleMovesInCards();
    }
    ChessBoard.prototype.rotate = function(){
        this.dom.style.transform = this.dom.style.transform +"rotate(180deg)";
        !this.isRotated && this.cardEle.setAttribute("transform","rotate(180deg)");
        this.isRotated && this.cardEle.removeAttribute("transform");
        this.isRotated = true;
    }
    ChessBoard.prototype.getAsImgUrl = function(imgId){
        var relPath = "/Users/adith-pt3056/Desktop/my workspace/website project/chess file/chess_icons/";
        relPath="chess_icons/";
        var domain = ".svg";
        return relPath+imgId+domain;
    }
    var dom = document.getElementById("chessHolderId");
    CsBoard.cb = new ChessBoard(dom);




    function Card(div,coin,white,inverted){
        this.div = div;
        this.coin = coin;
        this.white = white;
        this.inverted = inverted;
        this.possibleMoves = [];
    }

    Card.prototype.setDiv = function(div){
        this.div = div;
    }
    Card.prototype.setCoin = function(coin){
        this.coin = coin;
    }
    Card.prototype.setWhite = function(white){
        this.white = white;
    }
    Card.prototype.setInverted = function(inverted){
        this.inverted = inverted;
    }
    Card.prototype.getDiv = function(){
        return this.div;
    }
    Card.prototype.getCoin = function(){
        return this.coin;
    }
    Card.prototype.hasCoin = function(){
       return this.coin != undefined;
    }
    Card.prototype.isWhite = function(){
        return this.white;
    }
    Card.prototype.isInverted = function(){
        return this.inverted;
    }
    Card.prototype.getCoinName = function(){
        return this.coin + (this.white ? "W":"B") + (this.inverted ? "I":"S");
    }
    Card.prototype.resetCard = function(){
        this.coin = undefined;
        this.white = undefined;
        this.inverted = undefined;
        this.div.innerHTML = ""; 
    }
    Card.prototype.copy = function(crd){
        var c = crd.getCoin();
        var w = crd.isWhite();
        var i = crd.isInverted();
        this.setCoin(c);
        this.setWhite(w);
        this.setInverted(i);
    }
    Card.prototype.setPossibleMoves = function(possibleMoves){
        this.possibleMoves = possibleMoves;
    }
    Card.prototype.getPossibleMoves = function(){
        return this.possibleMoves;
    }
    


})();