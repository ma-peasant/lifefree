<script lang="ts" setup >
import { reactive, ref } from "vue";
import { InsertStatisticData ,DeleteStatisticData} from "../utils/sqlite";
import { ipcRenderer } from 'electron';
import { Statistic,TabData } from '../beans/Statistic';
import { MoenyTag } from '../beans/MoneyTag';
import * as echarts from 'echarts';
import { onMounted} from 'vue';
import { select } from '@/utils/sqlite';
import { con } from '@/utils/constant';
function InitDB() {
  let result = select(con.TAG_TABLE_NAME)
  if (result.length > 0) {
    result.filter(item => {
      consumeTypeBase.push(item)
    })
  }
  let result2 = select(con.STATISTIC_TABLE_NAME)
  if (result2.length > 0) {
    result2.filter(item => {
      tableData.push(item)
    })
  }
}

onMounted(() => {
  getEchartData();
  InitDB();
  // 监听自定义事件
  ipcRenderer.on('data-updated', () => {
    console.log("监听到数据操作");
    // 数据更新后的操作
    consumeTypeBase.splice(0, consumeTypeBase.length);
    let result = select(con.TAG_TABLE_NAME)
    if (result.length > 0) {
      result.filter(item => {
        consumeTypeBase.push(item)
      })
    }
  });
})

let tableData = reactive([]);

let consumeTypeBase = reactive([]);
const tag = ref('')
const moneyTag = ref('')
const prices = ref('')
const mark = ref('') // 备注
const lifeEnergy = ref('')   //生命能量
const moneyTpye = [MoenyTag.pay, MoenyTag.income]
const consumeDate = ref("")
const tableType = [
  {
    name: '消费类型',
    value: 'value'
  },
  {
    name: '消费时间',
    value: 'consumeDate'
  },
  {
    name: '消费金额',
    value: 'prices'
  },
  {
    name: '收入与开支',
    value: 'value2'
  },
  {
    name: '生命能量',
    value: 'lifeEnergy'
  },
  {
    name: '备注',
    value: 'tag'
  }
]

function AddClick() {
  let data: Statistic = new Statistic();
  data.tag = this.tag as string;
  data.moneyTag = this.moneyTag;
  data.date = this.consumeDate;
  data.lifeEnergy = this.lifeEnergy;
  data.prices = this.prices;
  data.mark = this.tag;
  console.log(this.tableData)
  let id = InsertStatisticData(data);

  let row : TabData = JSON.parse(JSON.stringify(data));
  row.id = id;
  this.tableData.push(row);
}

function editClick() {
  console.log("123");
}
function deleteRow(index:number,row:any) {
  DeleteStatisticData(row.id);
  tableData.splice(index, row.id)
}



function getEchartData() {
  const chart = document.getElementById("chart")
  if (chart) {
    console.log('加载数据列表');
    const myChart = echarts.init(chart)
    const option = {
      xAxis: {
        type: 'category',
        data: ['A', 'B', 'C']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150],
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


</script>
<template>
  <div style="display: flex; flex-direction: row; justify-content: center;">
    <h1>Welcome to MoneyFree!</h1>
    <el-icon style="height: 80px; margin-left: 40px;" :size=25 @click="openSetting()">
      <Tools />
    </el-icon>
  </div>
  <div>

    <div style="display: flex; flex-direction: row;">
      <el-select v-model="tag" class="m-2" placeholder="消费类别" size="large">
        <el-option v-for="item in consumeTypeBase" :key="item.tag" :label="item.tag" :value="item.tag" />
      </el-select>
      <el-date-picker style="width: 240px;" v-model="consumeDate" type="date" placeholder="Pick a day" size="large"
        format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
      <el-input style="width: 200px;" v-model="prices" placeholder="money"
        :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')" />
      <el-select v-model="moneyTag" class="m-2" placeholder="收入与开支" size="large">
        <el-option v-for="item in moneyTpye" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input style="width: 200px;" v-model="lifeEnergy" placeholder="生命能量" clearable />
      <el-input style="width: 400px;" v-model="mark" placeholder="备注" clearable />
    </div>
    <!-- <input id="greet-input" v-model="name" placeholder="Enter a name..." /> -->
    <el-button type="button" @click="AddClick()" style="width: 100%">添加</el-button>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column v-for="item in tableType" :prop="item.value" :label="item.name" :width="110" />
        <el-table-column fixed="right" label="操作" width="130">
          <template #default="scope">
            <!-- <el-button link type="primary" size="small" @click="editClick()">编辑</el-button> -->
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
