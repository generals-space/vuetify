<template>
  <v-app>
    <v-editor
      uploadURL="/blogs/Vanessa/upload"
      :uploadMax="10"
      v-model="text"
      style="width: 768px;margin: 50px auto;"
      @error="sendError"
      @input="update"></v-editor>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      text: 'pipe editor'
    }),
    methods: {
      sendError (msg) {
        console.log(msg)
      },
      update(value) {
        console.log(value)
      }
    }
  }
</script>
