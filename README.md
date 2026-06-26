Checkers Game

This game is made with vanilla JavaScript. Each checker and checker cell are DOM elements controlled via JavaScript.

At the moment, there is no AI players or online functionality.

Rules:
- Non-king black checkers can only move on grey squares going up
- Non-king red checkers can only move on grey squares going down
- Elminate each opposing checker
- Each piece that reaches the opposite end of the board becomes a king, allowing them to move both up and down.
- When a jump is availble, the game does not force the player to make the jump unless...
  - When a player makes a jump and a multi-jump is available, the player must go through the entire multi-jump to end their turn.
- There are three colored pulsing hightlights the indicate the following:
  - Red: Possible jump against an opposing checker
  - Green: Possible move to an empty sqaure
  - Blue: Show which checker the current player has selected


How to Play:

Download all project files then simply run the index.html file with the web browser of your choice.
