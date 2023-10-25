import { Component, OnInit } from '@angular/core';

import { Cell } from '../interfaces/cell.interface';

@Component({
  selector: 'tfe-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  board: Cell[][] = Array.from({ length: 4 }, () => new Array(4).fill(null));
  cols: number[] = Array(4)
    .fill(0)
    .map((_, index: number) => index);
  rows: number[] = Array(4)
    .fill(0)
    .map((_, index: number) => index);

  ngOnInit(): void {}
}
