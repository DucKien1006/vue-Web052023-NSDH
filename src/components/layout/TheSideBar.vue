<template>
    <div class="m-app-sidebar">
        <div class="m-sidebar-header">
            <div class="m-header-menu-icon"></div>
            <div class="m-header-logo-icon"></div>
        </div>
        <div class="m-sidebar-btn">
            <div class="m-btn-add-new">
                <div></div>
                <span>Thêm nhanh</span>
            </div>
        </div>
        <div class="sidebar-menu">
            <ul class="m-app-sidebar-list">
                <router-link :to="item.link" v-for="item in sidebars" :key="item" class="m-app-sidebar-item">
                    <div class="m-app-sidebar-box-icon">
                        <div class="m-app-sidebar-icon" :class="item.icon"></div>
                    </div>
                    <div class="m-app-sidebar-item-name">
                        {{ item.name }}
                    </div>
                </router-link>
            </ul>
        </div>
    </div>
</template>

<script setup>
const sidebars = [
    {
        link: "/home",
        name: "Tổng quan",
        icon: "m-overview-icon",
    },
    {
        link: "/nhanvien",
        name: "Tiền mặt",
        icon: "m-moneyreal-icon",
    },
    {
        link: "/demo",
        name: "Tiền gửi",
        icon: "m-moneypay-icon",
    },
    {
        link: "/demo",
        name: "Mua hàng",
        icon: "m-buy-icon",
    },
    {
        link: "/demo",
        name: "Bán hàng",
        icon: "m-cart-icon",
    },
    {
        link: "/demo",
        name: "Quản lý hóa đơn",
        icon: "m-manage-icon",
    },
    {
        link: "/demo",
        name: "Kho",
        icon: "m-store-icon",
    },
    {
        link: "/demo",
        name: "Công cụ dụng cụ",
        icon: "m-tool-icon",
    },
    {
        link: "/demo",
        name: "Tiền lương",
        icon: "m-price-icon",
    },
    {
        link: "/demo",
        name: "Tài sản cố định",
        icon: "m-moneystatic-icon",
    },
    {
        link: "/demo",
        name: "Thuế",
        icon: "m-tax-icon",
    },
    {
        link: "/demo",
        name: "Giá thành",
        icon: "m-price-icon",
    },
    {
        link: "/demo",
        name: "Tổng hợp",
        icon: "m-synthetic-icon",
    },
    {
        link: "/demo",
        name: "Ngân sách",
        icon: "m-budget-icon",
    },
    {
        link: "/demo",
        name: "Báo cáo",
        icon: "m-report-icon",
    },
    {
        link: "/demo",
        name: "Phân tích tài chính",
        icon: "m-business-icon",
    },
];
</script>
<style scoped>
@import url("@/assets/css/layout/sidebar.css");

.router-link-exact-active {
    background-color: #58595d;
    position: relative;
}

.router-link-exact-active .m-app-sidebar-icon {
    background-color: #fff;
}

.router-link-exact-active::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 6px;
    background-color: #2ca01c;
}
</style>
