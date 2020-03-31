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
        contribute: {
          "contribute_0": "如果您有以下一项或多项经验，愿意为整合运动贡献自己的一份力量，欢迎联系我们。",
        },
        "intro": {
          "intro_0": "欢迎来到整合运动数据统计。",
          "intro_1": "整合运动数据统计（Reunion Statistics）是整合运动旗下数据处理部门，致力于各作战素材库存统计分析。",
          "intro_2": "目前绝大部分数据由玩家手动上传，为了尽量减少谎报、误报对结果的影响，整合运动干部们会对库存进行多方位的审查。"
        }
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
        },
        "donate": {
          "donate_0": "Increasing number of users and server fees are putting Reunion Statistics into crisis. In order to protect our beloved Reunion Statistics, the webmaster decided to..."
        },
        "intro": {
          "intro_0": "Welcome to Reunion Statistics!",
          "intro_1": "Reunion Statistics is the Department of Data Analysis of Reunion Movement. We devote ourselves to item storage analysis.",
          "intro_2": "Item storage data are submitted by the players. Our prominent members conduct comprehensive review on the submitted data to reduce the impact of false reports."
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
        },
        "contribute": {
          "contribute_0": "以下のような開発の経験があるのであれば、Reunion Statisticsに自身の力を使ってみませんか？",
        },
        "intro": {
          "intro_0": "レユニオンデータ統計処理部門へようこそ！",
          "intro_1": "Reunion Statisticsはレユニオン・ムーブメントのデータ処理部門であり(嘘)、各作戦での素材在庫の統計分析を行っています。",
          "intro_2": "現在ほとんどのデータはユーザーの手によって手動でアップロードされており、誤った情報や誤った情報による影響を最小限に抑えるためにムーブメントの幹部たちはドロップアイテムについて様々な確度から審査しています。"
        }
      }
    }
  }
}