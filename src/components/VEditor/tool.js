/*
 * Copyright (C) 2012-2017,  b3log.org
 *
 */
/**
 * @fileOverview editor tool
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 1.1.0.0, Jan 3, 2018
 */

export const insertTextAtCaret = (textarea, prefix, suffix, replace) => {
  if (typeof textarea.selectionStart === 'number' && typeof textarea.selectionEnd === 'number') {
    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    const tmpStr = textarea.value
    textarea.focus()
    if (startPos === endPos) {
      // no selection
      document.execCommand('insertText', false, prefix + suffix)
    } else {
      if (replace) {
        document.execCommand('insertText', false, prefix + suffix)
      } else {
        if (tmpStr.substring(startPos - prefix.length, startPos) === prefix &&
          tmpStr.substring(endPos, endPos + suffix.length) === suffix) {
          // broke circle, avoid repeat
          document.execCommand('delete', false)
          for (let i = 0, iMax = prefix.length; i < iMax; i++) {
            document.execCommand('delete', false)
          }
          for (let j = 0, jMax = suffix.length; j < jMax; j++) {
            document.execCommand('forwardDelete', false)
          }
          document.execCommand('insertText', false, tmpStr.substring(startPos, endPos))
          textarea.selectionStart = startPos - prefix.length
          textarea.selectionEnd = endPos - prefix.length
        } else {
          // insert
          document.execCommand('insertText', false, prefix + tmpStr.substring(startPos, endPos) + suffix)
          textarea.selectionStart = startPos + prefix.length
          textarea.selectionEnd = endPos + prefix.length
        }
      }
    }
  }
}

export const ajaxUpload = (url, files, uploadMax = 5, succCB, errorCB) => {
  const formData = new FormData()
  for (let iMax = files.length, i = 0; i < iMax; i++) {
    if (files[i].size <= 1024 * 1024 * uploadMax) {
      formData.append('file[]', files[i])
    } else if (files.length === 1) {
      errorCB && errorCB()
      return
    }
  }
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        succCB(JSON.parse(xhr.responseText))
      } else {
        errorCB && errorCB(JSON.parse(xhr.responseText))
      }
    }
  }
  xhr.send(formData)
}

export const genUploading = (files, uploadMax = 5, loadingLabel = 'Uploading', overLabel = 'Over') => {
  let uploadingStr = ''
  for (let iMax = files.length, i = 0; i < iMax; i++) {
    const tag = files[i].type.indexOf('image') === -1 ? '' : '!'
    if (files[i].size > 1024 * 1024 * uploadMax) {
      uploadingStr += `\n${tag}[${files[i].name.replace(/\W/g, '')}](${overLabel} ${uploadMax}MB)\n`
    } else {
      uploadingStr += `\n${tag}[${files[i].name.replace(/\W/g, '')}](${loadingLabel})\n`
    }
  }
  return uploadingStr
}

export const genUploaded = (response, textarea, loadingLabel = 'Uploading', errorLabel = 'Error') => {
  textarea.focus()
  response.errFiles.forEach((data) => {
    replaceTextareaValue(textarea, `[${data.replace(/\W/g, '')}](${loadingLabel})\n`,
      `[${data.replace(/\W/g, '')}](${errorLabel})\n`)
  })

  Object.keys(response.succMap).forEach((key) => {
    replaceTextareaValue(textarea, `[${key.replace(/\W/g, '')}](${loadingLabel})\n`,
      `[${key.replace(/\W/g, '')}](${response.succMap[key]})\n`)
  })
}

export const replaceTextareaValue = (textarea, original, value) => {
  textarea.selectionStart = textarea.value.split(original)[0].length
  textarea.selectionEnd = textarea.selectionStart + original.length
  document.execCommand('delete', false)
  document.execCommand('insertText', false, value)
}
