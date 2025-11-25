import type { FavoriteItem } from '../types/favorites'

// API配置
const API_BASE_URL = '/supide-app/ide/runtime/oodm-runtime/callServiceByPath'
const TABLE_PATH = 'system.ene_opt_portal_userinfo'

// 获取ticket
function getTicket(): string {
  // 开发环境使用临时ticket
  const isDev = import.meta.env.DEV
  if (isDev) {
    return 'vNxdb8askOQv97gcT7waK'
  }
  // 正式环境从localStorage获取
  return localStorage.getItem('ticket') || ''
}

// 通用API调用函数
async function callTableApi(service: string, payload: any, ticket: string) {
  const body = {
    path: TABLE_PATH,
    service: service,
    params: payload,
  }

  const response = await fetch(API_BASE_URL, {
    headers: {
      accept: 'application/json',
      'accept-language': 'zh-cn',
      authorization: 'Bearer ' + ticket,
      'cache-control': 'no-cache, no-store',
      'content-type': 'application/json; charset=UTF-8',
    },
    referrer: 'https://ylos.yulongpc.com.cn/main/',
    body: JSON.stringify(body),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()

  if (result.code !== 200) {
    throw new Error(result.message || 'API返回错误')
  }

  return result
}

// 获取当前用户名（从localStorage或其他方式）
function getCurrentUsername(): string {
  // 这里需要根据实际情况获取用户名
  // 可以从localStorage或其他地方获取
  return localStorage.getItem('username') || 'admin'
}

// 查询用户收藏信息
export async function getFavoritesFromBackend(): Promise<FavoriteItem[]> {
  const ticket = getTicket()
  const username = getCurrentUsername()

  try {
    const result = await callTableApi(
      'querySQLExec',
      {
        sql: `select * from system_ene_opt_portal_userinfo where system_user_name = "${username}"`,
      },
      ticket
    )

    console.log('查询收藏信息返回:', result)

    // 解析返回的数据 - dataSource是对象数组
    const dataSource = result.data?.data?.dataSource || []
    console.log('dataSource:', dataSource)

    if (dataSource.length === 0) {
      console.log('未找到用户数据，返回空数组')
      return []
    }

    // 直接从对象中获取system_mark_info字段
    const firstRecord = dataSource[0]
    const markInfo = firstRecord?.system_mark_info
    console.log('markInfo原始值:', markInfo)

    // mark_info可能是空字符串或null
    if (!markInfo || markInfo === '') {
      console.log('markInfo为空，返回空数组')
      return []
    }

    // mark_info应该是JSON字符串，需要解析
    try {
      const parsed = JSON.parse(markInfo)
      console.log('解析后的收藏数据:', parsed)
      return Array.isArray(parsed) ? parsed : []
    } catch (parseError) {
      console.error('JSON解析失败:', parseError, 'markInfo:', markInfo)
      return []
    }
  } catch (error) {
    console.error('获取收藏信息失败:', error)
    throw error
  }
}

// 保存用户收藏信息
export async function saveFavoritesToBackend(favorites: FavoriteItem[]): Promise<void> {
  const ticket = getTicket()
  const username = getCurrentUsername()
  const markInfo = JSON.stringify(favorites)

  try {
    // 先查询用户是否存在
    const existingData = await callTableApi(
      'querySQLExec',
      {
        sql: `select * from system_ene_opt_portal_userinfo where system_user_name = "${username}"`,
      },
      ticket
    )

    const dataSource = existingData.data?.data?.dataSource || []
    const userExists = dataSource.length > 0

    if (userExists) {
      // 更新已有记录
      await callTableApi(
        'UpdateDataTableEntry',
        {
          where: {
            user_name: username,
          },
          update: {
            mark_info: markInfo,
          },
        },
        ticket
      )
    } else {
      // 创建新记录
      await callTableApi(
        'AddDataTableEntry',
        {
          user_name: username,
          mark_info: markInfo,
        },
        ticket
      )
    }
  } catch (error) {
    console.error('保存收藏信息失败:', error)
    throw error
  }
}
