<template>
  <div>
    <v-container fluid>
      <AccountStep @create="CreateAccount()" :isEdit="isEdit" />
    </v-container>
  </div>
</template>

<script>
import AccountStep from "@/components/accounts/Stepper";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AccountStep,
  },
  data() {
    return {};
  },
  methods: {
    CreateAccount() {
      this.$emit("createAccount");
    },
  },
};
</script>

<style></style>
