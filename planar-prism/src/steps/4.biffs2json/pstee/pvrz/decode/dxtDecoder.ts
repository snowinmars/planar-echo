import type { RawPvrPixelFormat } from '../parsePvrzs.types.js';
import type { RawPvr } from '../pvr/parsePvr.types.js';
import type { RawPvrRectangle, RawPvrRgbaImage } from './dxtDecoder.types.js';

/**
 * Whole algorithms here are neurogenerated.
 * Docs are dead, NearInfinity and GemRb saved the flow, so...thanks.
 */

// const copyRectArgb = (
//   src: Uint32Array,
//   srcWidth: number,
//   srcX: number,
//   srcY: number,
//   width: number,
//   height: number,
// ): Uint32Array => {
//   const dst = new Uint32Array(width * height);
//   for (let y = 0; y < height; y++) {
//     const srcRow = (srcY + y) * srcWidth + srcX;
//     const dstRow = y * width;
//     for (let x = 0; x < width; x++) {
//       dst[dstRow + x] = src[srcRow + x]!;
//     }
//   }
//   return dst;
// };

const argbToRgbaBuffer = (argb: Uint32Array, width: number, height: number): Buffer => {
  const data = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const c = argb[i]! >>> 0;
    const o = i * 4;
    data[o] = (c >>> 16) & 0xff;
    data[o + 1] = (c >>> 8) & 0xff;
    data[o + 2] = c & 0xff;
    data[o + 3] = (c >>> 24) & 0xff;
  }

  return data;
};

type AlignRectangleProps = Readonly<{
  rectangle: RawPvrRectangle;
  alignX: number;
  alignY: number;
}>;
const alignRectangle = ({
  rectangle,
  alignX,
  alignY,
}: AlignRectangleProps): RawPvrRectangle => {
  let {
    x,
    y,
    width,
    height,
  } = rectangle;

  let diffX = x % alignX;
  if (diffX !== 0) {
    x = x - diffX;
    width = width + diffX;
  }
  let diffY = y % alignY;
  if (diffY !== 0) {
    y = y - diffY;
    height = height + diffY;
  }

  diffX = (alignX - (width % alignX)) % alignX;
  width = width + diffX;

  diffY = (alignY - (height % alignY)) % alignY;
  height = height + diffY;

  return {
    x,
    y,
    width,
    height,
  };
};

const unpackColors565 = (inData: number, outData: number[]): void => {
  outData[0] = ((inData << 3) & 0xf8) | ((inData >>> 2) & 0x07);
  outData[1] = ((inData >>> 3) & 0xfc) | ((inData >>> 9) & 0x03);
  outData[2] = ((inData >>> 8) & 0xf8) | ((inData >>> 13) & 0x07);
  outData[3] = 255;
  outData[4] = ((inData >>> 13) & 0xf8) | ((inData >>> 18) & 0x07);
  outData[5] = ((inData >>> 19) & 0xfc) | ((inData >>> 25) & 0x03);
  outData[6] = ((inData >>> 24) & 0xf8) | ((inData >>> 29) & 0x07);
  outData[7] = 255;
};

