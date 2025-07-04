import {Injectable} from '@angular/core';
import {Kanji} from '@jp-aid/shared-interfaces';

@Injectable({
  providedIn: 'root'
})
export class MockData {
  getKanji(): Kanji[] {
    return [
      {id: '語', meaning: ['word', 'language'], on_readings: ['go'], kun_readings: ['kata(ru)'], stroke_count: 14},
      {id: '日', meaning: ['day', 'sun'], on_readings: ['nichi', 'jitsu'], kun_readings: ['hi', 'ka'], stroke_count: 4},
      {id: '本', meaning: ['book', 'origin'], on_readings: ['hon'], kun_readings: ['moto'], stroke_count: 5},
      {id: '人', meaning: ['person'], on_readings: ['jin', 'nin'], kun_readings: ['hito'], stroke_count: 2},
      {id: '気', meaning: ['spirit', 'mind'], on_readings: ['ki', 'ke'], kun_readings: [], stroke_count: 6},
      {id: '水', meaning: ['water'], on_readings: ['sui'], kun_readings: ['mizu'], stroke_count: 4},
      {id: '火', meaning: ['fire'], on_readings: ['ka'], kun_readings: ['hi'], stroke_count: 4},
      {id: '木', meaning: ['tree', 'wood'], on_readings: ['moku', 'boku'], kun_readings: ['ki'], stroke_count: 4},
      {id: '金', meaning: ['gold', 'money'], on_readings: ['kin', 'kon'], kun_readings: ['kane'], stroke_count: 8},
      {id: '土', meaning: ['earth', 'soil'], on_readings: ['do', 'to'], kun_readings: ['tsuchi'], stroke_count: 3},
      {id: '月', meaning: ['moon', 'month'], on_readings: ['getsu', 'gatsu'], kun_readings: ['tsuki'], stroke_count: 4},
      {id: '山', meaning: ['mountain'], on_readings: ['san'], kun_readings: ['yama'], stroke_count: 3},
      {id: '川', meaning: ['river'], on_readings: ['sen'], kun_readings: ['kawa'], stroke_count: 3},
      {id: '田', meaning: ['rice field'], on_readings: ['den'], kun_readings: ['ta'], stroke_count: 5},
      {id: '天', meaning: ['heaven', 'sky'], on_readings: ['ten'], kun_readings: ['ama'], stroke_count: 4},
      {id: '空', meaning: ['sky', 'empty'], on_readings: ['kuu'], kun_readings: ['sora'], stroke_count: 8},
      {id: '雨', meaning: ['rain'], on_readings: ['u'], kun_readings: ['ame'], stroke_count: 8},
      {id: '風', meaning: ['wind'], on_readings: ['fuu', 'fu'], kun_readings: ['kaze'], stroke_count: 9},
      {id: '花', meaning: ['flower'], on_readings: ['ka'], kun_readings: ['hana'], stroke_count: 7},
      {id: '草', meaning: ['grass'], on_readings: ['sou'], kun_readings: ['kusa'], stroke_count: 9},
      {id: '虫', meaning: ['insect'], on_readings: ['chuu'], kun_readings: ['mushi'], stroke_count: 6},
      {id: '犬', meaning: ['dog'], on_readings: ['ken'], kun_readings: ['inu'], stroke_count: 4},
      {id: '猫', meaning: ['cat'], on_readings: ['byou'], kun_readings: ['neko'], stroke_count: 11},
      {id: '鳥', meaning: ['bird'], on_readings: ['chou'], kun_readings: ['tori'], stroke_count: 11},
      {id: '魚', meaning: ['fish'], on_readings: ['gyo'], kun_readings: ['sakana'], stroke_count: 11},
      {id: '牛', meaning: ['cow'], on_readings: ['gyuu'], kun_readings: ['ushi'], stroke_count: 4},
      {id: '馬', meaning: ['horse'], on_readings: ['ba'], kun_readings: ['uma'], stroke_count: 10},
      {id: '羊', meaning: ['sheep'], on_readings: ['you'], kun_readings: ['hitsuji'], stroke_count: 6},
      {id: '豚', meaning: ['pig'], on_readings: ['ton'], kun_readings: ['buta'], stroke_count: 11},
      {id: '鹿', meaning: ['deer'], on_readings: ['roku'], kun_readings: ['shika'], stroke_count: 11},
      {id: '象', meaning: ['elephant'], on_readings: ['zou'], kun_readings: [], stroke_count: 14},
      {id: '虎', meaning: ['tiger'], on_readings: ['ko'], kun_readings: ['tora'], stroke_count: 8},
      {id: '狼', meaning: ['wolf'], on_readings: ['rou'], kun_readings: ['ookami'], stroke_count: 10},
      {id: '熊', meaning: ['bear'], on_readings: ['yuu'], kun_readings: ['kuma'], stroke_count: 14},
      {id: '猿', meaning: ['monkey'], on_readings: ['en'], kun_readings: ['saru'], stroke_count: 13},
      {id: '龍', meaning: ['dragon'], on_readings: ['ryuu'], kun_readings: ['tatsu'], stroke_count: 16},
      {id: '亀', meaning: ['turtle'], on_readings: ['ki'], kun_readings: ['kame'], stroke_count: 11},
      {id: '蛇', meaning: ['snake'], on_readings: ['ja'], kun_readings: ['hebi'], stroke_count: 11},
      {id: '蛙', meaning: ['frog'], on_readings: ['a'], kun_readings: ['kaeru'], stroke_count: 12},
      {id: '鯨', meaning: ['whale'], on_readings: ['gei'], kun_readings: ['kujira'], stroke_count: 19},
      {id: '鷹', meaning: ['hawk'], on_readings: ['you'], kun_readings: ['taka'], stroke_count: 24},
      {id: '鴨', meaning: ['duck'], on_readings: ['ou'], kun_readings: ['kamo'], stroke_count: 16},
      {id: '鶴', meaning: ['crane'], on_readings: ['kaku'], kun_readings: ['tsuru'], stroke_count: 21},
      {id: '鳩', meaning: ['pigeon'], on_readings: ['kyuu'], kun_readings: ['hato'], stroke_count: 13},
      {id: '鷲', meaning: ['eagle'], on_readings: ['shuu'], kun_readings: ['washi'], stroke_count: 23},
      {id: '鴉', meaning: ['crow'], on_readings: ['a'], kun_readings: ['karasu'], stroke_count: 15},
      {id: '鵬', meaning: ['mythical bird'], on_readings: ['hou'], kun_readings: [], stroke_count: 19},
      {id: '鵠', meaning: ['swan'], on_readings: ['koku'], kun_readings: ['hakuchou'], stroke_count: 19},
      {id: '鷗', meaning: ['seagull'], on_readings: ['ou'], kun_readings: ['kamome'], stroke_count: 22},
      {id: '鷹', meaning: ['falcon'], on_readings: ['you'], kun_readings: ['taka'], stroke_count: 24},
      {id: '鸚', meaning: ['parrot'], on_readings: ['ou'], kun_readings: [], stroke_count: 30},
      {id: '鸛', meaning: ['stork'], on_readings: ['kan'], kun_readings: ['kounotori'], stroke_count: 24},
      {id: '鸞', meaning: ['phoenix'], on_readings: ['ran'], kun_readings: [], stroke_count: 30}
    ];
  }
}
