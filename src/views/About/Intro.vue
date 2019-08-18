<template>
  <v-card class="mx-auto bkop-light">
    <div class="pt-2">
      <v-img
        v-if="$vuetify.breakpoint.mdAndDown"
        :src="require('@/assets/logo.png')"
        aspect-ratio="1"
        max-height="192px"
        contain
      />
    </div>
    <v-card-title>
      <h2>欢迎来到企鹅物流数据统计！</h2>
    </v-card-title>
    <v-card-title>
      <div>
        <p>
          企鹅物流数据统计（Penguin Statistics）是企鹅物流旗下数据处理部门（误），致力于各作战素材掉落统计分析。
        </p>
        <p>
          目前绝大部分数据由玩家手动上传，为了尽量减少谎报、误报对结果的影响，企鹅数据团队会对掉落进行多方位的审查。
        </p>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'Intro',
  methods: {
    goToHref(href) {
      window.open(href)
    }
  }
}
</script>
