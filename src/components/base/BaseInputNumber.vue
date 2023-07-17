<!-- <template>
    <input v-model="value" @input="onChange" @keydown="onKeyDown" />
</template>

<script>
import { computed } from "vue";
export default {
    props: {
        modelValue: {
            type: Number,
        },
    },
    data() {
        return {
            value: "",
        };
    },
    methods: {
        onChange(event) {
            // Loại bỏ các ký tự không phải số
            this.value = event.target.value.replace(/[^0-9]/g, "");
        },
        onKeyDown(event) {
            if (!event.keyCode == 8) {
                // Ngăn ngừa các ký tự không phải số
                if (!/^[0-9]*$/.test(event.key)) {
                    event.preventDefault();
                }
            }
        },
    },
    computed: {
        modelValue() {
            this.value = newVal;
        },
    },
};
</script> -->
