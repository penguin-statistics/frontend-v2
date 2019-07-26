import store from '@/store'

export default {
  item: {
    byItemId (itemId) {
      return store.state.data.items.find(el => {
        return el.itemId === itemId
      })
    },
  },
  formulas: {
    byItemId (itemId) {
      return store.state.data.formulas.find(el => {
        return el.id === itemId
      })
    }
  },
  limitations: {
    byStageId (stageId) {
      return store.state.data.limitations.find(el => {
        return el.name === stageId
      })
    }
  },
  statistics: {
    byItemId (itemId) {
      return store.state.data.resultMatrix.filter(el => {
        return el.itemId === itemId
      })
    },
    byStageId (stageId) {
      return store.state.data.resultMatrix.filter(el => {
        return el.stageId === stageId
      })
    }
  },
  stages: {
    byStageId (stageId) {
      store.state.data.stages.find(el => {
        return el.stageId === stageId
      })
    },
    byParentZoneId (zoneId) {
      return store.state.data.stages.filter(el => {
        return el.zoneId === zoneId
      })
    }
  },
  zones: {
    byZoneId (zoneId) {
      return store.state.data.zones.find(el => {
        return el.zoneId === zoneId
      })
    },
    byType (type) {
      return store.state.data.zones.find(el => {
        return el.type === type
      })
    },
    all () {
      return store.state.data.zones
    }
  }
}