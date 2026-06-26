/*

*/

/* TODO
- Add ability to do multiple jumps [DONE]
- Add ability for checkers that reach the end of the board to become kings [DONE]
- Add king checker functionality [DONE]
- Add Game Oever check
	- Modal to show show who won
		- Reset Button
*/

/*
    0 => Invalid Space
    1 => Red Piece          1.1 => Red King
    2 => Black Piece        2.1 => Black King
    3 => Emtpy Valid Space
 */
let board = [
	[0, 1, 0, 1, 0, 1, 0, 1],
	[1, 0, 1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1, 0, 1],
	[3, 0, 3, 0, 3, 0, 3, 0],
	[0, 3, 0, 3, 0, 3, 0, 3],
	[2, 0, 2, 0, 2, 0, 2, 0],
	[0, 2, 0, 2, 0, 2, 0, 2],
	[2, 0, 2, 0, 2, 0, 2, 0]
]

const redPiece = "images/red_pawn.png",
	  redKing = "images/red_king.png",
	  blackPiece = "images/black_pawn2.png",
	  blackKing = "images/black_king2.png";

// keeps track if a checker is selected.
// let isSelected = false;
let selectedSquare;

// holds squares where a checker can move to.
// Used to quickly access them to remove click events and the move styling
let moveSquares = [];
let redCount = 0,
	blackCount = 0;


// Used for multi-jumping
// Once a checker makes a jump, another check is done if another jump can be made
// if another jump can be made, then multiJump = true and multiJumpChecker is set to the current checker.
// THis is done so that the turn continues and only the multiJumpChecker is clickable
// Maybe only allow the checker with a given "jumper" class can be clicked
let madeAJump = false;
let multiJump = false;
let multiJumpChecker;

// 0 -> red turn
// 1 -> black turn
// Generates a number between 0-1 randomly so the player whos starts first is random
let currTurn = Math.floor(Math.random() * 2);

function updateTurn() {
	// Does not change turn if a checker is able to make another consecutive jump
	if(multiJump) {
		return;
	}

	let redTurn = document.querySelector(".red-turn");
	let blackTurn = document.querySelector(".black-turn")

	// Update UI to indicate who's turn it is
	if (currTurn == 0) { // black
		currTurn = 1;
		redTurn.style.color = "grey";
		blackTurn.style.color = "black";
		if(redTurn.classList.contains("focus_border")) {
			redTurn.classList.remove("focus_border");
		}
		blackTurn.classList.add("focus_border");

	} else { // red
		currTurn = 0
		redTurn.style.color = "red";
		blackTurn.style.color = "grey";
		if(blackTurn.classList.contains("focus_border")) {
			blackTurn.classList.remove("focus_border");
		}
		redTurn.classList.add("focus_border");
	}
	
	// if(currTurn == 0) {
	// 	currTurn = 1;
	// } else {
	// 	currTurn = 0;
	// }
}

