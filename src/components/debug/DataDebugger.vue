<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h1 class="headline">
          Data Debugger
        </h1>
      </v-card-title>
      <v-card-subtitle class="mt-1">
        <span class="subtitle-1">
          This is only intended for debugging purposes. If you accidentally see this page, that means something goes wrong. Please return to the home page by <a href="/">Click Here</a>
        </span>
      </v-card-subtitle>
      <v-card-text>
        <h2>getter tests</h2>
        <h3>Item</h3>
        <ul>
          <li>
            Length: {{ getter.items.all().length }}
          </li>
          <li>
            Get By ID
            <ul>
              <li>
                byItemId 30013: Should get 固源岩组 for all Servers
                <br>
                <code>{{ getter.items.byItemId("30013") }}</code>
              </li>
              <li>
                byItemId 31013: Should only get 凝胶 for CN Server, otherwise should Null:
                <br>
                <code>{{ getter.items.byItemId("31013") }}</code>
              </li>
            </ul>
          </li>
          <li>
            Get By Name
            <ul>
              <li>
                byName 固源岩组: Should get 固源岩组 for all Servers
                <br>
                <code>{{ getter.items.byName("固源岩组") }}</code>
              </li>
              <li>
                byName 凝胶: Should only get 凝胶 for CN Server, otherwise should Null:
                <br>
                <code>{{ getter.items.byName("凝胶") }}</code>
              </li>
            </ul>
          </li>
        </ul>

        <h3>Stage</h3>
        <ul>
          <li>
            Length: {{ getter.stages.all().length }}
          </li>
          <li>
            Get By ID
            <ul>
              <li>
                byStageId main_00-01: Should get 0-1 for all Servers
                <br>
                <code>{{ getter.stages.byStageId("main_00-01") }}</code>
              </li>

              <li>
                byParentZoneId main_0-01: Should get 11 entries for all Servers
                <br>
                Entries: <code>{{ getter.stages.byParentZoneId("main_0").length }}</code>
              </li>
            </ul>
          </li>
        </ul>

        <h3>Zones</h3>
        <ul>
          <li>
            Length: {{ getter.zones.all().length }}
          </li>
          <li>
            Get By ID
            <ul>
              <li>
                byZoneId main_0: Should get main_0 for all Servers
                <br>
                <code>{{ getter.zones.byZoneId("main_0") }}</code>
              </li>

              <li>
                byType ACTIVITY: Should get ACTIVITY
                <br>
                Entries: <code>{{ JSON.stringify(getter.zones.byType("ACTIVITY"), null, 0) }}</code>
              </li>
            </ul>
          </li>
        </ul>

        <h3>Statistics</h3>
        <ul>
          <li>
            Length: {{ getter.statistics.base(el => el).length }}
          </li>
          <li>
            Get By ID
            <ul>
              <!--              <li>-->
              <!--                <v-expansion-panels>-->
              <!--                  <v-expansion-panel>-->
              <!--                    <v-expansion-panel-header>-->
              <!--                      byItemId 30013: Should get 30013 for all Servers-->
              <!--                    </v-expansion-panel-header>-->
              <!--                    <v-expansion-panel-content>-->
              <!--                      <code>{{ getter.statistics.byItemId("30013") }}</code>-->
              <!--                    </v-expansion-panel-content>-->
              <!--                  </v-expansion-panel>-->
              <!--                </v-expansion-panels>-->
              <!--              </li>-->

              <li>
                byStageId main_00-01: Should get main_00-01 for all Servers
                <br>
                Entries: <code>{{ JSON.stringify(getter.statistics.byStageId("act9d0_01"), null, 0) }}</code>
              </li>
            </ul>
          </li>
        </ul>

        <h3>Trends</h3>
        <ul>
          <li>
            Length: {{ getter.trends.all().length }}
          </li>
          <li>
            Get By ID
            <ul>
              <li>
                byItemId 30013: Should get 30013 for all Servers
                <br>
                <code>{{ JSON.stringify(getter.trends.byItemId("30013"), null, 0) }}</code>
              </li>

              <li>
                byStageId main_00-01: Should get main_00-01 for all Servers
                <br>
                Entries: <code>{{ JSON.stringify(getter.trends.byStageId("act9d0_01"), null, 0) }}</code>
              </li>
            </ul>
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import getter from '@/utils/getters'
export default {
  name: 'DataDebugger',
  computed: {
    store () {
      return this.$store
    },
    getter () {
      return getter
    }
  }
}
</script>

<style scoped>
h1, h2, h3, h4, h5, h6 {
  margin-top: 16px !important;
}
  code {
    line-height: 1.2 !important;
    margin-bottom: 2em;
  }
</style>
