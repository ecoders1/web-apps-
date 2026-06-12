// Emails that have admin access
export const ADMIN_EMAILS = ["iyasu4313@gmail.com"];

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
