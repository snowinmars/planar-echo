/** Infinity Engine color key: pure green RGB(0, 255, 0). NearInfinity / GemRB MOS & TIS. */

export const GREEN_COLOR_KEY_R = 0x00;
export const GREEN_COLOR_KEY_G = 0xff;
export const GREEN_COLOR_KEY_B = 0x00;

export const isGreenColorKey = (r: number, g: number, b: number): boolean =>
  r === GREEN_COLOR_KEY_R && g === GREEN_COLOR_KEY_G && b === GREEN_COLOR_KEY_B;

/** BGRA entry: B@0 G@1 R@2 A@3 */
export const isGreenColorKeyBgra = (bgra: Buffer, offset: number): boolean =>
  isGreenColorKey(bgra[offset + 2]!, bgra[offset + 1]!, bgra[offset]!);
