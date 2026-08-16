// Password generation and strength utilities
export function generateSecurePassword(length = 16) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*';
  const all = upper + lower + digits + symbols;
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let pwd = '';
  pwd += upper[arr[0] % upper.length];
  pwd += lower[arr[1] % lower.length];
  pwd += digits[arr[2] % digits.length];
  pwd += symbols[arr[3] % symbols.length];
  for (let i = 4; i < length; i++) pwd += all[arr[i] % all.length];
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

export function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Very Weak', color: '#ef4444' },
    { score: 2, label: 'Weak',      color: '#f97316' },
    { score: 3, label: 'Fair',      color: '#eab308' },
    { score: 4, label: 'Strong',    color: '#22c55e' },
    { score: 5, label: 'Very Strong', color: '#10b981' },
  ];
  return levels[score] || levels[levels.length - 1];
}
