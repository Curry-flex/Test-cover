import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class AppInfoService {

  CurrentYear;
  constructor(private titleService: Title) {
    this.CurrentYear = new Date();
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(
      `Zanzibar Social Security Fund - ZSSF | ${newTitle}`
    );
  }
  public getCopyRightText() {
    return `Copyright © ${this.CurrentYear.getFullYear()} ZSSF. All Rights Reserved.`;
  }
  public get title() {
    return 'ADMINISTRATION SYSTEM';
  }
}
