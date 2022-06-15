import ObjectManager from '@/utils/objectManager';
import commons from './_common';

const config = new ObjectManager({
  name: 'config',
  api: {
    url: '/config'
  },
  transform: [
    (object) => object
  ],
  ttl: 1000 * 60 * 60 * 1, // 1 hour
  ajaxHooks: commons.defaultAjaxHooks
})

export default config;
