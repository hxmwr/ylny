// 公告相关API
import { getTicket } from './auth'

const API_BASE_URL = '/inter-api/oodm-runtime/callServiceByPath'
const TABLE_PATH = 'system.ene_opt_portal_notice'

// 公告项类型
export interface NoticeItem {
  id: number
  content: string
  remark: string
  checkPersonName: string
  checkTime: string
  createdTime: string
}

// 获取公告列表
export async function getNoticeList(): Promise<NoticeItem[]> {
  const ticket = getTicket()

  const response = await fetch(API_BASE_URL, {
    headers: {
      'accept': 'application/json',
      'accept-language': 'zh-cn',
      'authorization': 'Bearer ' + ticket,
      'cache-control': 'no-cache, no-store',
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      path: TABLE_PATH,
      service: 'GetDataTableEntries',
    }),
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

  // 解析返回数据
  const list = result.data?.list || []
  return list.map((item: any) => ({
    id: item['system.id'],
    content: item['system.notice_content'],
    remark: item['system.remark'],
    checkPersonName: item['system.check_person_name'],
    checkTime: item['system.check_time'],
    createdTime: item['system.created_time'],
  }))
}
