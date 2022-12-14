<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>

    <div v-if="isAdmin">
      <v-btn
        color="primary"
        large
        class="col-12 col-lg-2 mt-6"
        @click="showCreate = true"
      >
        <v-icon left> mdi-plus-circle </v-icon>
        สร้างกิจกรรม
      </v-btn>
    </div>
    <v-card class="mt-6" outlined>
      <v-card-title class="col-12">
        <div class="col-12">
          <v-text-field
            v-model="name"
            class="col-12"
            append-icon="mdi-magnify"
            label="ค้นหาชื่อกิจกรรม"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </div>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="activities"
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
        <template v-slot:item.activity_date="{ item }">
          {{
            dayjs(item?.activity_date)
              .add(543, "year")
              .format("DD MMMM YYYY") || "-"
          }}
        </template>

        <template v-slot:item.preview="{ item }">
          <a @click="showPreview(item)" href="#">แสดงรายละเอียด</a>
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
          <v-toolbar-title> {{ previewData.activity_name }}</v-toolbar-title>
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
                    {{ previewData?.activity_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>รายละเอียดกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ previewData?.activity_description || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>วันที่จัดกิจกรรม :</div>
                  <div class="pl-4 font-weight-bold">
                    {{
                      dayjs(previewData?.activity_date)
                        .add(543, "year")
                        .format("DD MMMM YYYY") || "-"
                    }}
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
                          <th class="text-left">บัตรประชาชน</th>
                          <th class="text-left">วัน/เดือน/ปีเกิด</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in previewData?.users" :key="item">
                          <td>{{ item?.person?.person_name || "-" }}</td>
                          <td>{{ item?.person?.id_card || "-" }}</td>
                          <td>
                            {{
                              dayjs(item?.person?.date_of_birth)
                                .add(543, "year")
                                .format("DD MMMM YYYY") || "-"
                            }}
                          </td>
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
      v-model="showCreate"
      :fullscreen="false"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeCreate()"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeCreate()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>เพิ่มสมาชิกชุมชน</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-container fluid class="mt-4">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="activityName"
                  label="ชื่อกิจกรรม"
                  name="activityName"
                  data-vv-as="ชื่อกิจกรรม"
                  v-validate="'required'"
                  :error-messages="errors && errors.first('activityName')"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="activityDesc"
                  label="รายละเอียดกิจกรรม"
                  name="activityDesc"
                  data-vv-as="รายละเอียดกิจกรรม"
                  v-validate="''"
                  :error-messages="errors && errors.first('activityDesc')"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  v-model="datepick"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="computedDateFormatted"
                      clearable
                      label="วันที่จัดกิจกรรม"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="activityDate = null"
                      :error-messages="errors && errors.first('activityDate')"
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="activityDate"
                    @change="datepick = false"
                    name="activityDate"
                    data-vv-as="วัวันที่จัดกิจกรรม"
                    v-validate="'required'"
                    locale="th-TH"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <div class="mt-4">
              <v-btn
                color="primary"
                class="col-12 col-lg-2"
                large
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
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import Activity from "../services/apis/Activity";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  components: {
    Breadcrumb,
  },

  data() {
    return {
      showCreate: false,
      loading: false,
      title: "กิจกรรม",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "กิจกรรม",
          disabled: false,
          href: "/activities",
        },
      ],
      search: "",
      page: 1,
      headers: [
        {
          text: "ชื่อกิจกรรม",
          align: "start",
          sortable: false,
          value: "activity_name",
        },
        { text: "รายละเอียดกิจกรรม", value: "activity_description" },
        { text: "วันที่จัดกิจกรรม", value: "activity_date" },
        { text: "แสดงรายละเอียด", value: "preview" },
      ],

      activities: [],
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
      activityName: "",
      activityDate: "",
      activityDesc: "",
      datepick: false,
    };
  },
  computed: {
    isAdmin() {
      if (this.$auth?.user?.role === "1") {
        return true;
      }
      return false;
    },
    computedDateFormatted() {
      return this.activityDate
        ? dayjs(this.activityDate).add(543, "year").format("DD MMMM YYYY")
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
    this.loadData();
  },
  methods: {
    dayjs,
    async loadData() {
      try {
        this.loading = true;
        const { data, meta } = await Activity.getAll({
          ...this.param,
          "filters[name]": this.name ?? undefined,
        });
        this.activities = data;
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
        activity_name: this.activityName,
        activity_date: this.activityDate,
        activity_description: this.activityDesc,
        status: "1",
      };

      return payload;
    },

    async submit() {
      const validate = await this.$validator.validateAll();
      if (!validate) return;

      try {
        const payload = this.getPayload();

        await Activity.create(payload);

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
      this.activityName = "";
      this.activityDesc = "";
      this.activityDate = "";
      this.$validator.reset();
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
