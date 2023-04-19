const formatTime = (mediaInfo) => {
  const timestamp = mediaInfo;
  const date = new Date(timestamp);
  const milliseconds = date.getTime();

  const elapsedMilliseconds = Date.now() - milliseconds;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

  if (elapsedSeconds < 60) {
    return elapsedSeconds + 's';
  }
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return elapsedMinutes + 'm';
  }
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return elapsedHours + 'h';
  }
  const options = {day: 'numeric', month: 'short'};
  return date.toLocaleDateString('en-US', options);
};

const formatSize = (sizeInBytes) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + ' B';
  }
  const sizeInKiloBytes = sizeInBytes / 1024;
  if (sizeInKiloBytes < 1024) {
    return sizeInKiloBytes.toFixed(2) + ' KB';
  }
  const sizeInMegaBytes = sizeInKiloBytes / 1024;
  return sizeInMegaBytes.toFixed(2) + ' MB';
};

export {formatTime, formatSize};
