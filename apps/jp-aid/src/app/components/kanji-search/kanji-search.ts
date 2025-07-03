import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'kl-kanji-search',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './kanji-search.html',
  styleUrl: './kanji-search.scss'
})
export class KanjiSearch {
  searchText: string = '';
}
