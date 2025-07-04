import {Routes} from '@angular/router';

import {ResultsPage} from './results-page/results-page';
import {SearchPage} from './search-page/search-page';

export const appRoutes: Routes = [
  {path: '', component: SearchPage, data: {animation: 'SearchPage'}},
  {path: 'search', component: ResultsPage, data: {animation: 'ResultsPage'}},
  {path: '**', redirectTo: ''}
];
