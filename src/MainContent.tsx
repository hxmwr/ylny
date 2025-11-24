import { Card, Calendar } from 'antd'
import { StarOutlined, StarFilled, RightOutlined, DownOutlined } from '@ant-design/icons'
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

// 层级菜单项类型定义
interface MenuItem {
    name: string
    children?: MenuItem[]
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

const MainContent = forwardRef<HTMLDivElement, MainContentProps>(({ }, ref) => {
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
                    {/* Row 1 */}
                    <Block
                        title="驾驶舱"
                        items={[
                            { name: '能碳驾驶舱' },
                            { name: '运行部能源看板' }
                        ]}
                    />
                    <Block
                        title="能源运行监控"
                        items={[
                            { name: '全厂能源实时监控' },
                            { name: '能源介质', children: [
                                { name: '电力监控', children: [
                                    { name: '全厂220kV' },
                                    { name: '炼油1#110kV变电所' },
                                    { name: '炼油2#110kV变电所' },
                                    { name: '化工1#110kV变电所' },
                                    { name: '化工2#110kV变电所' }
                                ]},
                                { name: '全厂氮气系统图' },
                                { name: '蒸汽平衡图' },
                                { name: '氢气平衡图' },
                                { name: '燃料气平衡图' },
                                { name: '炼油区低压火炬' },
                                { name: '全厂供风系统图' },
                                { name: '全厂除盐水系统图' }
                            ]},
                            { name: '运行部', children: [
                                { name: '炼油一部' },
                                { name: '炼油二部' },
                                { name: '炼油三部' },
                                { name: '炼油四部' },
                                { name: '炼油五部' },
                                { name: '炼油六部' },
                                { name: '化工一部' },
                                { name: '化工二部' },
                                { name: '化工三部' },
                                { name: '化工五部' },
                                { name: '化工六部' }
                            ]}
                        ]}
                        hasScroll
                    />
                    <Block
                        title="能效分析与监视"
                        items={[
                            { name: '能源监控' },
                            { name: '装置能效', children: [
                                { name: '炼油一部', children: [
                                    { name: '1#常压蒸馏装置' },
                                    { name: '2#常减压蒸馏装置' },
                                    { name: '1#LPG回收装置' }
                                ]},
                                { name: '炼油二部', children: [
                                    { name: '柴油加氢改质装置' },
                                    { name: '浆态床渣油加氢装置' },
                                    { name: '蜡油加氢裂化装置' }
                                ]}
                            ]},
                            { name: '公用工程能效', children: [
                                { name: '化工区制冷系统能效监测' },
                                { name: '空冷器出口温度监测' }
                            ]},
                            { name: '设备能效', children: [
                                { name: '加热炉' }
                            ]}
                        ]}
                        hasScroll
                    />

                    {/* Row 2 */}
                    <Block
                        title="用能需求预测"
                        items={[
                            { name: '工厂节点管理' },
                            { name: '日历规则管理' },
                            { name: '工厂日历管理' },
                            { name: '计划项配置' },
                            { name: '计划项导入' },
                            { name: '计划滚动' },
                            { name: '预测模型配置' },
                            { name: '用能需求预测' },
                            { name: '全厂用能月度预测表' }
                        ]}
                        hasScroll
                    />
                    <Block
                        title="能源计量核算"
                        items={[
                            { name: '班组计量', children: [
                                { name: '炼油一部' },
                                { name: '炼油二部' },
                                { name: '炼油三部' },
                                { name: '炼油四部' },
                                { name: '炼油五部' },
                                { name: '炼油六部' },
                                { name: '化工一部' },
                                { name: '化工二部' },
                                { name: '化工三部' },
                                { name: '化工五部' },
                                { name: '化工六部' }
                            ]},
                            { name: '设备计量' }
                        ]}
                        hasScroll
                    />
                    <Block
                        title="单耗统计"
                        items={[
                            { name: '公用二部' },
                            { name: '炼油一部' },
                            { name: '炼油二部' },
                            { name: '炼油三部' },
                            { name: '炼油四部' },
                            { name: '炼油五部' },
                            { name: '炼油六部' },
                            { name: '化工一部' },
                            { name: '化工二部' },
                            { name: '化工三部' },
                            { name: '化工五部' },
                            { name: '化工六部' }
                        ]}
                        hasScroll
                    />
                </div>
            </section>

            {/* Carbon Emission Management Section */}
            <section id="carbon" className="content-section">
                <h2 className="section-title">碳排放管理</h2>
                <div className="energy-grid">
                    {/* Row 1 */}
                    <Block
                        title="我的待办"
                        items={[
                            { name: '我的待办' }
                        ]}
                    />
                    <Block
                        title="碳数据管理"
                        items={[
                            { name: '企业基础信息' },
                            { name: '低碳报表配置' },
                            { name: '低碳数据填报' },
                            { name: '低碳数据查询' }
                        ]}
                    />
                    <Block
                        title="碳排放核算"
                        items={[
                            { name: '企业边界碳排放核算' },
                            { name: '补充数据表边界碳排放核算' }
                        ]}
                    />

                    {/* Row 2 */}
                    <Block
                        title="碳排放总览"
                        items={[
                            { name: '数据分析总览' },
                            { name: '月度数据查询' },
                            { name: '年度数据查询' }
                        ]}
                    />
                    <Block
                        title="碳排放报告"
                        items={[
                            { name: '碳排放报告' }
                        ]}
                    />
                    <Block
                        title="碳排放轨迹监测"
                        items={[
                            { name: '碳排放轨迹监测' }
                        ]}
                    />

                    {/* Row 3 */}
                    <Block
                        title="MRV管理"
                        items={[
                            { name: '数据质量控制计划' },
                            { name: '年度盘查审核' },
                            { name: '外审登记管理' },
                            { name: '数据比对分析' }
                        ]}
                    />
                    <Block
                        title="应用配置"
                        items={[
                            { name: '排放源模型配置' },
                            { name: '排放因子库' },
                            { name: '基础资料库', children: [
                                { name: '核算指南行业' },
                                { name: '行业信息库' },
                                { name: '碳排放源类别' },
                                { name: '蒸汽配置' }
                            ]},
                            { name: '核算模型库', children: [
                                { name: '行业核算模型' },
                                { name: '核算模型' },
                                { name: '运营数据模型' }
                            ]},
                            { name: '基础配置', children: [
                                { name: '节点组态' },
                                { name: '用户组管理' },
                                { name: '碳排放报告配置' },
                                { name: '国民经济行业配置' },
                                { name: '指标数据源配置' }
                            ]}
                        ]}
                        hasScroll
                    />
                </div>
            </section>

            {/* Energy Optimization Section */}
            <section id="optimize" className="content-section">
                <h2 className="section-title">能源优化</h2>
                <div className="energy-grid">
                    {/* Row 1 */}
                    <Block
                        title="全厂平衡与监控"
                        items={[
                            { name: '监控图', children: [
                                { name: '蒸汽平衡监控' },
                                { name: '氢气平衡监控' },
                                { name: '燃料气平衡监控' },
                                { name: '火炬监控', children: [
                                    { name: '全厂火炬' },
                                    { name: '炼油区高压火炬' },
                                    { name: '炼油区低压火炬' },
                                    { name: '炼油区低低压火炬' },
                                    { name: '聚烯烃高压火炬' },
                                    { name: 'EVA火炬' }
                                ]}
                            ]},
                            { name: '平衡表', children: [
                                { name: '蒸汽平衡表' },
                                { name: '氢气平衡表' },
                                { name: '燃料气平衡表' }
                            ]}
                        ]}
                        hasScroll
                    />
                    <Block
                        title="动力中心优化"
                        items={[
                            { name: '动力系统能效分析与监控' },
                            { name: '蒸汽动力系统优化' }
                        ]}
                    />
                    <Block
                        title="渣油加氢优化"
                        items={[
                            { name: '渣油加氢A', children: [
                                { name: '基础数据' },
                                { name: '进料图表' },
                                { name: '温度图表' },
                                { name: '压力图表' },
                                { name: '化验图表' },
                                { name: '催化剂寿命预测' },
                                { name: '高压注水优化' },
                                { name: '加热炉操作优化' }
                            ]},
                            { name: '渣油加氢B', children: [
                                { name: '基础数据' },
                                { name: '工艺图表' }
                            ]},
                            { name: '渣油加氢C', children: [
                                { name: '基础数据' },
                                { name: '工艺图表' }
                            ]}
                        ]}
                        hasScroll
                    />

                    {/* Row 2 */}
                    <Block
                        title="柴油加氢优化"
                        items={[
                            { name: '柴油加氢改质', children: [
                                { name: '导航预览' },
                                { name: '工艺图表' },
                                { name: '化验图表' },
                                { name: '加热炉操作优化' },
                                { name: '催化剂寿命预测与分析' }
                            ]},
                            { name: '柴油加氢裂化', children: [
                                { name: '导航预览' },
                                { name: '工艺图表' },
                                { name: '化验图表' },
                                { name: '加热炉操作优化' },
                                { name: '催化剂寿命预测与分析' }
                            ]}
                        ]}
                        hasScroll
                    />
                    <Block
                        title="管网模拟"
                        items={[
                            { name: '管网信息台账' },
                            { name: '超高压蒸汽管网模拟' },
                            { name: '高压蒸汽管网模拟' },
                            { name: '中压蒸汽管网模拟' },
                            { name: '低压蒸汽管网模拟' },
                            { name: '氢气系统管网模拟' },
                            { name: '燃料气管网模拟' },
                            { name: '应用配置', children: [
                                { name: '工作面板' },
                                { name: '模型管理' },
                                { name: '模型回收' },
                                { name: '发布管理' },
                                { name: '发布审核' },
                                { name: '发布运行' },
                                { name: '团队管理' }
                            ]}
                        ]}
                        hasScroll
                    />
                    <Block
                        title="调度优化"
                        items={[
                            { name: '调度优化总览' },
                            { name: '协同调度优化' },
                            { name: '氢气系统调度优化' },
                            { name: '调度导航' },
                            { name: '调度模型管理' },
                            { name: '预警管理', children: [
                                { name: '预警配置' },
                                { name: '预警监控' },
                                { name: '预警历史' }
                            ]},
                            { name: '装置模型' },
                            { name: '数据字典' }
                        ]}
                        hasScroll
                    />

                    {/* Row 3 */}
                    <Block
                        title="IBD大数据与算法"
                        items={[
                            { name: '数据中心', children: [
                                { name: '数据源管理' },
                                { name: '位号管理' },
                                { name: 'SQL管理' },
                                { name: '分组管理' },
                                { name: '对象结构' }
                            ]},
                            { name: '任务管理', children: [
                                { name: '任务管理' },
                                { name: '任务实例' }
                            ]},
                            { name: '算法管理', children: [
                                { name: '算法分类' },
                                { name: '算法管理' },
                                { name: '流程管理' },
                                { name: '流程模块管理' },
                                { name: '发布流程' }
                            ]},
                            { name: '应用管理', children: [
                                { name: '装置管理' },
                                { name: '应用管理' }
                            ]},
                            { name: '资源权限服务', children: [
                                { name: '资源来源配置' },
                                { name: '资源权限配置' }
                            ]},
                            { name: '数据仓库', children: [
                                { name: '文件管理' }
                            ]}
                        ]}
                        hasScroll
                    />
                </div>
            </section>
            </div>
        </div>
    )
})

MainContent.displayName = 'MainContent'

export default MainContent
