const message = [
  'The Planar Echo runtime daemon is unavailable.',
  'Its legacy implementation was removed in Milestone 0 and the replacement',
  'protocol has not been implemented yet.',
].join(' ');

console.error(message);
process.exitCode = 1;
