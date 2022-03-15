import createElement from './createElement.js'
import updateChildren from './updateChildren.js'
export default function patchVnode (oldVnode, newVnode) {
	// 新虚拟节点没有子元素
	if (newVnode.children === undefined) {
		// 当新旧节点的文本内容不同时修改文本
		if (newVnode.text !== oldVnode.text) {
			oldVnode.elm.innerText = newVnode.text
		}
	} else { // 新虚拟节点有子节点
		// 旧虚拟节点没有子元素
		if (oldVnode.children === undefined) { 
			// 首先将就节点的文本内容置空
			oldVnode.elm.innerText = ''
			for (let child of newVnode.children) {
				oldVnode.elm.appendChild(createElement(child))
			}
		} else { // 新旧虚拟节点都有子元素 （diff算法核心）
			console.log('diff算法核心')
			updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
		}
	}
}