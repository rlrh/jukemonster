import { Track } from '../../hooks/useRoomState/types';

export type AddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSearchResultClick: (track: Track) => void;
};

export type SearchResultsProps = {
  query: string;
  onSearchResultClick: (track: Track) => void;
};
