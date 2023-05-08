<template>
  <div class="container">
    <div class="title" v-if="!editId">新建维修工单</div>
    <div class="title" v-else>
      <span
        >编辑维修工单
        <el-button type="primary" @click="dialogVisible = true">修改工单状态</el-button></span
      >
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>

    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="formRef" label-width="100px" @submit.prevent :rules="rules">
            <el-form-item label="报修人" prop="name">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="报修人电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="报修科室" prop="depart">
              <el-input v-model="form.depart" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="维修地点" prop="address">
              <el-input v-model="form.address" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="问题说明" prop="desc">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入" v-model="form.desc">
              </el-input>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm">保 存</el-button>
              <el-button @click="resetForm">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <!-- 弹窗 -->
    <el-dialog
      title="修改工单状态"
      :append-to-body="true"
      :before-close="handleClose"
      v-model="dialogVisible"
    >
      <el-form ref="stateformRef" :model="stateform" label-width="80px">
        <el-form-item label="状态" prop="state">
          <el-radio-group clearable v-model="stateform.state">
            <el-radio label="pending">待处理</el-radio>
            <el-radio label="processing">处理中</el-radio>
            <el-radio label="completed">已完工</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import orderRepairApi from '@/model/order-repair'

export default {
  props: {
    editId: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const formRef = ref(null)
    const loading = ref(false)
    const stateform = reactive({ state: '' })
    const dialogVisible = ref(false)
    const form = reactive({ name: '', phone: '', depart: '', address: '', desc: '' })
    const listAssign = (a, b) => Object.keys(a).forEach(key => {
      a[key] = b[key] || a[key]
    })

    /**
     * 表单规则验证
     */
    const { rules } = getRules()

    onMounted(() => {
      if (props.editId) {
        getOrder()
      }
    })

    const getOrder = async () => {
      loading.value = true
      const res = await orderRepairApi.getOrder(props.editId)
      listAssign(form, res)
      listAssign(stateform, res)
      loading.value = false
    }

    // 重置表单
    const resetForm = () => {
      formRef.value.resetFields()
    }

    const submitForm = async formName => {
      formRef.value.validate(async valid => {
        if (valid) {
          let res = {}
          if (props.editId) {
            res = await orderRepairApi.editOrder(props.editId, form)
            context.emit('editClose')
          } else {
            res = await orderRepairApi.createOrder(form)
            resetForm(formName)
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            ElMessage.success(`${res.message}`)
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    const handleClose = () => {
      stateform.state = 'pending'
      dialogVisible.value = false
    }

    const back = () => {
      context.emit('editClose')
    }

    return {
      back,
      form,
      formRef,
      rules,
      resetForm,
      submitForm,
      dialogVisible,
      stateform,
      handleClose
    }
  },
}

/**
 * 表单验证规则
 */
function getRules() {
  /**
   * 验证回调函数
   */
  const checkInfo = (rule, value, callback) => {
    if (!value) {
      callback(new Error('信息不能为空'))
    }
    callback()
  }
  const rules = {
    name: [{ validator: checkInfo, trigger: 'blur', required: true }],
    phone: [{ validator: checkInfo, trigger: 'blur', required: true }],
    depart: [{ validator: checkInfo, trigger: 'blur', required: true }],
    address: [{ validator: checkInfo, trigger: 'blur', required: true }],
    desc: [{ validator: checkInfo, trigger: 'blur', required: true }],
  }
  return { rules }
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
