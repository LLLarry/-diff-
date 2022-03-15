/**
 * 根据虚拟节点创建真实的DOM元素
 * @param {Object} vnode
 */
export default function createElement (vnode) {
	const dom = document.createElement(vnode.sel)
	if (vnode.text !== undefined) {
		// 元素子节点为文本，直接设置元素的文本为 vnode.text
		dom.innerText = vnode.text
	} else if (Array.isArray(vnode.children)) {
		// 元素子节点为 dom元素，需要递归创建子dom元素
		for (let child of vnode.children) {
			dom.appendChild(createElement(child))
		}
	}
	// 将虚拟dom 的elm属性映射到 dom元素
	vnode.elm = dom
	return dom
}