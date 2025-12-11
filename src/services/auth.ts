// 公用认证函数

// 用户会话信息类型
interface SessionInfo {
  username: string
  companyCode: string
  staffName: string
  userId: number
  companyName: string
}

// 缓存的用户信息
let cachedSessionInfo: SessionInfo | null = null
let fetchPromise: Promise<SessionInfo> | null = null

// 获取 ticket
export function getTicket(): string {
  const isDev = import.meta.env.DEV
  if (isDev) {
    return 'b0ZaDoYcofw3X3E6B3GIg'
  }
  return localStorage.getItem('ticket') || ''
}

// 从API获取用户会话信息
export async function fetchSessionInfo(): Promise<SessionInfo> {
  // 如果已有缓存，直接返回
  if (cachedSessionInfo) {
    return cachedSessionInfo
  }

  // 如果正在请求中，等待现有请求完成
  if (fetchPromise) {
    return fetchPromise
  }

  // 发起新请求
  fetchPromise = (async () => {
    try {
      const ticket = getTicket()
      const response = await fetch('/inter-api/auth/v1/currentUser/sessionInfo', {
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + ticket,
        },
      })

      if (response.ok) {
        const data = await response.json()
        cachedSessionInfo = {
          username: data?.username || '',
          companyCode: data?.userSessionInfo?.companyCode || 'default_org_company',
          staffName: data?.userSessionInfo?.staffName || data?.username || '',
          userId: data?.userId || 0,
          companyName: data?.userSessionInfo?.companyName || '',
        }
        return cachedSessionInfo
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }

    // 返回默认值
    return {
      username: '',
      companyCode: 'default_org_company',
      staffName: '',
      userId: 0,
      companyName: '',
    }
  })()

  const result = await fetchPromise
  fetchPromise = null
  return result
}

// 获取当前用户名（异步）
export async function getCurrentUsernameAsync(): Promise<string> {
  const info = await fetchSessionInfo()
  return info.username
}

// 获取公司代码（异步）
export async function getCompanyCode(): Promise<string> {
  const info = await fetchSessionInfo()
  return info.companyCode
}

// 获取当前用户名（同步，兼容旧代码）
export function getCurrentUsername(): string {
  return cachedSessionInfo?.username || ''
}

// 清除缓存（退出登录时使用）
export function clearSessionCache(): void {
  cachedSessionInfo = null
  fetchPromise = null
}
