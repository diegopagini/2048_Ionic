import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GestureController, GestureDetail } from '@ionic/angular';

import { Cell } from '../models/cell';

enum Direction {
  up = 0,
  down = 1,
  left = 2,
  right = 3,
}

@Component({
  selector: 'tfe-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit, AfterViewInit {
  @ViewChild('gameBoard', { read: ElementRef }) gameBoard: ElementRef;
  board: Cell[][] = Array.from({ length: 4 }, () => new Array(4).fill(null));
  cols: number[] = Array(4)
    .fill(0)
    .map((_, index: number) => index);
  rows: number[] = Array(4)
    .fill(0)
    .map((_, index: number) => index);
  private direction: Direction;

  constructor(private readonly _gestureController: GestureController) {}

  ngOnInit(): void {
    this.generateRandomNumber();
    this.generateRandomNumber();
  }

  ngAfterViewInit(): void {
    this.initSwipe();
  }

  private onXSwipe(detail: GestureDetail): void {
    if (detail.deltaX < 0) {
      // Left move.
      this.direction = Direction.left;
      console.log('left');
    } else {
      // Right move.
      this.direction = Direction.right;
      console.log('right');
    }
  }

  private onYSwipe(detail: GestureDetail): void {
    if (detail.deltaY < 0) {
      // Up move.
      this.direction = Direction.up;
      console.log('up');
    } else {
      // Down move.
      this.direction = Direction.down;
      console.log('down');
    }
  }

  private initSwipe(): void {
    const xSwipe = this._gestureController.create(
      {
        el: this.gameBoard.nativeElement,
        gestureName: 'xswipe',
        maxAngle: 30,
        direction: 'x',
        onEnd: (detail: GestureDetail) => this.onXSwipe(detail),
      },
      true
    );

    const ySwipe = this._gestureController.create(
      {
        el: this.gameBoard.nativeElement,
        gestureName: 'yswipe',
        maxAngle: 30,
        direction: 'y',
        onEnd: (detail: GestureDetail) => this.onYSwipe(detail),
      },
      true
    );

    ySwipe.enable(); // For some glitch or something "y" must be enabled before thant "x".
    xSwipe.enable();
  }

  private generateRandomNumber(): void {
    let col = 0;
    let row = 0;

    do {
      col = Math.floor(Math.random() * this.board[0].length);
      row = Math.floor(Math.random() * this.board.length);
    } while (this.board[row][col] !== null);

    const probNum4 = Math.floor(Math.random() * 100) + 1;

    if (probNum4 <= 25) this.board[row][col] = new Cell(4);
    else this.board[row][col] = new Cell(2);
  }
}
