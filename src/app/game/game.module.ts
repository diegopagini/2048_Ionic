import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { GamePageRoutingModule } from './game-routing.module';
import { GamePage } from './game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GamePageRoutingModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  declarations: [GamePage],
})
export class GamePageModule {}
