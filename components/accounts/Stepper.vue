<template>
  <div>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="isEdit || e1 > 1" step="1">
          ค้นหาประชากรในครัวเรือน
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">
          ตรวจสอบความถูกต้อง
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">{{ title }}บัญชีผู้ใช้งาน</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-alert text color="info" elevation="2">
            ท่านสามารถค้นหาประชากร
            ด้วยการกรอกข้อมูลภายในช่องกรอกข้อมูลด้านล่างต่อไปนี้,
            เมื่อกรอกข้อมูลสำเสร็จแล้ว ให้กดปุ่ม "ค้นหาประชากร"
            (ไม่จำเป็นต้องกรอกข้อมูลครบทุกช่อง)
          </v-alert>
          <v-row no-gutters>
            <v-col cols="12" lg="6">
              <v-text-field label="ชื่อ-นามสกุล" outlined></v-text-field>
            </v-col>
            <v-col cols="12" class="pl-0 pl-lg-6" lg="6">
              <v-text-field label="รหัสบัตรประชาชน" outlined></v-text-field>
            </v-col>
          </v-row>

          <v-btn
            color="primary"
            large
            class="col-12 col-lg-2 mt-6"
            @click="e1 = 2"
          >
            <v-icon left> mdi-account-search</v-icon>
            ค้นหาประชากร
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-row no-gutters>
            <v-col cols="12" lg="3">
              <p class="font-weight-bold text-h6">ชื่อ-นามสกุล</p>
              <p class="mt-1">ภานุพงศ์ มะชัย</p>
              <v-divider class="d-block d-lg-none"></v-divider>
            </v-col>
            <v-col cols="12" lg="3" class="mt-4 mt-lg-0">
              <p class="font-weight-bold text-h6">บัตรประชาชน</p>
              <p class="mt-1">1476765463521</p>
              <v-divider class="d-block d-lg-none"></v-divider>
            </v-col>
            <v-col cols="12" lg="3" class="mt-4 mt-lg-0">
              <p class="font-weight-bold text-h6">วันเดือนปีเกิด</p>
              <p class="mt-1">20 ธันวาคม 2543</p>
              <v-divider class="d-block d-lg-none"></v-divider>
            </v-col>
            <v-col cols="12" lg="3" class="mt-4 mt-lg-0">
              <p class="font-weight-bold text-h6">เบอร์โทรศัพท์</p>
              <p class="mt-1">0882345768</p>
              <v-divider class="d-block d-lg-none"></v-divider>
            </v-col>
          </v-row>

          <div class="mt-6 mb-6">
            <v-btn
              color="primary"
              large
              class="col-12 col-lg-2"
              @click="e1 = 3"
            >
              <v-icon left> mdi-account-arrow-right</v-icon>
              ดำเนินการต่อ
            </v-btn>

            <v-btn
              v-if="!isEdit"
              large
              elevation="1"
              class="col-12 col-lg-2 ml-0 ml-lg-4 mt-4 mt-lg-0"
              @click="e1 = 1"
            >
              <v-icon left> mdi-arrow-left-circle</v-icon>
              ย้อนกลับ
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-row no-gutters>
            <v-col cols="12" lg="4">
              <v-text-field label="ชื่อบัญชีผู้ใช้งาน" outlined></v-text-field>
            </v-col>
            <v-col cols="12" class="pl-0 pl-lg-6" lg="4">
              <v-text-field
                type="password"
                label="รหัสผ่าน"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" class="pl-2 pl-lg-6">
              <v-switch inset label="เปิดใช้งาน"></v-switch>
            </v-col>
          </v-row>

          <div class="mt-6 mb-6">
            <v-btn
              color="primary"
              large
              class="col-12 col-lg-2"
              @click="create()"
            >
              <v-icon left> mdi-content-save-check</v-icon>
              {{ title }}บัญชีผู้ใช้งาน
            </v-btn>

            <v-btn
              large
              elevation="1"
              class="col-12 col-lg-2 ml-0 ml-lg-4 mt-4 mt-lg-0"
              @click="e1 = 2"
            >
              <v-icon left> mdi-arrow-left-circle</v-icon>
              ย้อนกลับ
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      e1: this.isEdit ? 2 : 1,
    };
  },
  computed: {
    title() {
      return this.isEdit ? "แก้ไข" : "สร้าง";
    },
  },
  methods: {
    create() {
      this.e1 = 1;
      this.$emit("create");
    },
  },
};
</script>

<style></style>
