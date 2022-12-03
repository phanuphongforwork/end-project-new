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
          <a @click="showAddHead(item)" href="#">เพิ่มสมาชิกครัวเรือน</a>
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
            >เพิ่มสมาชิกครัวเรือน บ้านเลขที่
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
                <div class="mt-4">
                  สมาชิก ({{ members && members.length }}) คน
                </div>
                <v-btn
                  color="primary"
                  class="col-2 mt-4 ml-4"
                  medium
                  depressed
                  @click="showAddMember()"
                >
                  <v-icon left> mdi-plus </v-icon>
                  เพิ่มสมาชิก
                </v-btn></v-card-title
              >

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
            >เลือกสมาชิกที่จะเพิ่มใน บ้านเลขที่
            {{ editData?.house_number }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <AddMember
            :house-id="editData?.house_id"
            @success="addMemberSuccess"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import HouseHold from "../services/apis/HouseHold";
import Person from "../services/apis/Person";
import HouseHoldMember from "../services/apis/HouseHoldMember";
import AddMember from "../components/house-hold-members/AddMember";
require("dayjs/locale/th");
dayjs.locale("th");

export default {
  components: {
    Breadcrumb,
    AddMember,
  },

  data() {
    return {
      title: "สมาชิกครัวเรือน",

      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "สมาชิกครัวเรือน",
          disabled: false,
          href: "house-hold-members",
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
        { text: "เพิ่มสมาชิกครัวเรือน", value: "actions", sortable: false },
      ],
      members: [],
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

      volunteer: null,
      addMember: false,
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
    async loadData() {
      try {
        const { data, meta } = await HouseHold.getAll({
          ...this.param,
          "filters[house_number]": this.house_number ?? undefined,
        });
        this.houseHolds = data;
        this.meta = meta;
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
    async loadMember(houseId = null) {
      const { data } = await HouseHoldMember.getAll({
        "filters[house_id]": houseId,
        perPage: 100,
        includes: "person",
      });
      this.members = data;
    },
    async showAddHead(house) {
      await this.loadMember(house.house_id);

      this.editData = house;
      this.showEditData = true;
    },
    closeModal() {
      this.members = [];
      this.editData = null;
      this.showEditData = false;
      this.volunteer = null;
    },
    closeModalAddMem() {
      this.addMember = false;
    },
    showAddMember() {
      this.addMember = true;
    },

    async addMemberSuccess(houseId) {
      this.addMember = false;
      await this.loadMember(houseId);
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
