import {Injectable, signal} from '@angular/core';
import {ExampleWord, GraphEdge, GraphNode, Kanji, KanjiNode, NodeType, PrimitiveNode, RadicalNode} from '@jp-aid/shared-interfaces';
import {
  exampleWordFixture,
  graphEdgeFixture,
  kanjiFixture,
  kanjiNodeFixture,
  primitiveNodeFixture,
  radicalNodeFixture
} from '@jp-aid/shared-interfaces/testing';

const NODE_COLORS = {
  [NodeType.Kanji]: '#FF5733',    // Orange-Red
  [NodeType.Radical]: '#33FF57',  // Green
  [NodeType.Primitive]: '#3357FF' // Blue
};

const EDGE_COLORS = {
  'has radical': '#888888', // Grey
  'has primitive': '#AAAAAA', // Light Grey
  'related': '#CCCCCC'    // Very Light Grey
};

@Injectable({
  providedIn: 'root'
})
export class MockData {
  private searchResults = signal<Kanji[]>([]);
  private currentKanjiIndex = signal<number>(-1);

  getKanji = (): Kanji[] => [
    kanjiFixture('語', ['word', 'language'], ['ゴ'], ['かた(る)'], 14),
    kanjiFixture('日', ['day', 'sun'], ['ニチ', 'ジツ'], ['ひ', 'か'], 4),
    kanjiFixture('本', ['book', 'origin'], ['ホン'], ['もと'], 5),
    kanjiFixture('人', ['person'], ['ジン', 'ニン'], ['ひと'], 2),
    kanjiFixture('気', ['spirit', 'mind'], ['キ', 'ケ'], [], 6),
    kanjiFixture('水', ['water'], ['スイ'], ['みず'], 4),
    kanjiFixture('火', ['fire'], ['カ'], ['ひ'], 4),
    kanjiFixture('木', ['tree', 'wood'], ['モク', 'ボク'], ['き'], 4),
    kanjiFixture('金', ['gold', 'money'], ['キン', 'コン'], ['かね'], 8),
    kanjiFixture('土', ['earth', 'soil'], ['ド', 'ト'], ['つち'], 3)
  ];

  getGraphData = (kanjiId: string): {nodes: GraphNode[]; edges: GraphEdge[]} => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    const kanji = this.getKanji().find(k => k.id === kanjiId);
    if (!kanji) {
      return {nodes, edges};
    }

    const kanjiNode: KanjiNode = kanjiNodeFixture(
      kanji.id,
      kanji.id,
      0,
      0,
      20,
      NODE_COLORS[NodeType.Kanji],
      NodeType.Kanji,
      kanji.meaning.join(', '),
      kanji.onReadings,
      kanji.kunReadings,
      kanji.strokeCount
    );
    nodes.push(kanjiNode);

    // Mock radicals
    const radical1: RadicalNode = radicalNodeFixture('言', '言', -1, 1, 10, NODE_COLORS[NodeType.Radical], NodeType.Radical, 7, ['speech']);
    nodes.push(radical1);
    edges.push(graphEdgeFixture(kanji.id, radical1.id, 2, EDGE_COLORS['has radical'], 'has radical'));

    // Mock primitives
    const primitive1: PrimitiveNode = primitiveNodeFixture('五', '五', 1, 1, 10, NODE_COLORS[NodeType.Primitive], NodeType.Primitive, 'five');
    nodes.push(primitive1);
    edges.push(graphEdgeFixture(kanji.id, primitive1.id, 2, EDGE_COLORS['has primitive'], 'has primitive'));

    const primitive2: PrimitiveNode = primitiveNodeFixture('口', '口', 1, -1, 10, NODE_COLORS[NodeType.Primitive], NodeType.Primitive, 'mouth');
    nodes.push(primitive2);
    edges.push(graphEdgeFixture(kanji.id, primitive2.id, 2, EDGE_COLORS['has primitive'], 'has primitive'));

