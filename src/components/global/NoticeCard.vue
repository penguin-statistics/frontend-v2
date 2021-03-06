<template>
  <v-card
    elevation="5"
    class="pa-6 mb-2"
    :class="severity.cardClass"
  >
    <h1 class="headline font-weight-black d-flex align-center">
      <v-icon left>
        {{ severity.icon }}
      </v-icon>

      {{ $t('menu.about.bulletin') }}
    </h1>
    <v-alert
      v-if="error"
      type="error"
      border="left"
      text
      class="mt-4 mb-0"
    >
      <span>
        {{ $t('notice.failed', {error}) }}
      </span>
    </v-alert>
    <v-card
      v-else-if="loading"
      flat
      class="mt-4 py-4 d-flex align-center justify-center bkop-light"
    >
      <v-progress-circular
        indeterminate
        :width="3"
        :size="24"
      />
      <span class="ml-2">
        {{ $t('notice.loading') }}
      </span>
    </v-card>
    <div
      v-else-if="content"
      class="subtitle-1 line-height-wide mt-4 mb-2 markdown-content"
      :class="severity.contentClass"
      v-html="content"
    />
  </v-card>
</template>

<script>
import strings from '@/utils/strings'

const severity = {
  /** 0: Emergency Notice */
  0: {
    id: 'emergency',
    icon: 'mdi-alert-decagram',
    cardClass: 'slash-strip--danger notice-card--emergency'
  },
  /** 1: Important Notice */
  1: {
    id: 'important',
    icon: 'mdi-alert-circle',
    cardClass: 'slash-strip--warning-transparent'
  },
  /** 0: Informational Notice */
  2: {
    id: 'informational',
    icon: 'mdi-information',
    cardClass: 'notice-card--informational'
  }
}

export default {
  name: 'NoticeCard',
  props: {
    notice: {
      type: Object,
      default () {
        return null
      }
    },
    error: {
      type: Error,
      default () {
        return null
      }
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    content () {
      if (!this.notice) return ''
      return strings.translateMarkdown(this.notice, 'content')
    },
    severity () {
      if (!this.notice) return severity[2]
      return severity[this.notice.severity]
    }
  }
}
</script>

<style scoped>
  ::v-deep .markdown-content p {
    margin-bottom: 0 !important;
    perspective: 0px;
  }
  ::v-deep .markdown-content a {
    color: #1ab0ff;
    display: inline-block;
    border: 1px solid white;
    padding: 1px 8px;
    border-radius: 4px;
    font-weight: bold;
    text-decoration: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .18);
    transform: none;
    transition: all 125ms;
    background: rgba(0, 0, 0, .5);
  }
  .theme--light ::v-deep .markdown-content a {
    color: white;
    border: 1px solid black;
    background: rgba(0, 140, 215, .85);
  }
  ::v-deep .markdown-content a:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, .4);
    transform: scale(1.01) translateY(-1px);
  }
  .theme--light ::v-deep .markdown-content a:hover{
    background: rgba(0, 140, 215, .9);
  }
  ::v-deep .markdown-content a:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, .4);
    transform: scale(0.98) translateY(1px);
    background: rgba(0, 0, 0, .65);
  }
  .theme--light ::v-deep .markdown-content a:active {
    background: rgba(0, 140, 215, 1);
  }

  .notice-card--emergency {
    animation: card-pulse infinite 2.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  @keyframes card-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(226, 81, 65, .0);
    }

    70% {
      box-shadow: 0 0 0 10px rgba(226, 81, 65, .55);
    }

    100% {
      box-shadow: 0 0 0 15px rgba(226, 81, 65, .0);
    }
  }
</style>
