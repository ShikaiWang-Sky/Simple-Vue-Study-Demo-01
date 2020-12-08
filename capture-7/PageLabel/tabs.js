Vue.component('tabs', {
    template: '\
        <div class="tabs">\
            <div class="tabs-bar">\
                <!-- 标签页标题, 这里要用 v-for -->\
                <div \
                    :class="tabCls(item)" \
                    v-for="(item, index) in navList" \
                    @click="handleChange(index)"> \
                    {{ item.label }}\
                    <span \
                        @click="deleteTab(index, event)"\
                        :v-if="isShown(item)">X</span>\
                </div>\
            </div>\
            <div class="tabs-content">\
                <!-- 这里的slot就是嵌套的pane -->\
                <slot></slot>\
            </div>\
        </div>',
    props: {
        //这里的value是为了可以使用v-model
        value: {
            type: [String, Number]
        }
    },
    data: function () {
        return {
            //用于渲染 tabs 的标题
            navList: [],
            //因为不能修改value, 所以复制一份自己维护
            currentValue: this.value
        }
    },
    methods: {
        getTabs() {
            //通过遍历子组件, 得到所有的pane组件
            return this.$children.filter(function (item) {
                return item.$options.name === 'pane';
            });
        },
        updateNav() {
            this.navList = [];
            //设置对this的引用, 在function回调里, this指向的并不是Vue实例
            let _this = this;
            this.getTabs().forEach(function (pane, index) {
                _this.navList.push({
                    label: pane.label,
                    name: pane.name || index
                });
                //如果没有给pane设置name, 默认设置它的索引
                if (!pane.name)
                    pane.name = index;
                //设置当前选中的tab的索引
                if (index === 0) {
                    if (!_this.currentValue) {
                        _this.currentValue = pane.name || index;
                    }
                }
            });
            this.updateStatus();
        },
        updateStatus() {
            let tabs = this.getTabs();
            let _this = this;
            //显示当前选中的tab对应的pane组件, 隐藏没有选中的
            tabs.forEach(function (tab) {
                return tab.show = tab.name === _this.currentValue;
            });
        },
        tabCls: function (item) {
            return [
                'tabs-tab',
                //下面的写法是对象语法, :前的class是否存在取决于:后的条件
                {
                    //给当前选中的tab加一个class
                    'tabs-tab-active': item.name === this.currentValue
                }
            ]
        },
        //点击tab标题时触发
        handleChange: function (index) {
            let nav = this.navList[index];
            let name = nav.name;
            //改变当前选中的tab, 并触发下面的watch
            this.currentValue = name;
            //更新value ==> input和v-model绑定, 在这个子组件中与value绑定, 而子组件
            //用currentValue维护
            this.$emit('input', name);
            //触发一个自定义事件, 供父级使用
            this.$emit('on-click', name);
        },
        //控制是否支持删除选项卡
        isShown: function (item) {
            return item.closable === 'true';
        },
        //删除tab
        deleteTab: function (index, item) {
            //如果关闭的是默认选中的tab
            if (this.navList[index].name === this.currentValue) {
                //如果tab长度大于0 ==> 至少有两个tab
                if (index > 0) {
                    //当前的索引为前一个
                    this.currentValue = this.navList[index - 1].name;
                    this.navList.splice(index, 1);
                    //阻止冒泡, 防止触发点击切换tab的事件
                    event.stopPropagation();
                } else {
                    //当前索引只有一个
                    this.navList.splice(index, 1);
                    event.stopPropagation();
                    if (this.navList.length > 0) {
                        //如果减少一个后还有(异常处理), 则现在的name为第一个的name
                        this.currentValue = this.navList[0].name;
                    } else {
                        //如果减去后为空, 当前值设置为空
                        this.currentValue = '';
                    }
                }
            } else {
                //如果关闭的是没有选中的, 直接减去
                this.navList.splice(index, 1);
                event.stopPropagation();
                //如果此时没有tab, currentValue为空
                if (this.navList.length === 0){
                    this.currentValue = '';
                }
            }
        }
    },
    watch: {
        value: function (val) {
            this.currentValue = val;
        },
        currentValue: function () {
            //在当前选中的tab发生变化时, 更新pane的显示状态
            this.updateStatus();
        }
    }
});
