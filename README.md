# Project 0:  General Assembly WDI.

https://reldatid.github.io/tic-tac-toe/

## Brief:

Create an implementation of tic tac toe in a webpage.

### Technical Requirements
Your app must:

- Render a game board in the browser
- Switch turns between X and O (or whichever markers you select); your game should prevent users from playing a turn into a square that is already occupied
- Visually display which side won if a player gets three in a row or show a draw/"cat’s game" if neither wins
- Include separate HTML / CSS / JavaScript files
- Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles
- Use Javascript with jQuery for DOM manipulation
- Deploy your game online, where the rest of the world can access it
- Use semantic markup for HTML and CSS (adhere to best practices)

So I may have disobeyed the "KISS" rule, and implemented something I've kinda wanted to build ever since I was introduced to it. It was shown to me as Tic-Tac-Toe-Ten, as there are 10 boards, 1 in each of the 9 segments of the larger master board.

### Full Ruleset
- The aim is to get 3 in a row in the big board.
- To claim a square on the big board you must win the contained small board.
- Player one can go in any square.
- Each move dictates the sub-board in which the next turn takes place. e.g - playing in the top left of a small board means the next turn must happen in the top left of the containing board.
- If a smaller board is won, it is claimed by that player and sub-subsequent turns cannot happen in that board, even if there are empty squares.
- If a turn is directed towards a claimed cell, the player can then go anywhere else on that board.
- In the event of a tied board completing rows for both players in the main board, the winner is the player who's turn it is. This ensures no ties ever. I think.

### Features

- Tic Tac Toe 'recursion'.
- Board Reset.
- Number of layers selector.
- Previous and next turn indicators.


### To Be implemented

number of '>'s is importance.

- >Full move history.
- >Win tracking with bananas.
- Board saving and loading.
- Leaderboard.
- >>Online multiplayer.
- >Undo perhaps? Better, clicking highlights a cell and there's a 'confirm move' button or something.
- Options menu to change game rules.
- Option: Single player against AI, Local 2 player, or online multiplayer.
  - Option: Use the AI to pre-populate game board for the first X moves.
- Option: A board is claimed as a tie as soon as no-one can win it.
- Option: No bananas mode. Turns off win tracking for casual playing.
- Idea:Option: Betting on what your opponents next move will be. Adds a meta-'mind-game' element where you can convince your opponents they are playing into your hands by doing what they expect.
