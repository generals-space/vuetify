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

export const ajaxUpload = (url, files, cb, uploadMax = 5) => {
  const formData = new FormData()
  for (let iMax = files.length, i = 0; i < iMax; i++) {
    if (files[i].size <= 1024 * 1024 * uploadMax) {
      formData.append('file[]', files[i])
    }
  }
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      cb(JSON.parse(xhr.responseText))
    }
  }
  xhr.send(formData)
}

export const genUploading = (files, uploadMax = 5, loadingLabel = 'Uploading', overLabel = 'Over') => {
  let uploadingStr = ''
  for (let iMax = files.length, i = 0; i < iMax; i++) {
    const tag = files[i].type.indexOf('image') === -1 ? '' : '!'
    if (files[i].size > 1024 * 1024 * uploadMax) {
      uploadingStr += `\n${tag}[${files[i].name}](${overLabel} ${uploadMax}MB)\n`
    } else {
      uploadingStr += `\n${tag}[${files[i].name}](${loadingLabel})\n`
    }
  }
  return uploadingStr
}

export const genUploaded = (response, text, loadingLabel = 'Uploading', errorLabel = 'Error') => {
  response.errFiles.forEach((data) => {
    text = text.replace(`[${data}](${loadingLabel})\n`,
      `[${data}](${errorLabel})\n`)
  })

  Object.keys(response.succMap).forEach((key) => {
    text = text.replace(`[${key}](${loadingLabel})\n`,
      `[${key}](${response.succMap[key]})\n`)
  })
  return text
}
