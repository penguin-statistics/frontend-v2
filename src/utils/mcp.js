import strings from '@/utils/strings'
import {activeLocale} from '@/mixins/I18n'

// the setup guide of our MCP server, which lets AI assistants read the drop rates. backend-next serves it on its own
// host, in the four languages of the site
const guide = 'https://mcp.penguin-stats.io/'
const guideLanguages = ['zh', 'en', 'ja', 'ko']

// the guide in the UI language. without ?lang it would follow the browser's language instead
export function mcpGuideUrl() {
  const language = strings.mapLocale(activeLocale()).split('-')[0]
  return guideLanguages.includes(language) ? `${guide}?lang=${language}` : guide
}
