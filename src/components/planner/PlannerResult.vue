<template>
  <v-card color="indigoBackground">
    <v-card-title
      class="indigo pb-4 elevation-2 white--text"
      style="background: #a14042; line-height: 1.1;"
    >
      <div
        class="overline d-block"
        style="width: 100%"
      >
        ArkPlanner
      </div>
      <br>
      <div
        class="headline font-weight-bold d-block"
        style="width: 100%"
      >
        {{ $t('planner.calculation.title') }}
      </div>
    </v-card-title>
    <v-card-text>
      <v-row
        align="center"
        justify="center"
        no-gutters
        class="my-2"
      >
        <v-col
          cols="12"
          sm="4"
          md="4"
          lg="4"
          xl="4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-cash</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="monospace">
                {{ parseTimes(result.gold) | thousandSeparator }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('planner.calculation.lmb') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col
          cols="12"
          sm="4"
          md="4"
          lg="4"
          xl="4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-brain</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="monospace">
                {{ parseTimes(result.cost) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('planner.calculation.sanity') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col
          cols="12"
          sm="4"
          md="4"
          lg="4"
          xl="4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-card-bulleted</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="monospace">
                {{ parseTimes(result.exp) }} EXP
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('planner.calculation.exp') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-tabs
        v-model="tab"
        icons-and-text
        grow
        :show-arrows="false"
        centered
        class="elevated-tab"
      >
        <v-tabs-slider />
        <v-tab
          v-for="t in tabs"
          :key="t.id"
          v-haptic
        >
          {{ $t(t.text) }}
          <v-icon>{{ t.icon }}</v-icon>
        </v-tab>
        <v-tab-item>
          <div class="d-flex justify-center mt-3">
            <v-icon
              small
              color="grey"
              class="mr-1"
            >
              mdi-information
            </v-icon>
            {{ $t('planner.notices.autoExistence') }}
          </div>
          <v-alert
            v-if="!result.stages.length"
            type="warning"
            border="left"
            class="mt-4"
          >
            {{ $t('planner.calculation.noStage') }}
          </v-alert>
          <v-row
            align="start"
            justify="start"
          >
            <v-col
              v-for="[index, stage] in result.stages.entries()"
              :key="stage.stage.stageId"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
              class="align-self-stretch"
            >
              <v-card class="card-item">
                <v-card-text>
                  <div class="title d-flex justify-center">
                    <span
                      v-ripple
                      class="font-weight-bold headline d-flex align-center cursor-pointer card-item-title__clickable clickable-hover"
                      style="margin-left: -8px; margin-top: -8px; padding: 4px 8px; border-radius: 4px;"
                      @click="redirectStage(stage.stage)"
                    >
                      {{ stage.stage.code }}
                      <v-icon
                        class="ml-2"
                        small
                      >
                        mdi-link
                      </v-icon>
                    </span>
                    <v-spacer />
                    <small style="margin-top: -4px">#{{ index + 1 }}</small>
                  </div>
                  <div class="display-1 text-center monospace font-weight-bold my-2">
                    {{ parseTimes(stage.count) }} <small class="title">{{ $t('planner.calculation.times') }}</small>
                  </div>
                  <div>
                    <div
                      v-for="material in stage.materials"
                      :key="material.name"
                      class="d-inline-flex mx-2 my-1 cursor-pointer"
                      @click="redirectItem(material.item.itemId)"
                    >
                      <v-badge
                        bottom
                        overlap
                        bordered
                        label
                        color="indigo"
                        :offset-x="24"
                        :offset-y="20"
                        :content="`×${parseAmount(material.value)}`"
                      >
                        <Item
                          :item="material.item"
                        />
                      </v-badge>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-alert
            v-if="!result.syntheses.length"
            type="warning"
            border="left"
            class="mt-4"
          >
            {{ $t('planner.calculation.noSyntheses') }}
          </v-alert>
          <v-row
            align="start"
            justify="start"
          >
            <v-col
              v-for="synthesis in result.syntheses"
              :key="synthesis.target.item.itemId"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
              class="align-self-stretch"
            >
              <v-card class="card-item">
                <v-card-text>
                  <div class="title d-flex justify-start">
                    <span
                      v-ripple
                      class="font-weight-bold headline d-flex align-center cursor-pointer card-item-title__clickable clickable-hover"
                      @click="redirectItem(synthesis.target.item.itemId)"
                    >
                      {{ synthesis.target.name }}
                      <v-icon
                        class="ml-2"
                        small
                      >
                        mdi-link
                      </v-icon>
                    </span>
                    <v-spacer />
                    <Item
                      :item="synthesis.target.item"
                      disable-tooltip
                      :ratio="0.5"
                      style="margin-top: -4px; flex: 0 0 30px"
                    />
                  </div>
                  <div class="display-1 text-center monospace font-weight-bold my-2">
                    &times;{{ parseTimes(synthesis.count) }}
                  </div>
                  <div
                    v-for="item in synthesis.items"
                    :key="item.name"
                    class="d-inline-flex mx-2 my-1 cursor-pointer"
                    @click="redirectItem(item.item.itemId)"
                  >
                    <v-badge
                      bottom
                      overlap
                      bordered
                      label
                      color="secondary"
                      :offset-x="24"
                      :offset-y="20"
                      :content="`×${parseAmount(item.value)}`"
                    >
                      <Item
                        :item="item.item"
                      />
                    </v-badge>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row
            align="start"
            justify="start"
          >
            <v-col
              v-for="value in result.values"
              :key="value.level"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
              class="align-self-stretch"
            >
              <v-card class="card-item">
                <v-card-text>
                  <div class="title">
                    <span class="font-weight-bold headline">{{ $t('planner.calculation.level') }} {{ value.level }}</span>
                  </div>
                  <div
                    v-for="item in value.materials"
                    :key="item.name"
                    class="d-inline-flex mx-4 my-1 cursor-pointer"
                    @click="redirectItem(item.item.itemId)"
                  >
                    <v-badge
                      bottom
                      overlap
                      bordered
                      label
                      color="secondary"
                      :offset-x="24"
                      :offset-y="20"
                      :content="parseAmount(item.value)"
                    >
                      <Item
                        :item="item.item"
                      />
                    </v-badge>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-card-text>

    <v-card-actions class="elevation-4">
      <v-btn
        v-haptic
        text
        block
        large
        @click="$emit('close')"
      >
        <v-divider style="opacity: 0.3" />
        <span class="mx-4 d-flex align-center">
          <v-icon left>mdi-close</v-icon>{{ $t('meta.dialog.close') }}
        </span>
        <v-divider style="opacity: 0.3" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Item from "@/components/global/Item";
  import formatter from "@/utils/formatter";
  export default {
    name: "PlannerResult",
    components: {Item},
    props: {
      result: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        tab: null,
        tabs: [{
          id: "stages",
          icon: "mdi-cube",
          text: "planner.calculation.tabs.stages"
        }, {
          id: "syntheses",
          icon: "mdi-treasure-chest",
          text: "planner.calculation.tabs.syntheses"
        }, {
          id: "values",
          icon: "mdi-cash-usd",
          text: "planner.calculation.tabs.values"
        }]
      }
    },
    methods: {
      redirectItem(itemId) {
        this.$router.push({
          name: "StatsByItem_SelectedItem",
          params: {
            itemId
          }
        })
      },
      redirectStage(stage) {
        this.$router.push({
          name: "StatsByStage_Selected",
          params: {
            zoneId: stage.zoneId,
            stageId: stage.stageId,
          }
        })
      },
      parseTimes (num) {
        return formatter.thousandSeparator(Math.ceil(parseFloat(num)))
      },
      parseAmount (num) {
        return formatter.thousandSeparator(parseFloat(num))
      }
    },
  }
</script>

<style scoped>
  .card-item {
    border: 2px solid #4350b0;
    height: 100%
  }
  .card-item-title__clickable {
    margin-left: -8px;
    margin-top: -8px;
    padding: 4px 8px;
    border-radius: 4px;
    text-transform: initial;
    flex: inherit;
    position: relative;
  }
</style>