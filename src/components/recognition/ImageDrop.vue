<template>
  <div
    class="file-input"
    @dragover="dragover"
    @drop="drop"
  >
    <v-file-input
      ref="fileInput"
      v-model="files"
      outlined
      multiple
      :label="$t('report.recognition.queue')"
      persistent-hint
      class="cursor-pointer my-4"
      :hint="$t('report.recognition.tips.chooseImage')"
      counter
      show-size
      accept="image/*"
      :rules="rules"
      prepend-icon="mdi-image"
      @blur="onDrag = false"
      @change="Files => $emit('input', Files)"
      @update:error="e=>$emit('valid', $refs.fileInput.valid)"
    >
      <template
        v-slot:prepend-inner
      >
        <v-overlay
          absolute
          :value="onDrag"
          color="success"
          opacity="0.9"
        >
          {{ $t("report.recognition.tips.dragImage") }}
        </v-overlay>
        <v-overlay
          absolute
          :value="$vuetify.breakpoint.xsOnly && files.length === 0"
          color="success"
          opacity="0.9"
          @click.native="$refs.fileInput.$refs.input.click()"
        >
          {{ $t("report.recognition.tips.addImage") }}
        </v-overlay>
      </template>
      <template
        v-slot:selection="{ index, text }"
      >
        <template
          v-if="$vuetify.breakpoint.xsOnly"
        >
          <template
            v-if="index === 0"
          >
            <span
              class="overline mx-2"
            >
              {{ files.length }} File(s)
            </span>
          </template>
        </template>
        <template
          v-else
        >
          <v-chip
            v-if="index < 10"
            small
            close
            @click:close="removeFileByIndex(index)"
          >
            {{ text }}
          </v-chip>
          <span
            v-else-if="index === 10"
            class="overline mx-2"
          >
            +{{ files.length - 10 }} File(s)
          </span>
        </template>
      </template>
    </v-file-input>
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      color="red darken-2"
    >
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          icon
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>

export default {
  name: 'ImageDrop',
  props: {
    value: {
      type: Array,
      default () { return [] }
    }
  },
  data: () => ({
    rules: [
      files => {
        for (const file of files) {
          if (file.size > 50e6) return `"${file.name}" (${(file.size / 1e6).toFixed(1)}MB) 超出大小限制`
          if (file.lastModified < Date.now() - 1000*3600*36) return `"${file.name}" 超过36h时间限制`
        }
        return true
      }
    ],
    onDrag: false,
    snackbar: false,
    snackbarMessage: ''
  }),
  computed: {
    files: {
      get () {
        return this.value
      },
      set (newFiles) {
        return newFiles
      }
    }
  },
  mounted () {
    document.addEventListener('dragenter', () => {
      this.$refs.fileInput.focus()
      this.onDrag = true
    }, false)
  },
  beforeUnmount () {
    document.removeEventListener('dragenter', () => {})
  },
  methods: {
    removeFileByIndex (index) {
      this.files.splice(index, 1)
    },
    dragover (event) {
      event.preventDefault()
    },
    drop (event) {
      event.preventDefault()
      var illegalFiles = []
      const imageFilter = (file) => {
        if (file.type.split('/')[0] === 'image') {
          return true
        } else {
          illegalFiles.push(file.name)
          return false
        }
      }
      
      var filteredFiles = [...event.dataTransfer.files].filter(imageFilter)
      if (illegalFiles.length>0){
          this.snackbar = true
          this.snackbarMessage = this.$t('report.recognition.tips.notImageFile',[`${illegalFiles[0]}${illegalFiles.length>1?` +${illegalFiles.length-1} ${this.$t('report.recognition.tips.notImageFileMultiple')}`:''}`])
      }
      // TODO: Discussion needed. Drag and Drop should keep files that already exist?
      this.$emit('input', [...this.files, ...filteredFiles])
      this.$refs.fileInput.blur()
    }
  }
}
</script>
<style scoped>
  .file-input >>> .v-input__slot {
    min-height: 128px !important;
  }
</style>
