export function meanBuyInterval(listItem) {

  if (!listItem || !listItem.history)
    throw 'Invalid item or no history';

  var buyTimes = listItem.history.slice(0, 20)
    .map(h => new Date(h.buyTime))
    .sort(function(a, b) { return b - a; });

  var meanDays = Math.floor(
    buyTimes
      .map(function(current, i, arr) {
        if (arr[i + 1])
          return (current - arr[i + 1]) / 1000 / 60 / 60 / 24;
      })
      .reduce(function(prev, cur) {
        if (cur)
          return prev + cur;
        return prev;
      }) / (buyTimes.length - 1));
      
  return meanDays;
}