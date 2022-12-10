<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>

    <v-card class="mt-6" outlined>
      <v-card-title class="col-12">
        <div class="col-12">
          <v-text-field
            v-model="house_number"
            class="col-12"
            append-icon="mdi-magnify"
            label="ค้นหาบ้านเลขที่"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </div>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="houseHolds"
        disable-filtering
        disable-sort
        :page="meta.page"
        :itemsPerPage="meta.perPage || 5"
        :server-items-length="meta.total"
        class="elevation-1"
        @update:items-per-page="changePerPage"
        @update:page="changePage"
        no-results-text="ไม่พบข้อมูล"
        no-data-text="ไม่พบข้อมูล, ลองค้นหาทะเบียนบ้านใหม่อีกครั้ง"
      >
        <template v-slot:item.actions="{ item }">
          <a @click="showAddHead(item)" href="#">เพิ่มหัวหน้าครัวเรือน</a>
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
          <v-toolbar-title
            >เพิ่มหัวหน้าครัวเรือน บ้านเลขที่
            {{ editData.house_number }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <div class="mt-4">
            <v-card outlined>
              <v-card-title>รายละเอียด</v-card-title>

              <div class="px-4">
                <div class="d-flex">
                  <div>บ้านเลขที่ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.house_number || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เขต :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.district?.district_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>แขวง :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.subdistrict?.subdistrict_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ถนน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.road?.road_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>ซอย :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.alley?.alley_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>รหัสไปรษณีย์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.subdistrict?.post_code || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>เบอร์โทรศัพท์ :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.phone || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2">
                  <div>หัวหน้าครัวเรือน :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.person?.person_name || "-" }}
                  </div>
                </div>
                <div class="d-flex mt-2 mb-4">
                  <div>อาสาสมัคร :</div>
                  <div class="pl-4 font-weight-bold">
                    {{ editData?.volunteer?.person_name || "-" }}
                  </div>
                </div>
              </div>
            </v-card>

            <v-card outlined class="mt-4">
              <v-card-title class="d-flex">
                <div class="mt-4">เลือกหัวหน้าครัวเรือน</div>
              </v-card-title>

              <div class="px-4">
                <div>
                  <div
                    class="d-flex mb-8 mt-4"
                    v-if="members && members.length === 0"
                  >
                    ไม่มีสมาชิกในครัวเรือน
                  </div>

                  <v-simple-table
                    v-if="members && members.length > 0"
                    fixed-header
                    height="300px"
                  >
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">ชื่อ-นามสกุล</th>
                          <th class="text-left">บัตรประชาชน</th>
                          <th class="text-left">วัน/เดือน/ปีเกิด</th>
                          <th class="text-left">สถานะในครัวเรือน</th>
                          <th class="text-left">สถานะ</th>
                          <th class="text-left">ตั้งเป็นหัวหน้าครัวเรือน</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in members" :key="item">
                          <td>{{ item?.person?.person_name || "-" }}</td>
                          <td>{{ item?.person?.id_card || "-" }}</td>
                          <td>
                            {{
                              dayjs(item?.person?.date_of_birth)
                                .add(543, "year")
                                .format("DD MMMM YYYY") || "-"
                            }}
                          </td>
                          <td>
                            {{ getMemberStatus(item?.member_status) || "-" }}
                          </td>
                          <td>{{ getStatus(item?.status) || "-" }}</td>
                          <td>
                            <v-btn @click="handleSetHead(item)" color="primary">
                              <v-icon left> mdi-crown-outline </v-icon>
                              ตั้งเป็นหัวหน้าครัวเรือน
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import HouseHold from "../services/apis/HouseHold";
import HouseHoldMember from "../services/apis/HouseHoldMember";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  components: {
    Breadcrumb,
  },

  data() {
    return {
      loading: false,
      title: "เลือกหัวหน้าครัวเรือน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "เลือกหัวหน้าครัวเรือน",
          disabled: false,
          href: "add-head-house-holds",
        },
      ],
      search: "",
      page: 1,
      headers: [
        {
          text: "บ้านเลขที่",
          align: "start",
          sortable: false,
          value: "house_number",
        },
        { text: "ชุมชน", value: "community.comm_name" },
        { text: "ซอย", value: "alley.alley_name" },
        { text: "ถนน", value: "road.road_name" },
        { text: "เขต", value: "district.district_name" },
        { text: "แขวง", value: "subdistrict.subdistrict_name" },
        { text: "รหัสไปรษณีย์", value: "subdistrict.post_code" },
        { text: "เลือกหัวหน้าครัวเรือน", value: "actions", sortable: false },
      ],

      houseHolds: [],
      meta: {},
      param: {
        page: 1,
        perPage: 5,
        q: "",
        sort: "created_at",
        order: "desc",
        includes: "community,road,alley,volunteer,person,subdistrict,district",
      },
      house_number: undefined,
      showEditData: false,
      editData: null,
      members: [],
      memberStatusOptions: [
        {
          value: "1",
          text: "หัวหน้าครัวเรือน",
        },
        {
          value: "2",
          text: "สมาชิกครัวเรือน",
        },
      ],
      statusOptions: [
        {
          value: "0",
          text: "เสียชีวิต",
        },
        {
          value: "1",
          text: "อยู่ในครัวเรือน",
        },
        {
          value: "2",
          text: "ย้าย",
        },
      ],
    };
  },
  watch: {
    house_number: {
      handler(data) {
        if (data) {
          this.loadData();
        } else {
          this.house_number = undefined;
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
    async loadPerson() {
      try {
        const { data } = await HouseHold.getUserInHouse(this.editData.house_id);

        this.members = data || [];
      } catch (e) {
        console.log(e);
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      }
    },
    async loadData() {
      try {
        this.loading = true;
        const { data, meta } = await HouseHold.getAll({
          ...this.param,
          "filters[house_number]": this.house_number ?? undefined,
        });
        this.houseHolds = data;
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
    showAddHead(house) {
      this.editData = house;
      this.showEditData = true;
      this.loadPerson();
    },
    closeModal() {
      this.editData = null;
      this.showEditData = false;
    },
    getMemberStatus(status) {
      const memberStatus = this.memberStatusOptions.find((e) => {
        return e.value === status;
      });

      if (memberStatus) {
        return memberStatus.text;
      }

      return "-";
    },
    getStatus(status) {
      const findStatus = this.statusOptions.find((e) => {
        return e.value === status;
      });

      if (findStatus) {
        return findStatus.text;
      }

      return "-";
    },
    async handleSetHead(item) {
      const id = item?.person?.person_id || null;

      if (id) {
        try {
          await HouseHoldMember.create({
            person_id: item?.person?.person_id,
            house_id: item?.house_id,
            status: item?.status,
            member_status: "1",
          });
          this.$toast.success(
            `แต่งตั้ง ${item?.person?.person_name} เป็นหัวหน้าครอบครัวแล้ว !`
          );
          this.editData.person.person_name = item?.person?.person_name;
        } catch (e) {
          this.$toast.error("ผิดพลาด, แต่งตั้งไม่สำเร็จ");
        } finally {
          this.loadPerson();
        }
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
