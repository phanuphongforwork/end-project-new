<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>

    <v-card class="mt-6 col-12" outlined>
      <v-card-title class="col-12">
        <v-container>
          <v-row no-gutters cols="12">
            <v-col cols="12" md="2" lg="2">
              <label for="">ปีที่ค้นหา :</label>
            </v-col>
            <v-col cols="12" md="12" lg="5">
              <v-text-field
                v-model="yearNow"
                single-line
                hide-details
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>

        <v-container>
          <v-row no-gutters cols="12">
            <v-col cols="12" md="12" lg="2">
              <label for="">ตำแหน่ง :</label>
            </v-col>
            <v-col cols="12" md="12" lg="5">
              <v-select
                :items="commitees"
                v-model="commitee"
                class="col-12"
                outlined
              ></v-select>
            </v-col>

            <!-- <v-col class="ml-lg-4 mt-lg-2">
              <v-btn
                class="col-12 col-md-12 col-lg-4"
                @click="modalActive = true"
                color="success"
              >
                <v-icon left> mdi-plus </v-icon>
                เพิ่มตำแหน่ง
              </v-btn>
            </v-col> -->
          </v-row>
        </v-container>

        <v-container>
          <v-row no-gutters cols="12">
            <v-col cols="12" md="12" lg="2">
              <label for="">สมาชิก :</label>
            </v-col>
            <v-col cols="12" md="12" lg="5">
              <v-text-field
                v-model="idcard"
                append-icon="mdi-magnify"
                label="เลขบัตรประชาชน"
                counter
                :rules="rules"
                maxlength="13"
                single-line
                hide-details
                outlined
              ></v-text-field>
            </v-col>

            <!-- <v-col class="ml-lg-4 mt-lg-2">
              <v-btn
                class="col-12 col-md-12 col-lg-4 mt-8 mt-lg-0"
                @click="handleAdd()"
                color="success"
                v-if="items && items.length === 0"
              >
                <v-icon left> mdi-plus </v-icon>
                เพิ่มคณะกรรมการ
              </v-btn>
            </v-col> -->
          </v-row>
        </v-container>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="items"
        disable-filtering
        disable-sort
        :itemsPerPage="5"
        class="elevation-1 col-12"
        no-results-text="ไม่พบข้อมูล"
        no-data-text="ไม่พบข้อมูล, ท่านสามารถเพิ่มคณะกรรมการได้"
      >
        <template
          v-slot:[`item.status`]="{ item }"
          class="d-flex justify-center"
        >
          {{ committeeText[item.status] }}
        </template>

        <template
          v-slot:[`item.start_date`]="{ item }"
          class="d-flex justify-center"
        >
          {{ dayjs(item.start_date).add(543, "year").format("YYYY") }}
        </template>

        <template v-slot:[`item.edit`]="{ item }" class="d-flex justify-center">
          <a @click="handleEditData(item)" href="#">แก้ไขข้อมูล</a>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="modalActive"
      hide-overlay
      transition="dialog-bottom-transition"
      max-width="800"
    >
      <v-card v-if="editData">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeEditData()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >แก้ไข {{ editData?.person?.person_name || "-" }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-card outlined>
            <v-card-title>รายละเอียด</v-card-title>

            <div class="px-4">
              <div class="d-flex">
                <div>บัตรประชาชน :</div>
                <div class="pl-4 font-weight-bold">
                  {{ editData.person?.id_card || "-" }}
                </div>
              </div>
              <div class="d-flex">
                <div>ชื่อ-นามสกุล :</div>
                <div class="pl-4 font-weight-bold">
                  {{ editData.person?.person_name || "-" }}
                </div>
              </div>
              <div class="d-flex">
                <div>ตำแหน่ง :</div>
                <div class="pl-4 font-weight-bold">
                  {{ editData?.committee?.committee_name || "-" }}
                </div>
              </div>
            </div>
          </v-card>
          <div class="mt-4">
            <v-select
              v-model="editData.status"
              :items="committeeOptions"
              label="สถานะ"
              name="status"
              data-vv-as="สถานะ"
              v-validate="'required'"
              :error-messages="errors.first('status')"
              outlined
            ></v-select>
          </div>
          <div class="">
            <v-btn class="col-12" color="primary" large @click="onEditData()">
              <v-icon left> mdi-content-save </v-icon>
              บันทึก
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showResult"
      hide-overlay
      transition="dialog-bottom-transition"
      max-width="800"
    >
      <v-card v-if="resultData">
        <v-toolbar dark color="primary">
          <!-- <v-btn icon dark @click="closeEditData()">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
          <v-toolbar-title
            >แก้ไข {{ editData?.person?.person_name || "-" }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-card outlined>
            <v-card-title>รายละเอียด</v-card-title>

            <div class="px-4">
              <div class="d-flex">
                <div>บัตรประชาชน :</div>
                <div class="pl-4 font-weight-bold">
                  {{ editData.person?.id_card || "-" }}
                </div>
              </div>
              <div class="d-flex">
                <div>ชื่อ-นามสกุล :</div>
                <div class="pl-4 font-weight-bold">
                  {{ editData.person?.person_name || "-" }}
                </div>
              </div>
              <div class="d-flex">
                <div>ตำแหน่ง :</div>
                <div class="pl-4 font-weight-bold">
                  {{ editData?.committee?.committee_name || "-" }}
                </div>
              </div>

              <div class="d-flex">
                <div>สถานะ :</div>
                <div class="pl-4 font-weight-bold">
                  {{ committeeText[resultData?.status] || "-" }}
                </div>
              </div>
            </div>
          </v-card>
          <div class="">
            <v-btn class="col-12" large @click="closeResult()">
              <!-- <v-icon left> mdi-content-save </v-icon> -->
              ปิดหน้าต่าง
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import AddCommitee from "@/components/commitee/AddCommitee";
import CommiteeApi from "../services/apis/Commitee";
import CommunityBoardApi from "../services/apis/CommunityBoard";
import AddCommunityBoard from "../components/community-boards/AddCommunityBoard";
import { COMMITTEE_TEXT, COMMITTEE_OPTIONS } from "../constants/committee";

require("dayjs/locale/th");
dayjs.locale("th");

import Breadcrumb from "@/components/Breadcrumbs";
export default {
  components: {
    Breadcrumb,
    AddCommitee,
    AddCommunityBoard,
  },

  data() {
    return {
      committeeOptions: COMMITTEE_OPTIONS,
      committeeText: COMMITTEE_TEXT,
      title: "คณะกรรมการชุมชน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "คณะกรรมการชุมชน",
          disabled: false,
          href: "community-board",
        },
      ],
      search: "",
      page: 1,
      headers: [
        { text: "บัตรประชาชน", value: "person.id_card" },
        {
          text: "ชื่อ-นามสกุล",
          align: "start",
          sortable: false,
          value: "person.person_name",
        },
        { text: "ปีที่รับตำแหน่ง", value: "start_date" },
        { text: "ตำแหน่ง", value: "committee.committee_name" },
        { text: "สถานะ", value: "status" },
        { text: "แก้ไข", value: "edit" },
      ],
      modalActive: false,
      isEdit: false,
      commitees: [],
      commitee: null,

      yearNow: dayjs().add(543, "year").format("YYYY"),
      idcard: "",
      items: [],
      meta: {},
      modalAddActive: false,
      payloadAdd: null,
      rules: [(v) => v.length <= 13 || "บัตรประชาชน 13 หลัก"],
      years: [],
      editData: null,
      resultData: null,
      showResult: false,
    };
  },

  mounted() {
    this.loadAvailable();
    this.loadCommitee();

    const startYear = dayjs().add(543, "year").format("YYYY");

    this.years = [];
    let i = 0;
    for (i; i < 20; i++) {
      this.years.push({
        value: dayjs(startYear).subtract(i, "year").format("YYYY"),
        text: dayjs(startYear).subtract(i, "year").format("YYYY"),
      });
    }
  },
  watch: {
    idcard: {
      handler(data) {
        if (data.length <= 13) {
          this.loadAvailable(data, this.commitee);
        }
      },
    },
    commitee: {
      handler(data) {
        if (data) {
          this.loadAvailable(this.idcard, data);
        }
      },
    },
    yearNow: {
      handler(data) {
        if (data) {
          this.loadAvailable(this.idcard, this.commitee, data);
        }
      },
    },
  },
  methods: {
    dayjs,
    async onEditData() {
      const validate = await this.$validator.validateAll();

      if (!validate) return;

      try {
        const { data } = await CommunityBoardApi.update(
          this.editData.community_board_id,
          {
            status: this.editData.status,
          }
        );
        this.resultData = data;
        this.showResult = true;
        this.$toast.success("แก้ไขข้อมูล สำเร็จ!");
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
      }
    },
    async loadAvailable(idCard = "", committeeId = "", year = "") {
      const { data, meta } = await CommunityBoardApi.getAvailable(
        idCard,
        committeeId,
        year
      );

      (this.items = data), (this.meta = meta);
    },
    async loadCommitee() {
      const { data } = await CommiteeApi.getAll({
        perPage: 500,
      });

      this.commitees =
        data.map((item) => {
          return {
            value: item.committee_id,
            text: item.committee_name,
          };
        }) || [];
    },

    handleEditData(data) {
      this.editData = data;
      this.modalActive = true;
    },

    closeEditData() {
      this.modalActive = false;

      this.editData = null;
    },
    closeResult() {
      this.loadAvailable();
      this.showResult = false;
      this.resultData = null;
      this.modalActive = false;
      this.editData = null;
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
