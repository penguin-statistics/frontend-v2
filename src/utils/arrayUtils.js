import uniq from 'lodash/uniq'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import filter from 'lodash/filter'

export function findDuplicates(array) {
  return uniq(
    flatten(
      filter(
        groupBy(array),
          n => n.length > 1)))
}