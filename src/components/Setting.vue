<script lang="ts" setup >
import { InsertTagData, DeleteTagData, select, UpdateTagData } from '@/utils/sqlite';
import { con } from '@/utils/constant';
import { ref, reactive } from 'vue'
import { ipcRenderer } from 'electron';
import { TabData } from '@/beans/Statistic';
let input_consumeType = ref('');
let tableData = reactive([] as any);
ShowData();
function ShowData() {
  let result :Array<TabData> = select(con.TAG_TABLE_NAME)
  if (result.length > 0) {
    console.log(typeof (result));
    result.filter((item:TabData) => {
      tableData.push(item)
    })
  }
}

function addConsumeType() {
  if (input_consumeType.value.toString().trim() == '') {
    alert("输入的内容不能为空");
    return;
  }
  let _tag: string = input_consumeType.value.toString()
  let _id = InsertTagData(_tag);
  tableData.push({id:_id,tag:_tag})
  ipcRenderer.send('data-updated');
}

function deleteConsumeType(index: number, row: any) {
  DeleteTagData(row.id);
  tableData.splice(index, row.id)
  ipcRenderer.send('data-updated');
}

// function ModifierConsumeType(tag: string, row: any) {
//   UpdateTagData(tag, row.id);
// }


// function confirmClick() {
//   ElMessageBox.confirm(`Are you confirm to chose ${radio1.value} ?`)
//     .then(() => {
//       this.drawer.value = false
//     })
//     .catch(() => {
//       // catch error
//     })
// }
</script>
<template>
  <div>
    <h4>添加消费类型</h4>
    <div style="display: flex; flex-direction: row;">
      <el-input v-model="input_consumeType" placeholder="Please input" clearable />
      <el-button type="primary" round @click="addConsumeType()">添加</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="tag" label="消费类型" width="120" />
        <el-table-column fixed="right" label="Operations" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="deleteConsumeType(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