function multiJumpCheck(currBox) {
	const DOM_ID = currBox.id;

	if(!DOM_ID || DOM_ID.length !== 6) {
		return;
	}

	const xCoord = parseInt(DOM_ID[3]),
		  yCoord = parseInt(DOM_ID[5]);

	let topLeftJump = document.getElementById(`box${xCoord-2}_${yCoord-2}`),
		topRightJump = document.getElementById(`box${xCoord-2}_${yCoord+2}`),
		btmLeftJump = document.getElementById(`box${xCoord+2}_${yCoord-2}`),
		btmRightJump = document.getElementById(`box${xCoord+2}_${yCoord+2}`);

	let topLeft = document.getElementById(`box${xCoord-1}_${yCoord-1}`),
		topRight = document.getElementById(`box${xCoord-1}_${yCoord+1}`),
		btmLeft = document.getElementById(`box${xCoord+1}_${yCoord-1}`),
		btmRight = document.getElementById(`box${xCoord+1}_${yCoord+1}`);

	let currChecker;

	if(currBox.hasChildNodes()) {
		currChecker = currBox.children[0];
	}
	console.log("CURR CHECKER: ")
	console.log(currChecker);

	if(currChecker != null && currChecker.classList.contains("redChecker")) {
		console.log("RED CHECKER READY TO JUMP!");
		// If either are true, then a multijump is possible
		if(btmLeft != null && btmLeft.hasChildNodes() && btmLeftJump != null && !btmLeftJump.hasChildNodes()) {
			console.log("Another available move to the btm left!")
			return true;
		}

		if(btmRight != null && btmRight.hasChildNodes() && btmRightJump != null && !btmRightJump.hasChildNodes()) {
			console.log("Another avaiable move to the btm right!")
			return true;
		}

		if(currChecker.classList.contains("king")) {
			if(topLeft != null && topLeft.hasChildNodes() && topLeftJump != null && !topLeftJump.hasChildNodes()) {
				console.log("Another avaiable move to the top left!")
				return true;
			}

			if(topRight != null && topRight.hasChildNodes() && topRightJump != null && !topRightJump.hasChildNodes()) {
				console.log("Another avaiable move to the top right!")
				return true;
			}
		}

	} else if (currChecker != null && currChecker.classList.contains("blackChecker")) {
		console.log("BLACK CHECKER READY TO JUMP!");
		if(topLeft != null && topLeft.hasChildNodes() && topLeftJump != null && !topLeftJump.hasChildNodes()) {
			console.log("Another avaiable move to the top left!")
			return true;
		}

		if(topRight != null && topRight.hasChildNodes() && topRightJump != null && !topRightJump.hasChildNodes()) {
			console.log("Another avaiable move to the top right!")
			return true;
		}
	

		if(currChecker.classList.contains("king")) {
			if(btmLeft != null && btmLeft.hasChildNodes() && btmLeftJump != null && !btmLeftJump.hasChildNodes()) {
				console.log("Another available move to the btm left!")
				return true;
			}

			if(btmRight != null && btmRight.hasChildNodes() && btmRightJump != null && !btmRightJump.hasChildNodes()) {
				console.log("Another avaiable move to the btm right!")
				return true;
			}
		}
	}

	console.log("There are no extra jumps available! for")
	console.log(currBox);
	return false;
}


// [ POSSIBLE FUTURE ADDITION TO FIND ALL JUMP MOVES ]
/* Start from the moves sqaures perhaps? */
// Recursive approach to check if there are available boxes to move to or jump to
// Keep self-calling if a jump is found more than once. (Check consecutive possible jumps)
// When no more jumps are available, return


// let checkersToJump = [];
// let jumpCount = 0;

// function checkAvailableJumps(currBox) {
// 	const DOM_ID = currBox.id;

// 	if(!DOM_ID || DOM_ID.length !== 6) {
// 		return;
// 	}

// 	const xCoord = parseInt(DOM_ID[3]),
// 		  yCoord = parseInt(DOM_ID[5]);

// 	let topLeftJump = document.getElementById(`box${xCoord-2}_${yCoord-2}`),
// 		topRightJump = document.getElementById(`box${xCoord-2}_${yCoord+2}`),
// 		btmLeftJump = document.getElementById(`box${xCoord+2}_${yCoord-2}`),
// 		btmRightJump = document.getElementById(`box${xCoord+2}_${yCoord+2}`);

// 	let topLeft = document.getElementById(`box${xCoord-1}_${yCoord-1}`),
// 		topRight = document.getElementById(`box${xCoord-1}_${yCoord+1}`),
// 		btmLeft = document.getElementById(`box${xCoord+1}_${yCoord-1}`),
// 		btmRight = document.getElementById(`box${xCoord+1}_${yCoord+1}`);


// 	if(topLeft && topLeft.hasChildNodes() && topLeftJump && !topLeftJump.hasChildNodes()) {
// 		if(checkJumpChecker(currBox, topLeft)) {
// 			moveSquares.push(topLeftJump);
// 			checkersToJump.push(topLeft.children[0]);
// 			topLeftJump.classList.add("available_jump");
// 			jumpCount++;
// 			topLeftJump.classList.add(`${jumpCount}`);
// 		}
// 	}

// 	if(topRight && topRight.hasChildNodes() && topRightJump && !topRightJump.hasChildNodes()) {
// 		if(checkJumpChecker(currBox, topRight)) {
// 			moveSquares.push(topRightJump);
// 			checkersToJump.push(topRight.children[0]);
// 			topRightJump.classList.add("available_jump");
// 			jumpCount++;
// 			topRight.classList.add(`${jumpCount}`);
// 		}
// 	}


