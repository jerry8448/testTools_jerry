// $('.btn1').click(getint1);
// $('.btn2').click(getint2);
// $('.btn3').click(getint3);
// div = $("div.main > div");

// function getint1(){
//     div[0].style.display = 'block';
//     div[1].style.display = 'none';
//     div[2].style.display = 'none';
//     $.get('http://127.0.0.1:8000/stock/get/',function(data){
//         div[0].innerHTML = data + 'div1'
//     })
// }

// function getint2(){
//     div[1].style.display = 'block';
//     div[0].style.display = 'none';
//     div[2].style.display = 'none';
//     $.get('http://127.0.0.1:8000/stock/get/',function(data){
//         div[1].innerHTML = data + 'div2'
//     })
// }

// function getint3(){
//     div[2].style.display = 'block';
//     div[1].style.display = 'none';
//     div[0].style.display = 'none';
//     $.get('http://127.0.0.1:8000/stock/get/',function(data){
//         div[2].innerHTML = data + 'div3'
//     })
// }

// var chartDom = $('.Kline');
// var myCharts = [];
// for(chart in chartDom){
//     myCharts.push(echarts.init(chart));
// }

var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);

var option;

const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';
var stock_data = 0;
const categoryData = [];
const values = [];
var data0,option;

function calculateMA(dayCount) {
    var result = [];
    for (var i = 0, len = data0.values.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += +data0.values[i - j][1];
      }
      var value = sum / dayCount;
      result.push(value.toFixed(2));
    }
    return result;
  }

function setOptionUpdate(data0){
    option = {
        title: {
          text: '平安银行',
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: data0.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: '日K',
            type: 'candlestick',
            data: data0.values,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor
            },
            markPoint: {
              label: {
                formatter: function (param) {
                  return param != null ? Math.round(param.value) + '' : '';
                }
              },
              data: [
                {
                  name: 'Mark',
                  coord: ['2013/5/31', 2300],
                  value: 2300,
                  itemStyle: {
                    color: 'rgb(41,60,85)'
                  }
                },
                {
                  name: 'highest value',
                  type: 'max',
                  valueDim: 'highest'
                },
                {
                  name: 'lowest value',
                  type: 'min',
                  valueDim: 'lowest'
                },
                {
                  name: 'average value on close',
                  type: 'average',
                  valueDim: 'close'
                }
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '');
                }
              }
            },
            markLine: {
              symbol: ['none', 'none'],
              data: [
                [
                  {
                    name: 'from lowest to highest',
                    type: 'min',
                    valueDim: 'lowest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: false
                      }
                    }
                  },
                  {
                    type: 'max',
                    valueDim: 'highest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: false
                      }
                    }
                  }
                ],
                {
                  name: 'min line on close',
                  type: 'min',
                  valueDim: 'close'
                },
                {
                  name: 'max line on close',
                  type: 'max',
                  valueDim: 'close'
                }
              ]
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA20',
            type: 'line',
            data: calculateMA(20),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          }
        ]
      };
}

function splitData(rawData){

    for (var i = rawData.length-1; i > -1; i--) {
        var data = rawData[i];
        // console.log(data);
        categoryData.push(data.trade_date);
        values.push([data.open,data.close,data.low,data.high]);
    }
    return {
        categoryData: categoryData,
        values: values
    };
    };

$.get('http://127.0.0.1:8000/stock/stockMsg/?ts_code=000001.sz&start_date=20220901&end_date=20221111',
function(data){
    stock_data = JSON.parse(data);
    data0 = splitData(stock_data);
    setOptionUpdate(data0);
    option && myChart.setOption(option);
});

$('.sandbox-container input').datepicker(
  {
    language:"zh-CN",    //语言选择中文
    format:"yyyy-mm-dd",    //格式化日期
    timepicker:true,     //关闭时间选项
    useCurrent:true,
    yearEnd:2050,        //设置最大年份
    todayButton:true,    //关闭选择今天按钮
    autoclose: 1,        //选择完日期后，弹出框自动关闭
    startView:4,         //打开弹出框时，显示到什么格式,3代表月
    minView: 3,          //能选择到的最小日期格式
}
);

// Each item: open，close，lowest，highest
input_data = $("[type='text']");
input_select = $("[type='radio']");
var market
$('.search').click(
  function(){
    if(input_select[0].checked){
      market = input_select[0].value;
    }
    else{
      market = input_select[1].value;
    }
    $.get('http://127.0.0.1:8000/stock/stockMsg/',
    {
      start_date:input_data[0].value,
      end_date:input_data[1].value,
      ts_code:input_data[2].value + '.' + market},
      function(data){
        categoryData.splice(0,categoryData.length);
        values.splice(0,values.length);
        try{stock_data = JSON.parse(data);
          data0 = splitData(stock_data);
          setOptionUpdate(data0);
          option.title.text = input_data[2].value;
          option && myChart.setOption(option)}
        catch(e){
          alert(data)
      }
    })
  }
);
$('.reset').click(
  function(){
    input_data[0].value = '';
    input_data[1].value = '';
    input_data[2].value = '';
  }

)

