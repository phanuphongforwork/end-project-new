<template>
  <div>
    {{ roleText() }}
  </div>
  <!-- <v-chip class="ma-2" :color="roleColor()"> -->
  <!-- </v-chip> -->
</template>

<script>
import { ROLE_TEXT, ROLE_COLOR } from "../../constants/role";
export default {
  props: {
    role: {
      type: String,
      default: "",
    },
  },
  methods: {
    roleText() {
      if (!this.role) {
        return "สมาชิก";
      }
      return ROLE_TEXT[this.role];
    },
    roleColor() {
      if (!this.role) {
        return "";
      }

      return ROLE_COLOR[this.role];
    },
  },
};
</script>

<style></style>
