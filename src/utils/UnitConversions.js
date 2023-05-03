const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const milliseconds = date.getTime();

  const elapsedMilliseconds = Date.now() - milliseconds;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

  if (elapsedSeconds < 60) {
    const pluralOrNot = elapsedSeconds > 1 ? ' seconds' : ' second';
    return elapsedSeconds + pluralOrNot;
  }
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    const pluralOrNot = elapsedMinutes > 1 ? ' minutes' : ' minute';
    return elapsedMinutes + pluralOrNot;
  }
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    const pluralOrNot = elapsedHours > 1 ? ' hours' : ' hour';
    return elapsedHours + pluralOrNot;
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

const calculateTokenCost = (completionTokens, promptTokens) => {
  const completionTokenPrice = 0.06 / 1000;
  const promptTokenPrice = 0.03 / 1000;

  const completionTokenCost = completionTokens * completionTokenPrice;
  const promptTokenCost = promptTokens * promptTokenPrice;

  const totalCost = completionTokenCost + promptTokenCost;
  return totalCost.toFixed(4);
};

export {formatTime, formatSize, calculateTokenCost};
