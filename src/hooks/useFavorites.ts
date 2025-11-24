import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'ylny_favorites'

export interface FavoriteItem {
    itemId: string       // 唯一标识: section_blockTitle_itemName
    section: string      // 所属section: energy/carbon/optimize
    blockTitle: string   // 所属block标题
    itemName: string     // 菜单项名称
    url: string | null   // 菜单项链接
    addedAt: number      // 收藏时间戳
}

// 从localStorage读取收藏列表
function loadFavorites(): FavoriteItem[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

// 保存收藏列表到localStorage
function saveFavorites(favorites: FavoriteItem[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (e) {
        console.error('Failed to save favorites:', e)
    }
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites)

    // 监听storage事件，支持多标签页同步
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setFavorites(loadFavorites())
            }
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    // 检查是否已收藏
    const isFavorite = useCallback((itemId: string): boolean => {
        return favorites.some(f => f.itemId === itemId)
    }, [favorites])

    // 切换收藏状态
    const toggleFavorite = useCallback((itemId: string, section: string, blockTitle: string, itemName: string, url?: string | null) => {
        setFavorites(prev => {
            const exists = prev.some(f => f.itemId === itemId)
            let newFavorites: FavoriteItem[]

            if (exists) {
                // 取消收藏
                newFavorites = prev.filter(f => f.itemId !== itemId)
            } else {
                // 添加收藏
                newFavorites = [...prev, {
                    itemId,
                    section,
                    blockTitle,
                    itemName,
                    url: url ?? null,
                    addedAt: Date.now()
                }]
            }

            saveFavorites(newFavorites)
            return newFavorites
        })
    }, [])

    // 获取某个section的收藏列表
    const getFavoritesBySection = useCallback((section: string): FavoriteItem[] => {
        return favorites.filter(f => f.section === section)
    }, [favorites])

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        getFavoritesBySection
    }
}

// 生成菜单项唯一ID
export function generateItemId(section: string, blockTitle: string, itemName: string): string {
    return `${section}_${blockTitle}_${itemName}`
}
