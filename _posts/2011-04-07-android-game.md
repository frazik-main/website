---
layout: post
title: Developing an Android 2D Game - Hexxagon-like
date: 2011-04-07 09:41:00
description: A tutorial on developing a 2D Android game similar to Hexxagon, covering game rules, class design, UI, and animation using Java 2D interfaces.
tags: android, game development, java, 2d game, animation, hexxagon, programming
categories: android-development, game-development
---

## Introduction

When developing Android games, you can choose to use OpenGL (for 3D game development) or Java drawing interfaces for simpler 2D games. In this example, I will demonstrate how to develop an Android 2D game. This game is similar to "Hexxagon," which I played long ago on my old DOS box (ah... memories: 386SX, 2MB RAM, Trident 512KB, 42MB HDD, BASIC, TURBO PASCAL... those were the times!).

The main goal in this game is to have as many balls as possible at the end. The rules are as follows: You have balls, and you can either move them or copy them (only up to a distance of three places). Whether a ball performs a move or a copy depends on the distance it needs to travel. A ball is copied only if the distance is 1. You perform a move into an empty destination field. Any opponent ball around the destination empty field will be "transformed" to your ball's color.

Since this explanation might not be entirely clear, I've created a simple video example on YouTube. Please watch it to better understand the basic game logic (it's certainly better than this written description!).

