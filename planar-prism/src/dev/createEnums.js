// this function should run in browser to autogenerate flags from docs description
// use https://beautifytools.com/javascript-beautifier.php to beautify or minify

const createGenerator = () => {
  let output = [];
  let indentLevel = 0;

  const _indent = () => '  '.repeat(indentLevel);

  const _line = (str = '') => {
    output.push(_indent() + str);
    return api;
  };

  const _capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  const _normalizeChunks = (input) => {
    if (Array.isArray(input)) {
      return { 0: input };
    }
    return input;
  };

  const register = () => {
    output = [];
    indentLevel = 0;
    return api;
  };

  const plainEnum = (name, chunks) => {
    const normalizedChunks = _normalizeChunks(chunks);

    _line(`const ${name} = {`);
    indentLevel++;

    Object.entries(normalizedChunks).forEach(([startKey, values]) => {
      const start = parseInt(startKey);

      values.forEach((value, index) => {
        if (value) {
          if (value.includes('//')) {
            const [v, c] = value.split('//').map(x => x.trim());
            _line(`${start + index}: '${v}', // ${c}`);
          }
          else {
            _line(`${start + index}: '${value}',`);
          }
        }
        else {
          _line(`// ${start + index}: unused`);
        }
      });
    });

    indentLevel--;
    _line('} as const;');
    _line(`type ${_capitalize(name)} = typeof ${name}[keyof typeof ${name}];`);
    _line('');

    return api;
  };

  const flagEnum = (name, bytes) => {
    _line(`const ${name} = {`);
    indentLevel++;

    Object.entries(bytes).forEach(([byteName, flags]) => {
      if (flags === null) {
        _line('');
        _line(`// ${byteName}`);
        _line('// unused');
        return;
      }

      _line('');
      _line(`// ${byteName}`);

      const byteOffset = parseInt(byteName.replace('byte', '')) - 1;
      const baseShift = byteOffset * 8;

      flags.forEach((flag, index) => {
        const hexValue = Math.abs((1 << (baseShift + index))).toString(16);
        if (flag) _line(`0x${hexValue}: '${flag}',`);
        else _line(`// 0x${hexValue}: unused`);
      });

      if (flags.length < 8) {
        const amount = 8 - flags.length;
        for (let i = 0; i < amount; i++) {
          const hexValue = Math.abs((1 << (baseShift + i + flags.length))).toString(16);
          _line(`// 0x${hexValue}: unused`);
        }
      }
    });

    indentLevel--;
    _line('} as const;');
    _line(`type ${_capitalize(name)} = typeof ${name}[keyof typeof ${name}];`);

    return api;
  };

  const write = () => {
    console.log(output.join('\n'));
    return api;
  };

  const api = {
    register,
    enum: plainEnum,
    flags: flagEnum,
    write,
  };

  return api;
};
