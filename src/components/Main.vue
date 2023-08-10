<script lang="ts" setup >
import { reactive, ref } from "vue";
import { InsertStatisticData, DeleteStatisticData, select } from "../sqlite/sqlite";
import { ipcRenderer } from 'electron';
import { Statistic, TabData } from '../beans/Statistic';
import { MoenyTag } from '../beans/MoneyTag';
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import { con } from '@/utils/constant';
import { TagData } from '../beans/Tag';
import { OpenXlsx, writeXlsx } from '../utils/xlsxUtil'

//初始化页面数据， 从execl文件加载数据后，也可以调用该方法
function InitDB(action: () => void) {
  let result: Array<TabData> = select(con.TAG_TABLE_NAME)
  if (result.length > 0) {
    result.filter((item: TabData) => {
      consumeTypeBase.push(item)
    })
  }
  let result2: Array<TagData> = select(con.STATISTIC_TABLE_NAME)
  if (result2.length > 0) {
    result2.filter((item: TagData) => {
      tableData.push(item)
    })
  }
  action();
}

onMounted(() => {
  //writeXlsx();
  InitDB(() => {
    MathEchartData()
  });
  //消费类型 监听自定义事件
  ipcRenderer.on('data-updated', () => {
    console.log("监听到数据操作");
    consumeTypeBase.splice(0, consumeTypeBase.length);
    let result = select(con.TAG_TABLE_NAME)
    if (result.length > 0) {
      result.filter((item: TabData) => {
        consumeTypeBase.push(item)
      })
    }
  });
})

let tableData = reactive([] as any);
let consumeTypeBase = reactive([] as any);
let tag = ref('')
let moneyTag = ref('')
let prices = ref('')
let mark = ref('') // 备注
let lifeEnergy = ref('')   //生命能量
let moneyTpye = [MoenyTag.pay, MoenyTag.income]
let consumeDate = ref("")
let tableType = [
  {
    name: '消费类型',
    value: 'tag'
  },
  {
    name: '消费时间',
    value: 'date'
  },
  {
    name: '消费金额',
    value: 'prices'
  },
  {
    name: '收入与开支',
    value: 'moneyTag'
  },
  {
    name: '生命能量',
    value: 'lifeEnergy'
  },
  {
    name: '备注',
    value: 'mark'
  }
]

function AddClick() {
  let data: Statistic = new Statistic();
  data.tag = tag.value;
  data.moneyTag = moneyTag.value;
  data.date = consumeDate.value;
  data.lifeEnergy = lifeEnergy.value;
  data.prices = prices.value;
  data.mark = mark.value;
  let id = InsertStatisticData(data);
  let row: TabData = JSON.parse(JSON.stringify(data));
  row.id = id;
  tableData.push(row);

  MathEchartData();
}

function deleteRow(index: number, row: any) {
  DeleteStatisticData(row.id);
  tableData.splice(index, 1)
  MathEchartData();
}

let chartArry: any = [];
let dateArray: any = [];
let pricesArray: any = [];

function MathEchartData() {
  chartArry.splice(0, chartArry.length);
  tableData.forEach((element: TabData) => {
    if (chartArry.length <= 0) {
      //// 假设你想获取不带 $ 符号的纯金额值
      chartArry.push({ date: element.date, prices: Number.parseFloat(element.prices.toString().replace(/\$/g, '').trim()) })
    } else {
      const existingEntry = chartArry.find((entry: any) => entry.date === element.date)
      if (existingEntry) {
        existingEntry.prices += Number.parseFloat(element.prices.toString().replace(/\$/g, '').trim());
      } else {
        chartArry.push({ date: element.date, prices: Number.parseFloat(element.prices.toString().replace(/\$/g, '').trim()) })
      }
    }
  });

  dateArray.splice(0, dateArray.length); // 清空数组
  pricesArray.splice(0, pricesArray.length);

  chartArry.forEach((item: any) => {
    dateArray.push(item.date);
    pricesArray.push(item.prices);
  });
  console.log('dailyExpenses :' + chartArry)
  getEchartData();
}

function getEchartData() {
  const chart = document.getElementById("chart")
  if (chart) {
    console.log('加载数据列表');
    const myChart = echarts.init(chart)
    const option = {
      xAxis: {
        type: 'category',
        data: dateArray
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: pricesArray,
          type: 'line'
        }
      ]
    };
    myChart.setOption(option)
    window.addEventListener("resize", function () {
      myChart.resize()
    })
  }
}

function openSetting() {
  ipcRenderer.send('open-setting')
}

//从execl导入数据 ， 会删除已存在的数据
function importExecl() {
  ipcRenderer.send('open-file-dialog');
}

//导出数据到execl
function outputExecl() {
  ipcRenderer.send('save-file-dialog');
}

ipcRenderer.on('selected-file', (event, filePaths) => {
  console.log('Selected File Paths:', filePaths);
  OpenXlsx(filePaths[0]);
  //刷新页面
  InitDB(() => {
    MathEchartData()
  });

});

ipcRenderer.on('save-file', (event, filePath) => {
  console.log('save File Paths:', filePath);
  writeXlsx('八月', filePath);
});

</script>
<template>
  <div style="display: flex; flex-direction: row;">
    <div style="display: flex; justify-content: center; align-items: center; flex: 1; margin-left: 150px;" >
      <h1 style="width: 100%;">Welcome to MoneyFree!</h1>
    </div>
    <div style="display: flex; justify-content: flex-end; align-items: center; width: 150px;">
      <el-icon style="height: 80px; margin-right: 20px;" :size="25" @click="openSetting()">
        <Tools />
      </el-icon>
      <el-button  type="primary" @click="importExecl()">导入</el-button>
      <el-button  type="primary" @click="outputExecl()">导出</el-button>
    </div>
  </div>

  <div>

    <div style="display: flex; flex-direction: row;">
      <el-select v-model="tag" class="m-2" placeholder="消费类别" size="large">
        <el-option v-for="item in consumeTypeBase" :key="item.tag" :label="item.tag" :value="item.tag" />
      </el-select>
      <el-date-picker style="width: 240px;" v-model="consumeDate" type="date" placeholder="Pick a day" size="large"
        format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
      <el-input style="width: 200px;" v-model="prices" placeholder="money"
        :formatter="(value: any) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="(value: any) => value.replace(/\$\s?|(,*)/g, '')" />
      <el-select v-model="moneyTag" class="m-2" placeholder="收入与开支" size="large">
        <el-option v-for="item in moneyTpye" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input style="width: 200px;" v-model="lifeEnergy" placeholder="生命能量" clearable />
      <el-input style="width: 400px;" v-model="mark" placeholder="备注" clearable />
    </div>
    <el-button type="button" @click="AddClick()" style="width: 100%">添加</el-button>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column v-for="item in tableType" :prop="item.value" :label="item.name" :width="110" />
        <el-table-column fixed="right" label="操作" width="130">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="chart" style="width: 100%;height: 300px;margin-top: 30px;"></div>
  </div>
</template>

<style >
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
