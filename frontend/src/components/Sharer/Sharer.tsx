import React, { useState, Fragment } from 'react';
import ShareModal from './ShareModal';
import { SharerProps, NavigatorWithPossibleWebShare } from './types';

const Sharer = ({
  render,
  roomId,
  shareUrl,
  shareTitle,
  shareText,
  shareMessage,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const handleClick = event => {
    const navigatorWithPossibleWebShare = navigator as NavigatorWithPossibleWebShare;
    if (navigatorWithPossibleWebShare.share) {
      navigatorWithPossibleWebShare
        .share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error));
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <Fragment>
      {render(handleClick)}
      <ShareModal
        roomId={roomId}
        shareUrl={shareUrl}
        shareMessage={shareMessage}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </Fragment>
  );
};

export default Sharer;
