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

export default {
  socials,
  getSocial(id) {
    return socials.find(v => v.id === id)
  }
}