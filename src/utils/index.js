/**
 * 将列表形式的数据转换为树形结构
 * @param {Array} list - 列表形式的数据数组
 * @param {string|number} rootValue - 根节点的pid值
 * @returns {Array} - 转换后的树形结构数组
 */
export function transListToTreeData(list, rootValue = 0) {
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

/**
 * 函数防抖，用于限制函数的执行频率。
 * 在等待期间，如果再次触发函数，则会重置等待时间。
 * 只有在等待时间结束且没有新的触发时，才会执行函数。
 * 
 * @param {Function} func - 需要防抖的函数。
 * @param {number} wait - 等待时间，单位为毫秒。
 * @returns {Function} - 返回防抖后的函数。
 */
export function debounce(func, wait) {
    let timeout; // 用于存储定时器的引用，以便可以取消定时器。
    return function () {
        const context = this; // 保存函数执行的上下文(this值)。
        const args = arguments; // 保存传递给函数的参数。
        clearTimeout(timeout); // 取消之前的定时器，以重新开始等待时间。
        timeout = setTimeout(function () { // 设置定时器，在等待时间结束后执行原函数。
            func.apply(context, args); // 执行原函数，并传递正确的上下文和参数。
        }, wait); // 等待时间为传入的wait参数。
    };
}