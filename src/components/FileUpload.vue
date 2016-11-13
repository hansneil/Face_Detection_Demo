<template>
  <div class="wrapper" id="wra">
    <!--<input type="text" name="angle" v-model='options.formData.angle'>-->
    <vue-file-upload url='/upload' :files.sync='files' :events='cbEvents' :request-options='options'
                     label='VIDEO' name='video'></vue-file-upload>
    <vue-file-upload url='/uploadImage' :files.sync='images' :events='imgEvents' :request-options='options'
                     label='IMAGE' name='image'></vue-file-upload>
    <div class="angle">
      <p>Shooting Angle</p>
      <div class="radio">
        <input type="radio" name="angle" v-model='options.formData.angle' value="0">
        <span :class="{active: isActive1}">L</span>
      </div>
      <div class="radio">
        <input type="radio" name="angle" v-model='options.formData.angle' value="2">
        <span :class="{active: isActive2}">M</span>
      </div>
      <div class="radio">
        <input type="radio" name="angle" v-model='options.formData.angle' value="1">
        <span :class="{active: isActive3}">R</span>
      </div>
    </div>
    <div class="angle">
      <p>Upload</p>
      <button class="submit" type='button' @click='uploadItem'>UPLOAD</button>
    </div>
  </div>
</template>

<style lang="scss">
  .wrapper {
    width: 50%;
    padding: 0 5%;
    text-align: center;
  }
  #wra.wrapper .fileupload-button {
    padding: 10px 20px;
    border: 1px solid #fff;
    background-color: transparent;
    margin-right: 30px;
  }
  #wra.wrapper .fileupload-button:hover {
    background-color: #fff;
    color: #333;
  }
  .angle {
    margin-top: 15px;
    color: #fff;
    font-weight: 900;
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 3px solid #fff;
    p {
      text-align: left;
      margin: 25px 0;
      border-bottom: 1px solid #fff;
      padding-bottom: 5px;
    }
  }
  .radio {
    display: inline-block;
    position: relative;
    width: 50px;
    height: 50px;
    margin: 0 25px;
    span {
      display: inline-block;
      text-align: center;
      width: 100%;
      line-height: 50px;
      border: 1px solid #fff;
      border-radius: 50%;
      font-size: 20px;
      &.active {
        background-color: #fff;
        color: #333;
      }
    };
    input {
      position: absolute;
      left: 0;
      top: 0;
      width: 50px;
      height: 50px;
      opacity: 0;
      z-index: 0;
      cursor: pointer;
      &:hover + span {
        background-color: #fff;
        color: #333;
      }
    }
  }
  .submit {
    width: 100px;
    line-height: 35px;
    border: 1px solid #fff;
    text-align: center;
    background-color: transparent;
    color: #fff;
    outline: none;
    &:hover {
      background-color: #fff;
      color: #333;
      cursor: pointer;
    }
  }
</style>

<script>
  import VueFileUpload from 'vue-file-upload';
  export default {
    data() {
      return {
        files: [],
        images: [],
        cbEvents: {
          onCompleteUpload: (file, response, status, header) => {
            console.log(response);
            this.$emit('return', response.data);
            this.options.formData.angle = -1;
          }
        },
        imgEvents: {
          onCompleteUpload: (file, response, status, header) => {
            console.log(response);
            this.$emit('imgreturn', response.data.name);
            this.options.formData.angle = -1;
          }
        },
        options: {
          formData: {
            angle: -1
          }
        }
      }
    },
    computed: {
      show() {
        return this.files.length != 0;
      },
      isActive1() {
        return this.options.formData.angle == 0;
      },
      isActive2() {
        return this.options.formData.angle == 2;
      },
      isActive3() {
        return this.options.formData.angle == 1;
      }
    },
    methods: {
      uploadItem() {
        const video = this.files.length;
        const image = this.images.length;
        var file;
        if (video) {
          file = this.files[video-1];
        } else if (image) {
          file = this.images[image-1];
        } else {
          alert("请至少选择一个视频或图片");
          return;
        }
        file.upload();
        this.$emit('start');
        var interval = setInterval(() => {
          const status = this.onStatus(file);
          if (status == "正在上传") {
            this.$emit('update');
          } else if (status == "上传成功") {
            clearInterval(interval);
            this.files = [];
          }
        }, 100);
      },
      onStatus(file){
        if(file.isSuccess){
          return "上传成功";
        }else if(file.isError){
          return "上传失败";
        }else if(file.isUploading){
          return "正在上传";
        }else{
          return "待上传";
        }
      }
    },
    components: {
      VueFileUpload
    }
  }
</script>
