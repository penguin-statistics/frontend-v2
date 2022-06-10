import config from "@/config";

function isDomain (domain) {
  const currentHostname = window.location.hostname;
  return currentHostname.indexOf(domain) > -1;
}

const mirror = {
  global: {
    identifier: 'penguin-stats.io',
    isCurrent () {
      return isDomain(this.identifier)
    }
  },
  cn: {
    identifier: 'penguin-stats.cn',
    isCurrent () {
      return isDomain(this.identifier)
    }
  },
  preview: {
    identifier: 'exusiai.dev',
    isCurrent () {
      return isDomain('now.sh') || isDomain('vercel.app') || isDomain('exusiai.dev')
    }
  }
}

mirror.adapter = function ({ cn, io }) {
  if (mirror.cn.isCurrent()) return cn
  return io
}

mirror.deliver = function (path) {
  if (mirror.global.isCurrent()) {
    return config.cdn.global + path
  } else {
    return config.cdn.cn + path
  }
}

export default mirror
