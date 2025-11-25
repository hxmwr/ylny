export interface FavoriteItem {
    itemId: string       // 唯一标识: section_blockTitle_itemName
    section: string      // 所属section: energy/carbon/optimize
    blockTitle: string   // 所属block标题
    itemName: string     // 菜单项名称
    url: string | null   // 菜单项链接
    addedAt: number      // 收藏时间戳
}
