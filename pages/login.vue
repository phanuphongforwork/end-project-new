<template>
  <div class="col-md-12 d-flex justify-center">
    <v-card elevation="4" class="col-md-6">
      <v-card-title>
        <h3>แบบบันทึกทะเบียนครัวเรือน</h3>
      </v-card-title>
      <v-card-subtitle>ที่อาสาสมัครสาธารณสุขดูแล</v-card-subtitle>
      <v-card-text>
        <v-form class="mt-10">
          <v-text-field
            outlined
            label="บัญชีผู้ใช้งาน"
            prepend-icon="mdi-account-circle"
            v-model="username"
          ></v-text-field>

          <v-text-field
            outlined
            type="password"
            label="รหัสผ่าน"
            prepend-icon="mdi-form-textbox-password"
            v-model="password"
          ></v-text-field>
        </v-form>

        <v-row justify="end" class="mt-2">
          <v-btn
            color="primary"
            dark
            large
            class="col-12 col-lg-12"
            @click="login()"
            :loading="loading"
          >
            เข้าสู่ระบบ
            <v-icon right> mdi-login </v-icon>
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: "login",
  data() {
    return {
      username: "",
      password: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;
        await this.$auth.loginWith("local", {
          data: {
            username: this.username,
            password: this.password,
          },
        });
        this.loading = false;

        // this.$router.push("/");
      } catch (error) {
        this.$toast.error("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
