import { expect } from 'chai';
import { extend, externalOffsetMap } from './extendedMap.js';

const simpleRecord = {
  1: 'one',
  2: 'two',
  4: 'four',
} as const;

const simpleMap = new Map<number, string[]>([
  [1, ['hello']],
  [2, ['world']],
  [4, ['foo', 'bar']],
]);

describe('extend()', () => {
  describe('basic functionality', () => {
    it('should match type definition', () => {
      const extended = extend(simpleRecord);

      expect(extended).to.have.property('parse');
      expect(extended.parse).to.be.a('function');
      expect(extended).to.have.property('parseFlags');
      expect(extended.parseFlags).to.be.a('function');
    });

    it('should preserve original record properties', () => {
      const extended = extend(simpleRecord);

      expect(extended[1]).to.equal('one');
      expect(extended[2]).to.equal('two');
      expect(extended[4]).to.equal('four');
    });
  });

  describe('parse()', () => {
    it('should return correct value for existing key', () => {
      const extended = extend(simpleRecord);

      expect(extended.parse(1)).to.equal('one');
      expect(extended.parse(2)).to.equal('two');
      expect(extended.parse(4)).to.equal('four');
    });

    it('should throw for non-existent key', () => {
      const extended = extend(simpleRecord);

      expect(() => extended.parse(-1)).to.throw();
      expect(() => extended.parse(0)).to.throw();
      expect(() => extended.parse(3)).to.throw();
      expect(() => extended.parse(8)).to.throw();
    });

    it('should work when 0 is a valid key', () => {
      const r = { 0: 'zero', ...simpleRecord };
      const extended = extend(r);

      expect(extended.parse(0)).to.equal('zero');
    });
  });

  describe('parseFlags()', () => {
    it('should return empty array for value 0', () => {
      const extended = extend(simpleRecord);

      expect(extended.parseFlags(0)).to.deep.equal([]);
    });

    it('should return single flag for exact match', () => {
      const extended = extend(simpleRecord);

      expect(extended.parseFlags(1)).to.deep.equal(['one']);
      expect(extended.parseFlags(2)).to.deep.equal(['two']);
      expect(extended.parseFlags(4)).to.deep.equal(['four']);
    });

    it('should return multiple flags for combined value', () => {
      const extended = extend(simpleRecord);

      expect(extended.parseFlags(1 | 2)).to.deep.equal(['one', 'two']);
      expect(extended.parseFlags(1 | 4)).to.deep.equal(['one', 'four']);
      expect(extended.parseFlags(2 | 4)).to.deep.equal(['two', 'four']);
      expect(extended.parseFlags(1 | 2 | 4)).to.deep.equal(['one', 'two', 'four']);
    });

    it('should ignore bits not present in input', () => {
      const extended = extend(simpleRecord);

      expect(extended.parseFlags(1 | 8)).to.deep.equal(['one']);
    });

    it('should return empty array for value with only unregistered bits', () => {
      const extended = extend(simpleRecord);

      expect(extended.parseFlags(8)).to.deep.equal([]);
      expect(extended.parseFlags(16)).to.deep.equal([]);
      expect(extended.parseFlags(256)).to.deep.equal([]);
    });

    it('should handle high bit values', () => {
      const r = { 1024: 'high', 1: 'low' };
      const ext = extend(r);

      expect(ext.parseFlags(1024)).to.deep.equal(['high']);
      expect(ext.parseFlags(1025)).to.deep.equal(['low', 'high']);
      expect(ext.parseFlags(1)).to.deep.equal(['low']);
    });

    it('should handle all 32 bits', () => {
      const r: Record<number, string> = {};
      for (let i = 0; i < 32; i++) r[Math.abs(1 << i)] = `bit${i}`;
      const ext = extend(r);

      const allFlags = ext.parseFlags(0xFFFFFFFF >>> 0);
      expect(allFlags).to.have.lengthOf(32);
      for (let i = 0; i < allFlags.length; i++) expect(allFlags[i]).to.equal(`bit${i}`);
    });

    it('should return flags in ascending bit order', () => {
      const extended = extend(simpleRecord);

      expect(extended.parseFlags(4 | 1)).to.deep.equal(['one', 'four']);
    });
  });

  describe('negative and edge values in parseFlags', () => {
    it('should handle negative values', () => {
      const extended = extend(simpleRecord);

      const result = extended.parseFlags(-1); // -1 === 0xffffffff
      expect(result).to.deep.equal(['one', 'two', 'four']);
    });

    it('should handle large unsigned values', () => {
      const r = { 0x80000000: 'sign' };
      const ext = extend(r);
      expect(ext.parseFlags(0x80000000)).to.deep.equal(['sign']);
    });
  });

  describe('immutability of original record', () => {
    it('should not mutate original record', () => {
      const original = { 1: 'a', 2: 'b' };
      const originalCopy = { ...original };
      extend(original);
      expect(original).to.deep.equal(originalCopy);
    });
  });
});

