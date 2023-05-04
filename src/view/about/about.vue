<template>
  <div class="container">
    <div class="lin-info">
      <div class="lin-info-left">
        <div class="welcome">
          欢 迎
        </div>
        <img class="welcome-bg" src="../../assets/image/about/header-bg.png" alt="" />
      </div>

    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const showTeam = ref(false)
    const activeName = ref('first')
    const { clientWidth } = document.body

    onMounted(() => {
      if (clientWidth > 1200 && clientWidth < 1330) {
        showTeam.value = true
      } else {
        showTeam.value = false
      }
    })

    /**
     * 切换选项
     */
    const handleArticle = link => {
      window.open(link)
    }

    return {
      showTeam,
      activeName,
      handleArticle,
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  .lin-info {
    display: flex;
    flex: 1;
    height: 160px;
    width: 100%;
    .lin-info-left {
      position: relative;
      width: 690px;
      height: 100%;
      background: rgba(69, 119, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .welcome {
        margin: 28px 0 0 30px;
        color: #fff;
        // font-weight: bold;
        font-size: 26px;
      }
      .welcome-bg {
        position: absolute;
        bottom: 0;
        right: 10px;
        width: 393px;
        height: 121px;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .container .lin-info .lin-info-right {
    display: none;
  }
  .container .lin-info .lin-info-left {
    width: 100%;
  }
}

@media screen and (max-width: 1200px) {
  .container .lin-info .lin-info-left {
    width: 100%;
  }
}
</style>
