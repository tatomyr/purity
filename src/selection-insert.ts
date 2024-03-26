export const insertText =
  (element: HTMLTextAreaElement | HTMLInputElement) =>
  (text: string): void => {
    const {selectionStart, selectionEnd} = element
    if (selectionStart && selectionEnd) {
      element.setRangeText(text, selectionStart, selectionEnd, "end")
    }
  }
