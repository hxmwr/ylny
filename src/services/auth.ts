// 公用认证函数

// 获取 ticket
export function getTicket(): string {
  const isDev = import.meta.env.DEV
  if (isDev) {
    return 'SWo13191qIvqDmiWTBqWu'
  }
  return localStorage.getItem('ticket') || ''
}

// 获取当前用户名
export function getCurrentUsername(): string {
  const u1 = localStorage.getItem('userInfo')
  const u2 = localStorage.getItem('user_info')
  const u3 = localStorage.getItem('personInfo')
  const u4 = sessionStorage.getItem('userInfo')
  const u5 = sessionStorage.getItem('user_info')
  const u6 = sessionStorage.getItem('personInfo')

  const userInfo = u1 ?? u2 ?? u3 ?? u4 ?? u5 ?? u6
  if (userInfo) {
    try {
      return JSON.parse(userInfo)['username'] || 'null'
    } catch {
      return 'null'
    }
  } else {
    const suposUserName = localStorage.getItem('suposUserName')
    if (suposUserName) {
      return suposUserName
    }
  }
  // 开发环境使用测试用户
  const isDev = import.meta.env.DEV
  return isDev ? 'EMS_youhua2' : 'null'
}