    // Mock related Kanji
    const relatedKanji1 = this.getKanji().find(k => k.id === '日');
    if (relatedKanji1) {
      const relatedKanjiNode1: KanjiNode = kanjiNodeFixture(
        relatedKanji1.id,
        relatedKanji1.id,
        -2,
        0,
        15,
        NODE_COLORS[NodeType.Kanji],
        NodeType.Kanji,
        relatedKanji1.meaning.join(', '),
        relatedKanji1.onReadings,
        relatedKanji1.kunReadings,
        relatedKanji1.strokeCount
      );
      nodes.push(relatedKanjiNode1);
      edges.push(graphEdgeFixture(kanji.id, relatedKanjiNode1.id, 2, EDGE_COLORS['related'], 'related'));
    }

    return {nodes, edges};
  };

  /**
   * Get example words for a specific kanji character
   * @param kanjiId The kanji character to get examples for
   * @returns Array of example words containing the kanji
   */
  getExampleWords = (kanjiId: string): ExampleWord[] => {
    const exampleWordsMap: Record<string, ExampleWord[]> = {
      語: [
        exampleWordFixture('日本語', 'にほんご', 'Japanese language'),
        exampleWordFixture('英語', 'えいご', 'English language'),
        exampleWordFixture('物語', 'ものがたり', 'story')
      ],
      日: [
        exampleWordFixture('今日', 'きょう', 'today'),
        exampleWordFixture('日本', 'にっぽん', 'Japan'),
        exampleWordFixture('毎日', 'まいにち', 'every day')
      ],
      本: [
        exampleWordFixture('日本', 'にっぽん', 'Japan'),
        exampleWordFixture('本当', 'ほんとう', 'really'),
        exampleWordFixture('教科書', 'きょうかしょ', 'textbook')
      ],
      水: [
        exampleWordFixture('水曜日', 'すいようび', 'Wednesday'),
        exampleWordFixture('飲み物', 'のみもの', 'beverage'),
        exampleWordFixture('水道', 'すいどう', 'water supply')
      ]
    };

    return exampleWordsMap[kanjiId] || [];
  };

  /**
   * Set search results for navigation context
   * @param results Array of kanji that were found in the search
   * @param currentKanjiId The currently selected kanji ID
   */
  setSearchResults = (results: Kanji[], currentKanjiId: string): void => {
    this.searchResults.set(results);
    const index = results.findIndex(kanji => kanji.id === currentKanjiId);
    this.currentKanjiIndex.set(index);
  };

  /**
   * Get current search results
   * @returns Array of kanji from current search
   */
  getSearchResults = (): Kanji[] => this.searchResults();

  /**
   * Get current kanji index in search results
   * @returns Index of current kanji in search results, or -1 if not found
   */
  getCurrentKanjiIndex = (): number => this.currentKanjiIndex();

  /**
   * Get previous kanji in search results
   * @returns Previous kanji or null if at beginning or no search context
   */
  getPreviousKanji = (): Kanji | null => {
    const results = this.searchResults();
    const currentIndex = this.currentKanjiIndex();

    if (results.length === 0 || currentIndex <= 0) {
      return null;
    }

    return results[currentIndex - 1];
  };

  /**
   * Get next kanji in search results
   * @returns Next kanji or null if at end or no search context
   */
  getNextKanji = (): Kanji | null => {
    const results = this.searchResults();
    const currentIndex = this.currentKanjiIndex();

    if (results.length === 0 || currentIndex >= results.length - 1 || currentIndex === -1) {
      return null;
    }

    return results[currentIndex + 1];
  };

  /**
   * Check if there is a previous kanji available
   * @returns True if previous kanji exists
   */
  hasPreviousKanji = (): boolean => this.currentKanjiIndex() > 0;

  /**
   * Check if there is a next kanji available
   * @returns True if next kanji exists
   */
  hasNextKanji = (): boolean => {
    const results = this.searchResults();
    const currentIndex = this.currentKanjiIndex();
    return currentIndex >= 0 && currentIndex < results.length - 1;
  };

  /**
   * Update current kanji index when navigating
   * @param kanjiId The new current kanji ID
   */
  updateCurrentKanji = (kanjiId: string): void => {
    const results = this.searchResults();
    const index = results.findIndex(kanji => kanji.id === kanjiId);
    this.currentKanjiIndex.set(index);
  };
}
