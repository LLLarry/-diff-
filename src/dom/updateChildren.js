
import patchVnode from './patchVnode.js'
import createElement from './createElement.js'
function sameVnode (oldVnode, newVnode) {
	return oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel
}

/**
 * 对比子节点并更新子节点
 * @param {Object} parentElm 
 * @param {Object} oldCh
 * @param {Object} newCh
 */
export default function updateChildren (parentElm, oldCh, newCh) {
	let oldStartInx = 0				 // 旧前指针
	let oldEndInx = oldCh.length - 1 // 旧后指针
	let newStartIdx = 0				 // 新前指针
	let newEndIdx = newCh.length - 1 // 新后指针
	
	let oldStartVnode = oldCh[0] // 旧前虚拟节点
	let oldEndVnode = oldCh[oldEndInx] // 旧后虚拟节点
	let newStartVnode = newCh[0] // 新前虚拟节点
	let newEndVnode = newCh[newEndIdx] // 新后虚拟节点
	
	while (oldStartInx <= oldEndInx && newStartIdx <= newEndIdx) {
		// 当虚拟节点为undefined时，移动指针：跳过当前虚拟节点
		if (oldStartVnode === undefined) {
			oldStartVnode = oldCh[++oldStartInx]
		} else if (oldEndVnode === undefined) {
			oldEndVnode = oldCh[--oldEndInx]
		}
		else if (sameVnode(oldStartVnode, newStartVnode)) { // 旧前与新前
			console.log(1)
			patchVnode(oldStartVnode, newStartVnode) // 对比新旧两个节点,并将不同的内容修改到旧节点上
			if (newStartVnode) newStartVnode.elm = oldStartVnode?.elm // 将旧节点的elm赋值给新节点
			oldStartVnode = oldCh[++oldStartInx] // 旧前节点指针向下移动一个位置
			newStartVnode = newCh[++newStartIdx] // 新前节点指针向下移动一个位置
			
		} else if(sameVnode(oldEndVnode, newEndVnode)) { // 旧后与新后
			console.log(2)
			patchVnode(oldEndVnode, newEndVnode) // 对比新旧两个节点,并将不同的内容修改到旧节点上
			if (newStartVnode) newEndVnode.elm = oldEndVnode?.elm // 将旧节点的elm赋值给新节点
			oldEndVnode = oldCh[--oldEndInx] // 旧后节点指针向上移动一个位置
			newEndVnode = newCh[--newEndIdx] // 新后节点指针向上移动一个位置
			
		} else if(sameVnode(oldStartVnode, newEndVnode)) { // 旧前与新后
			console.log(3)
			patchVnode(oldStartVnode, newEndVnode) // 对比新旧两个节点,并将不同的内容修改到旧节点上
			if (newEndVnode) newEndVnode.elm = oldStartVnode?.elm
			parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling) // 将旧节点移动到旧列表最后
			oldStartVnode = oldCh[++oldStartInx] 
			newEndVnode = newCh[--newEndIdx]
			
		} else if(sameVnode(oldEndVnode, newStartVnode)) { // 旧后与新前
			console.log(4)
			patchVnode(oldEndVnode, newStartVnode)
			if (newStartVnode) newStartVnode.elm = oldEndVnode?.elm
			parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm) // 将旧前的位置插入到新节点的对应的旧节点的下个兄弟节点位置前面
			oldEndVnode = oldCh[--oldEndInx]
			newStartVnode = newCh[++newStartIdx]
			
		} else { // 以上都不满足 查找
			console.log(5)
			// 获取旧list中有key的虚拟节点
			// oldKeyMap: 旧节点key对应的索引
			const oldKeyMap = oldCh.reduce((map, vNode, i) => {
				const key = vNode?.key
				if (key !== undefined) {
					map[key] = i
				}
				return map
			}, {})
			
			// 在oldKeyMap中找到新前节点对应的节点索引
			const idxInOld = oldKeyMap[newStartVnode.key]
			
			if (idxInOld !== undefined) { // 找到，说明该节点在新旧虚拟节点都存在
				const elmMove = oldCh[idxInOld]
				patchVnode(elmMove, newStartVnode) // 对比新旧两个节点,并将不同的内容修改到旧节点上
				// 处理过的节点，在虚拟节点的数组中，设置为undefined
				oldCh[idxInOld] = undefined
				parentElm.insertBefore(elmMove.elm, oldStartVnode.elm)
			} else { // 找不到，说明新节点为新创建的节点
				parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
			}
			// 指针加1
			newStartVnode = newCh[++newStartIdx]
		}
	}
	
	// 新增、删除 的情况
	// 结束while循环只有两种情况
	// 1、oldStartInx > oldEndInx
	// 2、newStartInx > newEndInx
	console.log(oldStartInx , oldEndInx)
	if (oldStartInx > oldEndInx) {
		// 添加操作
		const before = newCh[newEndIdx + 1] ? newCh[newEndIdx+1].elm : null
		for (let i = newStartIdx; i <= newEndIdx; i++) {
			parentElm.insertBefore(createElement(newCh[i]), before)
		}
	} else {
		// 删除操作
		for (let i = oldStartInx; i <= oldEndInx; i++) {
			console.log(i, oldCh[i].elm)
			parentElm.removeChild(oldCh[i].elm)
		}
	}
}