<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>
    <v-container fluid class="mt-4">
      <v-row>
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
            v-validate="'required'"
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
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>รายละเอียดทะเบียนครัวเรือน</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-alert type="success" outlined>
            สร้างทะเบียนครัวเรือน บ้านเลขที่ {{ house_number }} สำเร็จ!
          </v-alert>

          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div>บ้านเลขที่ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.house_number || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เขต :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.district?.district_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>แขวง :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.subdistrict?.subdistrict_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ถนน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.road?.road_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ซอย :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.alley?.alley_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>รหัสไปรษณีย์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.subdistrict?.post_code || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เบอร์โทรศัพท์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.phone || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>หัวหน้าครัวเรือน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.person?.person_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2 mb-4">
                  <div>อาสาสมัคร :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ resultData?.volunteer?.person_name || "-" }}
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

require("dayjs/locale/th");
dayjs.locale("th");

import { NEWBORN_OPTIONS } from "../constants/newborn";
import { PREGNANT_OPTIONS } from "../constants/pregnant";

export default {
  components: { Breadcrumb },
  data() {
    return {
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

      resultData: {},
      personName: "",
      idCard: "",
      dateOfBirth: "",
      phone: "",
      newborn: "",
      pregnant: "",
      postpartum: false,
      disabled: false,
      chronicDisease: false,
      ViolentBehavior: false,
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
    computedDateFormatted() {
      return this.dateOfBirth
        ? dayjs(this.dateOfBirth).add(543, "year").format("DD MMMM YYYY")
        : "";
    },

    newbornOptions() {
      return [
        {
          value: "",
          text: "ไม่ได้มีสถานะแรกเกิด",
        },
        ...NEWBORN_OPTIONS,
      ];
    },
    pregnantOptions() {
      return [
        {
          value: "",
          text: "ไม่ได้มีสถานะตั้งครรภ์",
        },
        ...PREGNANT_OPTIONS,
      ];
    },
  },
  methods: {
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
        violent_behavior: this.ViolentBehavior,
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

        // this.showResult = true;
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
      this.ViolentBehavior = false;
      this.username = "";
      this.password = "";
      this.role = "";
      this.$validator.reset();
      window.scrollTo(0, 0);
    },
    closeModal() {
      this.showResult = false;
      this.clear();
    },
  },
};
</script>

<style></style>
