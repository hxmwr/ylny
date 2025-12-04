import { useEffect, useState } from 'react'
import { List, Spin, Empty, Tag } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { getAllPendingTasks, type PendingTask } from '../services/workflowApi'

// 格式化时间
function formatTime(timeStr: string): string {
  const date = new Date(timeStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
}

export default function PendingTasks() {
  const [tasks, setTasks] = useState<PendingTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true)
        const data = await getAllPendingTasks()
        setTasks(data)
        setError(null)
      } catch (err) {
        console.error('加载待办任务失败:', err)
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleItemClick = (task: PendingTask) => {
    if (task.openUrl) {
      window.open(task.openUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Spin tip="加载中..." />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ color: '#ff4d4f', textAlign: 'center', padding: 20 }}>
        加载失败: {error}
      </div>
    )
  }

  if (tasks.length === 0) {
    return <Empty description="暂无待办任务" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <div className="pending-tasks-container" style={{ height: '100%', overflow: 'auto' }}>
      <List
        className="pending-tasks-list"
        dataSource={tasks}
        split={false}
        renderItem={(task) => (
          <List.Item
            className="pending-task-item"
            onClick={() => handleItemClick(task)}
            style={{ cursor: 'pointer', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <Tag color="blue" style={{ margin: 0, lineHeight: '18px', padding: '0 6px' }}>{task.taskName}</Tag>
                <span style={{
                  fontSize: 13,
                  color: 'rgba(0, 0, 0, 0.85)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {task.title}
                </span>
              </div>
              <div style={{
                fontSize: 12,
                color: 'rgba(0, 0, 0, 0.45)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {task.formNo} | {task.initiator} | <ClockCircleOutlined style={{ marginRight: 2 }} />{formatTime(task.createTime)}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}
