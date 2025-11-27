import { SearchOutlined, ClockCircleOutlined, LogoutOutlined } from "@ant-design/icons"
import { Input, Avatar, Space, Dropdown } from "antd"
import type { MenuProps } from "antd"
import { useEffect, useState, useMemo } from "react"

// 获取当前用户名
function getCurrentUsername(): string {
    const u1 = localStorage.getItem('userInfo')
    const u2 = localStorage.getItem('user_info')
    const u3 = sessionStorage.getItem('userInfo')
    const u4 = sessionStorage.getItem('user_info')
    const u5 = sessionStorage.getItem('personInfo')
    const u6 = localStorage.getItem('personInfo')

    const userInfo = u1 ?? u2 ?? u3 ?? u4 ?? u5 ?? u6
    if (userInfo) {
        try {
            return JSON.parse(userInfo)['username'] || 'null'
        } catch {
            return 'null'
        }
    } else {
        const u5 = localStorage.getItem('suposUserName')
        if (u5) {
            return u5
        }
    }
    // 开发环境使用测试用户
    const isDev = import.meta.env.DEV
    return isDev ? 'EMS_youhua2' : 'null'
}

export default function TopBar() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const username = useMemo(() => getCurrentUsername(), [])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('ticket')
        sessionStorage.removeItem('userInfo')
        localStorage.removeItem('userInfo')
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
                                {username.charAt(0).toUpperCase()}
                            </Avatar>
                            <span style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.85)' }}>
                                {username}
                            </span>
                        </Space>
                    </Dropdown>
                </Space>
            </div>
        </div>
    )
}