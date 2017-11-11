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
      <div class="editor__textarea" @scroll="syncScroll">
        <textarea @input="parseMarkdown($event.target.value)" ref="pipeEditor" :value="value"></textarea>
      </div>
      <div v-show="hasPreview" class="editor__markdown" ref="pipeView"></div>
    </div>
  </div>
</template>

<script>
  require('../../stylus/components/_editor.styl')
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
      syncScroll () {
        if (!this.hasPreview) {
          return
        }
      },
      insert (prefix, suffix) {
        insertTextAtCaret(this.$refs.pipeEditor, prefix, suffix)
      },
      parseMarkdown (text) {
        this.$emit('input', text, this.hasPreview)
      }
    }
  }
</script>
