/**
 * LiquidJS filter to filter out repeating array elements
 *
 * @param {Array<*>} value Array
 */
function uniqueFilter(value: any[]) {
  return [...new Set(value)];
}

export { uniqueFilter };
