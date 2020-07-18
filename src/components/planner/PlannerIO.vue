<template>
  <v-card>
    <v-card-title>
      {{ $t('planner.actions.importExport') }}
    </v-card-title>

    <v-card-text>
      <!--      <Subheader>-->
      <!--        短链接-->
      <!--      </Subheader>-->

      <!--            <v-fade-transition leave-absolute>-->
      <!--              <v-text-field-->
      <!--                v-if="shortlink.content && !shortlink.generating"-->
      <!--                id="copy-content"-->
      <!--                label="分享短链接"-->
      <!--                :value="shortlink.content"-->
      <!--                dense-->
      <!--                outlined-->
      <!--                placeholder="https://exusi.ai/foobar"-->

      <!--                readonly-->

      <!--                append-icon="mdi-content-copy"-->
      <!--                @click:append="copy(shortlink.content)"-->
      <!--              />-->

      <!--              <v-btn-->
      <!--                v-else-->
      <!--                block-->
      <!--                :loading="shortlink.generating"-->
      <!--                large-->
      <!--                class="mb-5"-->
      <!--                :class="{'primary': !shortlink.generating, 'slash-strip&#45;&#45;loading': shortlink.generating}"-->
      <!--                @click="generateShortlink"-->
      <!--              >-->
      <!--                <template v-slot:loader>-->
      <!--                  <v-progress-circular-->
      <!--                    indeterminate-->
      <!--                    :size="16"-->
      <!--                    :width="2"-->
      <!--                    class="mr-2"-->
      <!--                  />-->
      <!--                  正在生成...-->
      <!--                </template>-->
      <!--                <v-icon left>-->
      <!--                  mdi-link-box-->
      <!--                </v-icon>-->
      <!--                生成短链接-->
      <!--              </v-btn>-->
      <!--            </v-fade-transition>-->
      

      <Subheader>
        {{ $t('planner.actions.config._name') }}
      </Subheader>

      <v-textarea
        :label="$t('planner.actions.config.share')"
        :value="rendered.config"
        dense
        readonly
        hide-details
        outlined
        rows="5"
        class="monospace-pure planner-import-export mb-4"
        onmouseenter="this.select()"
        onmouseleave="window.getSelection().removeAllRanges()"

        append-icon="mdi-content-copy"
        @click:append="copy(rendered.config)"
      />

      <v-textarea
        v-model="importConfig"
        :label="$t('planner.actions.config.import')"
        dense
        hide-details
        outlined
        rows="14"
        clearable
        class="monospace-pure planner-import-export"
        placeholder="{&quot;@type&quot;:&quot;@penguin-statistics/planner/config&quot;,&quot;items&quot;:[{&quot;id&quot;:&quot;42&quot;,&quot;need&quot;:42,&quot;have&quot;:42},...],&quot;options&quot;:{...},&quot;excludes&quot;:[]}"
        style="border-radius: 4px 4px 0 0; z-index: 10"
        data-gramm="false"
      />

      <div class="d-flex justify-end">
        <v-btn
          outlined
          block
          large
          color="blue-grey"
          class="d-flex"
          style="border-radius: 0 0 4px 4px; margin-top: -1px"
          @click="doImport"
        >
          <v-divider style="opacity: 0.2" />
          <span class="mx-6 d-flex align-center">
            <v-icon left>
              mdi-file-import
            </v-icon>
            {{ $t('planner.actions.import') }}
          </span>
          <v-divider style="opacity: 0.2" />
        </v-btn>
      </div>
    </v-card-text>

    <v-divider />
    
    <v-card-actions>
      <v-spacer />
      <v-btn
        text
        @click="$emit('close')"
      >
        {{ $t('meta.dialog.close') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import * as clipboard from "clipboard-polyfill";
  import Subheader from "@/components/global/Subheader";
  import snackbar from "@/utils/snackbar";
  import marshaller from "@/utils/marshaller";
  import unmarshaller from "@/utils/unmarshaller";
  import Console from "@/utils/Console";
  export default {
    name: "PlannerIO",
    components: {Subheader},
    props: {
      config: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        shortlink: {
          generating: false,
          content: null
        },
        importConfig: ""
      }
    },
    computed: {
      rendered() {
        return {
          config: JSON.stringify(marshaller.planner.config(this.config))
        }
      }
    },
    watch: {
      config () {
        this.shortlink.content = null
      }
    },
    methods: {
      generateShortlink() {
        this.shortlink.generating = true
        setTimeout(() => {
          this.shortlink.generating = false
          this.shortlink.content = "https://exusi.ai/foobar"
        }, 3000)
      },
      copy (content) {
        clipboard.writeText(content)
          .then(() => {
            snackbar.launch("success", 5000, "clipboard.success")
          })
          .catch(() => {
            snackbar.launch("error", 5000, "clipboard.error")
          })
      },
      doImport() {
        const unmarshalled = unmarshaller.planner.config.auto(this.importConfig)

        if (unmarshalled.exception) {
          return snackbar.launch("error", 5000, `planner.import.${unmarshalled.exception}`)
        }

        this.$emit('reset')

        let importedCounter = 0;

        const currentItems = this.$store.getters["planner/config"].items

        for (const item of currentItems) {
          const toImportItem = unmarshalled.converted.items.find(el => el.id === item.id)
          if (toImportItem) {
            item.have = toImportItem.have || 0
            item.need = toImportItem.need || 0
            importedCounter++
          }
        }

        this.$store.commit("planner/changeItems", currentItems)

        if (unmarshalled.converted.options) {
          const options = Object.assign(this.config.options, unmarshalled.converted.options);
          this.$store.commit("planner/changeOptions", options)
        }

        if (unmarshalled.converted.excludes) {
          this.$store.commit("planner/changeExcludes", unmarshalled.converted.excludes)
        }

        snackbar.launch("success", 5000, "planner.import.success", {
          amount: importedCounter
        })

        Console.info("PlannerIO", "unmarshalled import config", unmarshalled)
      }
    },
  }
</script>

<style scoped>

</style>