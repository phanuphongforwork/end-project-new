<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>
    <v-container fluid class="mt-4">
      <v-row>
        <v-col cols="12">
          <v-alert type="info">ส่วนสำหรับจัดการบทบาทของบุคคล</v-alert>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-select
            v-model="role"
            :items="roleOptions"
            label="บทบาท"
            name="role"
            data-vv-as="บทบาท"
            v-validate="''"
            :error-messages="errors && errors.first('role')"
            outlined
          >
          </v-select>
        </v-col>
        <v-col v-if="showUserPassword" cols="12" md="3" lg="4">
          <v-text-field
            v-model="username"
            label="บัญชีผู้ใช้งาน"
            name="username"
            data-vv-as="บัตรประชาชน"
            v-validate="'required'"
            :error-messages="errors && errors.first('username')"
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col v-if="showUserPassword" cols="12" md="3" lg="4">
          <v-text-field
            v-model="password"
            label="รหัสผ่านเข้าสู่ระบบ"
            name="password"
            data-vv-as="รหัสผ่านเข้าสู่ระบบ"
            v-validate="'required'"
            :error-messages="errors && errors.first('password')"
            outlined
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-alert type="info">ส่วนสำหรับจัดการข้อมูลส่วนตัวของบุคคล</v-alert>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-text-field
            v-model="personName"
            label="ชื่อ-นามสกุล"
            name="personName"
            data-vv-as="ชื่อ-นามสกุล"
            v-validate="'required'"
            :error-messages="errors && errors.first('personName')"
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-text-field
            v-model="idCard"
            label="บัตรประชาชน"
            name="idCard"
            data-vv-as="บัตรประชาชน"
            v-validate="'required|length:13|numeric'"
            :error-messages="errors && errors.first('idCard')"
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-menu
            v-model="datepick"
            :close-on-content-click="false"
            max-width="290"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="computedDateFormatted"
                clearable
                label="วัน/เดือน/ปีเกิด"
                readonly
                v-bind="attrs"
                v-on="on"
                @click:clear="dateOfBirth = null"
                :error-messages="errors && errors.first('dob')"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateOfBirth"
              @change="datepick = false"
              name="dob"
              data-vv-as="วัน/เดือน/ปีเกิด"
              v-validate="'required'"
              locale="th-TH"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-text-field
            v-model="phone"
            label="เบอร์โทรศัพท์"
            name="phone"
            data-vv-as="เบอร์โทรศัพท์"
            v-validate="'required|numeric|length:10'"
            :error-messages="errors && errors.first('phone')"
            outlined
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-alert type="info">ส่วนสำหรับจัดการสถานะของบุคคล</v-alert>
        </v-col>
        <v-col cols="12" md="4" lg="4">
          <v-select
            v-model="newborn"
            :items="newbornOptions"
            label="สถานะเด็กแรกเกิด"
            name="newborn"
            data-vv-as="สถานะเด็กแรกเกิด"
            v-validate="''"
            :error-messages="errors && errors.first('newborn')"
            outlined
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="4" lg="4">
          <v-select
            v-model="pregnant"
            :items="pregnantOptions"
            label="สถานะหญิงตั้งครรภ์"
            name="pregnant"
            data-vv-as="สถานะหญิงตั้งครรภ์"
            v-validate="''"
            :error-messages="errors && errors.first('pregnant')"
            outlined
          >
          </v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="3">
          <v-switch v-model="postpartum" label="สถานะหญิงหลังคลอด"></v-switch>
        </v-col>
        <v-col cols="12" md="3">
          <v-switch v-model="disabled" label="สถานะผู้พิการ"></v-switch>
        </v-col>

        <v-col cols="12" md="3">
          <v-switch
            v-model="chronicDisease"
            label="สถานะป่วยโรคเรื้อรัง"
          ></v-switch>
        </v-col>
        <v-col cols="12" md="3">
          <v-switch
            v-model="violentBehavior"
            label="มีพฤติกรรมเสี่ยงด้านความรุนแรง"
          ></v-switch>
        </v-col>
      </v-row>

      <div class="mt-4">
        <v-btn
          color="primary"
          class="col-12 col-lg-2"
          large
          :loading="loading"
          @click="submit()"
        >
          <v-icon left> mdi-content-save </v-icon>
          บันทึกข้อมูล
        </v-btn>

        <v-btn
          class="col-12 col-lg-2 ml-0 ml-lg-2 mt-4 mt-lg-0"
          large
          @click="clear()"
        >
          <v-icon left> mdi-refresh </v-icon>
          ล้างข้อมูล
        </v-btn>
      </div>
    </v-container>

    <v-dialog
      v-model="showResult"
      :fullscreen="false"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeModal()"
    >
      <v-card v-if="resultData">
        <v-toolbar dark color="primary">
          <v-toolbar-title
            >รายละเอียดของ {{ resultData?.person_name || "-" }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-alert type="success" outlined>
            สร้างสมาชิก {{ resultData?.person_name || "-" }} สำเร็จ!
          </v-alert>

          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div class="mt-3">บทบาท :</div>
                  <div class="pl-4 font-weight-bold">
                    <Role :role="resultData.role" />
                  </div>
                </div>
                <div class="d-flex">
                  <div>ชื่อ-นามสกุล :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.person_name || "-" }}
                  </div>
                </div>
                <div v-if="resultData?.username" class="d-flex">
                  <div>ชื่อบัญชีเข้าสู่ระบบ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.username || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>วัน/เดือน/ปีเกิด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getDOB(resultData?.date_of_birth) || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>เบอร์โทรศัพท์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.phone || "-" }}
                  </div>
                </div>

                <v-divider class="my-4"> </v-divider>

                <div class="d-flex">
                  <div>สถานะเด็กแรกเกิด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      newbornText[resultData?.newborn] ||
                      "ไม่ได้เป็นเด็กแรกเกิด"
                    }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>สถานะหญิงตั้งครรภ์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      pregnantText[resultData?.pregnant] ||
                      "ไม่ได้เป็นหญิงตั้งครรภ์"
                    }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>สถานะหญิงหลังคลอด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getPostpartum(resultData?.postpartum) || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>สถานะผู้พิการ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getDisabled(resultData?.disabled) || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>สถานะป่วยโรคเรื้อรัง :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getChronicDisease(resultData?.chronic_disease) || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>มีพฤติกรรมเสี่ยงด้านความรุนแรง :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      getViolentBehavior(resultData?.violent_behavior) || "-"
                    }}
                  </div>
                </div>
              </div>
            </v-card>
            <v-btn
              color="primary"
              class="col-12 mt-4"
              large
              @click="closeModal()"
            >
              <v-icon left> mdi-progress-clock </v-icon>
              ดำเนินการต่อ
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import Person from "../services/apis/Person";
import Role from "../components/persons/Role";

