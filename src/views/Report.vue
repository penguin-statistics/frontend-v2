<i18n>
  {
    "zh": {
      "opensAt": "开放时间：{0} ~ {1}",
      "zone": {
        "name": "章节",
        "types": {
          "MAINLINE": "主线",
          "WEEKLY": "物资筹备",
          "ACTIVITY": "限时活动"
        }
      },
      "stage": {
        "name": "关卡",
        "apCost": "{apCost} 点理智",
        "loots": {
          "normal": "常规掉落",
          "extra": "额外物资",
          "special": "幸运掉落"
        }
      },
      "report": {
        "name": "上报结果"
      },
      "rules": {
        "isPositiveInteger": "需为正整数"
      }
    },
    "en": {
      "opensAt": "Opens At: {0} ~ {1}",
      "zone": {
        "name": "Zone",
        "types": {
          "MAINLINE": "Mainline",
          "WEEKLY": "Weekly",
          "ACTIVITY": "Activity"
        }
      },
      "stage": {
        "name": "Stage",
        "apCost": "{apCost} points of AP required",
        "loots": {
          "normal": "Normal",
          "extra": "Extra",
          "special": "Special"
        }
      },
      "report": {
        "name": "Report"
      },
      "rules": {
        "isPositiveInteger": "Requires Natural Number"
      }
    }
  }
</i18n>

