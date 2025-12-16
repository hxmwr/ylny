import { Card, Calendar } from 'antd'
import { StarOutlined, StarFilled, RightOutlined, DownOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import { forwardRef, useState, createContext, useContext } from 'react'
import './mainContent.css'
import { useFavorites, generateItemId } from './hooks/useFavorites'
import { useUserMenus, type MenuItem } from './hooks/useUserMenus'
import PendingTasks from './components/PendingTasks'
import NoticeList from './components/NoticeList'

// 收藏功能Context
interface FavoritesContextType {
    isFavorite: (itemId: string) => boolean
    toggleFavorite: (itemId: string, section: string, blockTitle: string, itemName: string, url?: string | null) => void
    currentSection: string
    currentBlockTitle: string
}
const FavoritesContext = createContext<FavoritesContextType | null>(null)

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

interface BlockProps {
    title: string
    items: MenuItem[]
    hasScroll?: boolean
    section: string
}

// 递归渲染菜单项组件
function MenuItemRenderer({ item, level = 0 }: { item: MenuItem; level?: number }) {
    const [expanded, setExpanded] = useState(false)
    const hasChildren = item.children && item.children.length > 0
    const hasLink = !hasChildren && item.url
    const favoritesContext = useContext(FavoritesContext)

    // 生成当前菜单项的唯一ID
    const itemId = favoritesContext
        ? generateItemId(favoritesContext.currentSection, favoritesContext.currentBlockTitle, item.name)
        : ''
    const isStarred = favoritesContext?.isFavorite(itemId) ?? false

    const handleStarClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (favoritesContext) {
            favoritesContext.toggleFavorite(
                itemId,
                favoritesContext.currentSection,
                favoritesContext.currentBlockTitle,
                item.name,
                item.url
            )
        }
    }

    const handleItemClick = () => {
        if (hasChildren) {
            setExpanded(!expanded)
        } else if (item.url) {
            // 在新窗口打开链接
            window.open(item.url, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div className="menu-item-wrapper">
            <div
                className={`menu-item level-${level} ${hasChildren ? 'has-children' : ''} ${hasLink ? 'has-link' : ''}`}
                onClick={handleItemClick}
                style={{ paddingLeft: level * 12 }}
            >
                {hasChildren && (
                    <span className="expand-icon">
                        {expanded ? <DownOutlined /> : <RightOutlined />}
                    </span>
                )}
                {!hasChildren && (
                    <span className="leaf-star" onClick={handleStarClick}>
                        {isStarred
                            ? <StarFilled style={{ color: '#faad14' }} />
                            : <StarOutlined className="leaf-icon" />
                        }
                    </span>
                )}
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

function Block({ title, items, hasScroll, section }: BlockProps) {
    const parentContext = useContext(FavoritesContext)

    // 创建一个新的context值，包含当前block的信息
    const blockContext: FavoritesContextType | null = parentContext ? {
        ...parentContext,
        currentSection: section,
        currentBlockTitle: title
    } : null

    return (
        <div className="energy-card">
            <div className="energy-card-header">
                <h3 className="energy-card-title">{title}</h3>
            </div>
            <div className={`energy-card-content ${hasScroll ? 'has-scroll' : ''}`}>
                <FavoritesContext.Provider value={blockContext}>
                    <div className="menu-tree">
                        {items.map((item, index) => (
                            <MenuItemRenderer key={index} item={item} level={0} />
                        ))}
                    </div>
                </FavoritesContext.Provider>
            </div>
        </div>
    )
}

const DOC_ITEMS = [
    { id: 1, name: '文档权限申请', icon: docPermissionApply, highlighted: true, url: '/msService/DocManage/docBorrow/docBorrow/docBorrowList?supos_menu_code=DocManage_1.0.0_docBorrow_docBorrowList_copy_1684862221778341' },
    { id: 2, name: '文档管理', icon: docManagement, url: '/msService/DocManage/document/docDocument/docManageLayout?supos_menu_code=DocManage_1.0.0_document_docManageLayout_copy_1684862221385120' },
    { id: 3, name: '文件夹管理', icon: folderManagement, url: '/msService/DocManage/docClass/docClass/docClassLayout?supos_menu_code=DocManage_1.0.0_docClass_docClassLayout_copy_1684862221319584' },
    { id: 4, name: '文档新增', icon: docAdd, url: '/msService/DocManage/document/docDocument/documentList?supos_menu_code=DocManage_1.0.0_document_documentList_copy_1684862222138791' },
    { id: 5, name: '文档删除', icon: docDelete, url: '/msService/DocManage/docDelApprove/docDelApprove/docDelList?supos_menu_code=DocManage_1.0.0_docDelApprove_docDelList_copy_1684862220696992' },
    { id: 6, name: '我的文档', icon: myDoc, url: '/msService/DocManage/document/docDocument/myDocList?supos_menu_code=DocManage_1.0.0_document_myDocList_copy_1684862222138785' },
    { id: 7, name: '文档回收站', icon: docRecycleBin, url: '/msService/DocManage/document/docDocument/docRecycleLayout?supos_menu_code=DocManage_1.0.0_document_docRecycleLayout_copy_1684862221811107' },
    { id: 8, name: '文档管理权限', icon: docManagementPermission, url: '/msService/DocManage/docPower/userPower/userPowerList?supos_menu_code=DocManage_1.0.0_docPower_userPowerList_copy_1684862222073248' },
    { id: 9, name: '文档新增', icon: docAddTree, url: '/msService/DocManage/document/docDocument/docmentListLayout?supos_menu_code=DocManage_1.0.0_document_docmentListLayout_copy_1684862222171557' },
]

interface MainContentProps {
    activeSection?: string
}

const MainContent = forwardRef<HTMLDivElement, MainContentProps>(({ }, ref) => {
    // 收藏功能
    const { favorites, isFavorite, toggleFavorite, loading: favoritesLoading, error: favoritesError } = useFavorites()

    // 从新接口获取菜单数据
    const { energyBlocks, carbonBlocks, optimizeBlocks, loading: menusLoading, error: menusError } = useUserMenus()

    const loading = favoritesLoading || menusLoading
    const error = favoritesError || menusError

    const onPanelChange = (value: Dayjs, mode: any) => {
        console.log(value.format('YYYY-MM-DD'), mode)
    }

    return (
        <FavoritesContext.Provider value={{ isFavorite, toggleFavorite, currentSection: '', currentBlockTitle: '' }}>
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
                            <PendingTasks />
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
                            <NoticeList />
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
                    loading={loading}
                >
                    <div className="favorites-content">
                        {error ? (
                            <div className="favorites-error" style={{ color: '#ff4d4f', padding: '10px', textAlign: 'center' }}>
                                加载失败: {error}
                            </div>
                        ) : favorites.length === 0 ? (
                            <div className="favorites-empty">暂无收藏，点击菜单项左侧的星标添加收藏</div>
                        ) : (
                            <div className="favorites-list">
                                {favorites.map(fav => (
                                    <div
                                        key={fav.itemId}
                                        className={`favorite-item ${fav.url ? 'has-link' : ''}`}
                                        onClick={() => fav.url && window.open(fav.url, '_blank', 'noopener,noreferrer')}
                                    >
                                            <StarFilled
                                                className="favorite-star"
                                                style={{ color: '#faad14' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleFavorite(fav.itemId, fav.section, fav.blockTitle, fav.itemName, fav.url)
                                                }}
                                            />
                                            <span className="favorite-title">{fav.itemName}</span>
                                            <span className="favorite-section">
                                                {fav.section === 'energy' ? '智能能源管理' :
                                                 fav.section === 'carbon' ? '碳排放管理' : '能源优化'}
                                                 {' > '}{fav.blockTitle}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        )}
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
                                onClick={() => item.url && window.open(item.url, '_blank', 'noopener,noreferrer')}
                                style={{ cursor: item.url ? 'pointer' : 'default' }}
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
                            section="energy"
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
                            section="carbon"
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
                            section="optimize"
                        />
                    ))}
                </div>
            </section>
            </div>
        </div>
        </FavoritesContext.Provider>
    )
})

MainContent.displayName = 'MainContent'

export default MainContent
