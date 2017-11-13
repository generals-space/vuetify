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
      <span><v-icon>upload</v-icon></span>
      <span @click="insert('* ', '')"><v-icon>unordered-list</v-icon></span>
      <span @click="insert('1. ', '')"><v-icon>ordered-list</v-icon></span>
      <span
        @click="hasPreview = !hasPreview"
        :class="{'editor__icon--current' : hasPreview}"><v-icon>view</v-icon></span>
      <span @click="isFullScreen = !isFullScreen"><v-icon>{{ isFullScreen ? 'contract' : 'fullscreen' }}</v-icon></span>
      <a target="_blank" href="https://hacpai.com/guide/markdown"><v-icon>question</v-icon></a>
    </div>
    <div class="editor__content">
      <div class="editor__textarea">
        <textarea
          @paste.prevent="pasteToMarkdown"
          @scroll="syncScroll"
          @input="parseMarkdown($event.target.value)"
          ref="pipeEditor"
          :value="value"></textarea>
      </div>
      <div v-show="hasPreview" class="editor__markdown" ref="pipeView"></div>
    </div>
  </div>
</template>l

<script>
  require('../../stylus/components/_editor.styl')
  import toMarkdown from 'to-markdown'
  import { insertTextAtCaret } from './tool'

  export default {
    name: 'v-editor',
    props: {
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
        isFullScreen: false
      }
    },
    methods: {
      pasteToMarkdown (event) {
        if (event.clipboardData.getData("text/html").replace(/(^\s*)|(\s*)$/g, '') === '') {
          return
        }
        let hasCode = false
        let markdownStr = toMarkdown(event.clipboardData.getData("text/html"), {
          converters: [{
            filter: ['pre', 'code'],
            replacement: function(content) {
              if (content.split('\n').length > 1) {
                hasCode = true
              }
              return '`' + content + '`'
            }
          }],
          gfm: true
        });

        if (hasCode) {
          event.target.value = event.clipboardData.getData("text/plain")
        } else {
          const div = document.createElement('div')
          div.innerHTML = markdownStr
          markdownStr = div.innerText.replace(/\n{2,}/g, '\n\n').replace(/ /g, ' ').replace(/(^\s*)|(\s*)$/g, '')
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
        this.$emit('input', text)
      }
    }
  }
</script>
