export type BreadcrumbType = 'kanji' | 'feature';

export interface BreadcrumbItem {
  label: string;
  type: BreadcrumbType;
  navigate?: () => void;
}