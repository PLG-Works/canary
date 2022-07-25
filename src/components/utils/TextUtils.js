export function getFormattedStat(count) {
  if (count < Math.pow(10, 3)) {
    return `${count}`;
  }
  if (count < Math.pow(10, 6)) {
    var newValue = Math.round(count / 100) / 10;
    return `${newValue}k`;
  }
  if (count < Math.pow(10, 9)) {
    var newValue = Math.round(count / Math.pow(10, 5)) / 10;
    return `${newValue}m`;
  }
  var newValue = Math.round(count / Math.pow(10, 8)) / 10;
  return `${newValue}b`;
}