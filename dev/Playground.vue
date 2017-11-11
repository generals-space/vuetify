<template>
  <v-app>
    <v-editor
      v-model="text"
      style="width: 768px;margin: 50px auto;"
      @input="update"></v-editor>
    <v-btn>{{text}}</v-btn>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      text: '111'
    }),
    methods: {
      update() {
        console.log(arguments, this.text)
      }
    }
  }
</script>
