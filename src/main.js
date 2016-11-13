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
    imgName: ''
  },
  methods: {
    updateTime: function() {
      var tempTime = this.timing - 0 + 0.1;
      this.timing = tempTime.toFixed(2);
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
      location.reload();
    },
    handleImage: function (name) {
      this.imgName = name;
      this.close = 1;
      this.ready = 1;
      this.isShrink = 1;
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

      var xData = function() {
        var data = [];
        for (var i = 1; i < data_total.length + 2; i++) {
          data.push(i + "Min");
        }
        return data;
      }();

      var option = {
        backgroundColor: "#344b58",
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
              "color": "rgba(255,144,128,1)",
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
                "color": "rgba(0,191,183,1)",
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
                "color": "rgba(252,230,48,1)",
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
