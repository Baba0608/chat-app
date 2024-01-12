const mediaFileVideoOverlay = document.getElementById(
  "media-file-video-overlay"
);

async function sendFile(mediaFile) {
  const file = mediaFile.files[0];

  mediaFile.value = "";
  const config = {
    headers: {
      authorization: token,
    },
  };
  try {
    let formData = new FormData();
    formData.append("my-file", file);

    const { data } = await axios.post(`file/upload`, formData, config);
    return data.result;
  } catch (err) {
    console.log(err);
  }
}

messagesDiv.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("media-file-image")) {
    const imageOverlay = document.getElementById("image-overlay");
    imageOverlay.src = e.target.src;
    document.getElementById("media-file-image-overlay").style.display = "block";
  } else if (e.target.classList.contains("media-file-video")) {
    const videoOverlay = document.getElementById("video-overlay");
    videoOverlay.src = e.target.src;
    document.getElementById("media-file-video-overlay").style.display = "block";
  }
});

mediaFileImageOverlay.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("media-file-image-overlay-inside")) {
    mediaFileImageOverlay.style.display = "none";
  }
});

mediaFileVideoOverlay.addEventListener("click", (e) => {
  e.preventDefault();

  console.log(e.target.classList);
  if (
    e.target.classList.contains("media-file-video-overlay-inside") ||
    e.target.classList.contains("media-file-video-container")
  ) {
    mediaFileVideoOverlay.style.display = "none";
  }
});
