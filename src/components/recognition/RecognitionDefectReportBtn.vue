<template>
  <div>
    <v-dialog
      v-model="expanded"
      :persistent="['preflight', 'uploading'].includes(state)"
      scrollable
      max-width="600px"
      content-class="position-relative"
    >
      <v-overlay
        absolute
        :value="['preflight', 'uploading'].includes(state)"
      >
        <div
          class="d-flex flex-column align-center justify-center"
        >
          <v-progress-circular
            :value="percentage"
            size="64"
            color="primary"
            class="mb-2 transition-fast"
            rotate="-90"
          />
          <div class="caption">
            {{ $t(`report.recognition.defectReport.state.${state}`) }}
          </div>
        </div>
      </v-overlay>
      <v-card>
        <v-card-title class="headline deep-purple d-flex align-center">
          <v-icon
            left
            size="28"
            class="mr-2"
          >
            mdi-bug
          </v-icon>
          {{ $t(`report.recognition.defectReport.dialog.title`) }}
        </v-card-title>

        <v-card-subtitle
          class="px-6 pt-3 deep-purple"
        >
          {{ $t(`report.recognition.defectReport.dialog.subtitle`) }}
        </v-card-subtitle>

        <v-card-text>
          <Subheader>
            {{ $t(`report.recognition.defectReport.dialog.section.originalImage`) }}
          </Subheader>

          <v-img
            :src="result.blobUrl"
            contain
            min-height="120px"
            max-height="480px"
            class="unknown-ratio-glow"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height caption">
                {{ $t('report.recognition.confirm.loadingImage') }}
              </div>
            </template>
            <template #default>
              <div class="d-flex flex-row full-width justify-end fallthrough">
                <span
                  class="monospace font-weight-bold bkop-medium text-right border-outlined img-side-tag elevation-4"
                >
                  {{ result.file.lastModified | timeAbsolute }}
                  <span
                    class="d-block text-right"
                    style="font-size: small; line-height: 1.5em"
                  >
                    {{ result.file.lastModified | timeRelative }}
                  </span>
                </span>
              </div>
            </template>
          </v-img>

          <Subheader>
            {{ $t(`report.recognition.defectReport.dialog.section.recognitionResult`) }}
          </Subheader>

          <v-card
            class="elevation-2 monospace"
          >
            <v-card-text class="recognition-json-card">
              <pre>{{ recognitionResult }}</pre>
            </v-card-text>
          </v-card>

          <Subheader>
            {{ $t(`report.recognition.defectReport.dialog.section.environment`) }}
          </Subheader>

          <v-card
            class="elevation-2 monospace"
          >
            <v-card-text class="recognition-json-card">
              <pre>{{ envInfo }}</pre>
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-haptic
            color="primary"
            @click="submit"
          >
            {{ $t('meta.dialog.submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      v-if="uploaded"
      outlined
      text
      disabled
      color="deep-purple lighten-4"
    >
      <v-icon left>
        mdi-bug-check
      </v-icon>
      {{ $t("report.recognition.defectReport.reported") }}
    </v-btn>

    <v-btn
      v-else
      depressed
      text
      outlined
      color="deep-purple lighten-4"
      @click="expanded = true"
    >
      <v-icon left>
        mdi-bug
      </v-icon>
      {{ $t("report.recognition.defectReport.action") }}
    </v-btn>
  </div>
</template>

<script>
import Theme from "@/mixins/Theme";
import Subheader from "@/components/global/Subheader";
import reportDefect from "@/apis/reportDefect";
import {service} from "@/utils/service";
import snackbar from "@/utils/snackbar";

export default {
  name: "RecognitionDefectReportBtn",
  components: {Subheader},
  mixins: [Theme],
  props: {
    result: {
      type: Object,
      required: true
    },
    index: {
      type: String,
      required: true
    },
    envContext: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      uploaded: false,
      expanded: false,
      // state: 'idle' | 'preflight' | 'uploading' | 'resolved' | 'rejected'
      state: "idle",
      uploadProgress: {
        loaded: 0,
        total: 1
      },
    }
  },
  computed: {
    recognitionResult () {
      return JSON.stringify(this.result.result, null, 4)
    },
    envInfo () {
      return JSON.stringify(this.envContext, null, 4)
    },
    // percentage returns an overall percentage
    percentage () {
      if (this.state === 'idle') return 0
      if (this.state === 'preflight') return 20
      if (this.state === 'uploading') {
        return this.uploadProgress.loaded / this.uploadProgress.total * 80 + 20
      }
      if (this.state === 'resolved') return 100
      return 100
    }
  },
  methods: {
    async submit() {
      try {
        this.state = "preflight";

        const preflight = (await reportDefect.initDefectReport({
          environment: this.envContext,
          recognitionResult: this.result.result,
        })).data

        this.state = "uploading";

        const formData = new FormData()
        formData.set('policy', preflight.uploadParams.policy)
        formData.set('authorization', preflight.uploadParams.authorization)
        formData.set('file', this.result.file)

        await service.post(preflight.uploadParams.url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total
            }
          },
          withCredentials: false
        })

        this.state = "resolved";
        this.uploaded = true;
        this.reset()
        snackbar.launch('success', 10000, 'report.recognition.defectReport.snackbar.succeeded')
      } catch (e) {
        snackbar.launch('error', 10000, 'report.recognition.defectReport.snackbar.failed')
        this.reset()
        throw e
      }
    },
    reset() {
      this.expanded = false;
      this.state = "idle";
      this.uploadProgress = {
        loaded: 0,
        total: 1
      };
    }
  },
}
</script>

<style>
.img-side-tag {
  padding: 3px 9px 2px 8px;
  border-radius: 0 0 0 8px;
  border-right-width: 0 !important;
  border-top-width: 0 !important;
}

.recognition-json-card {
  min-height: 120px;
  max-height: 240px;
  overflow-y: auto;
}

.transition-fast {
  transition: all 30ms ease-out;
}
</style>
