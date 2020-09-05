<template>
  <v-card
    color="background"
    elevation="9"
    class="transition-all"
  >
    <v-fade-transition>
      <v-overlay
        v-if="ctrl"
        :opacity="0.8"
        absolute
        style="border: 3px solid #2196f3"
      >
        <v-icon :size="72">
          mdi-cursor-default-click
        </v-icon>
        <v-icon>
          mdi-arrow-right
        </v-icon>
        <v-icon :size="36">
          mdi-link-box
        </v-icon>
      </v-overlay>
    </v-fade-transition>
    <v-card-title
      class="flex-row"
    >
      <ItemIcon
        :item="item"
        :ratio="0.5"
      />
      <span class="title ml-2">
        {{ item.name }}
      </span>

      <!--      <span-->
      <!--        class="ml-1 caption text&#45;&#45;text"-->
      <!--        :class="{'text-glow': ctrl}"-->
      <!--      >-->
      <!--        查看详细数据-->
      <!--      </span>-->
    </v-card-title>
    <v-card-text v-if="stats.data.length">
      <v-simple-table dense>
        <thead>
          <tr>
            <th>
              {{ $t('stats.headers.stage') }}
            </th>
            <th class="font-weight-bold">
              {{ $t('stats.headers.percentage') }}
              <v-icon small>
                mdi-sort-descending
              </v-icon>
            </th>
            <th>
              {{ $t('stats.headers.quantity') }}
              /
              {{ $t('stats.headers.times') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stat in stats.data"
            :key="stat.stageId"
            class="monospace"
            :class="{'orange--text font-weight-bold': highlight === stat.stageId}"
          >
            <td>
              <v-icon
                v-if="highlight === stat.stageId"
                color="orange"
                small
                class="mr-1"
              >
                mdi-arrow-right-circle
              </v-icon>
              <v-icon
                :color="highlight === stat.stageId ? 'orange' : ''"
                small
                class="mr-1"
              >
                {{ stat.zone.icon }}
              </v-icon>
              {{ stat.stageCode }}
            </td>
            <td>
              {{ stat.percentageText }}
            </td>
            <td>
              {{ stat.quantity }} / {{ stat.times }}
            </td>
          </tr>
          <tr
            v-if="stats.more"
            style="background: inherit !important;"
          >
            <td
              colspan="3"
              class="text-center"
            >
              <v-expand-x-transition>
                <v-icon
                  v-if="!ctrl"
                  small
                  color="text"
                  :class="{'text-glow': ctrl}"
                >
                  mdi-apple-keyboard-shift
                </v-icon>
              </v-expand-x-transition>
              <v-expand-x-transition>
                <v-icon
                  v-if="!ctrl"
                  x-small
                  color="text"
                  :class="{'text-glow': ctrl}"
                >
                  mdi-plus
                </v-icon>
              </v-expand-x-transition>
              <v-icon
                small
                color="text"
                :class="{'text-glow': ctrl}"
              >
                mdi-cursor-default-click
              </v-icon>
              <v-icon
                color="grey"
                class="ml-1"
                :class="{'text-glow': ctrl}"
              >
                mdi-dots-horizontal
              </v-icon>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import get from '@/utils/getters'
  import ItemIcon from "@/components/global/ItemIcon";
  import existUtils from "@/utils/existUtils";
  import strings from "@/utils/strings";
  import config from "@/config"

  const pagination = config.previewCard.item.pagination;

  export default {
    name: "PreviewItemCard",
    components: {ItemIcon},
    props: {
      itemId: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        ctrl: false
      }
    },
    computed: {
      item() {
        const item = get.items.byItemId(this.itemId)
        return {
          ...item,
          name: strings.translate(item, "name")
        }
      },
      stats () {
        const data = get.statistics.byItemId(this.itemId)
          // filter out stages that have too less samples
          .filter(el => el.times > 100)
          // only open stages
          .filter(el => existUtils.existence(el.stage, true))

          .sort((a, b) => b.percentage - a.percentage)

        return {
          data: data
            .slice(0, pagination)
            .map(el => {
              return {
                ...el,
                stageCode: strings.translate(el.stage, "code")
              }
            }),
          more: data.length > pagination
        }
      },
      highlight () {
        return this.$route.params.stageId
      }
    },
    mounted() {
      document.addEventListener("keydown", this.onShiftKey, {capture: true, passive: true})
      document.addEventListener("keyup", this.onShiftKey, {capture: true, passive: true})
    },
    beforeDestroy() {
      document.removeEventListener("keydown", this.onShiftKey)
      document.removeEventListener("keyup", this.onShiftKey)
    },
    methods: {
      onShiftKey (e) {
        this.ctrl = e.shiftKey
      }
    },
  }
</script>

<style scoped>

</style>