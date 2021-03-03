export default {
  localizations: [
    {
      value: 'zh',
      push: 'ZH_CN',
      text: '简体中文'
    },
    // {
    //   value: 'zh-TW',
    //   text: '繁体中文',
    //   beta: true
    // },
    {
      value: 'en',
      push: 'EN_US',
      text: 'English'
    },
    {
      value: 'ja',
      push: 'JA_JP',
      text: '日本語'
    },
    {
      value: 'ko',
      push: 'KO_KR',
      text: '한국어'
    }
  ],
  servers: ['CN', 'US', 'JP', 'KR'],
  push: {
    categories: [
      'NewStage',
      'ImportantTimePoint',
      'Maintenance',
      'ClientUpgrade'
    ]
  }
}
