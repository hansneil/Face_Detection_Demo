<template>
    <div class="wrapper" id="wra">
        <!--<input type="text" name="angle" v-model='options.formData.angle'>-->
        <vue-file-upload url='/upload' :files.sync='files' :events='cbEvents' :request-options='options'
                         label='IMAGE' :name='image'></vue-file-upload>
        <!--<button type='button' @click='uploadItem'>上传</button>-->
    </div>
</template>

<style lang="scss">
    #wra.wrapper .fileupload-button {
        padding: 10px 20px;
        border: 1px solid #fff;
        background-color: transparent;
    }
    #wra.wrapper .fileupload-button:hover {
        background-color: #fff;
        color: #333;
    }
</style>

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
        },
        options: {
          formData: {
            angle: 0
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
