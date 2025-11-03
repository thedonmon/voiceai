export function randomId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function generateElementId(): string {
  return `${randomId()}-${randomId()}`;
}
