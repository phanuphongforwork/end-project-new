<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>

    <div class="mt-6">
      <v-card v-if="previewData" outlined>
        <v-card-title>บ้านเลขที่ {{ previewData.house_number }}</v-card-title>

        <div class="px-4">
          <div class="d-flex">
            <div>บ้านเลขที่ :</div>
            <div class="pl-4 font-weight-bold">
              {{ previewData?.house_number || "-" }}
            </div>
          </div>
          <div class="d-flex mt-2">
            <div>เขต :</div>
            <div class="pl-4 font-weight-bold">
              {{ previewData?.district?.district_name || "-" }}
            </div>
          </div>
          <div class="d-flex mt-2">
            <div>แขวง :</div>
            <div class="pl-4 font-weight-bold">
              {{ previewData?.subdistrict?.subdistrict_name || "-" }}
            </div>
          </div>
          <div class="d-flex mt-2">
            <div>ถนน :</div>
            <div class="pl-4 font-weight-bold">
              {{ previewData?.road?.road_name || "-" }}
            </div>
          </div>
          <div class="d-flex mt-2">
            <div>ซอย :</div>
            <div class="pl-4 font-weight-bold">
              {{ previewData?.alley?.alley_name || "-" }}
            </div>
          </div>
          <div class="d-flex mt-2">
            <div>รหัสไปรษณีย์ :</div>
            <div class="pl-4 font-weight-bold">
              {{ previewData?.subdistrict?.post_code || "-" }}
            </div>
          </div>
          <div class="d-flex mt-2">
            <div>เบอร์โทรศัพท์ :</div>
            <div class="pl-4 font-weight-bold">
              {{ previewData?.phone || "-" }}
            </div>
          </div>
          <div class="d-flex mt-2">
            <div>หัวหน้าครัวเรือน :</div>
            <div class="pl-4 font-weight-bold">
              {{ previewData?.person?.person_name || "-" }}
            </div>
          </div>
          <div class="d-flex mt-2 mb-4">
            <div>อาสาสมัคร :</div>
            <div class="pl-4 font-weight-bold">
              {{ previewData?.volunteer?.person_name || "-" }}
            </div>
          </div>
        </div>
      </v-card>

      <v-card outlined class="mt-4">
        <v-card-title class="d-flex">
          <div class="mt-4">
            สมาชิก ({{ previewData?.members?.length || 0 }}) คน
          </div>
        </v-card-title>

        <div class="px-4">
          <div>
            <div
              class="d-flex mb-8 mt-4"
              v-if="previewData?.members && previewData?.members?.length === 0"
            >
              ไม่มีสมาชิกในครัวเรือน
            </div>

            <v-simple-table
              v-if="previewData?.members && previewData?.members?.length > 0"
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in previewData?.members" :key="item">
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
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import HouseHold from "../services/apis/HouseHold";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  components: {
    Breadcrumb,
  },

  data() {
    return {
      loading: false,
      title: "ทะเบียนครัวเรือนของฉัน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "ทะเบียนครัวเรือนของฉัน",
          disabled: false,
          href: "my-house",
        },
      ],
      search: "",
      page: 1,
      house: null,
      house_number: undefined,
      isShowPreview: false,
      previewData: null,
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
  computed: {},
  watch: {},
  mounted() {
    this.loadData();
  },
  methods: {
    dayjs,
    async loadData() {
      try {
        this.loading = true;
        const { data } = await HouseHold.getMyHouse();
        if (data && data.length > 0) {
          this.previewData = data[0];
        }
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