// }



function makeMove(selectedSpace, spaceToMove) {
	if(selectedSpace == null || spaceToMove == null) {
		return;
	}

	
	console.log(spaceToMove);
	let spaceIsAvailable = spaceToMove.classList.contains("available_move");
	let spaceIsJumpable = spaceToMove.classList.contains("available_jump");

	if(!spaceToMove.hasChildNodes() && (spaceIsAvailable || spaceIsJumpable)) {
		let startX = parseInt(selectedSpace.id[3]);
		let startY = parseInt(selectedSpace.id[5]);
		let startCoordVal = board[startX][startY];

		let toMoveX = parseInt(spaceToMove.id[3]);
		let toMoveY = parseInt(spaceToMove.id[5]);

		let checkerToMove = document.getElementById(`${startX}_${startY}`);

		// let toMoveCoord = board[toMoveX][toMoveY];
		board[toMoveX][toMoveY] = startCoordVal;
		board[startX][startY] = 3;
		spaceToMove.appendChild(checkerToMove);

		// update checkerID to coord of new sqaure
		checkerToMove.id = `${toMoveX}_${toMoveY}`;
		clearMoveSqaures();
		removeClickEvent();

		madeAJump = false;

		if(spaceIsJumpable) {
			let delX, delY;

			if(startX < toMoveX) { // Move down
				delX = startX+1;
				// console.log(delX)

			} else {
				delX = startX-1;
				// console.log(delX)
			}

			if(startY < toMoveY) { // left
				delY = startY+1;
			} else {
				delY = startY-1;
			}
				
			// console.log(`CHECKER TO JUMP COORD: x:${delX} y:${delY}`);
			deleteChecker(delX, delY);
			madeAJump = true;
		}
			
		// If true, then the turn will stay the same after a jump and if another jump is available
		

		let toMoveChecker = spaceToMove.children[0];

		

		/******************* Logic for checkers becoming a king *******************/
		// Very bottom row
		if(toMoveX == 7 && 
		   toMoveChecker.classList.contains("redChecker") &&
		   !toMoveChecker.classList.contains("king")) {

			toMoveChecker.src = redKing;
			toMoveChecker.classList.add("king");
		}
		// Very top row
		if(toMoveX == 0 &&
		   toMoveChecker.classList.contains("blackChecker") &&
		   !toMoveChecker.classList.contains("king")) {
			
			toMoveChecker.src = blackKing;
			toMoveChecker.classList.add("king");
		}

		multiJump = multiJumpCheck(spaceToMove) && madeAJump;
		
		if(multiJump) {
			console.log("Another jump is avaliable")
			multiJumpChecker = toMoveChecker;
		}

		

		updateTurn();
		printBoard();

		// let checkerImg = document.createElement("img");
		// checkerImg.src = `${redPiece}`;
		// checkerImg.id = `${i}_${j}`;
		// checkerImg.classList.add("redChecker");

			
		
	}
}

function handleMoveClick(square) {
    return () => makeMove(selectedSquare, square);
}


function moveClickEvent() {
	console.log(`NUMBER OF MOVE SQAURES AVAILABLE: ${moveSquares.length}`)
	for (let i = 0; i < moveSquares.length; i++) {
		moveSquares[i].addEventListener('click', handleMoveClick(moveSquares[i]));
		// moveSquares[i].addEventListener('click', () =>{
		// 	// console.log(`Moving to square: ${moveSquares[i].id}`);
		// 	makeMove(selectedSquare, moveSquares[i]);
		// });

	}
}

function removeClickEvent() {
	for (let i = 0; i < moveSquares.length; i++) {
		moveSquares[i].removeEventListener('click', handleMoveClick(moveSquares[i]));
		// moveSquares[i].removeEventListener('click', () => {
		// 	// console.log("ClickEvent Removed!");
		// 	makeMove(selectedSquare, moveSquares[i]);
		// });
	}
}

function clearMoveSqaures() {
	for(let i = 0; i < moveSquares.length; i++) {
		moveSquares[i].classList.remove("available_move");
		if(moveSquares[i].classList.contains("available_jump")) {
			moveSquares[i].classList.remove("available_jump");
		}
			
	}
	
	let currselected = document.querySelector(".curr_checker");
	if(currselected != null) {
		currselected.classList.remove("curr_checker");
	}
	moveSquares = [];
}

