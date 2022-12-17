<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>
    <div>ยินดีต้อนรับเข้าสู่ระบบทะเบียนครัวเรือน</div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumbs";
export default {
  components: {
    Breadcrumb,
  },
  mounted() {
    if (this.$auth.user) {
      if (this.$auth.user.role === "3") {
        this.$router.push("my-house");
      }
    }
  },
  data() {
    return {
      title: "หน้าแรก",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
      ],
    };
  },
};
</script>

<style></style>
