import iconEmit from './assets/icon-emit.svg'
import iconHome from './assets/icon-home.svg'
import iconLeaf from './assets/icon-leaf.svg'
import iconRocket from './assets/icon-rocket.svg'

const ICON_MAP = {
    home: iconHome,
    emit: iconEmit,
    leaf: iconLeaf,
    rocket: iconRocket,
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