// Helper function that adds the classes "avaiable_move" and "available_jump" to boxes that can be moved to or jumped to
// adding the clsses gives the highlight animation to show the user what's available
function highlightDirection(currChecker, moveDirLeft, jumpDirLeft, moveDirRight, jumpDirRight, turnNum) {
	if (currTurn != turnNum || (multiJump && currChecker != multiJumpChecker)) {
		return;
	}
	if(moveDirLeft != null && !moveDirLeft.hasChildNodes() && !multiJump) {
		moveSquares.push(moveDirLeft);
		moveDirLeft.classList.add("available_move");

	} else if (checkJumpChecker(currChecker.parentElement, moveDirLeft) && jumpDirLeft != null) {
		if(!jumpDirLeft.hasChildNodes()) {
			moveSquares.push(jumpDirLeft);
			jumpDirLeft.classList.add("available_jump")
		}
	}

	if(moveDirRight != null && !moveDirRight.hasChildNodes() && !multiJump) {
		moveSquares.push(moveDirRight);
		moveDirRight.classList.add("available_move");
		
	// } else if (btmRightJump != null && !btmRightJump.hasChildNodes()) {
	} else if (checkJumpChecker(currChecker.parentElement, moveDirRight) && jumpDirRight != null) {
		if(!jumpDirRight.hasChildNodes()) {
			moveSquares.push(jumpDirRight);
			jumpDirRight.classList.add("available_jump");
		}
	}

	moveClickEvent();
}

// Checks if checkers that may be jumpable are on the same team or not
function checkJumpChecker(selectedBox, targetBox) {
	if (selectedBox == null || targetBox == null || !targetBox.hasChildNodes()) {
		return false;
	}

	let currChecker = selectedBox.children[0];
	let targetChecker = targetBox.children[0];

	let currCheckerIsBlack = currChecker.classList.contains("blackChecker");
	let currCheckerIsRed = currChecker.classList.contains("redChecker");

	let targetCheckerIsBlack = targetChecker.classList.contains("blackChecker");
	let targetCheckerIsRed = targetChecker.classList.contains("redChecker");

	if( (currCheckerIsBlack && targetCheckerIsRed) ||
		(currCheckerIsRed && targetCheckerIsBlack) ) {
			// console.log("Valid Jump Available!");
			return true;
	}

	// console.log("No Jumps available!");
	return false;

	// A checker box should have only up to one child which should be the checker image
	
}

// Hightlights all available moves when selecting a checker
function highlightBox(currChecker, checkerType) {
	let DOM_ID;
	// console.log(currBox);
	
	try {
		DOM_ID = currChecker.parentElement.id;
		// Needs to be in the form of "boxX_Y" 
		if(DOM_ID.length != 6) {
			return;
		}
		
		let xCoord = parseInt(DOM_ID[3]),
			yCoord = parseInt(DOM_ID[5]);

		let topLeft = document.getElementById(`box${xCoord-1}_${yCoord-1}`),
			topRight = document.getElementById(`box${xCoord-1}_${yCoord+1}`),
			btmLeft = document.getElementById(`box${xCoord+1}_${yCoord-1}`),
			btmRight = document.getElementById(`box${xCoord+1}_${yCoord+1}`);

		let topLeftJump = document.getElementById(`box${xCoord-2}_${yCoord-2}`),
			topRightJump = document.getElementById(`box${xCoord-2}_${yCoord+2}`),
			btmLeftJump = document.getElementById(`box${xCoord+2}_${yCoord-2}`),
			btmRightJump = document.getElementById(`box${xCoord+2}_${yCoord+2}`);


		// console.log(topLeft);
		// console.log(topRight);
		// console.log(btmLeft);
		// console.log(btmRight);
		

		clearMoveSqaures();
		// If you press on an already selected square, deselect
		if(currChecker.parentElement == selectedSquare) {
			// console.log("Selected an already selected checker...")
			// console.log(currBox);
			// console.log(selectedSquare);
			
			removeClickEvent();
			selectedSquare = null;


		} else {
			currChecker.classList.add("curr_checker");
			// console.log("Selected a new checker!")
			// console.log(currBox);
			// console.log(selectedSquare);
			switch(checkerType) {
				case "red":
					highlightDirection(currChecker, btmLeft, btmLeftJump, btmRight, btmRightJump, 0);
					if(currChecker.classList.contains("king")) {
						highlightDirection(currChecker, topLeft, topLeftJump, topRight, topRightJump, 0);
					}
					console.log(`Selected a red pawn! with coord x:${xCoord} y:${yCoord}`);
					break;

				case "black":
					highlightDirection(currChecker, topLeft, topLeftJump, topRight, topRightJump, 1);
					if(currChecker.classList.contains("king")) {
						highlightDirection(currChecker, btmLeft, btmLeftJump, btmRight, btmRightJump, 1);
					}
					// moveClickEvent();
					console.log(`Selected a black pawn! with coord x:${xCoord} y:${yCoord}`);
					break;

				default:
					console.log(`Selected an invalid item...`);
			}
			selectedSquare = currChecker.parentElement;
		}
		
		
	} catch (e) {
		// console.error(`${currBox} does not a have either an ID or children elements...`);
		console.error(e);
	}
	
}

