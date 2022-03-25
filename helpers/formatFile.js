// **************** Formatting The Size Of The File **************** //
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const kbToByte = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const size = Math.floor(Math.log(bytes) / Math.log(kbToByte));
  return (
    parseFloat((bytes / Math.pow(kbToByte, size)).toFixed(2)) +
    ' ' +
    sizes[size]
  );
}

// **************** Compress The File Name **************** //
function getSmallFileName(filename) {
  if (filename.length > 25) {
    const length = filename.length;
    return `${filename.slice(0, 25)}...${filename.slice(length - 10, length)}`;
  }
  return filename;
}

module.exports = { formatBytes, getSmallFileName };
