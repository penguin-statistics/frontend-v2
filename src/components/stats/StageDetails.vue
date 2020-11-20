<template>
  <v-card class="bkop-light px-8 elevation-4 ma-2">
    <v-row
      align="start"
      align-content="start"
    >
      <v-col
        class="flex-md-grow-1 flex-lg-grow-1 flex-xl-grow-1"
      >
        <v-card-title class="py-4 pl-0">
          <v-icon left>
            mdi-information
          </v-icon>
          关于此作战
        </v-card-title>

        <FactTable class="mb-4">
          <FactTableItem
            title="章节"
            :content="zone.zoneName"
          />
          <FactTableItem
            title="作战"
            :content="stage.code"
          />
        </FactTable>

        <FactTable class="mb-4">
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
      <v-col class="md300px flex-md-grow-0 flex-lg-grow-0 flex-xl-grow-0">
        <v-card-title class="py-4 pl-0">
          <v-icon left>
            mdi-link
          </v-icon>
          外部链接
        </v-card-title>

        <BackdropCard
          v-for="link in links"
          :key="link.id"
          small
          hover
          dense
          :href="link.href"
          class="bkop-medium mb-2 py-2"
        >
          <template v-slot:backdrop>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </template>

          <h2 class="heading">
            {{ $t('stage.details.actions.links.' + link.id) }}
          </h2>
        </BackdropCard>
      </v-col>
      <v-col
        class="md300px lg400px flex-md-grow-0 flex-lg-grow-0 flex-xl-grow-0 flex-fill"
      >
        <v-card-title class="py-4 pl-0">
          <v-icon left>
            mdi-link
          </v-icon>
          快速操作
        </v-card-title>

        <v-hover>
          <template #default="{ hover }">
            <v-btn
              large
              block
              color="yellow"
              :outlined="!isFavorite"
              :light="isFavorite"
              class="mb-2 flex-grow-1"
              :class="{'text--darken-4': !dark && !isFavorite}"
              @click="toggleFavorite"
            >
              <v-slide-y-transition leave-absolute>
                <div v-if="isFavorite">
                  <v-scroll-x-transition
                    leave-absolute
                  >
                    <span
                      v-if="hover"
                      key="is-favorite-hover"
                      class="d-flex flex-row caption favorite-hover-border"
                    >
                      <v-icon
                        left
                        small
                      >
                        mdi-star-off
                      </v-icon>
                      点击以取消
                    </span>
                    <span
                      v-else
                      key="is-favorite"
                      class="d-flex flex-row"
                    >
                      <v-icon left>
                        mdi-star
                      </v-icon>
                      已星标此作战
                    </span>
                  </v-scroll-x-transition>
                </div>
              </v-slide-y-transition>
              <v-slide-y-reverse-transition leave-absolute>
                <span
                  v-if="!isFavorite"
                  key="not-favorite"
                  class="d-flex flex-row"
                >
                  <v-icon left>
                    mdi-star-outline
                  </v-icon>
                  星标此作战
                </span>
              </v-slide-y-reverse-transition>
            </v-btn>
          </template>
        </v-hover>
        <v-btn
          block
          large
          color="orange"
          outlined
          :class="{'orange--text text--darken-4': !dark}"
          class="mb-2 black--text"
        >
          <v-icon left>
            mdi-database-search
          </v-icon>
          进行高级查询
        </v-btn>
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
import mirror from "@/utils/mirror";

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
          href: mirror.adapter({
            cn: `https://mapcn.ark-nights.com/map/${this.stage.stageId}`,
            io: `https://map.ark-nights.com/map/${this.stage.stageId}`
          })
        }
      ]
    },
    isFavorite () {
      return this.$store.getters["stagePreferences/hasFavorite"](this.stage.stageId)
    }
  },
  methods: {
    formatDuration(s) {
      return timeFormatter.duration(s)
    },
    toggleFavorite() {
      this.$store.commit("stagePreferences/toggleFavorite", this.stage.stageId)
    }
  },
}
</script>

<style scoped>
.favorite-hover-border {
  border-color: rgba(0, 0, 0, 1);
  border-width: 0 0 0 2px;
  border-style: solid;
  padding-left: 10px;
}
</style>