/**
 * LiquidJS filter to pick specified fields from an object and return their
 * values as an array. Non-existent fields will be skipped
 *
 * @param {*} value An object to pick values from
 * @param {...any[]} args Field names to pick
 */
function pickFilter(value: any, ...args: any[]) {
  return args.reduce((acc, key) => {
    if (value[key]) {
      acc.push(value[key]);
    }

    return acc;
  }, []);
}

export { pickFilter };
