import { Component, OnInit } from '@angular/core';
import { Device, GetLanguageCodeResult } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly _platform: Platform,
    private readonly _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadLanguage();
  }

  private loadLanguage(): void {
    this._platform.ready().then(async () => {
      const lang: GetLanguageCodeResult = await Device.getLanguageCode();
      if (lang.value) this._translateService.use(lang.value.slice(0, 2));
    });
  }
}