// describe('externalOffsetMap', () => {
//   describe('parseExternal()', () => {
//     it('should return first element if key exists', () => {
//       expect(externalOffsetMap.parseExternal(1, simpleMap)).to.equal('hello');
//       expect(externalOffsetMap.parseExternal(2, simpleMap)).to.equal('world');
//     });

//     it('should return first element for key with multiple values', () => {
//       expect(externalOffsetMap.parseExternal(4, simpleMap)).to.equal('foo');
//     });

//     it('should return "n/a" if key does not exist', () => {
//       expect(externalOffsetMap.parseExternal(0, simpleMap)).to.equal('n/a');
//       expect(externalOffsetMap.parseExternal(8, simpleMap)).to.equal('n/a');
//       expect(externalOffsetMap.parseExternal(999, simpleMap)).to.equal('n/a');
//     });

//     it('should return "n/a" for empty map', () => {
//       const emptyMap = new Map<number, string[]>();
//       expect(externalOffsetMap.parseExternal(1, emptyMap)).to.equal('n/a');
//     });
//   });

//   describe('parseFlagsExternal()', () => {
//     it('should return values for single matching bit', () => {
//       expect(externalOffsetMap.parseFlagsExternal(1, simpleMap)).to.deep.equal(['hello']);
//       expect(externalOffsetMap.parseFlagsExternal(2, simpleMap)).to.deep.equal(['world']);
//     });

//     it('should return flattened values for multiple matching bits', () => {
//       expect(externalOffsetMap.parseFlagsExternal(1 | 2, simpleMap)).to.deep.equal(['hello', 'world']);
//       expect(externalOffsetMap.parseFlagsExternal(1 | 4, simpleMap)).to.deep.equal(['hello', 'foo', 'bar']);
//       expect(externalOffsetMap.parseFlagsExternal(1 | 2 | 4, simpleMap)).to.deep.equal(['hello', 'world', 'foo', 'bar']);
//     });

//     it('should ignore bits not present in map', () => {
//       // 1 | 8 = 9, 8 not in map
//       expect(externalOffsetMap.parseFlagsExternal(9, simpleMap)).to.deep.equal(['hello']);
//     });

//     it('should return empty array for value with only unregistered bits', () => {
//       expect(externalOffsetMap.parseFlagsExternal(8, simpleMap)).to.deep.equal([]);
//       expect(externalOffsetMap.parseFlagsExternal(256, simpleMap)).to.deep.equal([]);
//     });

//     it('should handle key with multiple values correctly in combination', () => {
//       // 4 has two values ['foo', 'bar']
//       expect(externalOffsetMap.parseFlagsExternal(4, simpleMap)).to.deep.equal(['foo', 'bar']);
//     });

//     it('should preserve order of bits and values', () => {
//       const result = externalOffsetMap.parseFlagsExternal(7, simpleMap);
//       expect(result).to.deep.equal(['hello', 'world', 'foo', 'bar']);
//     });

//     it('should work with empty map', () => {
//       const emptyMap = new Map<number, string[]>();
//       expect(externalOffsetMap.parseFlagsExternal(7, emptyMap)).to.deep.equal([]);
//     });

//     it('should handle all 32 bits', () => {
//       const bigMap = new Map<number, string[]>();
//       for (let i = 0; i < 32; i++) {
//         bigMap.set(1 << i, [`bit${i}`]);
//       }
//       const allFlags = externalOffsetMap.parseFlagsExternal(0xFFFFFFFF >>> 0, bigMap);
//       expect(allFlags).to.have.lengthOf(32);
//     });
//   });

//   describe('immutability', () => {
//     it('should not mutate passed map', () => {
//       const map = new Map<number, string[]>([[1, ['test']]]);
//       const mapCopy = new Map(map);
//       externalOffsetMap.parseExternal(1, map);
//       externalOffsetMap.parseFlagsExternal(1, map);
//       expect(map).to.deep.equal(mapCopy);
//     });
//   });
// });
