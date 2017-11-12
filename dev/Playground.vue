<template>
  <v-app>
    <v-editor
      v-model="text"
      style="width: 768px;margin: 50px auto;"
      @input="update"></v-editor>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      text: 'pipe editor'
    }),
    methods: {
      update() {
        console.log(arguments, this.text)
      }
    }
  }
</script>
