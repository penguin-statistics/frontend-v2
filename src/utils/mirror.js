import extractDomain from 'extract-domain'

function isDomain (domain, location = window.location.href) {
  return extractDomain(location) === domain
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
  vercel: {
    identifier: 'vercel.app',
    isCurrent () {
      return isDomain('now.sh') || isDomain('vercel.app')
    }
  }
}

mirror.adapter = function ({ cn, io }) {
  if (mirror.cn.isCurrent()) return cn
  return io
}

export default mirror
