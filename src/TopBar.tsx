import { SearchOutlined, ClockCircleOutlined, LogoutOutlined } from "@ant-design/icons"
import { Input, Avatar, Space, Dropdown } from "antd"
import type { MenuProps } from "antd"
import { useEffect, useState } from "react"

export default function TopBar() {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('ticket')
        window.location.href = 'https://ylos.yulongpc.com.cn'
    }

    const dropdownItems: MenuProps['items'] = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            onClick: handleLogout,
        },
    ]

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
                    <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
                        <Space size={12} style={{ cursor: 'pointer' }}>
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
                    </Dropdown>
                </Space>
            </div>
        </div>
    )
}