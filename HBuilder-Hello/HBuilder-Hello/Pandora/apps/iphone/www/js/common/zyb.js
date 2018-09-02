var myChart;

/*图表*/
myChart = echarts.init(document.getElementById('massAnalysis_grid'));

/*图表结束*/

	
queryMassAnalysis();

function queryMassAnalysis() {
	option = {
		title: {
			text: '7日年收益率（%）',
			subtext: ''
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['', '']
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: ['12-17', '12-22', '12-25', '12-30', '01-05', '01-08', '01-09']
		}],
		yAxis: [{
			type: 'value',

		}],
		series: [{
			name: '7日年收益率',
			type: 'line',
			data:function (){
                var list = [];
                for (var i = 1; i <= 30; i++) {
                    list.push(Math.round(Math.random()* 10));
                }
                return list;
            }(),
			markPoint: {
				data: [{
					type: 'max',
					name: '周最高'
				}]
			},
			markLine: {
				data: [{
					type: 'average',
					name: '平均值'
				}]
			}
		}]
	};
	myChart.clear();
	myChart.setOption(option);
}

