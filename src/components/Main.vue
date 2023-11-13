<script lang="ts" setup >
import { reactive, ref } from "vue";
import { InsertStatisticData, DeleteStatisticData, select } from "../sqlite/sqlite";
import { ipcRenderer } from 'electron';
import { Statistic, TabData } from '../beans/Statistic';
import { MoenyTag } from '../beans/MoneyTag';
import * as echarts from 'echarts';
import { onMounted ,nextTick,watch} from 'vue';
import { con } from '@/utils/constant';
import { CategoryData } from '../beans/Category';
import { OpenXlsx, writeXlsx } from '../utils/xlsxUtil'
import { useRouter } from "vue-router";
//**********************************字段定义***************************
let tableData = reactive([] as any) ;    //消费信息  
let consumeTypeBase = reactive([] as any);     //消费类型标签
let tag = ref('')                      //表格对应的消费标签
let moneyTag = ref('')                 //收入与支出
let prices = ref('')                   //金额
let mark = ref('')                     // 备注         
let lifeEnergy = ref('')               //生命能量
let consumeDate = ref("")              //消费时间

const router = useRouter()     //路由对象

let moneyTpye = [MoenyTag.pay, MoenyTag.income]   //开支还是收入
//表格的格式
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

let chartArry: any = [];    //图表 ： 时间和消费在一起的集合
//**********************************方法定义***************************
//初始化页面数据， 从execl文件加载数据后，也可以调用该方法
function InitDB() {
  //消费类型
  let result: Array<TabData> = select(con.Category_TABLE_NAME)
  if (result.length > 0) {
    result.filter((item: TabData) => {
      consumeTypeBase.push(item)
    })
  }
  //消费信息
  let result2: Array<CategoryData> = select(con.STATISTIC_TABLE_NAME)
  if (result2.length > 0) {
    result2.filter((item: CategoryData) => {
      tableData.push(item)
    })
  }
}

function AddClick() {
  let data: Statistic = new Statistic();
  data.category = tag.value;
  data.moneyTag = moneyTag.value;
  data.date = consumeDate.value;
  data.lifeEnergy = lifeEnergy.value;
  data.prices = prices.value;
  data.mark = mark.value;
  let id = InsertStatisticData(data);
  let row: TabData = JSON.parse(JSON.stringify(data));
  row.id = id;
  tableData.push(row);
}
//删除
function deleteRow(index: number, row: any) {
  DeleteStatisticData(row.id);
  tableData.splice(index, 1)
}
//表格数据处理
function MathEchartData() {
  chartArry.splice(0, chartArry.length);
  tableData.forEach((element: TabData) => {
    if (chartArry.length <= 0) {
      //// 假设你想获取不带 $ 符号的纯金额值
      chartArry.push({ date: element.date, prices: Number.parseFloat(element.prices.toString().replace(/\$/g, '').trim()) })
    } else {
      //同一日期的加在一起
      const existingEntry = chartArry.find((entry: any) => entry.date === element.date)
      if (existingEntry) {
        existingEntry.prices += Number.parseFloat(element.prices.toString().replace(/\$/g, '').trim());
      } else {
        chartArry.push({ date: element.date, prices: Number.parseFloat(element.prices.toString().replace(/\$/g, '').trim()) })
      }
    }
  });
  console.log('dailyExpenses :' + chartArry)
  SetEchartData();
}

function SetEchartData() {
  const chart = document.getElementById("chart")
  if (chart) {
    console.log('加载数据列表');
    const myChart = echarts.init(chart)
    const option = {
      xAxis: {
        type: 'category',
        data: chartArry.map((item:any) => item.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: chartArry.map((item:any) => item.prices),
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
  
  //router.push({ name: 'Setting' })
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
  InitDB();
});

ipcRenderer.on('save-file', (event, filePath) => {
  console.log('save File Paths:', filePath);
  writeXlsx('八月', filePath);
});

 //消费类型 监听自定义事件
ipcRenderer.on('data-updated', () => {
    console.log("监听到数据操作");
    consumeTypeBase.splice(0, consumeTypeBase.length);
    let result = select(con.Category_TABLE_NAME)
    if (result.length > 0) {
      result.filter((item: TabData) => {
        consumeTypeBase.push(item)
      })
    }
  });
//**********************************vue生命周期***************************8***************** */
onMounted(() => {
  InitDB();
})

watch(tableData, () => {
  console.log('tableData发生了变化');
  MathEchartData();
})
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
