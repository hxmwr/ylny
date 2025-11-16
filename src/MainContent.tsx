import { Card, Calendar } from 'antd'
import type { Dayjs } from 'dayjs'
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

export default function MainContent() {
    const onPanelChange = (value: Dayjs, mode: any) => {
        console.log(value.format('YYYY-MM-DD'), mode)
    }

    return (
        <div className="main-content">
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
        </div>
    )
}
