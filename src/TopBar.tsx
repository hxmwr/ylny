import { SearchOutlined, ClockCircleOutlined, LogoutOutlined } from "@ant-design/icons"
import { Avatar, Space, Dropdown, AutoComplete } from "antd"
import type { MenuProps } from "antd"
import { useEffect, useState, useMemo, useCallback } from "react"
import menuData from './menu.json'

// menu.json 项类型定义
interface MenuJsonItem {
    id: number
    displayName: string
    url: string | null
    type: number
    route: string | null
    icon: {
        type: string
        value: string | null
    }
    children: MenuJsonItem[]
}

// 搜索结果项
interface SearchItem {
    displayName: string
    url: string
    path: string[]  // 菜单路径，例如：['智能能源管理', '驾驶舱', '能碳驾驶舱']
}

// 递归扁平化菜单数据，提取所有有 URL 的叶子节点
function flattenMenuItems(items: MenuJsonItem[], parentPath: string[] = []): SearchItem[] {
    const result: SearchItem[] = []

    for (const item of items) {
        const currentPath = [...parentPath, item.displayName]

        if (item.url && (!item.children || item.children.length === 0)) {
            // 叶子节点，有 URL
            result.push({
                displayName: item.displayName,
                url: item.url,
                path: currentPath
            })
        }

        if (item.children && item.children.length > 0) {
            result.push(...flattenMenuItems(item.children, currentPath))
        }
    }

    return result
}

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

// 预先扁平化菜单数据
const allMenuItems = flattenMenuItems(menuData as MenuJsonItem[])

export default function TopBar() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [searchValue, setSearchValue] = useState('')
    const username = useMemo(() => getCurrentUsername(), [])

    // 搜索过滤逻辑
    const searchOptions = useMemo(() => {
        if (!searchValue.trim()) {
            return []
        }
        const keyword = searchValue.toLowerCase()
        return allMenuItems
            .filter(item =>
                item.displayName.toLowerCase().includes(keyword) ||
                item.path.some(p => p.toLowerCase().includes(keyword))
            )
            .slice(0, 10)  // 最多显示10条结果
            .map(item => ({
                value: item.url,
                label: (
                    <div className="search-option-item">
                        <div className="search-option-name">{item.displayName}</div>
                        <div className="search-option-path">{item.path.join(' > ')}</div>
                    </div>
                )
            }))
    }, [searchValue])

    // 选择搜索结果时打开对应菜单
    const handleSelect = useCallback((url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer')
        setSearchValue('')
    }, [])

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
                <div className="topbar-search-wrapper" style={{ position: 'relative' }}>
                    <SearchOutlined
                        style={{
                            position: 'absolute',
                            left: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#bfbfbf',
                            pointerEvents: 'none',
                            zIndex: 1,
                        }}
                    />
                    <AutoComplete
                        className="topbar-search"
                        options={searchOptions}
                        value={searchValue}
                        onChange={setSearchValue}
                        onSelect={handleSelect}
                        style={{ width: 240 }}
                        popupMatchSelectWidth={320}
                    >
                        <input
                            className="topbar-search-input"
                            placeholder="搜索菜单..."
                            style={{
                                width: '100%',
                                height: 32,
                                padding: '4px 11px 4px 30px',
                                background: '#f3f5f7',
                                border: '1px solid #d9d9d9',
                                borderRadius: 4,
                                outline: 'none',
                            }}
                        />
                    </AutoComplete>
                </div>
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