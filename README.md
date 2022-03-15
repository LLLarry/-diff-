

## 1、虚拟DOM和真实DOM节点对比

虚拟DOM

```js
{
    children: undefined
    data: {style: {…}}
    elm: li.items
    key: undefined
    sel: "li.items"
    text: "苹果"
}
```

真实DOM

```html
<li class="items" style="font-size: 18px;">苹果</li>
```

虚拟DOM: 其实就是通过js对象来表示一个真实的DOM对象

作用： 提升性能


## 2、新旧节点替换的规则

**diff算法中是如何判断新旧节点相等？**
	通过判断新旧节点的key和标签名相等

1、只能同级进行比较，不能跨层比较

2、如果新老节点不是同一个节点名称、那么就暴力删除旧的节点，创建新的节点

3、如果新旧节点是同一个节点名称、就判断新节点的children是不是undefined
	是undefined：
		判断 新旧节点的text是否不相等，不相等新text替换旧的
	不是undefined:
		判断就节点children是否是undefined：
			是undefined：旧节点的文本置空、将新节点的children创建为元素，append到就节点中
	不是undefined: 
		比较新旧节点的子元素（diff算法核心）	
4、比较新旧节点的子元素（diff算法核心）
	这个是新的 vnode 和 oldVnode 都有子节点，且子节点不一样的时候进行对比子节点的函数，这里很关键，很关键！
	
	比如现在有两个子节点列表对比，对比主要流程如下：
	
	循环遍历两个列表，循环停止条件是：其中一个列表的开始指针 startIdx 和 结束指针 endIdx 重合
	
	循环内容是：
	* 1、旧头与新头对比
	* 2、旧尾与新尾对比
	* 3、旧头与新尾对比
	* 4、旧尾与新头对比
	* 5、通过遍历在旧节点中查询新节点是否存在



> **注意：** 如果要提升性能，就一定要加key; key是唯一标识，在更改前后，确认是不是同一个节点

## 3、diff算法中各函数的作用
* **vnode函数：** 生成虚拟dom的函数

* **h函数：** 调用vnode生成虚拟dom

* **createElement函数：**将虚拟dom创建为真实dom,如果有子节点的话会递归创建真实dom

* **patch函数：**对比新旧虚拟节点

  * 新旧虚拟节点的标签名不同：旧节点删除，添加新节点
  * 新旧虚拟节点的标签名相同同：调用`patchVnode函数`判断新旧虚拟节点
  * 如果旧节点为`真实dom`，则会将真实dom通过`vnode函数`转化为虚拟dom在进行对比

* **patchVnode函数：**对比新旧节点的children和text属性

  * 新节点children为undefined，判断新旧节点的文本是否相同、不相同更改
  * 旧节点children为undefined，新节点不为undefined
    * 删除旧节点文本、将新节点的子元素渲染到旧节点上

  * 新旧节点children都不为undefined
    * diff算法核心 调用`updateChildren函数`，对比子节点

* **updateChildren函数:** 对比新旧虚拟节点的children集合，进行最小化更细到页面上

  通过循环对比的方式

  循环内容是：
  * 1、旧头与新头对比
  * 2、旧尾与新尾对比
  * 3、旧头与新尾对比
  * 4、旧尾与新头对比
  * 5、通过遍历在旧节点中查询新节点是否存在

  ​	

## 演示实例

旧节点
```js 
const tree = h('ul', {}, [
		h('li', {key: 'a'}, 'a'),
		h('li', {key: 'b'}, 'b'),
		h('li', {key: 'c'}, 'c'),
		h('li', {key: 'd'}, 'd')
	])
```

新节点
```js 
const tree1 = h('ul', {}, [
		h('li', {key: 'd'}, 'd'),
		h('li', {key: 'c'}, 'c'),
		h('li', {key: 'a'}, 'a'),
		h('li', {key: 'b'}, 'b')
	])
```

执行流程：
	初始化数据
		oldStartInx = 0 				起始指针
		oldEndInx = oldCh.length - 1	旧后指针
		newStartIdx = 0 				新前指针
		newEndIdx = newCh.length - 1	新后指针
		
