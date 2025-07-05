import {Kanji} from '../kanji';

export const kanjiFixture = (
  id: Kanji['id'],
  meaning: Kanji['meaning'],
  onReadings: Kanji['onReadings'],
  kunReadings: Kanji['kunReadings'],
  strokeCount: Kanji['strokeCount']
): Kanji => ({
  id,
  meaning,
  onReadings,
  kunReadings,
  strokeCount
});
