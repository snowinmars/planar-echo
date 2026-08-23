export const copyToArrayBuffer = (data: Uint8Array): ArrayBuffer => {
  const ab = new ArrayBuffer(data.byteLength);
  new Uint8Array(ab).set(data);
  return ab;
};

export const bufferForTransfer = (data: Uint8Array): { buf: Buffer; transfer: ArrayBuffer } => {
  const transfer = copyToArrayBuffer(data);
  return {
    buf: Buffer.from(transfer),
    transfer,
  };
};
