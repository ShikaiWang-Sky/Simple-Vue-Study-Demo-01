function isValueNumber(value) {
    return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9]][0-9]*$)|(^-?0{1}$)/).test(value + '');
}

function getControllerKey() {
    document.onkeydown = function (event) {
        //上箭头
        if (event.key === 'ArrowUp') {
            return 1;
        } else if (event.key === 'ArrowDown') {
            //下箭头
            return -1;
        } else {
            return 0;
        }
    }
}

Vue.component('input-number', {
    template: '\
        <div class="input-number">\
            <input \
                type="text"\
                :value="currentValue"\
                @change="handleChange"\
                @keydown="handleKeyController">\
            <button\
                @click="handleDown"\
                :disabled="currentValue <= min">-</button>\
            <button\
                @click="handleUp"\
                :disabled="currentValue >= max">+</button>\
        </div>',
    props: {
        max: {
            type: Number,
            default: Infinity
        },
        min: {
            type: Number,
            default: -Infinity
        },
        value: {
            type: Number,
            default: 0
        }
    },
    data: function () {
        return {
            currentValue: this.value,
            prop_step: 10
        }
    },
    watch: {
        currentValue: function (val) {
            this.$emit('input', val);
            this.$emit('on-change', val);
        },
        value: function (val) {
            this.updateValue(val);
        }
    },
    methods: {
        updateValue: function (val) {
            if (val > this.max)
                val = this.max;
            if (val < this.min)
                val = this.min;
            this.currentValue = val;
        },
        handleDown: function () {
            if (this.currentValue <= this.min)
                return;
            this.currentValue -= this.prop_step;
        },
        handleUp: function () {
            if (this.currentValue >= this.max)
                return;
            this.currentValue += this.prop_step;
        },
        handleChange: function (event) {
            let val = event.target.value.trim();
            let max = this.max;
            let min = this.min;

            if (isValueNumber(val)) {
                val = Number(val);
                this.currentValue = val;

                if (val > max) {
                    this.currentValue = max;
                } else if (val < min) {
                    this.currentValue = min;
                }
            } else {
                event.target.value = this.currentValue;
            }
        },
        handleKeyController: function (event) {
            let max = this.max;
            let min = this.min;

            if (event.key === 'ArrowUp') {
                if (this.currentValue >= max)
                    this.currentValue = max;
                else
                    this.currentValue += 1;
            } else if (event.key === 'ArrowDown') {
                //下箭头
                if (this.currentValue <= min)
                    this.currentValue = min;
                else
                    this.currentValue -= 1;
            }
        }
    },
    mounted: function () {
        this.updateValue(this.value);
    }
});
