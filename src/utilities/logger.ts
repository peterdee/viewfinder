export default function logger(...args: unknown[]): void {
  console.log(...args);
}

export function clientLog(...args: unknown[]): void {
  return logger('CLIENT:', args);
}

export function serverLog(...args: unknown[]): void {
  return logger('SERVER:', args);
}
