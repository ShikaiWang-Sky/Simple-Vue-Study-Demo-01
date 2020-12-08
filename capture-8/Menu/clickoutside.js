Vue.directive('clickoutside', {
    bind: function (el, binding, vnode) {
        function documentHandler(e) {
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }
        //给el的新建一个__vueClickOutside__属性, 注意, el是全局的, 并给该属性赋值
        //如果点击了外面, 该属性的值为false
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', el.__vueClickOutside__);
    },
    unbind: function (el, binding) {
        //销毁监听器
        document.removeEventListener('click', el.__vueClickOutside__);
        //删除属性
        delete el.__vueClickOutside__;
    }


});
