import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonIcon,
  IonToast,
} from '@ionic/react';
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
} from 'react-share';
import { copy as copyIcon } from 'ionicons/icons';
import QRCode from 'qrcode.react';
import copy from 'clipboard-copy';
import { ShareModalProps } from './types';

const ShareModal: React.FC<ShareModalProps> = ({
  roomId,
  shareMessage,
  shareUrl,
  isOpen,
  onClose,
}: ShareModalProps) => {
  const [showToast, setShowToast] = useState(false);

  const handleClick = event => {
    copy(shareUrl);
    setShowToast(true);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
          <IonTitle>Invite</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="item-background ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol class="ion-text-center">
              <h4>Copy this link</h4>
              <IonItem onClick={handleClick}>
                <IonInput value={shareUrl} readonly></IonInput>
                <IonButton slot="end" size="default">
                  <IonIcon icon={copyIcon} />
                </IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12" sizeSm="6" class="ion-text-center ion-padding">
              <h4>Scan QR code</h4>
              <QRCode value={shareUrl} size={192} includeMargin={true} />
            </IonCol>
            <IonCol size="12" sizeSm="6" class="ion-text-center">
              <IonGrid>
                <IonRow>
                  <IonCol size="12" class="ion-text-center">
                    <h4>Share on social media</h4>
                    <IonGrid>
                      <IonRow>
                        <IonCol class="ion-text-center">
                          <WhatsappShareButton
                            url={shareUrl}
                            title={shareMessage}
                          >
                            <WhatsappIcon size={48} round={true} />
                          </WhatsappShareButton>
                        </IonCol>
                        <IonCol class="ion-text-center">
                          <TelegramShareButton
                            url={shareUrl}
                            title={shareMessage}
                          >
                            <TelegramIcon size={48} round={true} />
                          </TelegramShareButton>
                        </IonCol>
                        <IonCol class="ion-text-center">
                          <FacebookShareButton
                            url={shareUrl}
                            quote={shareMessage}
                          >
                            <FacebookIcon size={48} round={true} />
                          </FacebookShareButton>
                        </IonCol>
                        <IonCol class="ion-text-center">
                          <TwitterShareButton
                            url={shareUrl}
                            title={shareMessage}
                          >
                            <TwitterIcon size={48} round={true} />
                          </TwitterShareButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="12" class="ion-text-center">
                    <h4>Enter room ID</h4>
                    <h1 className="display-5">{roomId}</h1>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Link copied to clipboard!"
        duration={1000}
      />
    </IonModal>
  );
};

export default ShareModal;
