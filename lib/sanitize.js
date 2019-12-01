// The original idea taken from https://github.com/stasm/innerself/blob/master/sanitize.js
// TODO: rewrite it without using textContent

const ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

export const sanitize = value => {
  const virtualDocument = new DOMParser().parseFromString('', 'text/html')
  const template = virtualDocument.createElement('template')
  template.innerHTML = value
  const text = template.content.textContent
  return text.replace(/[&<>"']/g, ch => ENTITIES[ch])
}
