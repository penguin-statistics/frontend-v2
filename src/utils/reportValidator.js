import get from "@/utils/getters";
import i18n from "@/i18n";
import strings from "@/utils/strings";

const categories = [
  "NORMAL_DROP",
  "SPECIAL_DROP",
  "EXTRA_DROP",
]

class ReportValidator {
  constructor(server, zone, stage, drops) {
    this.server = server
    this.zone = zone
    this.stage = stage
    this.drops = drops

    this.dropInfos = this._getDropInfos()
  }

  static null() {
    return {
      item: [],
      type: [],
      rate: 0
    }
  }

  _getDropInfos() {
    const dropInfos = {
      type: [],
      item: []
    }

    for (const drop of this.stage.dropInfos) {
      if (drop.itemId) {
        dropInfos.item.push({
          ...drop,
          item: get.items.byItemId(drop.itemId)
        })
      } else {
        // when an itemId is not presented, a category drop bound is described.
        dropInfos.type.push(drop)
      }
    }

    dropInfos.item.sort((a, b) => a.item.sortId - b.item.sortId)

    return dropInfos
  }

  _getVerificationRule(type, query) {
    // if (!this.dropInfos) {
    //   return {
    //     rules: [
    //       () => {
    //         return () => {
    //           return true
    //         }
    //       }
    //     ],
    //     limitation: {}
    //   }
    // }

    let limitation
    let verificationResponse = {
      stage: i18n.t(`stage.loots.${query.dropType}`)
    }
    // console.log("generating verification rule for", type, query)
    if (type === 'item') {
      limitation = this.dropInfos.item
        .find(v => v.itemId === query.itemId && v.dropType === query.dropType).bounds

      verificationResponse = {
        ...verificationResponse,
        item: strings.translate(get.items.byItemId(query.itemId), 'name')
      }
    } else if (type === 'type') {
      limitation = this.dropInfos.type
        .find(v => v.dropType === query.dropType).bounds
    } else {
      throw new TypeError(`_getVerificationRule: Invalid argument ${type}`)
    }

    // can't found drop info based on the queries, means it should be zero/not presenting.
    if (!limitation) {
      return {
        rules: [
          () => {
            return () => {
              return i18n.t('report.rules.null', {type})
            }
          }
        ],
        limitation
      }
    }

    // rule declarations

    // greater than or equal to
    const gte = (value) => {
      return (compare) => {
        // console.log("executing rule: gte with compare", compare, "should", value)
        const response = {...verificationResponse, quantity: compare, should: value}
        return compare >= value ? true : [i18n.t(`report.rules.${type}.gte`, response), response]
      }
    }

    // less than or equal to
    const lte = (value) => {
      return (compare) => {
        // console.log("executing rule: lte with compare", compare, "should", value)
        const response = {...verificationResponse, quantity: compare, should: value}
        return compare <= value ? true : [i18n.t(`report.rules.${type}.lte`, response), response]
      }
    }

    // not including
    const notIncludes = (values) => {
      return (compare) => {
        // console.log("executing rule: notIncludes with compare", compare, "should", values)
        const response = {...verificationResponse, quantity: compare, should: values.join(',')}
        return values.indexOf(compare) === -1 ? true : [i18n.t(`report.rules.${type}.not`, response), response]
      }
    }

    // compose generation
    const generated = {
      rules: [
        gte(limitation.lower),
        lte(limitation.upper)
      ],
      limitation
    }

    // if there's limitation then we also need to validate the notIncludes.
    if (limitation.exceptions) generated.rules.push(notIncludes(limitation.exceptions))

    return generated
  }

  /**
   * @typedef {{lower: number, upper: number, exceptions: number[]}} Limitation
   * @typedef {{itemId: string, type: string, quantity: number, limitation: Limitation, rate: number, message: string}} ItemOutlier
   * @typedef {{type: string, quantity: number, limitation: Limitation, rate: number, message: string}|null} TypeOutlier
   * @returns {{item: ItemOutlier[], type: TypeOutlier[], rate: number}} returns item data outliers and type data outliers in the whole dataset, respectively
   */
  validate() {
    // initiate the array that will be storing every data outlier
    /** @type ItemOutlier[] */
    const itemOutliers = []

    /** @type TypeOutlier[] */
    const typeOutliers = []

    const nullValidation = {item: itemOutliers, type: typeOutliers, rate: 0}

    // if (!this.selectedZone || this.invalidStage) return nullValidation

    /**
     * validate the quantity using their corresponding rule
     */
    function validate(rules, quantity) {
      for (const rule of rules) {
        const evaluation = rule(quantity)
        if (evaluation !== true) return evaluation
      }
      return [true, {}]
    }

    /**
     * calculate the outlier rate
     * @param {Limitation} limitation rules to validate with
     * @param {number} value value to validate with
     * @returns {number} percentage in decimal format (e.g. 150% = 1.5)
     */
    function calculateOutlierRate(limitation, value) {
      const upper = (value - limitation.upper) ? Math.max(0, (value - limitation.upper) / limitation.upper) : 0
      const lower = (limitation.lower - value) ? Math.max(0, (limitation.lower - value) / limitation.lower) : 0
      return upper + lower
    }

    // loop the candidate results that user provided
    for (const dropInfo of this.dropInfos.item) {
      const record = this.drops.find(el => el.itemId === dropInfo.itemId && el.dropType === dropInfo.dropType) || {
        ...dropInfo,
        quantity: 0
      }

      // generate rules. rules: Function[]; limitation: the bounds
      const {rules, limitation} = this._getVerificationRule('item', dropInfo)

      if (limitation === null) {
        return {
          error: 'EMPTY_RULE',
          ...nullValidation
        }
      }

      const quantity = record.quantity

      // execute validation rules.
      const [validation, extras] = validate(rules, quantity)

      // console.log("generated & executed", dropInfo, "->", {rules, limitation, validation, extras})

      // if validation fails on a rule
      if (validation !== true) {
        // calculate the outlier rate based on the bounds and current value
        // e.g. [0, 3), 6: will get 1 (outlier value 100%)
        const rate = calculateOutlierRate(limitation, record.quantity)

        // store this outlier
        itemOutliers.push({
          itemId: dropInfo.itemId,
          type: dropInfo.dropType,
          quantity,
          limitation,
          rate,
          message: validation,
          extras
        })
      }
    }

    // loop the type declarations (dropType limitations)
    for (const category of categories) {
      const dropType = category
      // generate rules
      const {rules, limitation} = this._getVerificationRule('type', {
        dropType
      })

      if (limitation === null) {
        return {
          error: 'EMPTY_RULE',
          ...nullValidation
        }
      }

      const quantity = this.drops
        .filter(el => el.dropType === dropType)
        .length

      // execute validation rules.
      const [validation, extras] = validate(rules, quantity)

      // if validation fails on a rule
      if (validation !== true) {
        // calculate the outlier rate based on the bounds and current value
        // e.g. [0, 3), 6: will get 1 (outlier value 100%)
        const rate = calculateOutlierRate(limitation, quantity)

        // store this outlier
        typeOutliers.push({
          type: dropType,
          quantity,
          limitation,
          rate,
          message: validation,
          extras
        })
      }
    }

    // calculate total outlier rate
    const itemRates = itemOutliers.reduce(
      (accumulator, current) => accumulator + current.rate,
      0
    )
    const typeRates = typeOutliers.reduce(
      (accumulator, current) => accumulator + current.rate,
      0
    )
    const totalRates = itemRates + typeRates

    return {
      item: itemOutliers,
      type: typeOutliers,
      rate: totalRates
    }
  }
}

export default ReportValidator;