function deleteChecker(xCoord, yCoord) {
	board[xCoord][yCoord] = "3";
	let toDel = document.getElementById(`${xCoord}_${yCoord}`);
	// console.log(yCoord, xCoord);
	// document.getElementById(`box${xCoord}_${yCoord}`).classList.add("available_jump");

	if(toDel !=null) {
		toDel.remove();
		if(currTurn == 1) {
			redCount--;
		} else {
			blackCount--;
		}
	} else {
		console.log(`There is no checker with the coordinates of (${yCoord} , ${xCoord})!`);
	}

	// document.getElementById(`${xCoord}_${yCoord}`).remove();

	
}

function addPawnMoveEvent(checkerSquare, type) {
	checkerSquare.addEventListener('click', () => {
		highlightBox(checkerSquare, type);
	})
}


function printBoard() {
	let currRow = ""
	let currChecker;
	for (let i =  0; i < board.length; i++) {
		for(let j = 0; j < board[i].length; j++) {
			if(board[i][j] == 1) {
				currChecker = document.getElementById(`${i}_${j}`);
				// console.log(currChecker);
			}
			
			// currRow += board[i][j] + " ";
			switch (board[i][j]) {
				case 0:
					currRow += "_ "
					break;
				case 1:
					currRow += "r "
					break;
				case 2:
					currRow += "b "
					break;
				case 3:
					currRow += "_ "
					break;
			}
			// console.log(`${board[i][j]} `);
			
		}
		console.log(currRow);
		currRow = "";
	}
}

function buildBoard(tbody) {
    // Creates the Checkers board grid
    for (let x = 0; x < 8; x++) {
        tbody.append(`<tr class="column${x} column"></tr>`);

        for (let y = 0; y < 8; y++) {
            $("tr").last().append(`<td class="box" id="box${x}_${y}"></td>`);
        }
    }
}

function populateBoard() {
    const tbody = $("tbody");
    buildBoard(tbody);

    let coordinateID;
    let currBox
    let checkerImg;

    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
            // DOM element by ID
            coordinateID = `#box${i}_${j}`;
            currBox = document.querySelector(coordinateID);
            // Add Red Piece
            if(board[i][j] == 1 && currBox != null) {
                checkerImg = document.createElement("img");
                checkerImg.src = `${redPiece}`;
                checkerImg.id = `${i}_${j}`;
                checkerImg.classList.add("redChecker");

                currBox.appendChild(checkerImg);
				addPawnMoveEvent(checkerImg, "red");
				redCount++;
                
            // Add Black Piece
            } else if(board[i][j] == 2 && currBox != null) {
                // currBox.append(`<img src=${blackPiece} id=${i}_${j} class="redChecker">`);
                checkerImg = document.createElement("img");
                checkerImg.src = `${blackPiece}`;
                checkerImg.id = `${i}_${j}`;
                checkerImg.classList.add("blackChecker");

                currBox.appendChild(checkerImg);
				addPawnMoveEvent(checkerImg, "black");
				blackCount++;
            }
        }
    }
}

populateBoard();
updateTurn();