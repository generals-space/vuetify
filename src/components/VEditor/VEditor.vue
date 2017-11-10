<template>
  <div
    class="editor"
    :class="{'editor--fullscreen': isFullScreen}"
    :style="`height: ${height || 'auto'}px`">
    <div class="editor__toolbar">
      <span><v-icon>emoji</v-icon></span>
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
        <textarea @keyup="parseMarkdown" ref="pipeEditor" v-model="editorText"></textarea>
      </div>
      <div v-show="hasPreview" class="editor__markdown"></div>
    </div>
  </div>
</template>

<script>
  require('../../stylus/components/_editor.styl')
  import { insertTextAtCaret } from './tool'

  export default {
    name: 'v-editor',
    props: {
      text: {
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
        editorText: '',
        hasPreview: true,
        isFullScreen: false
      }
    },
    methods: {
      insert (prefix, suffix) {
        insertTextAtCaret(this.$refs.pipeEditor, prefix, suffix)
      },
      parseMarkdown () {
        this.$emit('changed', {
          text: this.editorText,
          hasPreview: this.hasPreview
        })
      }
    },
    mounted () {
      this.$set(this, 'editorText', this.text)
    }
  }
</script>
