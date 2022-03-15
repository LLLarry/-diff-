import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from "snabbdom";

const patch = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);

// const container = document.getElementById("app");

// const vnode = h('li.items', { style: { fontSize: '18px' } }, '苹果')
// console.log(vnode)
// // Patch into empty DOM element – this modifies the DOM as a side effect
// patch(container, vnode);