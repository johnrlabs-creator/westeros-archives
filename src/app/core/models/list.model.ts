
export interface BaseItem {
  url: string;
  name: string;
}

export interface House extends BaseItem {
  region: string;
  coatOfArms: string;
  words: string;
  titles: string[];
  seats: string[];
  currentLord: string;
  heir: string;
  overlord: string;
  founded: string;
  founder: string;
  diedOut: string;
  ancestralWeapons: string[];
  cadetBranches: string[];
  swornMembers: string[];
  founderName?: string;
  swornMemberNames?: string[];
  swornMembersTruncated?: boolean;
}

export interface Book extends BaseItem {
  isbn: string;
  authors: string[];
  numberOfPages: number;
  publisher: string;
  country: string;
  mediaType: string;
  released: string;
  characters: string[];
  povCharacters: string[];
  charactersTruncated?: boolean;
  povCharactersTruncated?: boolean;
}

export interface Character extends BaseItem {
  gender: string;
  culture: string;
  born: string;
  died: string;
  titles: string[];
  aliases: string[];
  father: string;
  mother: string;
  spouse: string;
  allegiances: string[];
  books: string[];
  povBooks: string[];
  tvSeries: string[];
  playedBy: string[];
  allegiancesTruncated?: boolean;
  booksTruncated?: boolean;
}

export type FavoriteType = 'houses' | 'books' | 'characters';

export type Types = {
  house: House;
  book: Book;
  character: Character;
}