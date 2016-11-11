import Vue from 'Vue';
import FileUpload from './components/FileUpload';
import ImageUpload from './components/ImageUpload';
import Banner from './components/Banner';
import './style/main.scss';

var vm = new Vue({
  el: '#body',
  data: {
    number: 1024,
    isShrink: 0
  },
  methods: {
    handleRetData: function() {
      this.isShrink = 1;
    }
  },
  components: {
    FileUpload,
    Banner,
    ImageUpload
  }
})
