<template>
  <div
    class="editor"
    :class="{'editor--fullscreen': isFullScreen}"
    :style="`height: ${height || 'auto'}px`">
    <div class="editor__toolbar">
      <span @click="insert('**', '**')"><v-icon>bold</v-icon></span>
      <span @click="insert('*', '*')"><v-icon>italic</v-icon></span>
      <span @click="insert('> ', '')"><v-icon>quote</v-icon></span>
      <span @click="insert('[', '](http://)')"><v-icon>link</v-icon></span>
      <span>
        <form method="POST" enctype="multipart/form-data" action="/blogs/Vanessa/upload">
          <label>
            <v-icon>upload</v-icon>
            <input type="file"/>
          </label>
        </form>
      </span>
      <span @click="insert('* ', '')"><v-icon>unordered-list</v-icon></span>
      <span @click="insert('1. ', '')"><v-icon>ordered-list</v-icon></span>
      <span
        @click="hasPreview = !hasPreview"
        :class="{'editor__icon--current' : hasPreview}"><v-icon>view</v-icon></span>
      <span @click="isFullScreen = !isFullScreen"><v-icon>{{ isFullScreen ? 'contract' : 'fullscreen' }}</v-icon></span>
      <a target="_blank" href="https://hacpai.com/guide/markdown">
        <v-icon>question</v-icon>
      </a>
    </div>
    <div class="editor__content">
      <div class="editor__textarea">
        <textarea
          @paste.prevent="pasteToMarkdown"
          @drop.prevent="dragFile"
          @scroll="syncScroll"
          @input="parseMarkdown($event.target.value)"
          ref="pipeEditor"
          :value="value"></textarea>
      </div>
      <div v-show="hasPreview" class="editor__markdown" ref="pipeView"></div>
    </div>
  </div>
</template>

<script>
  require('../../stylus/components/_editor.styl')
  import toMarkdown from 'to-markdown'
  import { insertTextAtCaret, ajaxUpload } from './tool'

  export default {
    name: 'v-editor',
    props: {
      uploadURL: {
        type: String,
        required: false
      },
      value: {
        type: String,
        required: true
      },
      height: {
        type: Number,
        required: false
      }
    },
    data () {
      return {
        hasPreview: true,
        isFullScreen: false,
        debounceTimeout: undefined
      }
    },
    methods: {
      dragFile (event) {
        const files = event.dataTransfer.files
        if (files.length === 0) {
          return
        }
        insertTextAtCaret(this.$refs.pipeEditor, '![](Uploading...)', '')
        ajaxUpload(this.uploadURL, files, (response, msg) => {
          if (msg === 0) {
            this.$refs.pipeEditor.value = this.$refs.pipeEditor.value.replace('![](Uploading...)', `\n![](${response.data}) \n`)
          } else {
            this.$emit('error', msg)
          }
        })
      },
      pasteToMarkdown (event) {
        if (event.clipboardData.files.length > 0) {
          // upload file
          if (!this.uploadURL) {
            return
          }

          insertTextAtCaret(this.$refs.pipeEditor, '![](Uploading...)', '')
          ajaxUpload(this.uploadURL, event.clipboardData.files, (response, msg) => {
            if (msg === 0) {
              this.$refs.pipeEditor.value = this.$refs.pipeEditor.value.replace('![](Uploading...)', `\n![](${response.data}) \n`)
            } else {
              this.$emit('error', msg)
            }
          })
          return
        }

        if (event.clipboardData.getData('text/html').replace(/(^\s*)|(\s*)$/g, '') === '') {
          return
        }

        let hasCode = false
        let markdownStr = toMarkdown(event.clipboardData.getData('text/html'), {
          converters: [{
            filter: ['pre', 'code'],
            replacement: function (content) {
              if (content.split('\n').length > 1) {
                hasCode = true
              }
              return '`' + content + '`'
            }
          }],
          gfm: true
        })
        if (hasCode) {
          event.target.value = event.clipboardData.getData('text/plain')
        } else {
          const div = document.createElement('div')
          div.innerHTML = markdownStr
          markdownStr = div.innerText.replace(/\n{2,}/g, '\n\n').replace(/(^\s*)|(\s*)$/g, '')
          event.target.value = markdownStr
        }
      },
      syncScroll (event) {
        if (!this.hasPreview) {
          return
        }
        const textScrollTop = event.target.scrollTop
        const textHeight = event.target.clientHeight
        const textScrollHeight = event.target.scrollHeight
        if ((textScrollTop / textHeight > 0.5)) {
          this.$refs.pipeView.scrollTop = (textScrollTop + textHeight) *
            this.$refs.pipeView.scrollHeight / textScrollHeight - textHeight
        } else {
          this.$refs.pipeView.scrollTop = textScrollTop *
            this.$refs.pipeView.scrollHeight / textScrollHeight
        }
      },
      insert (prefix, suffix) {
        insertTextAtCaret(this.$refs.pipeEditor, prefix, suffix)
      },
      parseMarkdown (text) {
        const debounce = 1000
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout)
        }
        this.debounceTimeout = setTimeout(() => {
          this.$emit('input', text)
        }, debounce)
      }
    }
  }
</script>
