<template>
  <div>
    <vue-file-upload url='/upload' v-bind:files.sync='files' v-bind:events='cbEvents'></vue-file-upload>
    <button type='button' @click='uploadItem'>上传</button>
  </div>
</template>

<script>
  import VueFileUpload from 'vue-file-upload';
  export default {
    data() {
      return {
        files: [],
        cbEvents: {
          onCompleteUpload: (file, response, status, header) => {
            console.log(response);
          }
        }
      }
    },
    methods: {
      uploadItem() {
        this.files[0].upload();
      }
    },
    components: {
      VueFileUpload
    }
  }
</script>
