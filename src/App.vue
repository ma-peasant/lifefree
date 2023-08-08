<template>
  <div>
    <RouterView></RouterView>
  </div>
</template>
<!-- <Main ref="main" /> -->
<script lang="ts" setup>
import {CreateTable} from './sqlite/sqlite'
import {OpenXlsx} from './utils/xlsxUtil'

CreateTable();
OpenXlsx('test.xlsx');
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
