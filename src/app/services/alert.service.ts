import { Injectable } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';

interface CustomAlert {
  backdropDismiss: boolean;
  buttons: AlertButton[];
  header: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private readonly _alertController: AlertController) {}

  async alertCustomButtons({
    header,
    message,
    buttons,
    backdropDismiss,
  }: CustomAlert) {
    const alert = await this._alertController.create({
      message,
      buttons,
      backdropDismiss,
      header,
    });

    await alert.present();
  }
}
