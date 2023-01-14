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

        <template v-slot:item.age="{ item }">
          {{ getAge(item.date_of_birth) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <a @click="showDetail(item)" href="#">จัดการสิทธิ์</a>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="showDetailData"
      :fullscreen="true"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeModal()"
    >
      <v-card v-if="detail">
        <v-toolbar dark color="primary">
          <v-toolbar-title
            >สิทธิ์ของ {{ detail?.person_name || "-" }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div>คำนำหน้า :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ prefixText[detail?.prefix] || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>ชื่อ-นามสกุล :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ detail?.person_name || "-" }}
                  </div>
                </div>
                <div v-if="resultData?.username" class="d-flex">
                  <div>ชื่อบัญชีเข้าสู่ระบบ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ detail?.username || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>วัน/เดือน/ปีเกิด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getDOB(detail?.date_of_birth) || "-" }}
                  </div>
                </div>
                <div class="d-flex">
                  <div>อายุ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ getAge(detail?.date_of_birth) || "-" }} ปี
                  </div>
                </div>
                <div class="d-flex">
                  <div>เบอร์โทรศัพท์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ detail?.phone || "-" }}
                  </div>
                </div>
              </div>
            </v-card>

            <div class="mt-8">
              <v-btn
                color="primary"
                @click="handleAddRole(detail?.levels)"
                large
              >
                จัดการสิทธิ์
              </v-btn>
            </div>

            <v-simple-table fixed-header height="300px" class="mt-4">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">ชื่อสิทธิ์</th>
                    <!-- <th class="text-left">จัดการ</th> -->
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in myLevel" :key="item">
                    <td>{{ item?.level.level_name || "-" }}</td>
                    <!-- <td>นำออก</td> -->
                  </tr>
                  <tr v-if="!detail?.levels?.length">
                    ไม่มีสิทธ์ใดๆ
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <v-btn
              color="primary"
              class="col-12 mt-4"
              large
              @click="closeModal()"
              outlined
            >
              <v-icon left> mdi-progress-clock </v-icon>
              ปิดหน้าต่าง
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showAddRole"
      :fullscreen="false"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeAddModal()"
    >
      <v-card v-if="detail">
        <v-toolbar dark color="primary">
          <v-toolbar-title>จัดการสิทธิ์</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <div>
            <v-simple-table fixed-header height="300px" class="mt-4">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">ชื่อสิทธิ์</th>
                    <th class="text-left">สถานะ</th>
                    <th class="text-left">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in levels" :key="item">
                    <td>{{ item?.level_name || "-" }}</td>
                    <td>
                      {{
                        newLevels.includes(item?.level_id)
                          ? "มีสิทธ์นี้แล้ว"
                          : "ไม่ได้เป็นสิทธิ์นี้"
                      }}
                    </td>
                    <td v-if="newLevels.includes(item?.level_id)">
                      <v-btn @click="removeRole(item?.level_id)">
                        ถอนสิทธิ์
                      </v-btn>
                    </td>
                    <td v-else>
                      <v-btn
                        color="primary"
                        @click="addNewRole(item?.level_id)"
                      >
                        เพิ่มสิทธิ์
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <div>
            <v-btn
              color="primary"
              class="col-12 mt-4"
              large
              @click="saveRole(detail?.person_id)"
            >
              บันทึก
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
import Level from "../services/apis/Level";
import Role from "../components/persons/Role";
import CreateAccount from "@/components/accounts/CreateAccount";

require("dayjs/locale/th");
dayjs.locale("th");

import { NEWBORN_TEXT } from "../constants/newborn";
import { PREGNANT_TEXT } from "../constants/pregnant";
import { PREFIX_TEXT } from "../constants/prefix";

export default {
  components: {
    Breadcrumb,
    Role,
    CreateAccount,
  },
  data() {
    return {
      prefixText: PREFIX_TEXT,
      newbornText: NEWBORN_TEXT,
      pregnantText: PREGNANT_TEXT,
      modalActive: false,
      title: "จัดการบัญชีผู้ใช้งาน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "จัดการบัญชีผู้ใช้งาน",
          disabled: false,
          href: "person-roles",
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
          text: "บัตรประชาชน",
          align: "start",
          sortable: false,
          value: "id_card",
        },
        {
          text: "บัญชีเข้าสู่ระบบ",
          align: "start",
          sortable: false,
          value: "id_card",
        },
        {
          text: "วัน/เดือน/ปีเกิด",
          align: "start",
          sortable: false,
          value: "date_of_birth",
        },
        {
          text: "อายุ (ปี)",
          align: "center",
          sortable: false,
          value: "age",
        },
        {
          text: "เบอร์โทรศัพท์",
          align: "start",
          sortable: false,
          value: "phone",
        },

        { text: "จัดการสิทธิ์", value: "actions", sortable: false },
      ],
      items: [],
      showDetailData: false,
      detail: null,
      showCreatePerson: false,
      showAddRole: false,
      newLevels: [],
      levels: [],
      myLevel: [],
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
  mounted() {
    this.loadData();
    this.loadLevel();
  },
  methods: {
    dayjs,
    async loadData() {
      try {
        this.loading = true;
        const { data, meta } = await Person.getAll({
          ...this.param,
          q: this.search ?? undefined,
          includes: "levels.level",
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
    async loadLevel() {
      try {
        const { data } = await Level.getAll();
        this.levels = data;
      } catch {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
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
    changePerPage(perPage) {
      this.updateParam("perPage", perPage);
      this.updateParam("page", 1);
      this.loadData();
    },
    async showDetail(detail) {
      this.detail = detail;
      await this.loadRole();
      this.showDetailData = true;
    },
    closeModal() {
      this.detail = null;
      this.showDetailData = false;
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
    getAge(dob) {
      return dayjs().diff(dob, "year");
    },
    closeCreatePerson() {
      this.showCreatePerson = false;
      this.loadData();
    },
    closeAddModal() {
      this.showAddRole = false;
    },
    handleAddRole(levels = []) {
      this.newLevels = levels.map((level) => {
        return level.level_id;
      });
      this.showAddRole = true;
    },
    removeRole(level) {
      this.newLevels = this.newLevels.filter((item) => {
        return item !== level;
      });
    },
    addNewRole(level) {
      this.newLevels.push(level);
    },
    setRole() {
      // this.detail?.levels = []
    },
    async saveRole(personId) {
      try {
        await Person.updateLevels({
          person_id: personId,
          level_ids: this.newLevels,
        });
      } catch (error) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.loadRole();
        this.closeAddModal();
      }
    },
    async loadRole() {
      try {
        const { data } = await Person.getAll({
          includes: "levels.level",
          "filters[person_id]": this.detail.person_id,
        });

        this.myLevel = data[0].levels ?? [];
      } catch (e) {
        console.log(e);
      }
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
