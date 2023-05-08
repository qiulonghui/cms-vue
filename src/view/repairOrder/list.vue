<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">维修工单列表</div>
      </div>
      <!-- 表格 -->
      <el-table :data="orders" v-loading="loading">
        <el-table-column prop="id" label="维修单号" width="100"></el-table-column>
        <el-table-column prop="name" label="报修人"></el-table-column>
        <el-table-column prop="phone" label="报修人电话"></el-table-column>
        <el-table-column prop="depart" label="报修科室"></el-table-column>
        <el-table-column prop="address" label="维修地点"></el-table-column>
        <el-table-column prop="desc" label="问题说明" show-overflow-tooltip></el-table-column>
        <el-table-column prop="state" label="状态" show-overflow-tooltip>
          <template #default="scope">
            {{ stateMap[scope.row.state] }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creater" label="创建人"></el-table-column>
        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <el-button plain size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button
              plain
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除维修工单', type: 'disabled' }"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :total="totalNum"
          :background="true"
          :page-size="pageCount"
          :current-page="currentPage"
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 编辑页面 -->
    <OrderRepairModify v-else @editClose="editClose" :editId="editId"></OrderRepairModify>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import orderRepairApi from '@/model/order-repair'
import OrderRepairModify from './repairOrder'
import stateMap from './constants'

export default {
  components: {
    OrderRepairModify,
  },
  setup() {
    const orders = ref([])
    const editId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)
    const pageCount = ref(10) // 每页10条数据
    const totalNum = ref(0) // 分组内的用户总数
    const currentPage = ref(1) // 默认获取第一页的数据

    onMounted(() => {
      getOrders()
    })

    const getOrders = async () => {
      try {
        loading.value = true
        const { items, total } = await orderRepairApi.getOrders({
          count: pageCount.value,
          page: currentPage.value,
        })
        orders.value = items
        totalNum.value = total
        loading.value = false
      } catch (error) {
        loading.value = false
        if (error.code === 10020) {
          orders.value = []
        }
      }
    }

    const handleEdit = id => {
      showEdit.value = true
      editId.value = id
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await orderRepairApi.deleteBook(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          getOrders()
          ElMessage.success(`${res.message}`)
        }
      })
    }

    const editClose = () => {
      showEdit.value = false
      getOrders()
    }

    const handleCurrentChange = async val => {
      currentPage.value = val
      await getOrders()
    }

    return {
      orders,
      loading,
      showEdit,
      editClose,
      handleEdit,
      editId,
      handleDelete,
      stateMap,
      pageCount,
      totalNum,
      currentPage,
      handleCurrentChange,
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
