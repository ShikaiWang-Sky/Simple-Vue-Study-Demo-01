Vue.component('vInput', {
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    render: function (createElement) {
        let _this = this;
        return createElement('div', [
            createElement('span', '昵称: '),
            createElement('input', {
                attrs: {
                    type: 'text'
                },
                domProps: {
                    value: this.value
                },
                on: {
                    input: function (event) {
                        _this.value = event.target.value;
                        _this.$emit('input', event.target.value);
                    }
                }
            })
        ]);
    }
});

Vue.component('vTextarea', {
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    render: function (createElement) {
        let _this = this;
        return createElement('div', [
            createElement('span', '留言内容'),
            createElement('textarea', {
                attrs: {
                    placeholder: '请输入留言内容'
                },
                domProps: {
                    value: this.value
                },
                ref: 'message',
                on: {
                    input: function (event) {
                        _this.value = event.target.value;
                        _this.$emit('input', event.target.value);
                    }
                }
            })
        ]);
    },
    methods: {
        focus: function () {
            this.$refs.message.focus();
        }
    }
});