require("dayjs/locale/th");
dayjs.locale("th");

import { NEWBORN_OPTIONS, NEWBORN_TEXT } from "../constants/newborn";
import { PREGNANT_OPTIONS, PREGNANT_TEXT } from "../constants/pregnant";
import { ROLE_OPTIONS } from "../constants/role";

export default {
  components: { Breadcrumb, Role },
  data() {
    return {
      newbornText: NEWBORN_TEXT,
      pregnantText: PREGNANT_TEXT,
      loading: false,
      showResult: false,
      datepick: false,
      title: "เพิ่มสมาชิกครัวเรือน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "เพิ่มสมาชิกครัวเรือน",
          disabled: false,
          href: "add-persons",
        },
      ],

      resultData: null,
      personName: "",
      idCard: "",
      dateOfBirth: "",
      phone: "",
      newborn: "",
      pregnant: "",
      postpartum: false,
      disabled: false,
      chronicDisease: false,
      violentBehavior: false,
      username: "",
      password: "",
      role: "",
    };
  },
  watch: {},
  mounted() {
    this.clear();
  },
  computed: {
    showUserPassword() {
      return this.role === "1" || this.role === "2";
    },
    computedDateFormatted() {
      return this.dateOfBirth
        ? dayjs(this.dateOfBirth).add(543, "year").format("DD MMMM YYYY")
        : "";
    },

    newbornOptions() {
      return [
        {
          value: "",
          text: "ไม่ได้เป็นเด็กแรกเกิด",
        },
        ...NEWBORN_OPTIONS,
      ];
    },
    pregnantOptions() {
      return [
        {
          value: "",
          text: "ไม่ได้เป็นหญิงตั้งครรภ์",
        },
        ...PREGNANT_OPTIONS,
      ];
    },
    roleOptions() {
      return [
        {
          value: "",
          text: "สมาชิก",
        },
        ...ROLE_OPTIONS,
      ];
    },
  },
  methods: {
    dayjs,
    getPayload() {
      let payload = {
        person_name: this.personName,
        id_card: this.idCard,
        date_of_birth: this.dateOfBirth,
        phone: this.phone,
        newborn: this.newborn,
        pregnant: this.pregnant,
        postpartum: this.postpartum,
        disabled: this.disabled,
        chronic_disease: this.chronicDisease,
        violent_behavior: this.violentBehavior,
        username: this.username,
        role: this.role,
      };

      if (this.password) {
        payload = {
          ...payload,
          password: this.password,
        };
      }

      return payload;
    },

    async submit() {
      const validate = await this.$validator.validateAll();
      if (!validate) return;

      try {
        const payload = this.getPayload();

        this.loading = true;
        const { data } = await Person.create(payload);
        this.resultData = data;
        this.loading = false;

        this.showResult = true;
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.personName = "";
      this.idCard = "";
      this.dateOfBirth = "";
      this.phone = "";
      this.newborn = "";
      this.pregnant = "";
      this.postpartum = false;
      this.disabled = false;
      this.chronicDisease = false;
      this.violentBehavior = false;
      this.username = "";
      this.password = "";
      this.role = "";
      this.$validator.reset();
      window.scrollTo(0, 0);
    },
    closeModal() {
      this.resultData = null;
      this.showResult = false;
      this.clear();
    },
    getDisabled(disableStatus) {
      return disableStatus ? "เป็นผู้พิการ" : "ไม่ได้เป็นผู้พิการ";
    },
    getPostpartum(postpartum) {
      return postpartum ? "เป็นหญิงหลังคลอด" : "ไม่ได้เป็นหญิงหลังคลอด";
    },
    getChronicDisease(chronicDisease) {
      return chronicDisease
        ? "เป็นผู้ป่วยโรคเรื้อรัง"
        : "ไม่ได้เป็นผู้ป่วยโรคเรื้อรัง";
    },
    getViolentBehavior(ViolentBehavior) {
      return ViolentBehavior
        ? "มีพฤติกรรมเสี่ยงด้านความรุนแรง"
        : "ไม่ได้มีพฤติกรรมเสี่ยงด้านความรุนแรง";
    },
    getDOB(dob) {
      return dayjs(dob).add(543, "year").format("DD MMMM YYYY");
    },
  },
};
</script>

<style></style>
