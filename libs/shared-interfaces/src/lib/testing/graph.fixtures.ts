import {GraphEdge, GraphNode, KanjiNode, PrimitiveNode, RadicalNode} from '../graph';

export const graphNodeFixture = (
  id: GraphNode['id'],
  label: GraphNode['label'],
  x: GraphNode['x'],
  y: GraphNode['y'],
  size: GraphNode['size'],
  color: GraphNode['color'],
  type: GraphNode['type']
): GraphNode => ({id, label, x, y, size, color, type});

export const graphEdgeFixture = (
  source: GraphEdge['source'],
  target: GraphEdge['target'],
  size: GraphEdge['size'],
  color: GraphEdge['color'],
  label: GraphEdge['label']
): GraphEdge => ({source, target, size, color, label});

export const kanjiNodeFixture = (
  id: KanjiNode['id'],
  label: KanjiNode['label'],
  x: KanjiNode['x'],
  y: KanjiNode['y'],
  size: KanjiNode['size'],
  color: KanjiNode['color'],
  type: KanjiNode['type'],
  meaning: KanjiNode['meaning'],
  onReadings: KanjiNode['onReadings'],
  kunReadings: KanjiNode['kunReadings'],
  strokeCount: KanjiNode['strokeCount']
): KanjiNode => ({id, label, x, y, size, color, type, meaning, onReadings, kunReadings, strokeCount});

export const radicalNodeFixture = (
  id: RadicalNode['id'],
  label: RadicalNode['label'],
  x: RadicalNode['x'],
  y: RadicalNode['y'],
  size: RadicalNode['size'],
  color: RadicalNode['color'],
  type: RadicalNode['type'],
  strokeCount: RadicalNode['strokeCount'],
  meaning: RadicalNode['meaning']
): RadicalNode => ({id, label, x, y, size, color, type, strokeCount, meaning});

export const primitiveNodeFixture = (
  id: PrimitiveNode['id'],
  label: PrimitiveNode['label'],
  x: PrimitiveNode['x'],
  y: PrimitiveNode['y'],
  size: PrimitiveNode['size'],
  color: PrimitiveNode['color'],
  type: PrimitiveNode['type'],
  meaning: PrimitiveNode['meaning']
): PrimitiveNode => ({id, label, x, y, size, color, type, meaning});
