import { expect } from 'chai';
import createWriter from './writer.js';

describe('Writer', () => {
  describe('ctor', () => {
    it('should create empty instance', () => {
      const writer = createWriter();

      expect(writer).to.be.ok;
      expect(writer).to.have.property('write');
      expect(writer.write).to.be.a('function');
      expect(writer).to.have.property('br');
      expect(writer.br).to.be.a('function');
      expect(writer).to.have.property('writeLine');
      expect(writer.writeLine).to.be.a('function');
      expect(writer).to.have.property('done');
      expect(writer.done).to.be.a('function');
      expect(writer.done().length).equals(0);
    });
  });

  describe('write()', () => {
    it('should write nothing on no input', () => {
      const writer = createWriter();

      writer.write('');

      expect(writer.done().length).equals(0);
    });

    it('should write nothing with offset on no input with offset', () => {
      const offset = 2;
      const writer = createWriter();

      writer.write('', offset);

      expect(writer.done().length).equals(offset);
    });

    it('should write spaces on spaces input', () => {
      const spaces = ' \n';
      const writer = createWriter();

      writer.write(spaces);

      expect(writer.done().length).equals(spaces.length);
    });

    it('should write spaces with offset on spaces input with offset', () => {
      const offset = 2;
      const spaces = ' \n';
      const writer = createWriter();

      writer.write(spaces, offset);

      expect(writer.done().length).equals(spaces.length + offset);
    });

    it('should write chars on chars input', () => {
      const char = '¯\_(ツ)_/¯';
      const writer = createWriter();

      writer.write(char);

      expect(writer.done().length).equals(char.length);
    });

    it('should write chars with offset on chars input with offset', () => {
      const offset = 2;
      const char = '¯\_(ツ)_/¯';
      const writer = createWriter();

      writer.write(char, offset);

      expect(writer.done().length).equals(char.length + offset);
    });
  });

  describe('writeLine()', () => {
    it('should write new line on no input', () => {
      const writer = createWriter();

      writer.writeLine('');

      expect(writer.done().length).equals(1);
    });

    it('should write new line with offset on no input with offset', () => {
      const offset = 2;
      const writer = createWriter();

      writer.writeLine('', offset);

      expect(writer.done().length).equals(1 + offset);
    });

    it('should write spaces with new line on spaces input', () => {
      const spaces = ' \n';
      const writer = createWriter();

      writer.writeLine(spaces);

      expect(writer.done().length).equals(1 + spaces.length);
    });

    it('should write spaces with new line and offset on spaces input with offset', () => {
      const offset = 2;
      const spaces = ' \n';
      const writer = createWriter();

      writer.writeLine(spaces, offset);

      expect(writer.done().length).equals(1 + spaces.length + offset);
    });

    it('should write chars with new line on chars input', () => {
      const char = '¯\_(ツ)_/¯';
      const writer = createWriter();

      writer.writeLine(char);

      expect(writer.done().length).equals(1 + char.length);
    });

    it('should write chars with new line and offset on chars input with offset', () => {
      const offset = 2;
      const char = '¯\_(ツ)_/¯';
      const writer = createWriter();

      writer.writeLine(char, offset);

      expect(writer.done().length).equals(1 + char.length + offset);
    });
  });

  describe('br()', () => {
    it('should write new line', () => {
      const writer = createWriter();

      writer.br();
      writer.br();

      expect(writer.done().length).equals(2);
    });
  });

  describe('done()', () => {
    it('should not cache result', () => {
      const writer = createWriter();

      writer.writeLine('¯\_(ツ)_/¯').done();

      expect(writer.done().length).equals(0);
    });
  });
});
