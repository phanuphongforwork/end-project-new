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
          ></v-text-field>

          <v-text-field
            outlined
            type="password"
            label="รหัสผ่าน"
            prepend-icon="mdi-form-textbox-password"
          ></v-text-field>
        </v-form>

        <v-row justify="end" class="mt-2">
          <v-btn
            color="primary"
            dark
            large
            class="col-12 col-lg-12"
            nuxt
            to="/"
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
};
</script>

<style></style>
