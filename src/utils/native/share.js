import { Plugins } from '@capacitor/core'
const { Share } = Plugins

export default function (content) {
  return Share.share(content)
}
