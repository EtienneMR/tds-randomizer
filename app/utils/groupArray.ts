// Utility type: extract a valid Record key from T[K]
type PropertyKeyOf<T, K extends keyof T> = T[K] & (string | number | symbol);

// Resulting grouped shape
type Grouped<T, K extends keyof T> = Record<PropertyKeyOf<T, K>, T[]>;

/**
 * Groups an array of objects by the value of a given key.
 *
 * @param arr - The array of objects to group.
 * @param key - The key to group by; its values must be string|number|symbol.
 * @returns A record whose keys are the distinct values of arr[i][key],
 *          and whose values are arrays of the original objects.
 */
export default function groupArray<
  T extends Record<K, string | number | symbol>,
  K extends keyof T
>(arr: T[], key: K): Grouped<T, K> {
  return arr.reduce((acc, item) => {
    const groupKey = item[key] as PropertyKeyOf<T, K>;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Grouped<T, K>);
}
