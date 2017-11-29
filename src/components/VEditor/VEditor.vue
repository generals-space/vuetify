<template>
  <div
    class="b3log-editor"
    :class="{'b3log-editor--fullscreen': isFullScreen}"
    :style="`height: ${height || 'auto'}px`">
    <div class="b3log-editor__toolbar">
      <span
        :aria-label="convertHotKey(label.emoji)"
        class="pipe-tooltipped pipe-tooltipped--ne"
        @click="$refs.b3logEmojiPanel.style.display = 'block'"><v-icon>emoji</v-icon></span>
      <span
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne"
        @click="insert('**', '**')"><v-icon>bold</v-icon></span>
      <span
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne"
        @click="insert('*', '*')"><v-icon>italic</v-icon></span>
      <span
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne"
        @click="insert('> ', '')"><v-icon>quote</v-icon></span>
      <span
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne"
        @click="insert('[', '](http://)')"><v-icon>link</v-icon></span>
      <span
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne">
        <label>
          <v-icon>upload</v-icon>
          <input multiple="multiple" @change="selectFile" type="file"/>
        </label>
      </span>
      <span
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne"
        @click="insert('* ', '')"><v-icon>unordered-list</v-icon></span>
      <span
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne"
        @click="insert('1. ', '')"><v-icon>ordered-list</v-icon></span>
      <span
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne"
        @click="hasPreview = !hasPreview"
        :class="{'b3log-editor__icon--current' : hasPreview}"><v-icon>view</v-icon></span>
      <span
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne"
        @click="isFullScreen = !isFullScreen"><v-icon>{{ isFullScreen ? 'contract' : 'fullscreen' }}</v-icon></span>
      <a
        :aria-label="label.bold"
        class="pipe-tooltipped pipe-tooltipped--ne"
        target="_blank"
        href="https://hacpai.com/guide/markdown">
        <v-icon>question</v-icon>
      </a>
      <div class="b3log-editor__emoji" ref="b3logEmojiPanel">
        <div>
          <span v-for="item in emoji" @click="insert(`${item} `, '', true);">{{item}}</span>
        </div>
        <div class="b3log-editor__emoji-tip">
          <a href="https://www.webpagefx.com/tools/emoji-cheat-sheet/" target="_blank">EMOJI CHEAT SHEET</a>
        </div>
      </div>
    </div>
    <div class="b3log-editor__content">
      <div class="b3log-editor__textarea">
        <textarea
          :placeholder="placeholder || ''"
          @paste.prevent="pasteToMarkdown"
          @drop.prevent="dragFile"
          @scroll="syncScroll"
          ref="b3logEditor"
          @focus="$refs.b3logEmojiPanel.style.display = 'none'"
          :value="value"></textarea>
      </div>
      <div v-show="hasPreview" class="b3log-editor__markdown" ref="b3logView"></div>
    </div>
  </div>
</template>

