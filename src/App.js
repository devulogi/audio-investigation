import React from "react";
import { getSupportedMimeTypes, blobToArrayBuffer } from "./helpers";

function App() {
  const [mediaRecord, setMediaRecord] = React.useState(null);
  const [source, setSource] = React.useState(null);

  const constraint = { audio: true };
  const options = {
    mimeType: "audio/webm; codecs:mp4a",
  };
  let chunks = [];

  React.useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported.");
      navigator.mediaDevices.getUserMedia(constraint).then(onSuccess, onError);
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }, []);

  const onSuccess = function (stream) {
    let mediaRecorder = new MediaRecorder(stream, options);

    const supportedAudios = getSupportedMimeTypes("audio");
    console.log("-- All supported Audios : ", supportedAudios);

    mediaRecorder.onstop = function (e) {
      console.log("data available after MediaRecorder.stop() called.", e);

      const blob = new Blob(chunks, { type: options.mimeType });
      chunks = [];

      console.log("blob mimeType: ", blob.type);
      blobToArrayBuffer(blob).then(response => {
        console.log("response: ", response);
      });

      const audioURL = window.URL.createObjectURL(blob);
      setSource(audioURL);
    };

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
    setMediaRecord(mediaRecorder);
  };

  const onError = function (err) {
    console.log("The following error occured: " + err);
  };

  const onRecordButtonClick = () => {
    if (mediaRecord.state === "inactive") {
      mediaRecord.start();
      console.info("recorder started");
      console.log("media recorder state: ", mediaRecord.state);
    }
  };

  const onStopButtonClick = () => {
    if (mediaRecord.state === "recording") {
      mediaRecord.stop();
      console.info("recorder stopped");
      console.log("media recorder state: ", mediaRecord.state);
      console.log("mediaRecorder mimeType: ", mediaRecord.mimeType);
    } else {
      console.warn("You should hit Record before stopping.");
    }
  };

  return (
    <div>
      <div className='buttons'>
        <button onClick={onRecordButtonClick}>Record</button>
        <button onClick={onStopButtonClick}>Stop</button>
      </div>
      <div className='audio'>
        {source && <audio src={source} controls></audio>}
      </div>
    </div>
  );
}

export default App;
