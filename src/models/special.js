import timeFormatter from "@/utils/timeFormatter";
import merge from 'lodash/merge'

export default {
  apply (messages) {
    if (this.fool.enabled()) {
      return merge(
        messages,
        this.fool.messages
      )
    }
    return messages
  },
  fool: {
    enabled () {
      return timeFormatter.dayjs().isBetween('2020-04-01', '2020-04-02', 'day', '[)')
    },
    messages: {
      zh: {
        app: {
          name: "整合运动数据统计",
          name_line1: "整合运动数据统计",
        },
        meta: {
          footer: {
            credit: "整合运动数据统计"
          }
        },
      },
      en: {
        app: {
          name: "Reunion Statistics",
          name_line1: "Reunion Statistics",
        },
        menu: {
          about: {
            _name: "About Reunion Statistics"
          }
        },
        meta: {
          footer: {
            credit: "Reunion Statistics | {date}"
          }
        },
        contribute: {
          contribute_0: "If you have experience with any of the following, and want to contribute to Reunion Statistics, contact us at QQ group: 747099627."
        }
      },
      ja: {
        app: {
          name: "レユニオンデータ統計処理部門",
          name_line1: "レユニオン",
          name_line2: "データ統計処理部門"
        },
        meta: {
          footer: {
            credit: "レユニオンデータ統計処理部門 | {date}"
          }
        }
      }
    }
  }
}