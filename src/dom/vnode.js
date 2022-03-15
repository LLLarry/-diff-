/**
 * 创建虚拟节点
 * @param {Object} sel 元素的标签名
 * @param {Object} data 元素的属性
 * @param {Object} children 元素的子元素
 * @param {Object} text 元素的文本
 * @param {Object} elm 虚拟节点对应的真实dom节点
 */
export default function vnode (sel, data, children, text, elm) {
	const key = data.key
	return {
		sel,
		data,
		children,
		text,
		elm,
		key
	}
}