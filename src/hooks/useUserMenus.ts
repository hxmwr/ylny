import { useState, useEffect, useCallback } from 'react'
import { getUserMenus, extractEnergyMenus, type UserMenuItem } from '../services/favoritesApi'

// 层级菜单项类型定义（用于Block组件）
export interface MenuItem {
  name: string
  url?: string | null
  children?: MenuItem[]
}

// 将UserMenuItem转换为MenuItem
function convertUserMenuItems(items: UserMenuItem[]): MenuItem[] {
  return items.map(item => ({
    name: item.displayName,
    url: item.url,
    children: item.children && item.children.length > 0
      ? convertUserMenuItems(item.children)
      : undefined
  }))
}

// 从UserMenuItem生成blocks数据
function generateBlocksFromMenu(menu: UserMenuItem | null): { title: string; items: MenuItem[] }[] {
  if (!menu || !menu.children) return []

  return menu.children.map(child => ({
    title: child.displayName,
    items: child.children && child.children.length > 0
      ? convertUserMenuItems(child.children)
      : []
  }))
}

export function useUserMenus() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [energyBlocks, setEnergyBlocks] = useState<{ title: string; items: MenuItem[] }[]>([])
  const [carbonBlocks, setCarbonBlocks] = useState<{ title: string; items: MenuItem[] }[]>([])
  const [optimizeBlocks, setOptimizeBlocks] = useState<{ title: string; items: MenuItem[] }[]>([])

  const loadMenus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const menus = await getUserMenus()
      const { energyMenu, carbonMenu, optimizeMenu } = extractEnergyMenus(menus)

      setEnergyBlocks(generateBlocksFromMenu(energyMenu))
      setCarbonBlocks(generateBlocksFromMenu(carbonMenu))
      setOptimizeBlocks(generateBlocksFromMenu(optimizeMenu))
    } catch (err) {
      console.error('加载用户菜单失败:', err)
      setError(err instanceof Error ? err.message : '加载菜单失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMenus()
  }, [loadMenus])

  return {
    loading,
    error,
    energyBlocks,
    carbonBlocks,
    optimizeBlocks,
    refreshMenus: loadMenus
  }
}