type DecodeDxt1Props = Readonly<{
  data: Buffer;
  texWidth: number;
  rectangle: RawPvrRectangle;
  imgWidth: number;
}>;
const decodeDxt1 = ({
  data,
  texWidth,
  rectangle,
  imgWidth,
}: DecodeDxt1Props): Uint32Array => {
  const aligned = new Uint32Array(rectangle.width * rectangle.height);
  const wordSize = 8;
  const wordImageWidth = texWidth >>> 2;
  const wordRectWidth = rectangle.width >>> 2;
  const wordRectHeight = rectangle.height >>> 2;
  const wordPosX = rectangle.x >>> 2;
  const wordPosY = rectangle.y >>> 2;

  const colors = [0, 0, 0, 0, 0, 0, 0, 0];
  let pvrOfs = (wordPosY * wordImageWidth + wordPosX) * wordSize;
  let imgOfs = 0;

  for (let y = 0; y < wordRectHeight; y++) {
    for (let x = 0; x < wordRectWidth; x++) {
      const c = data.readUInt32LE(pvrOfs);
      unpackColors565(c, colors);
      let code = data.readUInt32LE(pvrOfs + 4);

      for (let idx = 0; idx < 16; idx++) {
        const ofs = imgOfs + ((idx >>> 2) * imgWidth) + (idx & 3);
        const sel = code & 3;
        if (sel === 0) {
          aligned[ofs] = (0xff000000 | (colors[2]! << 16) | (colors[1]! << 8) | colors[0]!) >>> 0;
        }
        else if (sel === 1) {
          aligned[ofs] = (0xff000000 | (colors[6]! << 16) | (colors[5]! << 8) | colors[4]!) >>> 0;
        }
        else if (sel === 2) {
          if ((c & 0xffff) > ((c >>> 16) & 0xffff)) {
            let v = 0xff000000;
            v |= ((((colors[2]! << 1) + colors[6]!) / 3) | 0) << 16;
            v |= ((((colors[1]! << 1) + colors[5]!) / 3) | 0) << 8;
            v |= (((colors[0]! << 1) + colors[4]!) / 3) | 0;
            aligned[ofs] = v >>> 0;
          }
          else {
            let v = 0xff000000;
            v |= ((colors[2]! + colors[6]!) >>> 1) << 16;
            v |= ((colors[1]! + colors[5]!) >>> 1) << 8;
            v |= (colors[0]! + colors[4]!) >>> 1;
            aligned[ofs] = v >>> 0;
          }
        }
        else if ((c & 0xffff) > ((c >>> 16) & 0xffff)) {
          let v = 0xff000000;
          v |= (((colors[2]! + (colors[6]! << 1)) / 3) | 0) << 16;
          v |= (((colors[1]! + (colors[5]! << 1)) / 3) | 0) << 8;
          v |= ((colors[0]! + (colors[4]! << 1)) / 3) | 0;
          aligned[ofs] = v >>> 0;
        }
        else {
          aligned[ofs] = 0;
        }
        code = code >>> 2;
      }

      pvrOfs = pvrOfs + wordSize;
      imgOfs = imgOfs + 4;
    }
    pvrOfs = pvrOfs + (wordImageWidth - wordRectWidth) * wordSize;
    imgOfs = imgOfs + imgWidth * 4 - rectangle.width;
  }

  return aligned;
};

type DecodeDxt5Props = Readonly<{
  data: Buffer;
  texWidth: number;
  rectangle: RawPvrRectangle;
  imgWidth: number;
}>;
const decodeDxt5 = ({
  data,
  texWidth,
  rectangle,
  imgWidth,
}: DecodeDxt5Props): Uint32Array => {
  const aligned = new Uint32Array(rectangle.width * rectangle.height);
  const wordSize = 16;
  const wordImageWidth = texWidth >>> 2;
  const wordRectWidth = rectangle.width >>> 2;
  const wordRectHeight = rectangle.height >>> 2;
  const wordPosX = rectangle.x >>> 2;
  const wordPosY = rectangle.y >>> 2;

  const alpha = [0, 0, 0, 0, 0, 0, 0, 0];
  const colors = [0, 0, 0, 0, 0, 0, 0, 0];
  let pvrOfs = (wordPosY * wordImageWidth + wordPosX) * wordSize;
  let imgOfs = 0;

  for (let y = 0; y < wordRectHeight; y++) {
    for (let x = 0; x < wordRectWidth; x++) {
      alpha[0] = data[pvrOfs]! & 0xff;
      alpha[1] = data[pvrOfs + 1]! & 0xff;
      if (alpha[0] > alpha[1]) {
        alpha[2] = ((6 * alpha[0] + alpha[1]) / 7) | 0;
        alpha[3] = ((5 * alpha[0] + 2 * alpha[1]) / 7) | 0;
        alpha[4] = ((4 * alpha[0] + 3 * alpha[1]) / 7) | 0;
        alpha[5] = ((3 * alpha[0] + 4 * alpha[1]) / 7) | 0;
        alpha[6] = ((2 * alpha[0] + 5 * alpha[1]) / 7) | 0;
        alpha[7] = ((alpha[0] + 6 * alpha[1]) / 7) | 0;
      }
      else {
        alpha[2] = ((4 * alpha[0] + alpha[1]) / 5) | 0;
        alpha[3] = ((3 * alpha[0] + 2 * alpha[1]) / 5) | 0;
        alpha[4] = ((2 * alpha[0] + 3 * alpha[1]) / 5) | 0;
        alpha[5] = ((alpha[0] + 4 * alpha[1]) / 5) | 0;
        alpha[6] = 0;
        alpha[7] = 255;
      }

      // each 4x4 'pixel' takes 3 bits to alpha
      // so, 4x4x3 = 48 = 8x6 = 6 bytes
      let ctrl = data.readBigUInt64LE(pvrOfs + 2) & 0xffffffffffffn; // It should be 48 bits, so 6 bytes... or s.ulong() & 0xffffffffffffn;
      const c = data.readUInt32LE(pvrOfs + 8);
      unpackColors565(c, colors);
      let code = data.readUInt32LE(pvrOfs + 12);

      for (let idx = 0; idx < 16; idx++) {
        const ofs = imgOfs + ((idx >>> 2) * imgWidth) + (idx & 3);
        let color = alpha[Number(ctrl & 7n)]! << 24;
        const sel = code & 3;
        if (sel === 0) {
          color |= (colors[2]! << 16) | (colors[1]! << 8) | colors[0]!;
        }
        else if (sel === 1) {
          color |= (colors[6]! << 16) | (colors[5]! << 8) | colors[4]!;
        }
        else if (sel === 2) {
          color |= ((((colors[2]! << 1) + colors[6]!) / 3) | 0) << 16;
          color |= ((((colors[1]! << 1) + colors[5]!) / 3) | 0) << 8;
          color |= (((colors[0]! << 1) + colors[4]!) / 3) | 0;
        }
        else {
          color |= (((colors[2]! + (colors[6]! << 1)) / 3) | 0) << 16;
          color |= (((colors[1]! + (colors[5]! << 1)) / 3) | 0) << 8;
          let v = ((colors[0]! + (colors[4]! << 1)) / 3) | 0;
          if (v > 255) v = 255;
          color |= v;
        }
        aligned[ofs] = color >>> 0;
        code = code >>> 2;
        ctrl = ctrl >> 3n;
      }

      pvrOfs = pvrOfs + wordSize;
      imgOfs = imgOfs + 4;
    }
    pvrOfs = pvrOfs + (wordImageWidth - wordRectWidth) * wordSize;
    imgOfs = imgOfs + (imgWidth << 2) - rectangle.width;
  }

  return aligned;
};

