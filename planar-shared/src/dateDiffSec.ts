export const dateDiffSec = (lhs: Date, rhs: Date): string => {
  const sec = (lhs.getTime() - rhs.getTime()) / 1000;
  return `${sec} s`;
};
