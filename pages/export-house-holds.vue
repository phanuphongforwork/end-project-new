<template>
  <div>
    <v-container class="d-flex justify-center">
      <div>
        <v-btn :loading="loading" large @click="handleExport()">
          <v-icon left> mdi-download-box </v-icon>
          ออกรายงานทะเบียนครัวเรือนที่ดูแล
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import ExportService from "../services/apis/Export";
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async handleExport() {
      try {
        this.loading = true;
        await ExportService.exportHouseHold();
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
