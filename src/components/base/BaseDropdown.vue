<template>
    <div class="v-dropdown">
        <div class="v-dropdown-item">
            <div
                class="v-dropdown__text"
                tabindex="-1"
                @click="$emit('onClick')"
            >
                {{ isTextChange ? textContent : text }}
            </div>
            <div
                class="v-dropdown__icon"
                @click="toggleContent"
                tabindex="-1"
            ></div>
        </div>
        <div
            class="v-dropdown__content"
            v-if="showContent"
            v-click-outside="() => (showContent = false)"
        >
            <div
                class="v-dropdown__content-item"
                v-for="(option, index) in items"
                :key="index"
                @click="handleSelect(option)"
                :class="{
                    'v-dropdown__content-item--active':
                        option[propKey] === value && backgroundActive,
                }"
            >
                <slot name="item" :option="option" :index="index">
                    {{ option[propValue] }}
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "VDropdown",
    props: {
        icon: {
            // Dropdown có icon hay không
            type: String,
            default: "",
        },
        text: {
            // Text của dropdown
            type: String,
            default: "",
        },
        items: {
            // Danh sách các item của dropdown
            type: Array,
            default: () => [],
        },
        isShow: {
            // Dropdown có show hay không
            type: Boolean,
            default: true,
        },
        propKey: {
            // Key của dữ liệu
            type: String,
            default: "key",
        },
        propValue: {
            // Value của dữ liệu
            type: String,
            default: "value",
        },
        value: {
            // Giá trị của dropdown
            type: String,
            default: "",
        },
        backgroundActive: {
            // Có để màu nền khi active hay không
            type: Boolean,
            default: true,
        },
        isTextChange: {
            // Có thay đổi text khi chọn item hay không
            type: Boolean,
            default: false,
        },
        hasContent: {
            // Có content hay không
            type: Boolean,
            default: false,
        },
        isShowContent: {
            // Có show content hay không
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showContent: false, // Dropdown có show content hay không
            textContent: "", // Text của dropdown
        };
    },
    watch: {
        showContent(value) {
            // Khi show content thay đổi thì emit ra ngoài
            this.$emit("update:isShowContent", value);
        },
        isShowContent: {
            // Khi isShowContent thay đổi thì showContent cũng thay đổi
            handler(value) {
                this.showContent = value;
            },
            deep: true,
        },
    },
    computed: {},
    methods: {
        /**
         * @description: Hiển thị content của dropdown
         */
        toggleContent() {
            // Toggle content của dropdown
            this.showContent = !this.showContent;
        },

        /**
         * @description: Ẩn content của dropdown
         */
        handleHide() {
            // Ẩn content của dropdown
            if (event.target.closest(".v-select__content")) return;

            this.showContent = false;
        },
        /**
         * @description: Xử lý khi chọn item của dropdown
         */
        handleSelect(item) {
            // Xử lý khi chọn item của dropdown
            if (this.isTextChange) {
                this.textContent = item[this.propValue];
                this.$emit("update:value", item[this.propKey]);
            }
            this.$emit("onSelect", item[this.propKey], item[this.propValue]);
            this.handleHide();
        },
    },
    created() {
        if (this.isTextChange && this.value) {
            this.items.map((item) => {
                if (item[this.propKey] === this.value) {
                    this.textContent = item[this.propValue];
                }
            });
        }
    },
};
</script>

<style scoped>
.v-dropdown {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
}

.v-dropdown-item {
    display: flex;
    align-items: center;
    border: none;
    cursor: pointer;
    height: 36px;
    outline: none;
    color: #0075c0 !important;
}

.v-dropdown__text {
    white-space: nowrap;
    font-family: MISAFont;
    font-size: 13px;
    margin-right: 4px;
    line-height: 36px;
}

.v-dropdown__icon {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -178px -362px;
    width: 12px;
    height: 12px;
    min-width: 12px;
    min-height: 12px;
}

.v-dropdown__content {
    z-index: 7;
    top: 72%;
    right: 0;
    position: absolute;
    padding: 2px 1px;
    min-width: 100px;
    font-weight: 500;
    box-shadow: 0 0 5px 0 rgb(0 0 0 / 20%);
    border: 1px solid #bdbdbd;
    border-radius: 2px;
    background-color: #ffffff;
}

.v-dropdown__content-item {
    padding: 4px 10px;
    font-family: MISAFont;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
}
.v-dropdown__content-item:hover {
    background-color: #e0e0e0;
}
.v-dropdown .v-dropdown__content-item--active {
    pointer-events: none;
    color: #ffffff;
    background-color: #2ca01c;
}
</style>
