// 工作流相关API

// API配置
const WORKFLOW_CONFIG_URL = '/inter-api/oodm-runtime/callServiceByPath'
const PENDING_TASKS_URL = '/inter-api/flow-service/v1/tasks/pending'
const TABLE_PATH = 'system.ene_opt_portal_workflowlist'

// 获取ticket
function getTicket(): string {
  const isDev = import.meta.env.DEV
  if (isDev) {
    return 'SWo13191qIvqDmiWTBqWu'
  }
  return localStorage.getItem('ticket') || ''
}

// 工作流配置项类型
export interface WorkflowConfig {
  processKey: string | null
  processName: string | null
  sourcemodule: string
  source: string
  remark: string
}

// 待办任务项类型
export interface PendingTask {
  taskId: string
  taskName: string
  processName: string
  formNo: string
  initiator: string
  startTime: string
  createTime: string
  url: string
  openUrl: string
  title: string
  source: string
  processKey: string
}

// 待办任务列表响应
export interface PendingTasksResponse {
  list: PendingTask[]
  pagination: {
    total: number
    pageSize: number
    current: number
  }
}

// 获取工作流配置列表
export async function getWorkflowConfigs(): Promise<WorkflowConfig[]> {
  const ticket = getTicket()

  const response = await fetch(WORKFLOW_CONFIG_URL, {
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

  // 解析返回数据，提取需要的字段
  const list = result.data?.list || []
  return list.map((item: any) => ({
    processKey: item['system.processKey'],
    processName: item['system.processName'],
    sourcemodule: item['system.sourcemodule'],
    source: item['system.source'],
    remark: item['system.remark'],
  }))
}

// 获取待办任务列表
export async function getPendingTasks(
  processKey: string,
  pageSize = 20,
  current = 1
): Promise<PendingTasksResponse> {
  const ticket = getTicket()

  const params = new URLSearchParams({
    processKey,
    total: '0',
    pageSize: String(pageSize),
    current: String(current),
    timeZone: '+8',
  })

  const response = await fetch(`${PENDING_TASKS_URL}?${params}`, {
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'zh-cn',
      'authorization': 'Bearer ' + ticket,
      'cache-control': 'no-cache, no-store',
      'content-type': 'application/json',
    },
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

// 获取所有配置的工作流的待办任务
export async function getAllPendingTasks(): Promise<PendingTask[]> {
  try {
    // 1. 先获取工作流配置
    const configs = await getWorkflowConfigs()
    console.log('工作流配置:', configs)

    // 2. 筛选出有 processKey 的配置
    const validConfigs = configs.filter(c => c.processKey)

    // 3. 并发获取所有工作流的待办任务
    const results = await Promise.all(
      validConfigs.map(config => getPendingTasks(config.processKey!))
    )

    // 4. 合并所有待办任务
    const allTasks: PendingTask[] = []
    results.forEach(result => {
      if (result.list) {
        allTasks.push(...result.list)
      }
    })

    // 5. 按创建时间排序（最新的在前）
    allTasks.sort((a, b) =>
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    )

    console.log('所有待办任务:', allTasks)
    return allTasks
  } catch (error) {
    console.error('获取待办任务失败:', error)
    throw error
  }
}