~~~js
第一次循环、
	旧头与新头对比，不匹配
	旧尾与新尾对比，不匹配
	旧头与新尾对比，不匹配
	旧尾与新头对比，匹配
		通过patchVnode对比新旧节点，并将差异更新到旧节点上
		将旧节点的位置移动到新节点对应的位置
		移动之后的旧节点的位置为
		```
		<li>d</li>
		<li>a</li>
		<li>b</li>
		<li>c</li>
		```
	修改指针的位置
	oldStartInx = 0
	oldEndInx = oldCh.length - 2
	newStartIdx = 1
	newEndIdx = newCh.length - 1
第二次循环、
	我们先看下新旧指针对应的位置
	旧节点
	```js 
	const tree = h('ul', {}, [
			h('li', {key: 'a'}, 'a'), // oldStartInx
			h('li', {key: 'b'}, 'b'),
			h('li', {key: 'c'}, 'c'), // oldEndInx
			h('li', {key: 'd'}, 'd')
		])
	```
	
	新节点
	```js 
	const tree1 = h('ul', {}, [
			h('li', {key: 'd'}, 'd'),
			h('li', {key: 'c'}, 'c'), // newStartIdx
			h('li', {key: 'a'}, 'a'),
			h('li', {key: 'b'}, 'b') // newEndIdx
		])
	```
	旧头与新头对比，不匹配
	旧尾与新尾对比，不匹配
	旧头与新尾对比，不匹配
	旧尾与新头对比，匹配
		
		通过patchVnode对比新旧节点，并将差异更新到旧节点上
		将旧节点的位置移动到新节点对应的位置
		移动之后的旧节点的位置为
		```
		<li>d</li>
		<li>c</li>
		<li>a</li>
		<li>b</li>
		```
	修改指针的位置
	oldStartInx = 0
	oldEndInx = oldCh.length -3
	newStartIdx = 2
	newEndIdx = newCh.length - 1
	
	第三次循环、
		我们先看下新旧指针对应的位置
		旧节点
		```js 
		const tree = h('ul', {}, [
				h('li', {key: 'a'}, 'a'), // oldStartInx
				h('li', {key: 'b'}, 'b'), // oldEndInx
				h('li', {key: 'c'}, 'c'), 
				h('li', {key: 'd'}, 'd')
			])
		```
		
		新节点
		```js 
		const tree1 = h('ul', {}, [
				h('li', {key: 'd'}, 'd'),
				h('li', {key: 'c'}, 'c'), 
				h('li', {key: 'a'}, 'a'), // newStartIdx
				h('li', {key: 'b'}, 'b')  // newEndIdx
			])
		```
		旧头与新头对比，匹配
			通过patchVnode对比新旧节点，并将差异更新到旧节点上
			由于新旧位置相同所以不需要进行移动
			
			此时dom节点为
			```
			<li>d</li>
			<li>c</li>
			<li>a</li>
			<li>b</li>
			```
			
		修改指针位置
			oldStartInx = 1
			oldEndInx = oldCh.length -3
			newStartIdx = 3
			newEndIdx = newCh.length - 1
~~~


​				
~~~js
	第四次循环、
		我们先看下新旧指针对应的位置
		旧节点
		```js 
		const tree = h('ul', {}, [
				h('li', {key: 'a'}, 'a'), 
				h('li', {key: 'b'}, 'b'), // oldStartInx oldEndInx
				h('li', {key: 'c'}, 'c'), 
				h('li', {key: 'd'}, 'd')
			])
		```
		
		新节点
		```js 
		const tree1 = h('ul', {}, [
				h('li', {key: 'd'}, 'd'),
				h('li', {key: 'c'}, 'c'), 
				h('li', {key: 'a'}, 'a'), 
				h('li', {key: 'b'}, 'b')  // newEndIdx newStartIdx
			])
		```
		旧头与新头对比，匹配
			通过patchVnode对比新旧节点，并将差异更新到旧节点上
			由于新旧位置相同所以不需要进行移动
			
			此时dom节点为
			```
			<li>d</li>
			<li>c</li>
			<li>a</li>
			<li>b</li>
			```
			
		修改指针位置
			oldStartInx = 2
			oldEndInx = oldCh.length -3
			newStartIdx = 4
			newEndIdx = newCh.length - 1
	
	第五次循环时
		不满足 oldStartInx <= oldEndInx && newStartIdx <= newEndIdx条件
		所以结束循环
		
		最后dom顺序为
		```
		<li>d</li>
		<li>c</li>
		<li>a</li>
		<li>b</li>
		```
		且都是已更改之后的元素
~~~