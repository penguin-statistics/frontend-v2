<template>
  <v-card
    color="background"
    elevation="6"
  >
    <v-card-title :class="{'pb-0': stats.data.length}">
      <ItemIcon
        :item="item"
        :ratio="0.5"
      />
      <span class="title ml-2">
        {{ item.name }}
      </span>
    </v-card-title>
    <v-card-text v-if="stats.data.length">
      <v-subheader class="ma-0 pa-0">
        数据速览
      </v-subheader>
      <v-simple-table dense>
        <table>
          <thead>
            <tr>
              <th>
                {{ $t('stats.headers.stage') }}
              </th>
              <th>
                统计数据
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="stat in stats.data"
              :key="stat.stageId"
            >
              <td>
                {{ stat.stage.code }}
              </td>
              <td>
                {{ stat.percentageText }}
              </td>
            </tr>
            <tr
              v-if="stats.more"
              style="background: inherit !important;"
            >
              <td
                colspan="2"
                class="text-center"
              >
                <v-icon color="grey">
                  mdi-dots-horizontal
                </v-icon>
              </td>
            </tr>
          </tbody>
        </table>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import get from '@/utils/getters'
  import ItemIcon from "@/components/global/ItemIcon";

  const pagination = 5;

  export default {
    name: "PreviewItemCard",
    components: {ItemIcon},
    props: {
      itemId: {
        type: String,
        required: true
      },
    },
    computed: {
      item() {
        return get.items.byItemId(this.itemId)
      },
      stats () {
        const data = get.statistics.byItemId(this.itemId)
        return {
          data: data
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, pagination),
          more: data.length > pagination
        }
      }
    },
  }
</script>

<style scoped>

</style>