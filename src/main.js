import Vue from 'Vue';
import FileUpload from './components/FileUpload';

var vm = new Vue({
  el: '#body',
  data: {
    number: 1024
  },
  components: {
    FileUpload
  }
})
