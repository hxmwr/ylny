import { useState } from "react"
import Icon from "./Icon"

const NAV_ITEMS = [
    { key: 'home', label: '首页', icon: 'home' as const },
    { key: 'energy', label: '智能能源管理', icon: 'rocket' as const },
    { key: 'carbon', label: '碳排放管理', icon: 'emit' as const },
    { key: 'optimize', label: '能源优化', icon: 'leaf' as const },
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
