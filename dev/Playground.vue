<template>
  <v-app>
    <div style="width: 768px;margin: 50px auto;">
      <v-editor
        uploadURL="/blogs/Vanessa/upload"
        :uploadMax="10"
        v-model="text"
        :height="300"
        :label="label"
        :fetchUpload="fetchUpload"
        @change="update"></v-editor>
    </div>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      text: 'pipe editor',
      label: {
        loading: '',
        over: '',
        error: '',
        emoji:' <ctrl+/>',
        bold: '1',
        italic: '',
        quote: '',
        link: '',
        upload: '',
        unorderedList: '',
        orderedList: '',
        view: '',
        fullscreen: '',
        question: ''
      }
    }),
    methods: {
      fetchUpload (src, succCB) {
        setTimeout(() => {
          succCB(src, 'vvvvvvv')
        }, 1000)
      },
      update () {
        console.log('input', arguments)
      }
    }
  }
</script>
