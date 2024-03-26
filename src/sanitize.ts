export const sanitize = (input: string): string =>
  input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
