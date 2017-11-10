export const insertTextAtCaret = (textarea, prefix, suffix) => {
  textarea.focus()
  if (typeof textarea.selectionStart === 'number' && typeof textarea.selectionEnd === 'number') {
    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    const tmpStr = textarea.value
    if (startPos === endPos) {
      // no selection
      textarea.value = tmpStr.substring(0, startPos) + prefix + suffix + tmpStr.substring(endPos, tmpStr.length)
      textarea.selectionStart = startPos + prefix.length
      textarea.selectionEnd = startPos + (prefix.length)
    } else {
      if (tmpStr.substring(startPos - prefix.length, startPos) === prefix &&
        tmpStr.substring(endPos, endPos + suffix.length) === suffix) {
        // broke circle, avoid repeat
        textarea.value = tmpStr.substring(0, startPos - prefix.length) +
          tmpStr.substring(startPos, endPos) + tmpStr.substring(endPos + suffix.length, tmpStr.length)
        textarea.selectionStart = startPos - prefix.length
        textarea.selectionEnd = endPos - prefix.length
      } else {
        // insert
        textarea.value = tmpStr.substring(0, startPos) + prefix + tmpStr.substring(startPos, endPos) +
          suffix + tmpStr.substring(endPos, tmpStr.length)
        textarea.selectionStart = startPos + prefix.length
        textarea.selectionEnd = startPos + (endPos - startPos + prefix.length)
      }
    }
  }
  textarea.focus()
}
