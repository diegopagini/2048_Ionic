import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GestureController, GestureDetail } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { Direction } from '../interfaces/direction.enum';
import { NextPositionFree } from '../interfaces/next-position.interface';
import { Cell } from '../models/cell';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'tfe-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit, AfterViewInit {
  @ViewChild('gameBoard', { read: ElementRef }) gameBoard: ElementRef;
  board: Cell[][];
  cols: number[];
  points = 0;
  private direction: Direction;
  private hasMovement = false;
  private pointsRounded = 0;
  rows: number[];

  constructor(
    private readonly _alertService: AlertService,
    private readonly _gestureController: GestureController,
    private readonly _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.newGame();
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
      this.moveLeft();
    } else {
      // Right move.
      this.direction = Direction.right;
      this.moveRight();
    }

    this.checkMove();
  }

  private onYSwipe(detail: GestureDetail): void {
    if (detail.deltaY < 0) {
      // Up move.
      this.direction = Direction.up;
      this.moveUp();
    } else {
      // Down move.
      this.direction = Direction.down;
      this.moveDown();
    }

    this.checkMove();
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

    this.board[row][col] = new Cell();
    const probNum4 = Math.floor(Math.random() * 100) + 1;

    if (probNum4 <= 25) this.board[row][col].value = 4;
    else this.board[row][col].value = 2;
  }

  private moveLeft(): void {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 1; col < this.board[row].length; col++) {
        this.processPosition(row, col);
      }
    }
  }

  private moveRight(): void {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = this.board[row].length - 2; col >= 0; col--) {
        this.processPosition(row, col);
      }
    }
  }

  private moveUp(): void {
    for (let row = 1; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        this.processPosition(row, col);
      }
    }
  }

  private moveDown(): void {
    for (let row = this.board.length - 2; row >= 0; row--) {
      for (let col = 0; col < this.board[row].length; col++) {
        this.processPosition(row, col);
      }
    }
  }

  private nextPositionFree({
    originalRow,
    originalCol,
    originalNumber,
  }: NextPositionFree): number[] | null {
    let newRow: number | undefined = undefined;
    let newCol: number | undefined = undefined;
    let found = false;

    switch (this.direction) {
      case Direction.left:
        newRow = originalRow;
        for (let col = originalCol - 1; col >= 0 && !found; col--) {
          if (this.board[originalRow][col] !== null) {
            found = true;

            if (this.board[originalRow][col].blocked) newCol = col + 1;
            else if (this.board[originalRow][col].value === originalNumber)
              newCol = col;
            else if (col + 1 !== originalCol) newCol = col + 1;
          }
        }

        if (!found) newCol = 0;

        break;

      case Direction.right:
        newRow = originalRow;
        for (
          let col = originalCol + 1;
          col < this.board[originalRow].length && !found;
          col++
        ) {
          if (this.board[originalRow][col] !== null) {
            found = true;

            if (this.board[originalRow][col].blocked) newCol = col - 1;
            else if (this.board[originalRow][col].value === originalNumber)
              newCol = col;
            else if (col - 1 !== originalCol) newCol = col - 1;
          }

          if (!found) newCol = this.board[originalRow].length - 1;
        }
        break;

      case Direction.up:
        newCol = originalCol;
        for (let row = originalRow - 1; row >= 0 && !found; row--) {
          if (this.board[row][originalCol] !== null) {
            found = true;

            if (this.board[row][originalCol].blocked) newRow = row + 1;
            else if (this.board[row][originalCol].value === originalNumber)
              newRow = row;
            else if (row + 1 !== originalRow) newRow = row + 1;
          }

          if (!found) newRow = 0;
        }
        break;

      case Direction.down:
        newCol = originalCol;
        for (
          let row = originalRow + 1;
          row < this.board.length && !found;
          row++
        ) {
          if (this.board[row][originalCol] !== null) {
            found = true;

            if (this.board[row][originalCol].blocked) newRow = row - 1;
            else if (this.board[row][originalCol].value === originalNumber)
              newRow = row;
            else if (row - 1 !== originalRow) newRow = row - 1;
          }

          if (!found) newRow = this.board.length - 1;
        }

        break;
    }

    if (newRow !== undefined && newCol !== undefined) return [newRow, newCol];

    return null;
  }

  private processPosition(row: number, col: number): void {
    const cell = this.board[row][col];
    if (cell !== null) {
      const nextPosition = this.nextPositionFree({
        originalRow: row,
        originalCol: col,
        originalNumber: cell.value,
      });

      if (nextPosition) {
        const newRow = nextPosition[0];
        const newCol = nextPosition[1];

        if (!this.board[newRow][newCol])
          this.board[newRow][newCol] = new Cell();

        if (cell.value === this.board[newRow][newCol].value) {
          const points = cell.value * 2;
          this.board[newRow][newCol].value = points;
          this.board[newRow][newCol].blocked = true;
          this.points += points;
          this.pointsRounded += points;
        } else {
          this.board[newRow][newCol] = cell;
        }

        this.board[row][col] = null as any;
        this.hasMovement = true;
      }
    }
  }

  private clearBloquedCells(): void {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] !== null) this.board[row][col].blocked = false;
      }
    }
  }

  private checkMove(): void {
    if (this.winGame()) {
      this._alertService.alertCustomButtons({
        header: this._translateService.instant('label.win.game.title'),
        message: this._translateService.instant('label.game.content', {
          points: this.points,
        }),
        buttons: [
          {
            text: this._translateService.instant('label.new.game'),
            handler: () => {
              this.newGame();
            },
          },
          {
            text: this._translateService.instant('label.share'),
            handler: () => {},
          },
        ],
        backdropDismiss: false,
      });
    } else if (this.loseGame()) {
      this._alertService.alertCustomButtons({
        header: this._translateService.instant('label.lose.game.title'),
        message: this._translateService.instant('label.game.content', {
          points: this.points,
        }),
        buttons: [
          {
            text: this._translateService.instant('label.new.game'),
            handler: () => {
              this.newGame();
            },
          },
          {
            text: this._translateService.instant('label.share'),
            handler: () => {},
          },
        ],
        backdropDismiss: false,
      });
    } else if (this.hasMovement) {
      this.generateRandomNumber();
      this.hasMovement = false;
      this.pointsRounded = 0;
      this.clearBloquedCells();
    }
  }

  private winGame(): boolean {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] !== null && this.board[row][col].value >= 2048)
          return true;
      }
    }
    return false;
  }

  private loseGame(): boolean {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === null) return false;
        else if (
          (this.board[row - 1] &&
            this.board[row - 1][col].value === this.board[row][col].value) ||
          (this.board[row][col + 1] &&
            this.board[row][col + 1].value === this.board[row][col].value) ||
          (this.board[row + 1] &&
            this.board[row + 1][col].value === this.board[row][col].value) ||
          (this.board[row - 1] &&
            this.board[row][col - 1].value === this.board[row][col].value)
        )
          return false;
      }
    }

    return true;
  }

  private newGame(): void {
    this.board = Array.from({ length: 4 }, () => new Array(4).fill(null));
    this.cols = Array(4)
      .fill(0)
      .map((_, index: number) => index);
    this.rows = Array(4)
      .fill(0)
      .map((_, index: number) => index);
    this.points = 0;
  }
}
