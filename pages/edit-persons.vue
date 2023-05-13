<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>

    <v-card class="mt-6" outlined>
      <v-card-title class="col-12">
        <div class="col-12">
          <v-text-field
            v-model="search"
            class="col-12"
            append-icon="mdi-magnify"
            label="ค้นหาด้วยบัตรประชาชน หรือ ชื่อ-นามสกุล"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </div>
      </v-card-title>

      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items"
        disable-filtering
        disable-sort
        :page="meta.page"
        :itemsPerPage="meta.perPage || 5"
        :server-items-length="meta.total"
        class="elevation-1"
        @update:items-per-page="changePerPage"
        @update:page="changePage"
        no-results-text="ไม่พบข้อมูล"
        no-data-text="ไม่พบข้อมูล, ลองค้นหาใหม่อีกครั้ง"
      >
        <template v-slot:item.prefix="{ item }">
          {{ prefixText[item?.prefix] || "-" }}
        </template>

        <template v-slot:item.date_of_birth="{ item }">
          {{ dayjs(item.date_of_birth).add(543, "year").format("DD/MM/YYYY") }}
        </template>

        <template v-slot:item.actions="{ item }">
          <a @click="showEdit(item)" href="#">แก้ไขสมาชิกชุมชน</a>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="showEditData"
      :fullscreen="true"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeModal()"
    >
      <v-card v-if="editData">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeModal()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>แก้ไขข้อมูลสมาชิกครัวเรือน</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-container fluid class="mt-4">
            <v-row>
              <v-col cols="12">
                <v-alert type="info">ส่วนสำหรับจัดการบทบาทของบุคคล</v-alert>
              </v-col>
              <v-col v-if="showUserPassword" cols="12" md="3" lg="4">
                <v-text-field
                  v-model="editData.username"
                  label="บัญชีผู้ใช้งาน"
                  name="username"
                  data-vv-as="บัตรประชาชน"
                  v-validate="'required'"
                  :error-messages="errors && errors.first('username')"
                  outlined
                  :disabled="isVolunteer || isAdmin"
                >
                </v-text-field>
              </v-col>
              <v-col v-if="showUserPassword" cols="12" md="3" lg="4">
                <v-text-field
                  v-model="password"
                  label="รหัสผ่านเข้าสู่ระบบ"
                  name="password"
                  data-vv-as="รหัสผ่านเข้าสู่ระบบ"
                  v-validate="''"
                  :error-messages="errors && errors.first('password')"
                  outlined
                  :disabled="isVolunteer"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-alert type="info"
                  >ส่วนสำหรับจัดการข้อมูลส่วนตัวของบุคคล</v-alert
                >
              </v-col>
              <v-col cols="12" md="3" lg="4">
                <v-select
                  v-model="editData.prefix"
                  :items="prefixOptions"
                  label="คำนำหน้า"
                  name="prefix"
                  data-vv-as="คำนำหน้า"
                  v-validate="'required'"
                  :error-messages="errors && errors.first('prefix')"
                  outlined
                  :disabled="isAdmin || isVolunteer"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3" lg="4">
                <v-text-field
                  v-model="editData.person_name"
                  label="ชื่อ-นามสกุล"
                  name="personName"
                  data-vv-as="ชื่อ-นามสกุล"
                  v-validate="'required'"
                  :error-messages="errors && errors.first('personName')"
                  outlined
                  :disabled="isAdmin || isVolunteer"
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
                      @click:clear="editData.date_of_birth = null"
                      :error-messages="errors && errors.first('dob')"
                      outlined
                      :disabled="isVolunteer || isAdmin"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editData.date_of_birth"
                    @change="datepick = false"
                    name="dob"
                    data-vv-as="วัน/เดือน/ปีเกิด"
                    v-validate="'required'"
                    locale="th-TH"
                    :disabled="isVolunteer || isAdmin"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3" lg="4">
                <v-text-field
                  v-model="editData.phone"
                  label="เบอร์โทรศัพท์"
                  name="phone"
                  data-vv-as="เบอร์โทรศัพท์"
                  v-validate="'required|numeric|length:10'"
                  :error-messages="errors && errors.first('phone')"
                  outlined
                  :disabled="isVolunteer"
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
                  v-model="editData.newborn"
                  :items="newbornOptions"
                  label="สถานะเด็กแรกเกิด"
                  name="newborn"
                  data-vv-as="สถานะเด็กแรกเกิด"
                  v-validate="''"
                  :error-messages="errors && errors.first('newborn')"
                  outlined
                  :disabled="isAdmin"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="4" lg="4">
                <v-select
                  v-model="editData.pregnant"
                  :items="pregnantOptions"
                  label="สถานะหญิงตั้งครรภ์"
                  name="pregnant"
                  data-vv-as="สถานะหญิงตั้งครรภ์"
                  v-validate="''"
                  :error-messages="errors && errors.first('pregnant')"
                  outlined
                  :disabled="isAdmin"
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="3">
                <v-switch
                  v-model="editData.postpartum"
                  label="สถานะหญิงหลังคลอด"
                  :disabled="isAdmin"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="3">
                <v-switch
                  v-model="editData.disabled"
                  label="สถานะผู้พิการ"
                  :disabled="isAdmin"
                ></v-switch>
              </v-col>

              <v-col cols="12" md="3">
                <v-switch
                  v-model="editData.chronic_disease"
                  label="สถานะป่วยโรคเรื้อรัง"
                  :disabled="isAdmin"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="3">
                <v-switch
                  v-model="editData.violent_behavior"
                  label="มีพฤติกรรมเสี่ยงด้านความรุนแรง"
                  :disabled="isAdmin"
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
            </div>
          </v-container>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import Person from "../services/apis/Person";
