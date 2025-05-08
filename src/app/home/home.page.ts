import { Component, OnDestroy, OnInit } from '@angular/core';
import { PhaserService } from '../phaser/phaser.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {

  constructor(private phaserService: PhaserService) {}

  ngOnInit() {
    this.phaserService.createGame();
  }

  ngOnDestroy() {
    this.phaserService.destroyGame();
  }
}
