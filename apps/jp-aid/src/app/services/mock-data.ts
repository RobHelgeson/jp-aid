import { Injectable } from '@angular/core';
import { Kanji } from '@jp-aid/shared-interfaces';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockData {

  getKanji(): Kanji[] {
    return [
      { id: '語', meaning: ['word', 'language'], on_readings: ['go'], kun_readings: ['kata(ru)'], stroke_count: 14 },
      { id: '日', meaning: ['day', 'sun'], on_readings: ['nichi', 'jitsu'], kun_readings: ['hi', 'ka'], stroke_count: 4 },
      { id: '本', meaning: ['book', 'origin'], on_readings: ['hon'], kun_readings: ['moto'], stroke_count: 5 },
      { id: '人', meaning: ['person'], on_readings: ['jin', 'nin'], kun_readings: ['hito'], stroke_count: 2 },
      { id: '気', meaning: ['spirit', 'mind'], on_readings: ['ki', 'ke'], kun_readings: [], stroke_count: 6 },
    ];
  }
}
