import iconHome from './assets/icon-home.svg'
import iconEnergyManage from './assets/能源管理-1.svg'
import iconCarbonManage from './assets/碳排放管理.svg'
import iconEnergyOptimize from './assets/能源优化.svg'

const ICON_MAP = {
    home: iconHome,
    energy: iconEnergyManage,
    carbon: iconCarbonManage,
    optimize: iconEnergyOptimize,
} as const

type IconName = keyof typeof ICON_MAP

interface IconProps {
    name: IconName
    width?: number | string
    height?: number | string
    className?: string
}

export default function Icon({ width = 24, height = 24, name, className }: IconProps) {
    const src = ICON_MAP[name]

    return (
        <img
            className={className ? `icon ${className}` : 'icon'}
            src={src}
            alt={`${name} icon`}
            width={width}
            height={height}
        />
    )
}
