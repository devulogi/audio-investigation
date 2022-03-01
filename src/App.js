import React from "react";
import { getSupportedMimeTypes, blobToArrayBuffer } from "./helpers";

function App() {
  const [mediaRecord, setMediaRecord] = React.useState(null);
  const [source, setSource] = React.useState(null);
  const ref = React.useRef();

  const options = {
    tag: "audio",
    type: "audio/webm",
    codecs: "codecs:AAC",
    gUM: { audio: true },
  };
  let chunks = [];

  React.useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported.");
      navigator.mediaDevices.getUserMedia(options.gUM).then(onSuccess, onError);
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }, []);

  const onSuccess = function (stream) {
    let mediaRecorder = new MediaRecorder(stream, {
      mimeType: `${options.type};${options.codecs}`,
    });

    const supportedAudios = getSupportedMimeTypes(options.tag);
    console.log("-- All supported Audios : ", supportedAudios);

    mediaRecorder.onstop = function () {
      console.log("data available after MediaRecorder.stop() called.");

      const blob = new Blob(chunks, {
        type: "audio/wav; codecs:AAC",
      });
      chunks = [];

      console.log("blob mimeType: ", blob.type);
      console.log("blob: -> ", blob);

      blobToArrayBuffer(blob).then(response => {
        console.log("response: ", response);
      });

      const url = window.URL.createObjectURL(blob);
      setSource(url);
      if (ref.current) {
        ref.current.onloadedmetadata = function () {
          console.log("Metadata loaded complete.");
          console.log(ref);
          if (ref.current.duration === Infinity) {
            ref.current.currentTime = 1e101;
            ref.current.ontimeupdate = function () {
              this.ontimeupdate = () => {
                return;
              };
              ref.current.currentTime = 0;
            };
          }
        };
      }
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
      console.warn("recorder started");
    }
  };

  const onStopButtonClick = () => {
    if (mediaRecord.state === "recording") {
      mediaRecord.stop();
      console.warn("recorder stopped");
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
        {source && <button onClick={() => setSource(null)}>Delete</button>}
      </div>
      <div className='audio'>
        {source && <audio ref={ref} src={source} controls></audio>}
        <br />
        {source && (
          <a href={source} download='audio.wav'>
            Download
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
