export interface RFileDto {
  /** id for Nedb */
  _id?: string;
  /** file path */
  path: string;
  /** file title */
  title?: string;

  /** extension type */
  type?: string;
  /** extension type metadata */
  metadata?: any;

  /** extension property */
  prop?: any;
};