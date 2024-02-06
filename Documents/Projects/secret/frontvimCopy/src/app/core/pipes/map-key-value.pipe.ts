import { Pipe, PipeTransform } from '@angular/core';

// Holds a weak reference to its key (here a map), so if it is no longer referenced its value can be garbage collected.
const cache = new WeakMap<ReadonlyMap<any, any>, Array<{ key: any; value: any }>>();

@Pipe({ name: 'mapkeyvalue', pure: true })
export class MapKeyValuePipe implements PipeTransform {
  transform<K, V>(input: ReadonlyMap<K, V>): Iterable<{ key: K; value: V }> {
    const existing = cache.get(input);
    if (existing !== undefined) {
      return existing;
    }

    const iterable = Array.from(input, ([key, value]) => ({ key, value }));
    cache.set(input, iterable);
    return iterable;
  }
}
