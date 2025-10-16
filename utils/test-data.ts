export function randomEmail(prefix: string = 'user'): string {
  const unique = Math.random().toString(36).slice(2, 10);
  return `${prefix}.${unique}@example.com`;
}

export function randomString(length: number = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}