type AlignDxtProps = Readonly<{
  pixelFormat: RawPvrPixelFormat;
  data: Buffer;
  imgWidth: number;
  rectangle: RawPvrRectangle;
  texWidth: number;
}>;
const alignDxt = ({
  pixelFormat,
  data,
  imgWidth,
  rectangle,
  texWidth,
}: AlignDxtProps) => {
  if (pixelFormat === 'dxt1') return decodeDxt1({
    data,
    imgWidth,
    rectangle,
    texWidth,
  });
  else if (pixelFormat === 'dxt5') return decodeDxt5({
    data,
    imgWidth,
    rectangle,
    texWidth,
  });
  else throw new Error(`Pixel format '${pixelFormat}' not supported`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
};

const decodeDxtToArgb = (pvr: RawPvr, pixelData: Buffer): Uint32Array => {
  const region: RawPvrRectangle = {
    x: 0,
    y: 0,
    width: pvr.width,
    height: pvr.height,
  };

  const rectangle = alignRectangle({
    rectangle: region,
    alignX: 4,
    alignY: 4,
  });

  const aligned = alignDxt({
    pixelFormat: pvr.pixelFormat,
    data: pixelData,
    imgWidth: rectangle.width,
    rectangle,
    texWidth: pvr.width,
  });

  if (rectangle.x === 0 && rectangle.y === 0 && rectangle.width === pvr.width && rectangle.height === pvr.height) {
    return aligned;
  }

  throw new Error(`Aligning algorithm broke dxt in '${pvr.resourceName}'`);
  // return copyRectArgb(aligned, rectangle.width, region.x - rectangle.x, region.y - rectangle.y, pvr.width, pvr.height);
};

const decodeParsedToArgb = (pvr: RawPvr, pixelData: Buffer): Uint32Array => {
  switch (pvr.pixelFormat) {
    case 'dxt1':
    case 'dxt5': return decodeDxtToArgb(pvr, pixelData);
    default: throw new Error(`Pixel format '${pvr.pixelFormat}' not supported`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
};

export const decodePvrToRgba = (pvr: RawPvr, pixelData: Buffer): RawPvrRgbaImage => {
  const argb = decodeParsedToArgb(pvr, pixelData);
  return {
    width: pvr.width,
    height: pvr.height,
    data: argbToRgbaBuffer(argb, pvr.width, pvr.height),
  };
};
