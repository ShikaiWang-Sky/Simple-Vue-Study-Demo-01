Vue.component('list', {
    props: {
        list: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    render: function (createElement) {
        let _this = this;
        let list = [];
        this.list.forEach(function (msg, index) {
            let node = createElement('div', {
                attr: {
                    class: 'list-item'
                }
            }, [
                createElement('span', msg.name + ': '),
                createElement('div', {
                    attr: {
                        class: 'list-msg'
                    }
                }, [
                    createElement('p', msg.message),
                    createElement('a', {
                        attrs: {
                            class: 'list-reply'
                        },
                        on: {
                            click: function () {
                                _this.handleReply(index);
                            }
                        }
                    }, '回复')
                ])
            ])
            list.push(node);
        });
        if (this.list.length) {
            return createElement('div', {
                attrs: {
                    class: 'list'
                }
            }, list);
        } else {
            return createElement('div', {
                attrs: {
                    class: 'list-nothing'
                }
            }, '留言列表为空');
        }
    },
    methods: {
        handleReply: function (index) {
            this.$emit('reply', index);
        }
    }
});
