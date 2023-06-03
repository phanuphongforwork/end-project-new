<template>
  <div>
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
        <template v-slot:item.actions="{ item }">
          <v-btn @click="addItem(item)" color="info">
            <v-icon left> mdi-plus </v-icon>
            เพิ่มสมาชิก
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="showAddStatus"
      :fullscreen="false"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeModalAddStatus()"
    >
      <v-card v-if="member">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeModalAddStatus()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >สถานะสมาชิก {{ member?.person_name }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <v-card class="pb-4" outlined>
            <v-card-title>รายละเอียด</v-card-title>

            <div class="px-4">
              <div class="d-flex">
                <div>รหัสบัตรประชาชน :</div>
                <div class="pl-4 font-weight-bold">
                  {{ member?.id_card || "-" }}
                </div>
              </div>
              <div class="d-flex mt-2">
                <div>ชื่อ-นามสกุล :</div>
                <div class="pl-4 font-weight-bold">
                  {{ member?.person_name || "-" }}
                </div>
              </div>
              <div class="d-flex mt-2">
                <v-textarea
                  v-model="detail"
                  outlined
                  name="input-7-4"
                  label="รายละเอียดการตรวจสุขภาพ"
                ></v-textarea>
              </div>
            </div>
          </v-card>
          <v-container class="mt-4" fluid>
            <v-btn color="primary" class="col-12 mt-4" large @click="submit()">
              <v-icon left> mdi-content-save </v-icon>
              ยืนยันการเพิ่ม
            </v-btn>
          </v-container>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Breadcrumb from "@/components/Breadcrumbs";
import Person from "../../services/apis/Person";
import HealthCheck from "../../services/apis/HealthCheck";

require("dayjs/locale/th");
dayjs.locale("th");

export default {
  props: ["item"],
  components: {
    Breadcrumb,
  },
  data() {
    return {
      modalActive: false,
      title: "สมาชิก",
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
        { text: "กดเพื่อเพิ่ม", value: "actions", sortable: false },
      ],
      items: [],
      showDetailData: false,
      detail: null,
      member: null,
      showAddStatus: false,
      detail: "",
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
    this.detail = "";
    this.items = [];
    this.loadData();
  },
  methods: {
    dayjs,
    async loadData() {
      try {
        const userIds = [];
        this.item?.users?.forEach((user) => {
          userIds.push(user.person.person_id);
        });

        const { data, meta } = await Person.getNotInHealthCheck(
          {
            ...this.param,
            q: this.search ?? undefined,
          },
          userIds
        );
        this.items = data;
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

    closeModalAddStatus() {
      this.showAddStatus = false;
      this.detail = "";
    },

    addItem(item) {
      this.showAddStatus = true;
      this.member = {
        person_id: item.person_id,
        person_name: item.person_name,
        id_card: item.id_card,
        date_of_birth: item.date_of_birth,
        status: item?.household_member?.status || "1",
        member_status: item?.household_member?.member_status || "2",
      };
    },
    async submit() {
      const validate = await this.$validator.validateAll();
      if (!validate) return;

      try {
        const { data } = await HealthCheck.update(this.item.health_check_id, {
          health_check_date: dayjs(this.item.health_check_id).format(
            "YYYY-MM-DD"
          ),
          status: this.item.status,
          health_check_name: this.item.health_check_name,
          remark: this.detail,
          newUserIds: [this.member.person_id],
          deleteUserIds: [],
        });

        this.loadData();
        this.closeModalAddStatus();
        this.$emit("success", data);

        this.member = null;
        this.items = [];
        this.detail = "";

        this.$toast.success("เพิ่มสมาชิก สำเร็จ!");
      } catch (e) {
        this.$toast.error("เกิดข้อผิดพลาด, กรุณาลองใหม่อีกครั้ง");
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
