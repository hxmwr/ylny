import { useEffect, useState } from 'react'
import { List, Spin, Empty } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { getNoticeList, type NoticeItem } from '../services/noticeApi'

// 格式化时间
function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
}

export default function NoticeList() {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNotices() {
      try {
        setLoading(true)
        const data = await getNoticeList()
        // 按时间倒序排列
        data.sort((a, b) =>
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        )
        setNotices(data)
        setError(null)
      } catch (err) {
        console.error('加载公告失败:', err)
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

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

  if (notices.length === 0) {
    return <Empty description="暂无公告" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <div className="notice-list-container" style={{ height: '100%', overflow: 'auto' }}>
      <List
        className="notice-list"
        dataSource={notices}
        split={false}
        renderItem={(notice) => (
          <List.Item
            className="notice-item"
            style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13,
                color: 'rgba(0, 0, 0, 0.85)',
                marginBottom: 4,
                lineHeight: 1.5,
              }}>
                {notice.content}
              </div>
              <div style={{
                fontSize: 12,
                color: 'rgba(0, 0, 0, 0.45)',
                whiteSpace: 'nowrap',
              }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {formatTime(notice.checkTime || notice.createdTime)}
                {notice.checkPersonName && <span style={{ marginLeft: 12 }}>发布人: {notice.checkPersonName}</span>}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}
