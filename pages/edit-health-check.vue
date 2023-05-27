<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>

    <v-card class="mt-6" outlined>
      <v-card-title class="col-12">
        <div class="col-12">
          <v-text-field
            v-model="name"
            class="col-12"
            append-icon="mdi-magnify"
            label="ค้นหาชื่อกิจกรรมตรวจสุขภาพ"
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
        <template v-slot:item.health_check_date="{ item }">
          {{
            dayjs(item?.health_check_date)
              .add(543, "year")
              .format("DD MMMM YYYY") || "-"
          }}
        </template>
        <template v-slot:item.health_check_end="{ item }">
          {{
            item?.health_check_end
              ? dayjs(item?.health_check_end)
                  .add(543, "year")
                  .format("DD MMMM YYYY")
              : "-"
          }}
        </template>

        <template v-slot:item.preview="{ item }">
          <a @click="showPreview(item)" href="#">แสดงรายละเอียด</a>
        </template>

        <template v-if="canEdit" v-slot:item.edit_members="{ item }">
          <a @click="editMember(item)" href="#"
            >แก้ไขรายชื่อผู้เข้าร่วมกิจกรรม</a
          >
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="isShowPreview"
      :fullscreen="true"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closePreview()"
    >
      <v-card v-if="previewData">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closePreview()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ previewData.health_check_name }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div>ชื่อกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.health_check_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>วันที่จัดกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      dayjs(previewData?.health_check_date)
                        .add(543, "year")
                        .format("DD MMMM YYYY") || "-"
                    }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>วันที่สิ้นสุดกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      dayjs(previewData?.health_check_end)
                        .add(543, "year")
                        .format("DD MMMM YYYY") || "-"
                    }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>หน่วยงานที่จัด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.agency_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>สถานที่จัด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.location_name || "-" }}
                  </div>
                </div>
              </div>
            </v-card>

            <v-card outlined class="mt-4">
              <v-card-title class="d-flex">
                <div class="mt-4">
                  สมาชิก ({{ previewData?.users?.length || 0 }}) คน
                </div>
              </v-card-title>

              <div class="px-4">
                <div>
                  <div
                    class="d-flex mb-8 mt-4"
                    v-if="
                      previewData?.users && previewData?.users?.length === 0
                    "
                  >
                    ไม่มีสมาชิกเข้าร่วมกิจกรรม
                  </div>

                  <v-simple-table
                    v-if="previewData?.users && previewData?.users?.length > 0"
                    fixed-header
                    height="300px"
                  >
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">ชื่อ-นามสกุล</th>
                          <!-- <th class="text-left">บัตรประชาชน</th> -->
                          <!-- <th class="text-left">วัน/เดือน/ปีเกิด</th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in previewData?.users"
                          :key="index"
                        >
                          <td>{{ item?.person?.person_name || "-" }}</td>
                          <!-- <td>{{ item?.person?.id_card || "-" }}</td> -->
                          <!-- <td>
                            {{
                              dayjs(item?.person?.date_of_birth)
                                .add(543, "year")
                                .format("DD MMMM YYYY") || "-"
                            }}
                          </td> -->
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </div>
            </v-card>
            <div class="d-flex justify-center">
              <v-btn @click="closePreview()" class="col-12 mt-4" large>
                <v-icon left> mdi-close </v-icon>
                ปิดหน้านี้
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>

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
          <v-toolbar-title> {{ editData.health_check_name }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div>ชื่อกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData.health_check_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>วันที่จัดกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      dayjs(editData?.health_check_date)
                        .add(543, "year")
                        .format("DD MMM YYYY") || "-"
                    }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>วันที่สิ้นสุดกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      dayjs(editData?.health_check_end)
                        .add(543, "year")
                        .format("DD MMM YYYY") || "-"
                    }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>หน่วยงานที่จัด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.agency_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>สถานที่จัด :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.location_name || "-" }}
                  </div>
                </div>
              </div>
            </v-card>

            <v-card outlined class="mt-4">
              <v-card-title class="d-flex">
                <div class="mt-4">
                  สมาชิก ({{ editData?.users?.length || 0 }}) คน
                </div>
                <v-btn
                  color="primary"
                  class="col-2 mt-4 ml-4"
                  medium
                  depressed
                  @click="showAddMember()"
                >
                  <v-icon left> mdi-plus </v-icon>
                  เพิ่มผู้เข้าร่วม
                </v-btn></v-card-title
              >

              <div class="px-4">
                <div>
                  <div class="d-flex mb-8 mt-4" v-if="!editData?.users">
                    ไม่มีสมาชิกที่เข้าร่วม
                  </div>

                  <v-simple-table
                    v-if="editData?.users && editData?.users.length > 0"
                    fixed-header
                    height="300px"
                  >
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">ชื่อ-นามสกุล</th>
                          <!-- <th class="text-left">บัตรประชาชน</th> -->
                          <!-- <th class="text-left">วัน/เดือน/ปีเกิด</th> -->
                          <th class="text-left">วันที่เข้าร่วม</th>
                          <th class="text-left">แก้ไขสมาชิก</th>
                          <th class="text-left">รายละเอียด</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in editData?.users"
                          :key="index"
                        >
                          <td>{{ item?.person?.person_name || "-" }}</td>
                          <!-- <td>{{ item?.person?.id_card || "-" }}</td> -->
                          <!-- <td>
                            {{
                              dayjs(item?.person?.date_of_birth)
                                .add(543, "year")
                                .format("DD MMMM YYYY") || "-"
                            }}
                          </td> -->

                          <td>
                            {{
                              item?.join_date
                                ? dayjs(item?.join_date)
                                    .add(543, "year")
                                    .format("DD MMMM YYYY")
                                : "-"
                            }}
                          </td>
                          <td>
                            {{ item?.remark ? item.remark : "-" }}
                          </td>

                          <td>
                            <v-btn
                              @click="handleRemoveMember(item, editData)"
                              color="error"
                            >
                              <v-icon left> mdi-trash-can </v-icon>
                              ลบสมาชิก
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </div>
            </v-card>
            <div class="d-flex justify-center">
              <v-btn @click="closeModal()" class="col-12 mt-4" large>
                <v-icon left> mdi-close </v-icon>
                ปิดหน้านี้
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="addMember"
      :fullscreen="true"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeModalAddMem()"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeModalAddMem()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >เลือกสมาชิกที่จะเพิ่มใน
            {{ editData?.health_check_name }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <AddActivityMember :activity="editData" @success="addMemberSuccess" />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import HealthCheck from "../services/apis/HealthCheck";
import AddActivityMember from "../components/activities/AddActivityMember.vue";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  components: {
    Breadcrumb,
    AddActivityMember,
  },

  data() {
    return {
      showCreate: false,
      loading: false,
      title: "ผู้เข้าร่วมตรวจสุขภาพ",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "ผู้เข้าร่วมตรวจสุขภาพ",
          disabled: false,
          href: "/edit-health-check",
        },
      ],
      search: "",
      page: 1,
      headers: [],

      items: [],
      meta: {},
      param: {
        page: 1,
        perPage: 5,
        q: "",
        sort: "created_at",
        order: "desc",
        includes: "",
      },
      name: undefined,
      isShowPreview: false,
      previewData: null,
      healCheckName: "",
      healCheckDate: "",
      healCheckEnd: "",
      agencyName: "",
      locationName: "",
      datepick: false,
      editDataMember: null,
      showEditDataMember: false,
      addMember: false,
      showEditData: false,
      editData: null,
    };
  },
  computed: {
    isAdmin() {
      const myLevel = localStorage.getItem("user_level") || null;
      if (Number(myLevel) === 1) {
        return true;
      }
      return false;
    },
    canEdit() {
      const myLevel = localStorage.getItem("user_level") || null;
      if (Number(myLevel) === 1 || Number(myLevel) === 2) {
        return true;
      }
      return false;
    },
    computedDateFormatted() {
      return this.healCheckDate
        ? dayjs(this.healCheckDate).add(543, "year").format("DD MMMM YYYY")
        : "";
    },
  },
  watch: {
    name: {
      handler(data) {
        if (data) {
          this.loadData();
        } else {
          this.name = undefined;
          this.loadData();
        }
      },
    },
  },
  mounted() {
    this.headers = [
      {
        text: "ชื่อกิจกรรม",
        align: "start",
        sortable: false,
        value: "health_check_name",
      },
      { text: "วันที่จัดกิจกรรม", value: "health_check_date" },
      { text: "วันที่สิ้นสุดกิจกรรม", value: "health_check_end" },
      { text: "หน่วยงานที่จัด", value: "agency_name" },
      { text: "สถานที่จัด", value: "location_name" },
      { text: "แสดงรายละเอียด", value: "preview" },
    ];

    if (this.isAdmin || this.canEdit) {
      this.headers.push({
        text: "แก้ไขผู้เข้าร่วมตรวจสุขภาพ",
        value: "edit_members",
      });
    }
    this.loadData();
  },
  methods: {
    dayjs,
    async addMemberSuccess(data) {
      this.editData = data;
      this.addMember = false;

      await this.loadData();
    },
    async loadData() {
      try {
        this.loading = true;
        const { data, meta } = await HealthCheck.getAll({
          ...this.param,
          "filters[name]": this.name ?? undefined,
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
    changePerPage(perPage) {
      this.updateParam("perPage", perPage);
      this.updateParam("page", 1);
      this.loadData();
    },
    showPreview(item) {
      this.previewData = item;

      this.isShowPreview = true;
    },
    closePreview(item) {
      this.isShowPreview = false;
      this.previewData = null;
    },
    getPayload() {
      let payload = {
        health_check_name: this.healCheckName,
        health_check_date: this.healCheckDate,
        status: "1",
      };

      return payload;
    },

    async submit() {
      const validate = await this.$validator.validateAll();
      if (!validate) return;

      try {
        const payload = this.getPayload();

        await HealthCheck.create(payload);

        this.closeCreate();
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาตรวจสอบและลองใหม่อีกครั้ง");
      } finally {
        this.loadData();
      }
    },
    closeCreate() {
      this.showCreate = false;
      this.clear();
    },
    clear() {
      this.healCheckName = "";
      this.healCheckDate = "";
      this.$validator.reset();
    },
    editMember(activity) {
      this.editData = activity;
      this.showEditData = true;
    },
    handleEditMember(item) {
      this.editDataMember = item;
      this.showEditDataMember = true;
    },
    closeModalEditMember() {
      this.editDataMember = null;
      this.showEditDataMember = false;
    },
    closeModal() {
      this.editData = null;
      this.showEditData = false;
    },
    closeModalAddMem() {
      this.addMember = false;
    },
    showAddMember() {
      this.addMember = true;
    },
    async handleRemoveMember(item, editData) {
      try {
        await HealthCheck.update(item.heal_check_id, {
          deleteUserIds: [item.person_id],
        });
        this.$toast.success("ลบผู้เข้าร่วมกิจกรรมสําเร็จ");

        const newUsers = this.editData?.users.filter(
          (user) => user.person_id !== item.person_id
        );
        this.editData.users = newUsers;
        this.loadData();
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาตรวจสอบและลองใหม่อีกครั้ง");
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
.v-input__control {
  padding: 0px;
}
</style>
