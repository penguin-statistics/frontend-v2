<template>
  <span>
    <v-tooltip
      v-if="!disableTooltip"
      :open-delay="200"
      bottom
      content-class="elevation-0 transparent"
      lazy
    >
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <ItemIcon
            :item="item"
            :ratio="ratio"
            :disable-link="disableLink"
            :disable-tooltip="true"
          />
        </span>
      </template>
      <v-card>
        <v-card-title>
          <h1 class="mr-2">{{ item.name }}</h1>

          <v-chip
            :color="item.meta.color"
            text-color="black"
          >
            <v-avatar>
              <v-icon>{{ item.meta.icon }}</v-icon>
            </v-avatar>
            {{ item.meta.name }}
          </v-chip>
        </v-card-title>
      </v-card>
    </v-tooltip>
    <ItemIcon
      v-if="disableTooltip"
      :item="item"
      :ratio="ratio"
      :disable-link="disableLink"
      :disable-tooltip="false"
    />
  </span>
</template>

<script>
  import ItemIcon from '@/components/ItemIcon'
  export default {
    name: "Item",
    components: {ItemIcon},
    props: {
      item: {
        type: Object,
        required: true
      },
      ratio: {
        type: Number,
        default () {
          return 1
        }
      },
      disableTooltip: {
        type: Boolean,
        default () {
          return false
        }
      },
      disableLink: {
        type: Boolean,
        default () {
          return false
        }
      }
    }
  }
</script>
