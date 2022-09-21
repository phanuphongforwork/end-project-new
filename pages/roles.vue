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
        สร้างสิทธิ์การใช้งาน
      </v-btn>
    </div>
    <v-card class="mt-6" outlined>
      <v-data-table
        :headers="headers"
        :items="roles"
        disable-filtering
        disable-sort
        :itemsPerPage="5"
        class="elevation-1"
      >
        <template
          v-slot:[`item.Status`]="{ item }"
          class="d-flex justify-center"
        >
          <v-chip color="primary" dark>
            {{ item.Status }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]>
          <a href="#" @click="editRole(item)">แก้ไขสิทธิ์</a>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="modalActive"
      hide-overlay
      persistent
      :fullscreen="true"
      transition="dialog-bottom-transition"
      max-width="800"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeModal()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            isEdit ? `แก้ไข${title}` : `สร้าง${title}`
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="px-4 py-4">
          <CreateForm @save="closeModal()" />
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="createSuccess" color="success" timeout="2000">
      สร้างสิทธิ์การใช้งานเรียบร้อยแล้ว
    </v-snackbar>

    <v-snackbar v-model="updateSuccess" color="success" timeout="2000">
      แก้ไขสิทธิ์การใช้งานเรียบร้อยแล้ว
    </v-snackbar>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumbs";
import CreateForm from "@/components/roles/CreateForm";
export default {
  components: {
    Breadcrumb,
    CreateForm,
  },
  data() {
    return {
      title: "สิทธิ์การใช้งาน",
      breadcrumbs: [
        {
          text: "หน้าแรก",
          disabled: false,
          href: "/",
        },
        {
          text: "สิทธิ์การใช้งาน",
          disabled: false,
          href: "roles",
        },
      ],
      search: "",
      page: 1,
      headers: [
        {
          text: "ลำดับที่",
          value: "index",
          width: 100,
        },
        {
          text: "ชื่อบทบาท",
          align: "start",
          sortable: false,
          value: "LevelName",
        },
        { text: "สถานะ", value: "Status", align: "center", width: 200 },
        { text: "แก้ไขสิทธิ์", value: "actions", sortable: false, width: 100 },
      ],
      modalActive: false,
      roles: Array(5)
        .fill({
          LevelName: "แอดมิน",
          Status: "ใช้งาน",
        })
        .map((e, index) => {
          return {
            ...e,
            index: Number(index) + 1,
          };
        }),
      isEdit: false,
      createSuccess: false,
      updateSuccess: false,
    };
  },
  methods: {
    closeModal() {
      this.modalActive = false;

      if (!this.isEdit) {
        this.createSuccess = true;
      } else {
        this.updateSuccess = true;
      }
      this.isEdit = false;
    },
    editRole(item) {
      this.isEdit = true;
      this.modalActive = true;
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
