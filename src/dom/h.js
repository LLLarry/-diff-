import vnode from './vnode.js'
/**
 * h函数作用，调用vnode函数生成虚拟dom
 * @param {Object} sel 元素的标签
 * @param {Object} data 元素的属性
 * @param {Object} params 字符串 | 虚拟dom数组
 */
export default function h (sel, data, params) {
	if (typeof params === 'string') {
		// 为文本节点，表示没有子元素，直接创建虚拟dom
		return vnode(sel, data, undefined, params, null)
	} else if (Array.isArray(params)) {
		// 有子元素，创建有节点的虚拟dom
		return vnode(sel, data, params, undefined, null)
	}
}