export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  type: NodeType;
}

export interface GraphEdge {
  source: string;
  target: string;
  size: number;
  color: string;
  label: string;
  property?: PropertyType; // Add property type to edge
}

export enum NodeType {
  Kanji = 'kanji',
  Radical = 'radical',
  Primitive = 'primitive'
}

export enum PropertyType {
  Radical = 'radical',
  Primitive = 'primitive',
  OnYomi = 'on_yomi',
  KunYomi = 'kun_yomi'
}

export interface KanjiNode extends GraphNode {
  meaning: string;
  onReadings: string[];
  kunReadings: string[];
  strokeCount: number;
}

export interface RadicalNode extends GraphNode {
  strokeCount: number;
  meaning: string[];
}

export interface PrimitiveNode extends GraphNode {
  meaning: string;
}