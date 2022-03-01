export function getSupportedMimeTypes(media) {
  const audioTypes = ["webm", "ogg", "mp3", "x-matroska"];
  const codecs = [
    "vp9",
    "vp9.0",
    "vp8",
    "vp8.0",
    "avc1",
    "av1",
    "h265",
    "h.265",
    "h264",
    "h.264",
    "opus",
    "pcm",
    "aac",
    "mpeg",
    "mp4a",
  ];

  const isSupported = MediaRecorder.isTypeSupported;
  const supported = [];

  audioTypes.forEach(type => {
    const mimeType = `${media}/${type}`;
    codecs.forEach(codec =>
      [
        `${mimeType};codecs=${codec}`,
        `${mimeType};codecs:${codec}`,
        `${mimeType};codecs=${codec.toUpperCase()}`,
        `${mimeType};codecs:${codec.toUpperCase()}`,
      ].forEach(variation => {
        if (isSupported(variation)) supported.push(variation);
      })
    );
    if (isSupported(mimeType)) supported.push(mimeType);
  });
  return supported;
}

export function blobToArrayBuffer(blob) {
  return new Promise(resolve => {
    const reader = new FileReader(blob);
    reader.readAsArrayBuffer(blob);
    reader.onloadstart = function () {
      console.log("reading blob");
    };
    reader.onloadend = function () {
      console.log("converted blob to arraybuffer", reader.result);
      resolve(reader.result);
    };
  });
}

export function downloadFile(recorderChunks) {
  var blob = new Blob(recorderChunks, { type: "audio/webm;codecs=opus" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}
