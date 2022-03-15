import h from './dom/h.js'
import patch from './dom/patch.js'

console.log('index.js')
const tree = h('ul', {}, [
		h('li', {key: 'a'}, 'a'),
		h('li', {key: 'b'}, 'b'),
		h('li', {key: 'c'}, 'c'),
		h('li', {key: 'd'}, 'd')
	])

const app = document.querySelector('#app')
patch(app, tree)

document.querySelector('#btn1').onclick = function () {
	
	// const tree1 = h('ul', {}, [
	// 	h('li', {key: 'c'}, 'c'),
	// 	h('li', {key: 'b'}, 'b'),
	// 	h('li', {key: 'a'}, 'a'),
	// 	h('li', {key: 'd'}, 'd'),
	// 	h('li', {key: 'f'}, 'f')
	// ])
	
	const tree1 = h('ul', {}, [
		h('li', {key: 'c'}, 'd'),
		h('li', {key: 'b'}, 'c'),
		h('li', {key: 'a'}, 'a'),
		h('li', {key: 'd'}, 'b')
	])
	patch(tree, tree1)
	
}