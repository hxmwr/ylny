import { useState, useCallback, useEffect, useRef } from 'react'
import { getUserPermissions } from '../services/favoritesApi'

// 菜单项类型（与MainContent中保持一致）
interface MenuItem {
    name: string
    url?: string | null
    children?: MenuItem[]
}

export function usePermissions() {
    const [permittedUrls, setPermittedUrls] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const initializedRef = useRef(false)

    // 从后端加载权限列表
    const loadPermissions = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const urls = await getUserPermissions()
            setPermittedUrls(urls)
        } catch (err) {
            console.error('加载权限列表失败:', err)
            setError(err instanceof Error ? err.message : '加载权限失败')
            // 失败时使用空Set（不显示任何菜单，或者可以改为显示所有菜单）
            setPermittedUrls(new Set())
        } finally {
            setLoading(false)
        }
    }, [])

    // 组件挂载时加载数据（避免React Strict Mode重复加载）
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true
            loadPermissions()
        }
    }, [loadPermissions])

    // 检查URL是否有权限
    const hasPermission = useCallback((url: string | null | undefined): boolean => {
        if (!url) return false
        return permittedUrls.has(url)
    }, [permittedUrls])

    // 过滤菜单项：递归过滤，只保留有权限的菜单项
    // 对于非叶子节点，如果其下没有任何有权限的子菜单，也会被过滤掉
    const filterMenuItems = useCallback((items: MenuItem[]): MenuItem[] => {
        return items
            .map(item => {
                // 如果有子菜单，递归过滤子菜单
                if (item.children && item.children.length > 0) {
                    const filteredChildren = filterMenuItems(item.children)
                    // 如果过滤后没有任何子菜单，这个节点也不显示
                    if (filteredChildren.length === 0) {
                        return null
                    }
                    return {
                        ...item,
                        children: filteredChildren
                    }
                } else {
                    // 叶子节点：检查URL是否有权限
                    if (hasPermission(item.url)) {
                        return item
                    }
                    return null
                }
            })
            .filter((item): item is MenuItem => item !== null)
    }, [hasPermission])

    // 过滤blocks数据
    const filterBlocks = useCallback((blocks: { title: string; items: MenuItem[] }[]): { title: string; items: MenuItem[] }[] => {
        return blocks
            .map(block => ({
                title: block.title,
                items: filterMenuItems(block.items)
            }))
            .filter(block => block.items.length > 0) // 过滤掉没有任何菜单项的block
    }, [filterMenuItems])

    // 手动刷新权限列表
    const refreshPermissions = useCallback(() => {
        return loadPermissions()
    }, [loadPermissions])

    return {
        permittedUrls,
        hasPermission,
        filterMenuItems,
        filterBlocks,
        loading,
        error,
        refreshPermissions
    }
}
