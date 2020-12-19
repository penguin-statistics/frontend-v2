import qs from 'qs'
import mirror from "@/utils/mirror";

function paramUrl(base, queryParams) {
  let url
  if (queryParams) {
    url = `${base}?${qs.stringify(queryParams)}`
  } else {
    url = base
  }
  window.open(url, null, 'noopener,noreferrer')
}

const socials = [
  {
    "id": "twitter",
    "name": "Twitter",
    "icon": "mdi-twitter",
    "color": "#1DA1F2",
    canShare: !mirror.cn.isCurrent(),
    share({text, url}) {
      return paramUrl('https://twitter.com/intent/tweet', {text, url})
    }
  },
  {
    "id": "facebook",
    "name": "Facebook",
    "icon": "mdi-facebook",
    "color": "#1877F2",
    canShare: !mirror.cn.isCurrent(),
    share({text, url}) {
      return paramUrl('https://www.facebook.com/sharer.php', {t: text, u: url})
    }
  },
  {
    "id": "weibo",
    "name": "Weibo",
    "icon": "mdi-sina-weibo",
    "color": "#E6162D",
    canShare: true,
    share({text: title, url}) {
      return paramUrl('http://service.weibo.com/share/share.php', {title, url})
    }
  },
  {
    "id": "github",
    "name": "GitHub",
    "icon": "mdi-github-circle",
    "color": "#181717",
    "canShare": false
  },
  {
    "id": "qq",
    "name": "QQ",
    "icon": "mdi-qqchat",
    "color": "#51b6ef",
    "canShare": false,
    // share({url}) {
    //   return paramUrl('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey', {url})
    // }
  },
  {
    "id": "reddit",
    "name": "Reddit",
    "icon": "mdi-reddit",
    "color": "#FF4500",
    "canShare": true,
    share({text: title, url}) {
      return paramUrl('https://reddit.com/submit', {title, url})
    }
  },
  {
    "id": "email",
    "name": "Email",
    "icon": "mdi-email",
    "canShare": false
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