import Role from "../components/persons/Role";

import { NEWBORN_OPTIONS, NEWBORN_TEXT } from "../constants/newborn";
import { PREGNANT_OPTIONS, PREGNANT_TEXT } from "../constants/pregnant";
import { ROLE_OPTIONS } from "../constants/role";
import { PREFIX_OPTIONS, PREFIX_TEXT } from "../constants/prefix";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  components: {
    Breadcrumb,
    Role,
  },
  data() {
    return {
      prefixText: PREFIX_TEXT,
      newbornText: NEWBORN_TEXT,
      pregnantText: PREGNANT_TEXT,
      loading: false,
      datepick: false,
      modalActive: false,
      title: "แก้ไขสมาชิกชุมชน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "แก้ไขสมาชิกชุมชน",
          disabled: false,
          href: "edit-persons",
        },
      ],
      search: "",
      meta: {},
      param: {
        page: 1,
        perPage: 5,
        q: "",
        sort: "created_at",
        order: "desc",
        includes: "",
      },
      loading: false,
      headers: [
        {
          text: "คำนำหน้า",
          align: "start",
          sortable: false,
          value: "prefix",
        },
        {
          text: "ชื่อ - นามสกุล",
          align: "start",
          sortable: false,
          value: "person_name",
        },
        {
          text: "บัญชีเข้าสู่ระบบ",
          align: "start",
          sortable: false,
          value: "username",
        },
        // {
        //   text: "บัตรประชาชน",
        //   align: "start",
        //   sortable: false,
        //   value: "id_card",
        // },

        {
          text: "วัน/เดือน/ปีเกิด",
          align: "start",
          sortable: false,
          value: "date_of_birth",
        },
        {
          text: "เบอร์โทรศัพท์",
          align: "start",
          sortable: false,
          value: "phone",
        },

        { text: "แก้ไขสมาชิกชุมชน", value: "actions", sortable: false },
      ],
      items: [],
      showEditData: false,
      editData: null,
      resultData: null,
      showResult: false,
      prefix: "",
    };
  },
  watch: {
    search: {
      handler(data) {
        if (data) {
          this.loadData();
        } else {
          this.search = undefined;
          this.loadData();
        }
      },
    },
  },
  computed: {
    isVolunteer() {
      const myLevel = localStorage.getItem("user_level") || null;
      return Number(myLevel) === 2 ? true : false;
    },
    isAdmin() {
      const myLevel = localStorage.getItem("user_level") || null;
      return Number(myLevel) === 1 ? true : false;
    },

    prefixOptions() {
      return [...PREFIX_OPTIONS];
    },
    showUserPassword() {
      return true;
    },
    computedDateFormatted() {
      return this.editData?.date_of_birth
        ? dayjs(this.editData.date_of_birth)
            .add(543, "year")
            .format("DD MMMM YYYY")
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
  mounted() {
    this.loadData();
  },
  methods: {
    dayjs,
    getPayload() {
      let payload = {
        person_name: this.editData.person_name,
        id_card: this.editData.id_card,
        date_of_birth: dayjs(this.editData.date_of_birth).format("YYYY-MM-DD"),
        phone: this.editData.phone,
        newborn: this.editData.newborn,
        pregnant: this.editData.pregnant,
        postpartum: this.editData.postpartum,
        disabled: this.editData.disabled,
        chronic_disease: this.editData.chronic_disease,
        violent_behavior: this.editData.violent_behavior,
        username: this.editData.username,
        prefix: this.editData.prefix,
      };

      if (this.editData.password) {
        payload = {
          ...payload,
          password: this.editData.password,
        };
      }

      return payload;
    },
    async loadData() {
      try {
        this.loading = true;
        const { data, meta } = await Person.getAll({
          ...this.param,
          q: this.search ?? undefined,
        });
        this.items = data;
        this.meta = meta;

        this.loading = false;
      } catch {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.loading = false;
      }
    },
    updateParam(paramName, value) {
      this.param = {
        ...this.param,
        [paramName]: value,
      };

      if (this.pushState) {
        this.$router.push({
          query: this.param,
          path: this.$route.path,
        });
      }
    },
    removeParam(paramName) {
      delete this.param[paramName];
    },
    changePage(page) {
      this.updateParam("page", page);
      this.loadData();
    },
    changeSearch(keyword) {
      this.updateParam("q", keyword);
      this.updateParam("page", 1);
      this.loadData();
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    changePerPage(perPage) {
      this.updateParam("perPage", perPage);
      this.updateParam("page", 1);
      this.loadData();
    },
    showEdit(data) {
      this.editData = data;
      this.showEditData = true;
    },
    closeModal() {
      this.editData = null;
      this.showEditData = false;
    },
    async submit() {
      const validate = await this.$validator.validateAll();
      if (!validate) return;

      try {
        const payload = this.getPayload();

        this.loading = true;
        const { data } = await Person.update(this.editData.person_id, payload);
        this.resultData = data;
        this.loading = false;
        this.$toast.success("แก้ไขข้อมูลสมาชิก สำเร็จ!");
        this.closeModal();
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.loading = false;
      }
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

<style>
table {
  border: none;
  border-collapse: collapse;
}
table td {
  border-left: 1px solid #dddddd;
}
table td:first-child {
  border-left: none;
}
</style>
