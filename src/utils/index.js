/**
 * 将列表形式的数据转换为树形结构
 * @param {Array} list - 列表形式的数据数组
 * @param {string|number} rootValue - 根节点的pid值
 * @returns {Array} - 转换后的树形结构数组
 */
export function transListToTreeData(list, rootValue=0) {
    // 初始化一个空数组，用于存储根节点
    const arr = []
    // 遍历列表中的每个元素
    list.forEach(item => {
        // 判断当前节点的pid是否等于根节点的pid
        if (item.pid === rootValue) {
            // 找到了匹配的节点，将其作为根节点
            // 查找当前节点的子节点
            const children = transListToTreeData(list, item.id)
            // 将子节点赋值给当前节点的children属性
            item.children = children
            // 将当前节点添加到根节点数组中
            arr.push(item)
        }
    })
    // 返回转换后的树形结构数组
    return arr
}