import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const Phaser: any;

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: 'Phaser', useValue: Phaser }
  ]
})
export class PhaserModule { } 