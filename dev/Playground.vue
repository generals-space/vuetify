<template>
  <v-app>
    <v-editor
      uploadURL="/blogs/Vanessa/upload"
      :uploadMax="10"
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
      update(value) {
        console.log(value)
      }
    }
  }
</script>
