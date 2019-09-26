export type SharerProps = {
  roomId: string;
  shareUrl: string;
  shareTitle: string;
  shareText: string;
  shareMessage: string;
};

export type ShareModalProps = {
  roomId: string;
  shareMessage: string;
  shareUrl: string;
  isOpen: boolean;
  onClose: () => void;
};

export interface NavigatorWithPossibleWebShare extends Navigator {
  share?: (data?: ShareData) => Promise<void>;
}

type ShareData = {
  title?: string;
  text?: string;
  url?: string;
};
