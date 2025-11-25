import { useState, useCallback, useEffect, useRef } from 'react'
import { getFavoritesFromBackend, saveFavoritesToBackend } from '../services/favoritesApi'
import type { FavoriteItem } from '../types/favorites'

export type { FavoriteItem }

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const initializedRef = useRef(false)

    // 从后端加载收藏列表
    const loadFavorites = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getFavoritesFromBackend()
            setFavorites(data)
        } catch (err) {
            console.error('加载收藏列表失败:', err)
            setError(err instanceof Error ? err.message : '加载失败')
            // 失败时使用空数组
            setFavorites([])
        } finally {
            setLoading(false)
        }
    }, [])

    // 组件挂载时加载数据（避免React Strict Mode重复加载）
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true
            loadFavorites()
        }
    }, [loadFavorites])

    // 检查是否已收藏
    const isFavorite = useCallback((itemId: string): boolean => {
        return favorites.some(f => f.itemId === itemId)
    }, [favorites])

    // 切换收藏状态
    const toggleFavorite = useCallback(async (itemId: string, section: string, blockTitle: string, itemName: string, url?: string | null) => {
        try {
            // 基于当前状态计算新的收藏列表
            const exists = favorites.some(f => f.itemId === itemId)
            let newFavorites: FavoriteItem[]

            if (exists) {
                // 取消收藏
                newFavorites = favorites.filter(f => f.itemId !== itemId)
            } else {
                // 添加收藏
                newFavorites = [...favorites, {
                    itemId,
                    section,
                    blockTitle,
                    itemName,
                    url: url ?? null,
                    addedAt: Date.now()
                }]
            }

            // 立即更新UI状态
            setFavorites(newFavorites)

            // 异步保存到后端
            try {
                await saveFavoritesToBackend(newFavorites)
            } catch (err) {
                console.error('保存收藏到后端失败:', err)
                setError('保存失败，请稍后重试')
                // 可选：回滚到之前的状态
                // setFavorites(favorites)
            }
        } catch (err) {
            console.error('切换收藏状态失败:', err)
            setError(err instanceof Error ? err.message : '操作失败')
        }
    }, [favorites])

    // 获取某个section的收藏列表
    const getFavoritesBySection = useCallback((section: string): FavoriteItem[] => {
        return favorites.filter(f => f.section === section)
    }, [favorites])

    // 手动刷新收藏列表
    const refreshFavorites = useCallback(() => {
        return loadFavorites()
    }, [loadFavorites])

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        getFavoritesBySection,
        loading,
        error,
        refreshFavorites
    }
}

// 生成菜单项唯一ID
export function generateItemId(section: string, blockTitle: string, itemName: string): string {
    return `${section}_${blockTitle}_${itemName}`
}
