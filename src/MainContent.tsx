import { Card, Calendar, Tag } from 'antd'
import { StarOutlined, StarFilled } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import { forwardRef, useState } from 'react'
import './mainContent.css'

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

interface EnergyCardProps {
    title: string
    tags: string[]
    dropdown?: string[]
    multiRow?: boolean
    hasScroll?: boolean
}

function EnergyCard({ title, tags, dropdown, multiRow, hasScroll }: EnergyCardProps) {
    const [starred, setStarred] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

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
                <div className={`energy-tags ${multiRow ? 'multi-row' : ''}`}>
                    {tags.map((tag, index) => (
                        <Tag
                            key={index}
                            className="energy-tag"
                            onClick={() => {
                                if (dropdown && index === 0) {
                                    setShowDropdown(!showDropdown)
                                }
                            }}
                        >
                            <StarOutlined style={{ fontSize: 12, marginRight: 4 }} />
                            {tag}
                        </Tag>
                    ))}
                </div>
                {dropdown && showDropdown && (
                    <div className="energy-dropdown">
                        {dropdown.map((item, index) => (
                            <div key={index} className="dropdown-item">
                                <StarOutlined style={{ fontSize: 12, marginRight: 8 }} />
                                {item}
                            </div>
                        ))}
                    </div>
                )}
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
    { id: 9, name: '文档新增\n左树右表', icon: docAddTree },
]

interface MainContentProps {
    activeSection?: string
}

const MainContent = forwardRef<HTMLDivElement, MainContentProps>(({ activeSection }, ref) => {
    const onPanelChange = (value: Dayjs, mode: any) => {
        console.log(value.format('YYYY-MM-DD'), mode)
    }

    return (
        <div className="main-content" ref={ref}>
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
                    {/* Row 1 */}
                    <EnergyCard
                        title="驾驶舱"
                        tags={['运行部能源看板', '能碳驾驶舱', '运行部能源看板']}
                    />
                    <EnergyCard
                        title="能源运行监视"
                        tags={['全场能源实时监...', '能源介质监控', '运行部能源监控']}
                        dropdown={['子菜单1', '子菜单1', '子菜单1']}
                    />
                    <EnergyCard
                        title="驾驶舱"
                        tags={['能碳驾驶舱', '运行部能源看板', '运行部能源看板']}
                    />

                    {/* Row 2 */}
                    <EnergyCard
                        title="驾驶舱"
                        tags={['能碳驾驶舱', '运行部能源看板', '运行部能源看板']}
                    />
                    <EnergyCard
                        title="用能需求预测"
                        tags={[
                            '工厂节点管理', '计算项配置', '计划项导入',
                            '计划滚动', '预测模型配置', '用能预测',
                            '全厂用能预测月...'
                        ]}
                        multiRow
                    />
                    <EnergyCard
                        title="能源计量核算"
                        tags={['班组计量', '设备计量']}
                    />

                    {/* Row 3 */}
                    <EnergyCard
                        title="驾驶舱"
                        tags={['能碳驾驶舱', '运行部能源看板', '运行部能源看板']}
                    />
                    <EnergyCard
                        title="驾驶舱"
                        tags={['能碳驾驶舱', '运行部能源看板', '运行部能源看板']}
                    />
                    <EnergyCard
                        title="单耗统计"
                        tags={[
                            '炼油一部', '炼油一部', '炼油一部',
                            '炼油一部', '炼油一部', '炼油一部',
                            '炼油一部', '炼油一部', '炼油一部',
                            '炼油一部', '炼油一部', '炼油一部'
                        ]}
                        multiRow
                        hasScroll
                    />

                    {/* Row 4 */}
                    <EnergyCard
                        title="驾驶舱"
                        tags={['能碳驾驶舱', '运行部能源看板', '运行部能源看板']}
                    />
                    <EnergyCard
                        title="驾驶舱"
                        tags={['能碳驾驶舱', '运行部能源看板', '运行部能源看板']}
                    />
                    <EnergyCard
                        title="驾驶舱"
                        tags={['能碳驾驶舱', '运行部能源看板', '运行部能源看板']}
                    />
                </div>
            </section>

            {/* Carbon Emission Management Section */}
            <section id="carbon" className="content-section">
                <h2 className="section-title">碳排放管理</h2>
                <div className="energy-grid">
                    {/* Row 1 */}
                    <EnergyCard
                        title="碳数据管理"
                        tags={['企业基础信息', '低碳数据配置', '低碳数据填报', '低碳数据查询']}
                        multiRow
                    />
                    <EnergyCard
                        title="碳数据管理"
                        tags={['企业边界碳排放...', '补充数据表边界...']}
                    />
                    <EnergyCard
                        title="我的待办"
                        tags={['我的待办']}
                    />

                    {/* Row 2 */}
                    <EnergyCard
                        title="碳排放总览"
                        tags={['数据分析总览', '月度数据查询', '年度数据查询']}
                    />
                    <EnergyCard
                        title="碳排放报告"
                        tags={['碳排放报告']}
                    />
                    <EnergyCard
                        title="MRV管理"
                        tags={['数据质量控制计划', '年度盘查审核', '外审登记管理', '数据对比分析']}
                        multiRow
                    />

                    {/* Row 3 */}
                    <EnergyCard
                        title="碳排放轨迹监测"
                        tags={['碳排放轨迹监测']}
                    />
                </div>
            </section>

            {/* Energy Optimization Section */}
            <section id="optimize" className="content-section">
                <h2 className="section-title">能源优化</h2>
                <div className="energy-grid">
                    {/* Row 1 */}
                    <EnergyCard
                        title="全厂平衡与监控"
                        tags={['监控图', '平衡表']}
                        dropdown={['蒸汽平衡表', '氢气平衡表', '燃料气平衡表']}
                    />
                    <EnergyCard
                        title="动力中心优化"
                        tags={['动力系统能效分...', '蒸汽动力系统优化']}
                    />
                    <EnergyCard
                        title="渣油加氢优化"
                        tags={['渣油加氢A', '渣油加氢B', '渣油加氢C']}
                    />

                    {/* Row 2 */}
                    <EnergyCard
                        title="柴油加氢改质"
                        tags={['工艺图表', '化验图表', '加热炉操作优化', '导航预览']}
                        multiRow
                    />
                    <EnergyCard
                        title="柴油加氢裂化"
                        tags={['工艺图表', '化验图表', '加热炉操作优化', '导航预览']}
                        multiRow
                    />
                    <EnergyCard
                        title="管网模拟"
                        tags={[
                            '管网信息台账', '超高压蒸汽管网...', '高压蒸汽管网模拟',
                            '中压蒸汽管网模拟', '低压蒸汽管网模拟', '氢气系统管网模拟',
                            '燃料气管网模拟', '应用配置'
                        ]}
                        multiRow
                        hasScroll
                    />

                    {/* Row 3 */}
                    <EnergyCard
                        title="调度优化"
                        tags={[
                            '调度优化总览', '协同调度优化', '调度优化总览',
                            '协同调度优化', '调度导航', '调度模型管理',
                            '预警管理', '装置模型', '数据字典'
                        ]}
                        multiRow
                        hasScroll
                    />
                    <EnergyCard
                        title="IBD大数据与算法"
                        tags={[
                            '数据中心', '任务管理', '算法管理',
                            '应用管理', '资源权限服务', '数据仓库'
                        ]}
                        multiRow
                    />
                </div>
            </section>
        </div>
    )
})

MainContent.displayName = 'MainContent'

export default MainContent
