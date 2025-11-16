import { SearchOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { Input, Avatar, Space } from "antd"
import { useEffect, useState } from "react"

export default function TopBar() {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (date: Date) => {
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${month}/${day} ${hours}:${minutes}:${seconds}`
    }

    return (
        <div className="topbar">
            <div className="topbar-title">
                <span className="title-highlight">能源优化与智能</span>
                <span className="title-normal">管理系统</span>
            </div>
            <div className="right">
                <Input
                    className="topbar-search"
                    placeholder="搜索相关内容"
                    prefix={<SearchOutlined />}
                    style={{
                        width: 200,
                        background: '#f3f5f7',
                        borderRadius: 4,
                    }}
                />
                <Space size={16} style={{ marginLeft: 24 }}>
                    <div className="topbar-time">
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                        <span>{formatTime(currentTime)}</span>
                    </div>
                    <div style={{ width: 1, height: 32, background: '#f0f0f0' }} />
                    <Space size={12}>
                        <Avatar
                            style={{
                                background: '#1890ff',
                            }}
                            size={32}
                        >
                            A
                        </Avatar>
                        <span style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.85)' }}>
                            admin
                        </span>
                    </Space>
                </Space>
            </div>
        </div>
    )
}