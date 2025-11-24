import { Card, Calendar } from 'antd'
import { StarOutlined, StarFilled, RightOutlined, DownOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import { forwardRef, useState, useMemo } from 'react'
import './mainContent.css'
import menuData from './menu.json'

// Import document management icons
import docPermissionApply from './assets/文档权限申请.png'
import docManagement from './assets/文档管理.png'
import folderManagement from './assets/文件夹管理.png'
import docAdd from './assets/文档新增.png'
import docDelete from './assets/文档删除.png'
import myDoc from './assets/我的文档.png'
import docRecycleBin from './assets/文档回收站.png'
import docManagementPermission from './assets/文档管理权限.png'
import docAddTree from './assets/文档新增-1.png'

// menu.json 原始类型定义
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

// 层级菜单项类型定义（用于Block组件）
interface MenuItem {
    name: string
    children?: MenuItem[]
}

// 将menu.json的结构转换为Block需要的结构
function convertMenuItems(items: MenuJsonItem[]): MenuItem[] {
    return items.map(item => ({
        name: item.displayName,
        children: item.children && item.children.length > 0
            ? convertMenuItems(item.children)
            : undefined
    }))
}

// 根据displayName查找顶级分组
function findTopLevelGroup(name: string): MenuJsonItem | undefined {
    return (menuData as MenuJsonItem[]).find(item => item.displayName === name)
}

interface BlockProps {
    title: string
    items: MenuItem[]
    hasScroll?: boolean
}

// 递归渲染菜单项组件
function MenuItemRenderer({ item, level = 0 }: { item: MenuItem; level?: number }) {
    const [expanded, setExpanded] = useState(false)
    const hasChildren = item.children && item.children.length > 0

    return (
        <div className="menu-item-wrapper">
            <div
                className={`menu-item level-${level} ${hasChildren ? 'has-children' : ''}`}
                onClick={() => hasChildren && setExpanded(!expanded)}
                style={{ paddingLeft: level * 12 }}
            >
                {hasChildren && (
                    <span className="expand-icon">
                        {expanded ? <DownOutlined /> : <RightOutlined />}
                    </span>
                )}
                {!hasChildren && <StarOutlined className="leaf-icon" />}
                <span className="menu-item-text">{item.name}</span>
            </div>
            {hasChildren && expanded && (
                <div className="menu-children">
                    {item.children!.map((child, index) => (
                        <MenuItemRenderer key={index} item={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}

function Block({ title, items, hasScroll }: BlockProps) {
    const [starred, setStarred] = useState(false)

    return (
        <div className="energy-card">
            <div className="energy-card-header">
                <h3 className="energy-card-title">{title}</h3>
                <div
                    className="energy-card-star"
                    onClick={() => setStarred(!starred)}
                >
                    {starred ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                </div>
            </div>
            <div className={`energy-card-content ${hasScroll ? 'has-scroll' : ''}`}>
                <div className="menu-tree">
                    {items.map((item, index) => (
                        <MenuItemRenderer key={index} item={item} level={0} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const DOC_ITEMS = [
    { id: 1, name: '文档权限申请', icon: docPermissionApply, highlighted: true },
    { id: 2, name: '文档管理', icon: docManagement },
    { id: 3, name: '文件夹管理', icon: folderManagement },
    { id: 4, name: '文档新增', icon: docAdd },
    { id: 5, name: '文档删除', icon: docDelete },
    { id: 6, name: '我的文档', icon: myDoc },
    { id: 7, name: '文档回收站', icon: docRecycleBin },
    { id: 8, name: '文档管理权限', icon: docManagementPermission },
    { id: 9, name: '文档新增', icon: docAddTree },
]

interface MainContentProps {
    activeSection?: string
}

// 从顶级分组生成blocks数据
function generateBlocksFromGroup(groupName: string): { title: string; items: MenuItem[] }[] {
    const group = findTopLevelGroup(groupName)
    if (!group || !group.children) return []

    return group.children.map(child => ({
        title: child.displayName,
        items: child.children && child.children.length > 0
            ? convertMenuItems(child.children)
            : []
    }))
}

const MainContent = forwardRef<HTMLDivElement, MainContentProps>(({ }, ref) => {
    // 动态生成各section的blocks
    const energyBlocks = useMemo(() => generateBlocksFromGroup('智能能源管理'), [])
    const carbonBlocks = useMemo(() => generateBlocksFromGroup('碳排放管理'), [])
    const optimizeBlocks = useMemo(() => generateBlocksFromGroup('能源优化'), [])

    const onPanelChange = (value: Dayjs, mode: any) => {
        console.log(value.format('YYYY-MM-DD'), mode)
    }

    return (
        <div className="main-content" ref={ref}>
            <div className="main-content-wrapper">
            {/* Home Section */}
            <section id="home" className="content-section">
                {/* Top Row */}
                <div className="top-row">
                    {/* Important Info / Todo */}
                    <Card
                        className="info-card"
                        title={
                            <div className="card-title">
                                <span className="title-icon">📌</span>
                                <span>重要信息展示/待办</span>
                            </div>
                        }
                        bordered={false}
                    >
                        <div className="info-content">
                            {/* Content placeholder */}
                        </div>
                    </Card>

                    {/* Announcements */}
                    <Card
                        className="announcement-card"
                        title={
                            <div className="card-title">
                                <span className="title-icon">📢</span>
                                <span>公告</span>
                            </div>
                        }
                        bordered={false}
                    >
                        <div className="announcement-content">
                            {/* Content placeholder */}
                        </div>
                    </Card>

                    {/* Calendar */}
                    <Card
                        className="calendar-card"
                        title={
                            <div className="card-title">
                                <span className="title-icon">📅</span>
                                <span>日历</span>
                            </div>
                        }
                        bordered={false}
                    >
                        <Calendar
                            fullscreen={false}
                            onPanelChange={onPanelChange}
                        />
                    </Card>
                </div>

                {/* Favorites Section */}
                <Card
                    className="favorites-card"
                    title={
                        <div className="card-title">
                            <span className="title-icon">⭐</span>
                            <span>收藏夹</span>
                        </div>
                    }
                    bordered={false}
                >
                    <div className="favorites-content">
                        {/* Content placeholder */}
                    </div>
                </Card>

                {/* Document Management Section */}
                <Card
                    className="document-card"
                    title={
                        <div className="card-title">
                            <span className="title-icon">📁</span>
                            <span>文档管理</span>
                        </div>
                    }
                    bordered={false}
                >
                    <div className="document-grid">
                        {DOC_ITEMS.map(item => (
                            <div
                                key={item.id}
                                className={`doc-item ${item.highlighted ? 'highlighted' : ''}`}
                            >
                                <div className="doc-icon">
                                    <img src={item.icon} alt={item.name} />
                                </div>
                                <div className="doc-name">{item.name}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>

            {/* Energy Management Section */}
            <section id="energy" className="content-section">
                <h2 className="section-title">智能能源管理</h2>
                <div className="energy-grid">
                    {energyBlocks.map((block, index) => (
                        <Block
                            key={index}
                            title={block.title}
                            items={block.items}
                            hasScroll={block.items.length > 3 || block.items.some(item => item.children && item.children.length > 0)}
                        />
                    ))}
                </div>
            </section>

            {/* Carbon Emission Management Section */}
            <section id="carbon" className="content-section">
                <h2 className="section-title">碳排放管理</h2>
                <div className="energy-grid">
                    {carbonBlocks.map((block, index) => (
                        <Block
                            key={index}
                            title={block.title}
                            items={block.items}
                            hasScroll={block.items.length > 3 || block.items.some(item => item.children && item.children.length > 0)}
                        />
                    ))}
                </div>
            </section>

            {/* Energy Optimization Section */}
            <section id="optimize" className="content-section">
                <h2 className="section-title">能源优化</h2>
                <div className="energy-grid">
                    {optimizeBlocks.map((block, index) => (
                        <Block
                            key={index}
                            title={block.title}
                            items={block.items}
                            hasScroll={block.items.length > 3 || block.items.some(item => item.children && item.children.length > 0)}
                        />
                    ))}
                </div>
            </section>
            </div>
        </div>
    )
})

MainContent.displayName = 'MainContent'

export default MainContent
