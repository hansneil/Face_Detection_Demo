import Vue from 'Vue';
import FileUpload from './components/FileUpload';
import ImageUpload from './components/ImageUpload';
import Banner from './components/Banner';
import './style/main.scss';
import echarts from 'echarts';

var vm = new Vue({
  el: '#body',
  data: {
    number: 1024,
    isShrink: 0,
    detectRes: '',
    loading: 0,
    close: 0,
    timing: 0,
    ready: 0,
    imgName: '',
    videoName: '',
    experiment: '',
    corrected: ''
  },
  methods: {
    updateTime: function(progress) {
      this.timing = progress;
    },
    loadingData: function () {
      this.loading = 1;
    },
    reset: function () {
      this.loading = 0;
      this.isShrink = 0;
      this.close = 0;
      this.timing = 0;
      this.ready = 0;
    },
    handleRetImage: function (name) {
      this.loading = 0;
      this.timing = 0;
    },
    handleImage: function (name) {
      this.imgName = name;
      this.close = 1;
      this.isShrink = 1;
      setTimeout(() => {
        this.ready = 1;
      }, 0);
    },
    handleRetVideo: function (data) {
      this.videoName = data;
      this.loading = 0;
      this.timing = 0;
    },
    handleRetData: function(data) {
      this.isShrink = 1;
      this.close = 1;
      var myChart = echarts.init(document.getElementById('chart-wrapper'));
      var data_total = data.total.split('\n').slice(0, -1).reduce((prev, val) => {
        prev.push((val.split(' '))[1] - 0);
        return prev;
      }, []);

      var data_listen = data.slice.split('\n').slice(0, -1).reduce((prev, val) => {
        prev.push((val.split(' '))[1] - 0);
        return prev;
      }, []);

      var data_nlisten = data.slice.split('\n').slice(0, -1).reduce((prev, val) => {
        prev.push((val.split(' '))[2] - 0);
        return prev;
      }, []);

      //计算听课率
      var class_attendance = data.slice.split('\n').slice(0, -1).reduce((prev, val) => {
        var listen = (val.split(' '))[1];
        var total = (val.split(' '))[1] - 0 + ((val.split(' '))[2] - 0);
        if (total == 0) {
          return prev;
        } else {
          return prev - 0 + listen / total;
        }
      }, 0);
      class_attendance = class_attendance / data_total.length;
      //this.experiment = (class_attendance * 100).toFixed(2) + '%';
      var i = 1;
      var expInter = setInterval(() => {
        this.experiment = (class_attendance * 100 - 5 + i * 0.5).toFixed(2) + '%';
        i++;
        if (i > 10) {
          clearInterval(expInter);
        }
      }, 100);
      //校准值
      var max = data_total.reduce((prev, val) => {
        if (val > prev) {
          prev = val;
        }
        return prev;
      }, 0);
      var class_total = Math.floor(max * 12 / 7);
      //校正听课率
      var data_slice_sort = data.slice.split('\n').slice(0, -1).map((val) => {
        var listen = (val.split(' '))[1];
        var total = (val.split(' '))[1] - 0 + ((val.split(' '))[2] - 0);
        if (max > total * 2) {
          return -1;
        } else {
          return listen / total;
        }
      }).filter((val) => {
        return val != -1;
      });

      var average_slice = (data_slice_sort.reduce((prev, val) => {
        return prev - 0 + val;
      })) / data_slice_sort.length;

      //最低听课率
      var lowest_slice = data_slice_sort.reduce((prev, val) => {
        if (val < prev) {
          prev = val;
        }
        return prev;
      });

      var corrected_attendance = (average_slice * max + class_total * 5 / 12 * lowest_slice * average_slice) / class_total;
      //this.corrected = (this.corrected * 100).toFixed(2) + '%';

      var j = 1;
      var corInter = setInterval(() => {
        this.corrected = (corrected_attendance * 100 - 5 + j * 0.5).toFixed(2) + '%';
        j++;
        if (j > 10) {
          clearInterval(corInter);
        }
      }, 100);

      var xData = function() {
        var data = [];
        for (var i = 1; i < data_total.length + 2; i++) {
          data.push(i);
        }
        return data;
      }();

      var option = {
        backgroundColor: "#ffffff",
        "title": {
          "text": "Detect Result",
          "subtext": "powered by Echarts",
          x: "4%",

          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16',

          },
        },
        "tooltip": {
          "trigger": "axis",
          "axisPointer": {
            "type": "shadow",
            textStyle: {
              color: "#fff"
            }

          },
        },
        "grid": {
          "borderWidth": 0,
          "top": 110,
          "bottom": 95,
          textStyle: {
            color: "#fff"
          }
        },
        "legend": {
          x: '4%',
          top: '11%',
          textStyle: {
            color: '#90979c',
          },
          "data": ['Listen', 'N-Listen']
        },


        "calculable": true,
        "xAxis": [{
          "type": "category",
          "axisLine": {
            lineStyle: {
              color: '#90979c'
            }
          },
          "splitLine": {
            "show": false
          },
          "axisTick": {
            "show": false
          },
          "splitArea": {
            "show": false
          },
          "axisLabel": {
            "interval": 0,

          },
          "data": xData,
        }],
        "yAxis": [{
          "type": "value",
          "splitLine": {
            "show": false
          },
          "axisLine": {
            lineStyle: {
              color: '#90979c'
            }
          },
          "axisTick": {
            "show": false
          },
          "axisLabel": {
            "interval": 0,

          },
          "splitArea": {
            "show": false
          },

        }],
        "dataZoom": [{
          "show": true,
          "height": 30,
          "xAxisIndex": [
            0
          ],
          bottom: 30,
          "start": 10,
          "end": 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle:{
            color:"#d3dee5",

          },
          textStyle:{
            color:"#fff"},
          borderColor:"#90979c"


        }, {
          "type": "inside",
          "show": true,
          "height": 15,
          "start": 1,
          "end": 35
        }],
        "series": [{
          "name": "Listen",
          "type": "bar",
          "stack": "总量",
          "barMaxWidth": 35,
          "barGap": "10%",
          "itemStyle": {
            "normal": {
              "color": "rgba(210,77,87,1)",
              "label": {
                "show": true,
                "textStyle": {
                  "color": "#fff"
                },
                "position": "insideTop",
                formatter: function(p) {
                  return p.value > 0 ? (p.value) : '';
                }
              }
            }
          },
          "data": data_listen,
        },

          {
            "name": "N-Listen",
            "type": "bar",
            "stack": "总量",
            "itemStyle": {
              "normal": {
                "color": "rgba(38,166,191,1)",
                "barBorderRadius": 0,
                "label": {
                  "show": true,
                  "position": "top",
                  formatter: function(p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            "data": data_nlisten
          }, {
            "name": "Total",
            "type": "line",
            "stack": "总量",
            symbolSize:10,
            symbol:'circle',
            "itemStyle": {
              "normal": {
                "color": "rgba(6, 177, 214, 1)",
                "barBorderRadius": 0,
                "label": {
                  "show": true,
                  "position": "top",
                  formatter: function(p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            "data": data_total
          },
        ]
      };
      myChart.setOption(option);
    }
  },
  components: {
    FileUpload,
    Banner,
    ImageUpload
  }
})