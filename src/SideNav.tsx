import { useState } from "react"
import Icon from "./Icon"

const NAV_ITEMS = [
    { key: 'home', label: '首页', icon: 'home' as const },
    { key: 'emit', label: '发布', icon: 'emit' as const },
    { key: 'leaf', label: '成长', icon: 'leaf' as const },
    { key: 'rocket', label: '探索', icon: 'rocket' as const },
]

export default function SideNav() {
    const [activeKey, setActiveKey] = useState<string>(NAV_ITEMS[0].key)

    return (
        <div className="side-nav">
            {NAV_ITEMS.map(item => (
                <div
                    key={item.key}
                    className={`side-nav-item${activeKey === item.key ? ' is-active' : ''}`}
                    onClick={() => setActiveKey(item.key)}
                >
                    <Icon name={item.icon} width={24} height={24} />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    )
}
