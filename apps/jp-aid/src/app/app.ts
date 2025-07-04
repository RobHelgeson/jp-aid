import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

import {KanjiResults} from './kanji-results/kanji-results';
import {KanjiSearch} from './kanji-search/kanji-search';

@Component({
  standalone: true,
  imports: [RouterModule, KanjiSearch, KanjiResults],
  selector: 'kl-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'jp-aid';
  searchText: string = '';
}
