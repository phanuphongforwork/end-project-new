<template>
  <div>
    <div>
      <Breadcrumb :items="breadcrumbs" :title="title" />
    </div>
    <div>
      <v-btn
        color="primary"
        large
        class="col-12 col-lg-2 mt-6"
        @click="modalActive = true"
      >
        <v-icon left> mdi-plus-circle </v-icon>
        สร้างตำแหน่ง
      </v-btn>
    </div>
    <v-card class="mt-6" outlined>
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
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="modalActive"
      :fullscreen="false"
      transition="dialog-bottom-transition"
      width="800px"
      persistent
      @click:outside="closeModal()"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeModal()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>สร้างตำแหน่ง</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <div>
            <v-text-field
              v-model="committee"
              label="ชื่อตำแหน่ง"
              name="committee"
              data-vv-as="ชื่อตำแหน่ง"
              v-validate="'required'"
              :error-messages="errors && errors.first('committee')"
              outlined
            >
            </v-text-field>
          </div>
          <v-btn
            color="primary"
            class="col-12 col-lg-2"
            large
            @click="submit()"
          >
            <v-icon left> mdi-content-save </v-icon>
            บันทึกข้อมูล
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumbs";
import Commitee from "../services/apis/Commitee";

export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      modalActive: false,
      title: "ตำแหน่ง",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "ตำแหน่ง",
          disabled: false,
          href: "/committees",
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
          text: "ชื่อตำแหน่ง",
          align: "start",
          sortable: false,
          value: "committee_name",
        },
      ],
      items: [],
      committee: "",
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        const { data, meta } = await Commitee.getAll({
          ...this.param,
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
    async submit() {
      try {
        const validate = await this.$validator.validateAll();
        if (!validate) return;

        await Commitee.create({
          committee_name: this.committee,
        });

        this.$toast.success("สร้างตำแหน่งสำเร็จ");
        this.clear();
        this.modalActive = false;
        this.loadData();
      } catch {
        this.$toast.error("ผิดพลาด, ตำแหน่งที่เพิ่มอาจจะซ้ำ");
      }
    },
    clear() {
      this.committee = "";
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
</style>
