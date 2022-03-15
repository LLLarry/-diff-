import vnode from './vnode'
import createElement  from './createElement.js'
import patchVnode from './patchVnode.js'
/** 对比新旧两个节点的异同
		是同一节点
		不是同一节点：旧节点删除、新节点添加
 * @param {Object} oldVnode
 * @param {Object} newVnode
 */
export default function patch (oldVnode, newVnode) {
	// 没有sel属性的oldVnode为真实dom; 
	// 我们需要将真实dom转化为虚拟dom
	if (oldVnode.sel === undefined) {
		const sel = oldVnode.tagName.toLowerCase()
		oldVnode = vnode(sel, {}, [], undefined, oldVnode)
	}
	
	if (oldVnode.sel === newVnode.sel) {
		// 表示两个节点相同
		patchVnode(oldVnode, newVnode)
	} else {
		// 表示两个节点不相同，直接将新节点删除、然后创建就节点
		// 1、新节点的dom元素
		const newVnodeElm = createElement(newVnode)
		// 2、旧节点的dom元素
		const oldVnodeElm = oldVnode.elm
		// 3、将新元素添加到旧元素前面
		oldVnodeElm.parentNode.insertBefore(newVnodeElm, oldVnodeElm)
		// 4、将旧元素删除掉
		oldVnodeElm.parentNode.removeChild(oldVnodeElm)
	}
}