export const withoutExtension = (resourceName: string): string => {
  const parts = resourceName.split('.');
  const tooManyDots = parts.length !== 2;
  const dotAtStartOrEnd = !parts[0] || !parts[1];
  if (tooManyDots || dotAtStartOrEnd) throw new Error(`Wrong resource name '${resourceName}'`);
  return parts[0]!;
};
