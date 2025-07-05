import {Routes} from '@angular/router';

import {KanjiDetail} from './kanji-detail/kanji-detail';
import {ResultsPage} from './results-page/results-page';
import {SearchPage} from './search-page/search-page';

export const appRoutes: Routes = [
  {path: '', component: SearchPage, data: {animation: 'SearchPage'}},
  {path: 'search', component: ResultsPage, data: {animation: 'ResultsPage'}},
  {path: 'kanji/:id', component: KanjiDetail, data: {animation: 'KanjiDetail'}},
  {path: '**', redirectTo: ''}
];
