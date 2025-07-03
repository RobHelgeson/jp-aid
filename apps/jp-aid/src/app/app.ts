import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

import {KanjiSearch} from './components/kanji-search/kanji-search';

@Component({
  standalone: true,
  imports: [RouterModule, KanjiSearch],
  selector: 'kl-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'jp-aid';
}
