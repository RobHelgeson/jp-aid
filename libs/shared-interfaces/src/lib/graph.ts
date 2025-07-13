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
}

export enum NodeType {
  Kanji = 'kanji',
  Radical = 'radical',
  Primitive = 'primitive',
  Feature = 'feature'
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

export enum PropertyType {
  ON_YOMI = "on'yomi",
  KUN_YOMI = "kun'yomi",
  RADICAL = 'radical',
  PRIMITIVE = 'primitive'
}

export enum BreadcrumbNodeType {
  KANJI = 'kanji',
  FEATURE = 'feature'
}

export interface BreadcrumbItem {
  label: string;
  type: BreadcrumbNodeType;
  property?: PropertyType;
  nodeId: string;
}

export interface NavigationState {
  nodeId: string;
  property: PropertyType;
}