<script>
  require('../../stylus/components/_editor.styl')
  import toMarkdown from 'to-markdown'
  import {insertTextAtCaret, ajaxUpload, genUploading, genUploaded} from './tool'

  export default {
    name: 'v-editor',
    props: {
      placeholder: {
        type: String,
        required: false
      },
      uploadURL: {
        type: String,
        required: false
      },
      label: {
        loading: undefined,
        over: undefined,
        error: undefined,
        emoji: undefined,
        bold: undefined,
        italic: undefined,
        quote: undefined,
        link: undefined,
        upload: undefined,
        unorderedList: undefined,
        orderedList: undefined,
        view: undefined,
        fullscreen: undefined,
        question: undefined
      },
      uploadMax: {
        type: Number,
        required: false
      },
      value: {
        type: String,
        required: true
      },
      height: {
        type: Number,
        required: false
      },
      fetchUpload: {
        type: Function,
        required: false
      }
    },
    data () {
      return {
        hasPreview: true,
        isFullScreen: false,
        timerId: undefined,
        emoji: ['😄', '😂', '😭', '😋', '🎉', '❤️', '👍', '👌', '🙏', '😱', '😈', '👊', '😍']
      }
    },
    methods: {
      convertHotKey (v) {
        if (v) {
          if (/Mac/.test(navigator.platform)) {
            return v.replace('ctrl', '⌘').replace('shift', '⇧')
          }
          return v
        }
        return ''
      },
      _debounceChange () {
        const debounce = 1000
        if (this.timerId !== undefined) {
          clearTimeout(this.timerId)
        }
        this.$set(this, 'timerId', undefined)
        this.$set(this, 'timerId', setTimeout(() => {
          this.$emit('change', this.$refs.b3logEditor.value, this.hasPreview ? this.$refs.b3logView : undefined)
        }, debounce))
      },
      selectFile (event) {
        insertTextAtCaret(this.$refs.b3logEditor,
          genUploading(event.target.files, this.uploadMax, this.label.loading, this.label.over), '')
        ajaxUpload(this.uploadURL, event.target.files, (response) => {
          this.$refs.b3logEditor.value = genUploaded(response.data, this.$refs.b3logEditor.value,
            this.label.loading, this.label.error)
          this._debounceChange()
        }, this.uploadMax)
      },
      dragFile (event) {
        const files = event.dataTransfer.files
        if (files.length === 0) {
          return
        }
        insertTextAtCaret(this.$refs.b3logEditor,
          genUploading(files, this.uploadMax, this.label.loading, this.label.over), '')
        ajaxUpload(this.uploadURL, files, (response) => {
          this.$refs.b3logEditor.value = genUploaded(response.data, this.$refs.b3logEditor.value,
            this.label.loading, this.label.error)
          this._debounceChange()
        }, this.uploadMax)
      },
      pasteToMarkdown (event) {
        if (event.clipboardData.getData('text/html').replace(/(^\s*)|(\s*)$/g, '') !== '') {
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
            }, {
              filter: ['img'],
              replacement: (content, target) => {
                if (1 === target.attributes.length) {
                  return '';
                }

                this.fetchUpload && this.fetchUpload(target.src, (originalURL, url) => {
                  event.target.value = event.target.value.replace(originalURL, url)
                })

                return `![${target.alt}](${target.src})`;
              }
            }],
            gfm: true
          })
          if (hasCode) {
            insertTextAtCaret(event.target, event.clipboardData.getData('text/plain'), '', true)
            this._debounceChange()
          } else {
            const div = document.createElement('div')
            div.innerHTML = markdownStr
            markdownStr = div.innerText.replace(/\n{2,}/g, '\n\n').replace(/(^\s*)|(\s*)$/g, '', true)
            insertTextAtCaret(event.target, markdownStr, '')
            this._debounceChange()
          }
        } else if (event.clipboardData.getData('text/plain').replace(/(^\s*)|(\s*)$/g, '') !== '' &&
          event.clipboardData.files.length === 0) {
          insertTextAtCaret(event.target, event.clipboardData.getData('text/plain'), '', true)
          this._debounceChange()
        } else if (event.clipboardData.files.length > 0) {
          // upload file
          if (this.uploadURL) {
            insertTextAtCaret(this.$refs.b3logEditor,
              genUploading(event.clipboardData.files, this.uploadMax, this.label.loading, this.label.over), '', true)
            ajaxUpload(this.uploadURL, event.clipboardData.files, (response) => {
              event.target.value = genUploaded(response.data, event.target.value,
                this.label.loading, this.label.error)
              this._debounceChange()
            }, this.uploadMax)
          }
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
          this.$refs.b3logView.scrollTop = (textScrollTop + textHeight) *
            this.$refs.b3logView.scrollHeight / textScrollHeight - textHeight
        } else {
          this.$refs.b3logView.scrollTop = textScrollTop *
            this.$refs.b3logView.scrollHeight / textScrollHeight
        }
      },
      insert (prefix, suffix, hasReplaced) {
        insertTextAtCaret(this.$refs.b3logEditor, prefix, suffix, hasReplaced)
        this._debounceChange()
      }
    }
  }
</script>