[Watch the game demo on YouTube](https://www.youtube.com/watch?v=KDGctcun9S8)

## Class Design

I've added many comments to the code to enhance readability and usefulness. If you're interested in the details, please refer to the source. Here, I will only explain the main class organization and design decisions. You can download the [full source code](http://codingwithpassionblog.googlecode.com/files/MinMaxBalls.zip) from my Google Code repository.

Please note that this code is far from being finished or polished. But enough with the excuses, let's begin!

The game's implementation is separated into two main classes. The first class, `BoardView`, is a custom `View` responsible for animation, drawing, and handling user input (screen touches). The second class, the main `Activity`, is responsible for game flow, saving and restoring state, and initialization. This is also the only `Activity` in this game. There is also a third, less prominent class that handles the core game logic.

A strong motivation behind this implementation was to separate the view from the game-flow controller. `BoardView` handles only aspects closely coupled with animation and drawing, while the `Activity` (`MinMaxBalls`) manages the game logic and flow.

I must admit something: The game's title might mislead experienced programmers into thinking that this implementation uses the Minimax algorithm to calculate the next move. In the initial iteration of the game, this algorithm was present, but it consumed too much CPU power. Furthermore, in a real-world scenario, we cannot predict that a user will always choose the best possible move, so the algorithm behaved strangely when users made illogical choices. Therefore, I decided it was best to exclude it for now. I will write another blog post about this algorithm, but in the context of a simpler game scenario (perhaps Tic-Tac-Toe or something similar).

## MinMaxBalls Main Activity

Regardless, here is the code for the `MinMaxBalls` main activity:

```java
package org.codingwithpassion.minmaxballs;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import org.codingwithpassion.minmaxballs.BoardView.MoveStageListener;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.method.LinkMovementMethod;
import android.text.util.Linkify;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Main activity for game. It is unnecessarily complex and
 * needs to be refactored at some point in the future.
 * @author jan.krizan
 */
public class MinMaxBalls extends Activity {

 // This is the actual location where we store the state of the board. It is here because
 // of save instance state stuff and decoupling between view/controller and model.
 // So this activity is something like a model.
 private State[][] positions = new State[BoardView.BOARD_SIZE][BoardView.BOARD_SIZE];

 // Game instance that is used mainly for calculating computer moves.
 private Game game = new Game();

 // Two TextView views that we use for tracking current score.
 private TextView humanScore;
 private TextView computerScore;

 // Dialog and menu IDs.
 private static final int DIALOG_RESET = 1;
 private static final int DIALOG_ABOUT = 2;
 private static final int MENU_RESET = 3;
 private static final int MENU_ABOUT = 4;

 // Intent parameter ID.
 private static final String DIFFICULTY = "minmaxdifficulty";

 private boolean isFinish = false;

 private NumberFormat numberFormat = new DecimalFormat("00");

 // Instance of our view.
 private BoardView boardView;

 /*
  * OK, main activity, nothing clever.
  */
 @Override
 public void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);

  setContentView(R.layout.main);

  boardView = (BoardView) findViewById(R.id.boardView);
  humanScore = (TextView) findViewById(R.id.humanScore);
  computerScore = (TextView) findViewById(R.id.compScore);

  boardView.setFocusable(true);
  boardView.setFocusableInTouchMode(true);
  boardView.setMoveStageListener(new CellSelected());

  // Initialize positions.
  Game.setEmptyValues(positions);
  Game.setSolidSquares(positions);
  Game.initializeStartPositions(positions);

  // Initial game difficulty.
  int difficulty = Game.MEDIUM_DIFFICULTY;

  Bundle extras = getIntent().getExtras();
  if (extras != null) {
   difficulty = Integer.parseInt(extras.getString(DIFFICULTY));
   Log.d("difficult", String.valueOf(difficulty));
  }

  // We set difficulty to know what kind (which "hard-nest") of moves to perform.
  game.setDifficulty(difficulty);

  // Bind positions table to View values.
  boardView.setPositions(positions);

  refreshScore();
 }

 /*
  * Simple but effective refresh score.
  */
 private void refreshScore() {
  humanScore.setText(numberFormat.format(Game.countPlayerBalls(positions,
    State.HUMAN)));
  computerScore.setText(numberFormat.format(Game.countPlayerBalls(
    positions, State.COMP)));
 }

 @Override
 protected Dialog onCreateDialog(int id) {
  if (id == DIALOG_RESET) {
   String easy = String
     .valueOf(this.getText(R.string.difficulty_easy));
   String hard = String
     .valueOf(this.getText(R.string.difficulty_hard));
   String medium = String.valueOf(this
     .getText(R.string.difficulty_medium));

   final CharSequence[] items = { easy, medium, hard };

   AlertDialog.Builder builder = new AlertDialog.Builder(this);
   builder.setTitle(R.string.game_difficulty);
   builder.setItems(items, new DialogInterface.OnClickListener() {
    public void onClick(DialogInterface dialog, int item) {
     String difficulty = String.valueOf(Game.MEDIUM_DIFFICULTY);
     if (item == 0) {
      difficulty = String.valueOf(Game.EASY_DIFFICULTY);
     } else if (item == 1) {
      difficulty = String.valueOf(Game.MEDIUM_DIFFICULTY);
     } else if (item == 2) {
      difficulty = String.valueOf(Game.HARD_DIFFICULTY);
     }
     Intent intent = getIntent();
     intent.putExtra(DIFFICULTY, difficulty);
     finish();
     startActivity(intent);
    }
   });
   return builder.create();
  } else if (id == DIALOG_ABOUT) {
   final TextView message = new TextView(this);
   final SpannableString s = new SpannableString(
     this.getText(R.string.blog_link));
   Linkify.addLinks(s, Linkify.WEB_URLS);
   message.setText(s);
   message.setMovementMethod(LinkMovementMethod.getInstance());
   AlertDialog.Builder builder = new AlertDialog.Builder(this);
   builder.setView(message)
     .setCancelable(true)
     .setIcon(android.R.drawable.stat_notify_error)
     .setNegativeButton("OK",
       new DialogInterface.OnClickListener() {
        public void onClick(DialogInterface dialog,
          int id) {
         dialog.cancel();
        }
       });
   return builder.create();
  }
  return null;
 }

 @Override
 public boolean onCreateOptionsMenu(Menu menu) {
  super.onCreateOptionsMenu(menu);

  int groupId = 0;

  MenuItem menuItemReset = menu.add(groupId, MENU_RESET, Menu.NONE,
    R.string.new_game);
  menuItemReset.setIcon(android.R.drawable.star_big_on);
  MenuItem menuItemAbout = menu.add(groupId, MENU_ABOUT, Menu.NONE,
    R.string.about);
  menuItemAbout.setIcon(android.R.drawable.stat_notify_error);

  return true;
 }

 @Override
 public boolean onOptionsItemSelected(MenuItem item) {
  super.onOptionsItemSelected(item);

  if (item.getItemId() == MENU_RESET) {
   showDialog(DIALOG_RESET);
   return true;
  } else if (item.getItemId() == MENU_ABOUT) {
   showDialog(DIALOG_ABOUT);
   return true;
  }

  return false;
 }

 private void showToast(int message) {
  Toast.makeText(getApplicationContext(), message, Toast.LENGTH_LONG)
    .show();
 }

 @Override
 public void onSaveInstanceState(Bundle bundle) {
  super.onSaveInstanceState(bundle);

  if (game.getMove().player == State.HUMAN) {
   if (!isFinish) {
    int source_i = game.getMove().sourceMove.i;
    int source_j = game.getMove().sourceMove.j;
    if (source_i != -1 && source_j != -1) {
     if (positions[source_i][source_j] == State.SELECTED) {
      positions[source_i][source_j] = State.HUMAN;
     }
    }
    game.bestMove(positions, State.COMP);
    game.getMove().player = State.COMP;
    performMove(game.getMove(), false);
    changecolors(game.getMove(), false);
   }
  }

  for (int i = 0; i < positions.length; i++) {
   int[] pos = new int[positions.length];
   for (int j = 0; j < positions.length; j++) {
    pos[j] = positions[i][j].getValue();
   }
   bundle.putIntArray("pos" + i, pos);
  }
 }

 @Override
 public void onRestoreInstanceState(Bundle bundle) {
  for (int i = 0; i < BoardView.BOARD_SIZE; i++) {
   for (int j = 0; j < BoardView.BOARD_SIZE; j++) {
    positions[i][j] = State
      .fromInt(bundle.getIntArray("pos" + i)[j]);
   }
  }
  refreshScore();
 }

 /*
  * OK, the real meat of game-flow control. It uses semaphore-like
  * poor design to control flow and it is crucially important to
  * preserve the order of if-s and boolean fields checking.
  * Very, very poor design (dragons live here kind of design!) so:
  * TODO: Please refactor this. I get a pretty nasty poor design smell here!
  */
 private class CellSelected implements MoveStageListener {

  // Semaphore-like boolean fields.
  private boolean isCompMove = false;
  private boolean isCompSelected = false;

  private boolean isHumanBallChange = false;
  private boolean isCompBallsChange = false;

  private boolean isCompVictory = false;
  private boolean isHumanVictory = false;

  /*
   * React to user click on the board. If the user clicks on their
   * ball, then select that ball. If they select an empty field, then
   * move the ball. Otherwise, display an error by displaying an error animation
   * on that square.
   */
  public void userClick(int i, int j) {
   Coordinate humanSource = game.getMove().sourceMove;
   if (!isFinish && positions[i][j] == State.HUMAN) {
    game.getMove().player = State.HUMAN;
    // If we already selected a ball and now we change our mind.
    if (humanSource.isNotEmpty()) {
     positions[humanSource.i][humanSource.j] = State.HUMAN;
    }
    positions[i][j] = State.SELECTED;
    boardView.selectBall(i, j, State.SELECTED);
    humanSource.i = i;
    humanSource.j = j;
   } else if (!isFinish
     && humanSource.isNotEmpty()
     && positions[i][j] == State.EMPTY
     && Game.isAllowedDistance(i, j, humanSource.i,
       humanSource.j, 2)) {
    game.getMove().destinationMove.i = i;
    game.getMove().destinationMove.j = j;
    performMove(game.getMove(), true);
    isHumanBallChange = true;
   } else {
    boardView.error(i, j);
    isHumanBallChange = false;
   }

  }

  /*
   * If animation is complete, then it is obvious we need to do something.
   * What will be done is decided by checking various boolean fields.
   */
  public void animationComplete() {
   // TODO: refactor:
   // Excessive conditional logic, must preserve conditions order of
   // conditions...bad, bad design. :(
   if (isCompVictory) {
    changeAllColors(State.HUMAN, State.COMP);
    isCompVictory = false;
    // stop all activity
    isCompSelected = false;
   }
   if (isHumanVictory) {
    changeAllColors(State.COMP, State.HUMAN);
    isHumanVictory = false;
    // stop all activity
    isCompSelected = false;
   }

   if (isCompBallsChange) {
    changecolors(game.getMove(), true);
    isCompBallsChange = false;
    refreshScore();
    game.deleteMove();
    checkWin();
   }

   if (isCompMove) {

    performMove(game.getMove(), true);
    isCompMove = false;
    isCompBallsChange = true;
   }
   if (isCompSelected) {

    // Calculate move for computer.
    game.bestMove(positions, State.COMP);
    game.getMove().player = State.COMP;
    Coordinate compSelect = game.getMove().sourceMove;
    boardView.selectBall(compSelect.i, compSelect.j, State.SELECTED);
    positions[compSelect.i][compSelect.j] = State.SELECTED;
    isCompSelected = false;
    isCompMove = true;
   }

   if (isHumanBallChange) {
    changecolors(game.getMove(), true);
    isHumanBallChange = false;
    isCompSelected = true;
    refreshScore();
    game.deleteMove();
    checkWin();
   }
  }

  private void checkWin() {
   if (game.isWin(positions, State.HUMAN)) {
    checkWhoWin();
   }
   if (game.isWin(positions, State.COMP)) {
    checkWhoWin();
   }
  }

  private void checkWhoWin() {
   if (Game.countPlayerBalls(positions, State.HUMAN) >= Game
     .countPlayerBalls(positions, State.COMP)) {
    isHumanVictory = true;
    showToast(R.string.human_wins);
    isCompVictory = false;
    isFinish = true;
   } else {
    isCompVictory = true;
    showToast(R.string.comp_wins);
    isHumanVictory = false;
    isFinish = true;
   }
  }
 }

 private void changecolors(Move move, boolean withAnimation) {
  State toWho = move.player;
  State fromWho = toWho == State.HUMAN ? State.COMP : State.HUMAN;
  boolean[][] changeThese = Game.changeColors(positions,
    move.destinationMove.i, move.destinationMove.j, fromWho);

  for (int i = 0; i < BoardView.BOARD_SIZE; i++) {
   for (int j = 0; j < BoardView.BOARD_SIZE; j++) {
    if (changeThese[i][j]) {
     positions[i][j] = toWho;
    }
   }
  }
  if (withAnimation)
   boardView.changeColors(changeThese, fromWho, toWho);
 }

 private void changeAllColors(State fromWho, State toWho) {
  boolean[][] changeThese = Game.changeAllColors(positions, fromWho);

  for (int i = 0; i < BoardView.BOARD_SIZE; i++) {
   for (int j = 0; j < BoardView.BOARD_SIZE; j++) {
    if (changeThese[i][j]) {
     positions[i][j] = toWho;
    }
   }
  }

  boardView.changeColors(changeThese, fromWho, toWho);

 }

 private void performMove(Move move, boolean withAnimation) {
  int start_i = move.sourceMove.i;
  int start_j = move.sourceMove.j;
  int dest_i = move.destinationMove.i;
  int dest_j = move.destinationMove.j;

  State who = move.player;
  if (Game.getDistance(start_i, start_j, dest_i, dest_j) > 1) {
   if (withAnimation)
    boardView.moveBall(start_i, start_j, dest_i, dest_j, who);
   positions[start_i][start_j] = State.EMPTY;
  } else {
   if (withAnimation)
    boardView.createBall(dest_i, dest_j, who);
   positions[start_i][start_j] = who;
  }
  positions[dest_i][dest_j] = who;
 }

}
```

You can see that there is one inner class named `CellSelected`. Its responsibility is to control game flow and handle "messages" from the view that are sent via method calls. It also saves instance field data and performs additional moves when necessary (e.g., when the user tilts the screen) in its `onSaveInstanceState` method.

## BoardView Class

The second interesting class is `BoardView`.

```java
package org.codingwithpassion.minmaxballs;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.os.Handler;
import android.os.Message;
import android.os.Handler.Callback;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

/**
 * Implementation of board view/controller. It draws the board, handles user events
 * (touch), screen rotation, and animation.
 *
 * @author jan.krizan
 */
public class BoardView extends View {

 public static final int BOARD_MARGIN = 10;
 public static final int BOARD_SIZE = 7;
 public static final int GRID_SIZE = 2;

 private static final int MSG_ANIMATE = 0;

 private final Handler animationHandler = new Handler(
   new AnimationMessageHandler());

 private MoveStageListener moveStageListener;

 /**
  * Listener interface that sends messages to Activity. The Activity then handles
  * these messages.
  */
 public interface MoveStageListener {

  // Fires when user clicks somewhere on the board.
  void userClick(int i, int j);

  // When animation completes, the current move stage is complete.
  void animationComplete();
 }

 public void setMoveStageListener(MoveStageListener selectionListener) {
  this.moveStageListener = selectionListener;
 }

 /**
  * Animation interface that controls the animation handler.
  */
 public interface Animation {
  // This is called in the onDraw method.
  void animate(Canvas canvas);

  // Says if animation should end.
  boolean isFinish();

  // Controls which cells will be animated and hence should be
  // ignored when we draw the grid.
  boolean skip(int i, int j);

  // How many frames per second we will use for our animation.
  int fps();
 }

 private Animation animation = new NullAnimation();

 // Here we store the animation board state with all players and intermediate
 // states for cells.
 private State[][] positions;

 public void setPositions(State[][] positions) {
  this.positions = positions;
 }

 // Paint for board table line. It is here because onPaint is
 // using it several times per frame.
 private Paint boardLinePaint;

 // Width of board is also calculated dynamically when screen
 // size changes.
 private float boardWidth;

 // Maximum radius of ball - calculated dynamically also...
 private float maxRadius;

 // Can freely be here because it is calculated every time screen size
 // changes.
 private float cellSize;

 public BoardView(Context context, AttributeSet attrs) {
  super(context, attrs);
  requestFocus();
  boardLinePaint = new Paint();
  boardLinePaint.setColor(0xFFFFFFFF);
  boardLinePaint.setStrokeWidth(GRID_SIZE);
  boardLinePaint.setStyle(Style.STROKE);
 }

 /*
  * Classic onDraw. It paints table and ball states. When we need to animate
  * stuff, we call it to refresh the canvas state (easy as in classic Java 2D
  * graphics animation).
  */
 @Override
 protected void onDraw(Canvas canvas) {
  super.onDraw(canvas);
  float offsetBoardWidth = boardWidth - BOARD_MARGIN;
  canvas.drawRect(BOARD_MARGIN, BOARD_MARGIN, offsetBoardWidth,
    offsetBoardWidth, boardLinePaint);

  for (int i = 0; i < BOARD_SIZE; i++) {
   float cellStep = BOARD_MARGIN + (i * cellSize);
   canvas.drawLine(cellStep, BOARD_MARGIN, cellStep, offsetBoardWidth,
     boardLinePaint);
   canvas.drawLine(BOARD_MARGIN, cellStep, offsetBoardWidth, cellStep,
     boardLinePaint);
  }

  setValuesFromDatas(canvas);

  animation.animate(canvas);

 }

 /*
  * Set values from board state structure and skip animated items.
  */
 private void setValuesFromDatas(Canvas canvas) {
  for (int i = 1; i < BOARD_SIZE + 1; i++) {
   for (int j = 1; j < BOARD_SIZE + 1; j++) {
    // If these are currently animated squares, do not
    // draw them!
    if (!animation.skip(i - 1, j - 1))
     drawBall(i, j, positions[i - 1][j - 1], maxRadius, canvas,
       255);
    drawSolidSquare(canvas, i, j, positions[i - 1][j - 1]);
   }
  }
 }

 /*
  * Method for drawing a filled square (when the user touches an inappropriate section
  * of the table). It is stupid to create a Paint object every time, but it is here
  * for readability and encapsulation reasons.
  */
 private void drawWhiteSquare(Canvas canvas, int i, int j, int alpha) {
  Paint paint = new Paint();
  paint.setColor(Color.WHITE);
  paint.setStyle(Style.FILL);
  paint.setAlpha(alpha);
  drawCustomRect(i, j, canvas, paint, 0);
 }

 private void drawCustomRect(int i, int j, Canvas canvas, Paint paint,
   float shrink) {
  canvas.drawRect(i * cellSize + GRID_SIZE + BOARD_MARGIN + shrink, j
    * cellSize + GRID_SIZE + BOARD_MARGIN + shrink, (i + 1)
    * cellSize - GRID_SIZE + BOARD_MARGIN - shrink, (j + 1)
    * cellSize + BOARD_MARGIN - GRID_SIZE - shrink, paint);
 }

 /*
  * Draw fancy "disabled" and solid square. Same story here for Paint object
  * as in drawWhiteSquare method.
  */
 private void drawSolidSquare(Canvas canvas, int i, int j, State who) {
  if (who == State.BLOCK) {

   Paint paintBigger = new Paint();
   paintBigger.setColor(0xFFA800A8);
   paintBigger.setStyle(Style.FILL);

   drawCustomRect(i - 1, j - 1, canvas, paintBigger, 0);

   Paint paintSmaller = new Paint();
   paintSmaller.setColor(0xFFFC54FC);
   paintSmaller.setStyle(Style.FILL);

   float shrink = cellSize * 0.15f;

   drawCustomRect(i - 1, j - 1, canvas, paintSmaller, shrink);

   canvas.drawLine((i - 1) * cellSize + GRID_SIZE + BOARD_MARGIN,
     (j - 1) * cellSize + GRID_SIZE + BOARD_MARGIN, (i - 1)
       * cellSize + GRID_SIZE + BOARD_MARGIN + shrink,
     (j - 1) * cellSize + GRID_SIZE + BOARD_MARGIN + shrink,
     paintSmaller);

   canvas.drawLine(i * cellSize - GRID_SIZE + BOARD_MARGIN, (j - 1)
     * cellSize + GRID_SIZE + BOARD_MARGIN, i * cellSize
     - GRID_SIZE + BOARD_MARGIN - shrink, (j - 1) * cellSize
     + GRID_SIZE + BOARD_MARGIN + shrink, paintSmaller);

   canvas.drawLine(i * cellSize - GRID_SIZE + BOARD_MARGIN, j
     * cellSize - GRID_SIZE + BOARD_MARGIN, i * cellSize
     - GRID_SIZE + BOARD_MARGIN - shrink, j * cellSize
     - GRID_SIZE + BOARD_MARGIN - shrink, paintSmaller);

   canvas.drawLine((i - 1) * cellSize + GRID_SIZE + BOARD_MARGIN, j
     * cellSize - GRID_SIZE + BOARD_MARGIN, (i - 1) * cellSize
     + GRID_SIZE + BOARD_MARGIN + shrink, j * cellSize
     - GRID_SIZE + BOARD_MARGIN - shrink, paintSmaller);
  }

 }

 /*
  * Draw custom balls. We can change balls alpha and radius in animation.
  */
 private void drawBall(int i, int j, State who, float radius, Canvas canvas,
   int alpha) {

  // Calculate where we will put ball in our grid based on coordinates in
  // grid.
  float x = cellSize * (i - 1) + cellSize / 2 + BOARD_MARGIN;
  float y = cellSize * (j - 1) + cellSize / 2 + BOARD_MARGIN;
  // Skip empty every time.
  if (who != State.EMPTY && who != State.BLOCK) {
   Paint smallBall = new Paint();

   int color = Color.RED;
   if (who == State.SELECTED)
    color = Color.BLACK;
   else if (who == State.COMP)
    color = Color.BLUE;
   smallBall.setColor(color);
   smallBall.setStyle(Style.FILL);
   smallBall.setAlpha(alpha);

   Paint bigBall = new Paint();
   bigBall.setColor(Color.WHITE);
   bigBall.setStyle(Style.FILL);
   bigBall.setAlpha(alpha);

   // Smaller ball is 15% smaller than bigger.
   canvas.drawCircle(x, y, radius * 1.15f, bigBall);

   canvas.drawCircle(x, y, radius, smallBall);
  }
 }

 /*
  * Select ball action operation (ball becomes black).
  */
 public void selectBall(int i, int j, State who) {
  animation = new PutBall();
  PutBall putBall = (PutBall) animation;
  putBall.alpha = 0;
  putBall.i = i;
  putBall.j = j;
  putBall.who = State.SELECTED;

  animationHandler.sendEmptyMessage(MSG_ANIMATE);
 }

 /*
  * Create new ball operation (on an empty square in the grid).
  */
 public void createBall(int i, int j, State who) {
  animation = new CreateBallAnimation();
  CreateBallAnimation createBallAnimation = (CreateBallAnimation) animation;
  createBallAnimation.radius = 0;
  createBallAnimation.i = i;
  createBallAnimation.j = j;
  createBallAnimation.who = who;

  animationHandler.sendEmptyMessage(MSG_ANIMATE);
 }

 /*
  * Paint square in white block operation (along with alpha animation) when
  * user performs an illegal move.
  */
 public void error(int i, int j) {
  animation = new FillSquareAnimation();
  FillSquareAnimation fillSquareAnimation = (FillSquareAnimation) animation;
  fillSquareAnimation.i = i;
  fillSquareAnimation.j = j;
  fillSquareAnimation.alpha = 255;

  animationHandler.sendEmptyMessage(MSG_ANIMATE);
 }

 /*
  * Move ball from one place to another operation (with animation also).
  */
 public void moveBall(int i1, int j1, int i2, int j2, State who) {
  animation = new MoveBallsAnimation();
  MoveBallsAnimation createBallAnimation = (MoveBallsAnimation) animation;
  createBallAnimation.radius = maxRadius;
  createBallAnimation.moveFrom[i1][j1] = true;
  createBallAnimation.moveTo[i2][j2] = true;
  createBallAnimation.whoFrom = who;
  createBallAnimation.whoTo = who;

  animationHandler.sendEmptyMessage(MSG_ANIMATE);
 }

 /*
  * Change colors for all balls operation that have same coordinates as true
  * values in "changeThem" matrix. Animation is same as for move operation.
  */
 public void changeColors(boolean[][] changeThem, State whoFrom, State whoTo) {
  animation = new MoveBallsAnimation();
  MoveBallsAnimation createBallAnimation = (MoveBallsAnimation) animation;
  createBallAnimation.radius = maxRadius;
  createBallAnimation.moveFrom = changeThem;
  createBallAnimation.moveTo = changeThem;
  createBallAnimation.whoFrom = whoFrom;
  createBallAnimation.whoTo = whoTo;

  animationHandler.sendEmptyMessage(MSG_ANIMATE);
 }

 @Override
 public boolean onTouchEvent(MotionEvent event) {
  if (animation.isFinish()) {
   int action = event.getAction();

   int i = (int) ((event.getX() - BOARD_MARGIN) / cellSize);
   int j = (int) ((event.getY() - BOARD_MARGIN) / cellSize);

   if (i >= 0 && i <= (BOARD_SIZE - 1) && j >= 0
     && j <= (BOARD_SIZE - 1)) {

    // If user just clicks, then we will show a painted square.
    if (action == MotionEvent.ACTION_DOWN) {
     moveStageListener.userClick(i, j);
     return true;
    }
   }
  }

  return false;
 }

 /*
  * Recalculate fields based on current screen size.
  */
 @Override
 protected void onSizeChanged(int w, int h, int oldw, int oldh) {
  super.onSizeChanged(w, h, oldw, oldh);
  boardWidth = w < h ? w : h;
  cellSize = (boardWidth - GRID_SIZE * BOARD_MARGIN) / BOARD_SIZE;

  maxRadius = cellSize * 0.68f / 2;
 }

 /*
  * Set dimension of current view.
  */
 protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
  int w = MeasureSpec.getSize(widthMeasureSpec);
  int h = MeasureSpec.getSize(heightMeasureSpec);
  int d = w == 0 ? h : h == 0 ? w : w < h ? w : h;
  setMeasuredDimension(d, d);
 }

 /**
  * Inner animation handler. This handler calls itself several times during
  * animation and in every pass invalidates the current view (calls the onDraw method
  * of View). It is controlled by the Animation interface and hence a concrete
  * implementation of the Animation interface. This implementation "tells" it
  * when to stop.
  */
 private class AnimationMessageHandler implements Callback {
  public boolean handleMessage(Message msg) {
   if (msg.what == MSG_ANIMATE) {
    BoardView.this.invalidate();
    if (!animationHandler.hasMessages(MSG_ANIMATE)) {
     if (animation.isFinish()) {
      animationHandler.removeMessages(MSG_ANIMATE);
      moveStageListener.animationComplete();
     } else {
      animationHandler.sendEmptyMessageDelayed(MSG_ANIMATE,
        animation.fps());
     }
    }
    return true;
   }
   return false;
  }
 }

 /**
  * This animation doesn't do anything - null animation.
  */
 private class NullAnimation implements Animation {
  public void animate(Canvas canvas) {
   // do nothing
  }

  public boolean isFinish() {
   return true;
  }

  public boolean skip(int i, int j) {
   return false;
  }

  public int fps() {
   return 1000 / 1;
  }
 }

 /**
  * Create ball animation (balls pops-up up in empty square).
  */
 private class CreateBallAnimation implements Animation {

  public int i;
  public int j;
  public State who;
  public float radius;

  public void animate(Canvas canvas) {
   drawBall(i + 1, j + 1, who, radius, canvas, 255);
   radius += 8;
   if (radius >= BoardView.this.maxRadius)
    radius = BoardView.this.maxRadius;
  }

  public boolean isFinish() {
   return radius >= BoardView.this.maxRadius;
  }

  public boolean skip(int i, int j) {
   return (this.i == i && this.j == j);
  }

  public int fps() {
   return 1000 / 16;
  }
 }

 /**
  * Move ball animation that moves the current ball from one square to another
  * altogether with a popping-up effect. :) It can be used for one ball or a ball
  * set (represented by a coordinate matrix).
  */
 private class MoveBallsAnimation implements Animation {
  public boolean[][] moveFrom = new boolean[BOARD_SIZE][BOARD_SIZE];
  public boolean[][] moveTo = new boolean[BOARD_SIZE][BOARD_SIZE];
  public State whoFrom;
  public State whoTo;
  public float radius;

  public boolean firstPahseFinish;
  public boolean secondPhaseFinish;

  public void animate(Canvas canvas) {
   if (!firstPahseFinish) {
    for (int i = 0; i < BOARD_SIZE; i++) {
     for (int j = 0; j < BOARD_SIZE; j++) {
      if (moveFrom[i][j])
       drawBall(i + 1, j + 1, whoFrom, radius, canvas, 255);
     }
    }

    radius -= 8;
    if (radius <= 0) {
     radius = 0;
     firstPahseFinish = true;
    }
   } else {

    for (int i = 0; i < BOARD_SIZE; i++) {
     for (int j = 0; j < BOARD_SIZE; j++) {
      if (moveTo[i][j])
       drawBall(i + 1, j + 1, whoTo, radius, canvas, 255);
     }
    }

    radius += 8;
    if (radius >= maxRadius) {
     radius = maxRadius;
     secondPhaseFinish = true;
    }
   }
  }

  public boolean isFinish() {
   return firstPahseFinish && secondPhaseFinish;
  }

  public boolean skip(int i, int j) {
   return moveFrom[i][j] || moveTo[i][j];
  }

  public int fps() {
   return 1000 / 16;
  }
 }

 /**
  * Paint square with a gradually disappearing white inner square.
  */
 private class FillSquareAnimation implements Animation {

  public int i;
  public int j;

  public int alpha;

  public void animate(Canvas canvas) {
   drawWhiteSquare(canvas, i, j, alpha);
   alpha -= 75;
   if (alpha <= 0)
    alpha = 0;
  }

  public boolean isFinish() {
   return alpha <= 0;
  }

  public boolean skip(int i, int j) {
   return false;
  }

  public int fps() {
   return 1000 / 16;
  }
 }

 /**
  * And last but not least, an animation that gradually changes the ball
  * color.
  */
 private class PutBall implements Animation {

  public int i;
  public int j;
  public State who;
  public int alpha;

  public void animate(Canvas canvas) {
   drawBall(i + 1, j + 1, who, maxRadius, canvas, alpha);
   alpha += 100;
   if (alpha >= 255)
    alpha = 255;
  }

  public boolean isFinish() {
   return alpha >= 255;
  }

  public boolean skip(int i, int j) {
   return (this.i == i && this.j == j);
  }

  public int fps() {
   return 1000 / 16;
  }
 }
}
```

This class extends `View` and overrides the `onDraw` method. This is a rudimentary animation implementation in Android that uses Java 2D interfaces, meaning it's almost identical to Core Java 2D animation.

It defines two interfaces. The `MoveStageListener` interface is used for sending messages to the `Activity` (`MinMaxBalls`) class. The second interface, `Animation`, is used to send messages to the `Message Handler`. The `Message Handler` is used to perform the animation loop and to invalidate the view (thereby calling the `onDraw` method). This could also be achieved using another thread, but this approach results in slightly cleaner code.

The `Animation` interfaces "tell" the `Message Handler` when to stop, what FPS to use, and other such details. We have several implementations of these `Animation` interfaces, and all perform simple animations.

And that's it. Please feel free to leave comments if you have any questions or suggestions. I will do my best to notice them (it's hard to spot blog comments, as Blogger doesn't send email notifications when someone posts one—they should!). And yes, I will also try to answer them.
