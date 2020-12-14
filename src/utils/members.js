const socials = [
  {
    "id": "weibo",
    "name": "Weibo",
    "icon": "mdi-sina-weibo"
  },
  {
    "id": "twitter",
    "name": "Twitter",
    "icon": "mdi-twitter"
  },
  {
    "id": "github",
    "name": "GitHub",
    "icon": "mdi-github-circle"
  },
  {
    "id": "qq",
    "name": "QQ",
    "icon": "mdi-qqchat"
  },
  {
    "id": "email",
    "name": "Email",
    "icon": "mdi-email"
  }
]

const responsibilities = {
  v1frontend: {
    id: "v1frontend",
    icon: "mdi-penguin"
  },
  frontend: {
    id: "frontend",
    icon: "mdi-desktop-mac"
  },
  backend: {
    id: "backend",
    icon: "mdi-code-tags"
  },
  maintenance: {
    id: "maintenance",
    icon: "mdi-hammer-screwdriver"
  },
  statistics: {
    id: "statistics",
    icon: "mdi-chart-areaspline"
  },
  arkplanner: {
    id: "arkplanner",
    icon: "mdi-directions-fork"
  },
  bulkupload: {
    id: "bulkupload",
    icon: "mdi-upload-multiple"
  },
  customersupport: {
    id: "customersupport",
    icon: "mdi-message-bulleted"
  },
  logo: {
    id: "logo",
    icon: "mdi-drawing"
  },
  materials: {
    id: "materials",
    icon: "mdi-folder-image"
  },
  localization: {
    en: {
      id: "localization_en",
      icon: "mdi-alphabet-latin"
    },
    ja: {
      id: "localization_ja",
      icon: "mdi-syllabary-hiragana"
    },
    ko: {
      id: "localization_ko",
      icon: "mdi-syllabary-hangul"
    },
  },
  widget: {
    id: "widget",
    icon: "mdi-widgets"
  },
}

export default {
  socials,
  getSocial(id) {
    return socials.find(v => v.id === id)
  },
  responsibilities
}