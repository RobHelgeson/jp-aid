import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() search_text: string = '';
  @Output() search_textChange = new EventEmitter<string>();

  onSearchTextChange(text: string): void {
    this.search_text = text;
    this.search_textChange.emit(this.search_text);
  }
}
