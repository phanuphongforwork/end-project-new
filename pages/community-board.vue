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

            <v-col class="ml-lg-4 mt-lg-2">
              <v-btn
                class="col-12 col-md-12 col-lg-4 mt-8 mt-lg-0"
                @click="handleAdd()"
                color="success"
                v-if="items && items.length === 0"
              >
                <v-icon left> mdi-plus </v-icon>
                เพิ่มคณะกรรมการ
              </v-btn>
            </v-col>
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
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="modalActive"
      hide-overlay
      transition="dialog-bottom-transition"
      max-width="800"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeAddCommiee()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>เพิ่มตำแหน่ง</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <AddCommitee @success="createCommiteeSuccess()" />
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="modalAddActive"
      hide-overlay
      transition="dialog-bottom-transition"
      max-width="800"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeAdd()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>เพิ่มคณะกรรมการ</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-card v-if="payloadAdd" outlined>
            <v-card-title>รายละเอียด</v-card-title>

            <div class="px-4">
              <AddCommunityBoard
                :idCard="idcard"
                :comittee="commitee"
                @success="closeAdd()"
              />
            </div>
          </v-card>
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
import { COMMITTEE_TEXT } from "../constants/committee";

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
        // { text: "สถานะ", value: "status" },

        { text: "ตำแหน่ง", value: "committee.committee_name" },
        { text: "สถานะ", value: "status" },
      ],
      modalActive: false,
      isEdit: false,
      commitees: [],
      commitee: null,

      yearNow: dayjs().add(543, "year").format("YYYY"),
      years: [
        {
          value: dayjs().add(543, "year").format("YYYY"),
          text: dayjs().add(543, "year").format("YYYY"),
        },
      ],
      idcard: "",
      items: [],
      meta: {},
      modalAddActive: false,
      payloadAdd: null,
      rules: [(v) => v.length <= 13 || "บัตรประชาชน 13 หลัก"],
    };
  },
  mounted() {
    this.loadAvailable();
    this.loadCommitee();
  },
  watch: {
    idcard: {
      handler(data) {
        if (data.length <= 13) {
          this.loadAvailable(data, this.commitee);
        }
      },
    },
  },
  methods: {
    dayjs,
    async loadAvailable(idCard = "", committeeId = "") {
      const { data, meta } = await CommunityBoardApi.getAvailable(
        idCard,
        committeeId
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

    closeAddCommiee() {
      this.modalActive = false;
    },
    createCommiteeSuccess() {
      this.modalActive = false;
      this.loadCommitee();
    },
    handleAdd() {
      this.payloadAdd = {
        id_card: this.idcard,
        committee_id: this.commitee,
        status: "1",
      };

      this.modalAddActive = true;
    },
    closeAdd() {
      this.modalAddActive = false;
      this.payloadAdd = null;
      this.loadAvailable();
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
