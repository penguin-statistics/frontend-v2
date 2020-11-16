<template>
  <v-card class="bkop-light pt-1 pa-8 elevation-4 ma-2">
    <v-card-title class="pt-6 pl-0 pb-0">
      关于此作战
    </v-card-title>

    <v-row
      align="start"
      align-content="start"
    >
      <v-col
        class="flex-md-grow-1 flex-lg-grow-1 flex-xl-grow-1"
      >
        <div class="d-inline-block mb-4">
          <div
            class="d-flex flex-row px-4 py-2 radius-1 headline"
            style="border: 2px solid rgba(255,255,255,.5)"
          >
            <span
              v-text="zone.zoneName"
            />
            <v-divider
              vertical
              class="mx-4 white"
            />
            <span
              v-text="stage.code"
            />
          </div>
        </div>

        <FactTable>
          <FactTableItem
            title="理智"
            :content="stage.apCost"
          />
          <FactTableItem
            title="最短通关时间"
            :content="formatDuration(stage.minClearTime)"
          />
        </FactTable>
      </v-col>
      <v-col
        class="flex-md-grow-1 flex-lg-grow-1 flex-xl-grow-1"
      >
        <ul>
          <li>
            <v-icon>
              mdi-poll-box
            </v-icon>
            全站 24 小时掉落汇报排行第 1 名
          </li>
          <li>
            <v-icon>
              mdi-poll-box
            </v-icon>
            全站总掉落汇报排行第 1 名
          </li>
        </ul>
        {{ stage.existence }}
      </v-col>
      <v-col
        class="md400px flex-md-grow-0 flex-lg-grow-0 flex-xl-grow-0"
      >
        <v-btn
          block
          large
          color="yellow"
          :outlined="dark"
          class="mb-2"
        >
          <v-icon left>
            mdi-star
          </v-icon>
          星标此关卡
        </v-btn>
        <v-btn
          block
          large
          color="orange"
          :outlined="dark"
          class="mb-2 black--text"
        >
          <v-icon left>
            mdi-magnify
          </v-icon>
          对此关卡进行高级查询
        </v-btn>

        <v-divider class="my-4" />

        <h4 class="heading my-4">
          <v-icon>
            mdi-link
          </v-icon>
          外部链接
        </h4>

        <BackdropCard
          v-for="link in links"
          :key="link.id"
          small
          hover
          :href="link.href"
          class="bkop-medium mb-2"
        >
          <template v-slot:backdrop>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </template>

          <h2 class="heading my-1">
            <!--            {{ renderTranslation(link.title) }}-->
            {{ $t('stage.details.actions.links.' + link.id) }}
          </h2>
        </BackdropCard>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import timeFormatter from "@/utils/timeFormatter";
import FactTable from "@/components/stats/fact-table/FactTable";
import FactTableItem from "@/components/stats/fact-table/FactTableItem";
import BackdropCard from "@/components/global/BackdropCard";
import Theme from "@/mixins/Theme";

export default {
  name: "StageDetails",
  components: {BackdropCard, FactTableItem, FactTable},
  mixins: [Theme],
  props: {
    stage: {
      type: Object,
      required: true
    },
    zone: {
      type: Object,
      required: true
    },
    stats: {
      type: Array,
      required: true
    },
  },
  computed: {
    links() {
      return [
        {
          id: "prts-wiki",
          icon: "mdi-file-document",
          href: `http://prts.wiki/w/${this.stage.code}`
        },
        {
          id: "map-arknights-com",
          icon: "mdi-map",
          href: `https://maps.ark-nights.com/stage/${this.stage.code}`
        }
      ]
    }
  },
  methods: {
    formatDuration(s) {
      return timeFormatter.duration(s)
    }
  },
}
</script>

<style scoped>

</style>