<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout align-center>
      <v-flex>
        <v-stepper
          v-model="step"
          class="bkop-light transparent"
        >
          <v-stepper-header>
            <v-stepper-step
              :complete="step > 1"
              :editable="step > 1"
              :step="1"
            >
              {{ $t('zone.name') }}
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="step > 2"
              :editable="step > 2"
              :step="2"
            >
              {{ $t('stage.name') }}
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="step === 3"
              :step="3"
            >
              {{ $t('report.name') }}
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content :step="1">
              <v-container
                fluid
                grid-list-lg
                class="py-0"
              >
                <v-list
                  v-for="zoneCategory in categorizedZones"
                  :key="zoneCategory.id"
                  subheader
                  class="transparent"
                >
                  <v-subheader inset>
                    {{ $t(['zone.types', zoneCategory.id].join('.')) }}
                  </v-subheader>

                  <v-list-tile
                    v-for="zone in zoneCategory.zones"
                    :key="zone.zoneId"
                    v-ripple
                    :disabled="zone.isOutdated"
                    avatar
                    @click="storeZoneSelection(zone.zoneId)"
                  >
                    <v-list-tile-avatar>
                      <v-icon>{{ zone.icon }}</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ zone.zoneName }}</v-list-tile-title>
                      <v-list-tile-sub-title v-if="zone.isActivity">
                        <span
                          :class="{ 'text--darken-1 font-weight-bold': true, 'red--text': zone.isOutdated, 'green--text': !zone.isOutdated }"
                        >{{ zone.isOutdated ? "已结束" : "正在进行" }}</span>
                        {{ $t('opensAt', zone.activityActiveTime) }}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-icon color="grey lighten-1">
                        mdi-chevron-right
                      </v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-container>
            </v-stepper-content>

            <v-stepper-content
              v-if="selected.zone"
              :step="2"
            >
              <v-container
                fluid
                grid-list-lg
                class="py-0"
              >
                <v-list
                  subheader
                  :three-line="$vuetify.breakpoint.smAndUp"
                  class="transparent"
                >
                  <v-subheader
                    v-if="selectedZone"
                    inset
                  >
                    {{ selectedZone.zoneName || '' }}
                  </v-subheader>

                  <v-list-tile
                    v-for="stage in stages"
                    :key="stage.stageId"
                    v-ripple
                    avatar
                    @click="storeStageSelection(stage.stageId)"
                  >
                    <v-list-tile-avatar>
                      <v-icon>mdi-cube-outline</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ stage.code }}</v-list-tile-title>
                      <v-list-tile-sub-title>
                        <v-layout
                          align-center
                          justify-start
                          row
                          wrap
                          d-inline-flex
                        >
                          <v-flex :class="{ 'yellow--text font-weight-bold': true, 'amber--text text--darken-4': !$vuetify.dark }">
                            {{ $t('stage.apCost', {apCost: stage.apCost}) }}
                          </v-flex>

                          <v-divider
                            v-if="stage.normalDrop.length > 0"
                            vertical
                            class="hidden-xs-only mx-1"
                          />

                          <v-flex
                            v-if="stage.normalDrop.length > 0"
                            class="hidden-xs-only"
                          >
                            <div>{{ $t('stage.loots.normal') }}</div>
                            <Item
                              v-for="item in stage.normalDrop"
                              :key="item"
                              :item="getItem(item)"
                              :ratio="0.5"
                              disable-link
                            />
                          </v-flex>

                          <v-divider
                            v-if="stage.extraDrop.length > 0"
                            vertical
                            class="hidden-sm-and-down mx-1"
                          />

                          <v-flex
                            v-if="stage.extraDrop.length > 0"
                            class="hidden-sm-and-down"
                          >
                            <div>{{ $t('stage.loots.extra') }}</div>
                            <Item
                              v-for="item in stage.extraDrop"
                              :key="item*10"
                              :item="getItem(item)"
                              :ratio="0.5"
                              disable-link
                            />
                          </v-flex>

                          <v-divider
                            v-if="stage.specialDrop.length > 0"
                            vertical
                            class="hidden-sm-and-down mx-1"
                          />

                          <v-flex
                            v-if="stage.specialDrop.length > 0"
                            class="hidden-sm-and-down"
                          >
                            <div>{{ $t('stage.loots.special') }}</div>
                            <Item
                              v-for="item in stage.specialDrop"
                              :key="item*100"
                              :item="getItem(item)"
                              :ratio="0.5"
                              disable-link
                            />
                          </v-flex>
                        </v-layout>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-icon color="grey lighten-1">
                        mdi-chevron-right
                      </v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-container>
            </v-stepper-content>

            <v-stepper-content :step="3">
              <v-container
                v-for="stage in stageItems"
                fluid
                grid-list-sm

                class="py-0"
              >
                <v-subheader>
                  {{ $t('stage.loots.' + stage.id) }}
                </v-subheader>
                <v-flex
                  v-for="item in stage.drops"
                  class="py-1 px-2 d-inline-block"
                  xs12
                  sm6
                  md4
                  lg3
                  xl2
                >
                  <!--                  <h5 class="title mb-3">-->
                  <!--                    {{ item.name }}-->
                  <!--                  </h5>-->
                  <v-text-field
                    label="数量"
                    type="number"

                    outline
                    :rules="[validationRules.isPositiveInteger]"

                    :value="0"

                    append-icon="mdi-minus"
                    prepend-inner-icon="mdi-plus"

                    style="display: inline-flex"
                    @click:append-outer="alert('-- ' + item.id)"

                    @click:prepend="alert('++ ' + item.id)"
                  >
                    <template v-slot:prepend>
                      <Item
                        :item="item"
                        :ratio="0.75"
                        disable-link
                        style="margin-top: -7.5px"
                      />
                    </template>
                  </v-text-field>
                </v-flex>
              </v-container>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import get from '@/utils/getters'
  import Item from "@/components/Item";
  import ItemStepper from "@/components/ItemStepper";

  export default {
    name: "Report",
    components: {ItemStepper, Item},
    data: () => ({
      step: 1,
      selected: {
        zone: null,
        stage: null
      },
      demoItem: {
        "itemId": "2001",
        "name": "基础作战记录",
        "sortId": 15,
        "rarity": 1,
        "itemType": "CARD_EXP",
        "addTimePoint": 1,
        "spriteCoord": [
          0,
          0
        ],
        "meta": {
          "name": "基础作战记录",
          "color": "green",
          "icon": "mdi-plus"
        }
      }
    }),
    computed: {
      categorizedZones() {
        const categories = ["MAINLINE", "WEEKLY", "ACTIVITY"];
        let result = [];
        for (let category of categories) {
          result.push({
            id: category,
            zones: get.zones.byType(category)
          })
        }
        return result
      },
      selectedZone() {
        if (!this.selected.zone) return {zoneName: ''};
        return get.zones.byZoneId(this.selected.zone)
      },
      stages() {
        return get.stages.byParentZoneId(this.selected.zone)
      },
      stageItems () {
        if (!this.selected.stage) return [];
        let stages = get.stages.byStageId(this.selected.stage);
        let items = [];
        const categories = [{
          i18n: "normal",
          value: "normalDrop"
        }, {
          i18n: "extra",
          value: "extraDrop"
        }, {
          i18n: "special",
          value: "specialDrop"
        }];

        for (let category of categories) {
          let dropIds = stages[category.value];
          if (dropIds.length === 0) continue;
          let drops = [];
          for (let drop of dropIds) {
            drops.push(get.item.byItemId(drop))
          }

          items.push({
            id: category.i18n,
            drops
          })
        }
        return items
      },
      validationRules () {
        let rules = []
        const isNaturalNumber = value => {
          value = value.toString();
          let n1 = Math.abs(value);
          let n2 = parseInt(value, 10);
          return (!isNaN(n1) && n2 === n1 && n1.toString() === value) || this.$t('rules.isPositiveInteger');
        };
        rules.push(isNaturalNumber);
        if (!this.selected.stage) return rules;

        let limitations = get.limitations.byStageId(this.selected.stage);

      }
    },
    methods: {
      storeZoneSelection(zoneId) {
        this.step += 1;
        this.selected.zone = zoneId
      },
      storeStageSelection(stageId) {
        this.step += 1;
        this.selected.stage = stageId
      },
      getItem(itemId) {
        return get.item.byItemId(itemId)
      }
    }
  }
</script>

<style scoped>
  .theme--light .zoneTitle {
    color: #fff;
  }

  .v-table {
    background: transparent !important;
  }
</style>
