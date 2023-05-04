const repairOrder = {
  route: null,
  name: null,
  title: '维修工单',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-rizhiguanli',
  filePath: 'view/repairOrder/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '维修工单列表',
      type: 'view',
      name: 'RepairOrderList',
      route: '/repairOrder/list',
      filePath: 'view/repairOrder/list.vue',
      inNav: true,
      icon: 'iconfont icon-rizhiguanli',
    },
    {
      title: '新建维修工单',
      type: 'view',
      name: 'RepairOrderCreate',
      route: '/repairOrder/add',
      filePath: 'view/repairOrder/repairOrder.vue',
      inNav: true,
      icon: 'iconfont icon-add',
    },
  ],
}

export default repairOrder
