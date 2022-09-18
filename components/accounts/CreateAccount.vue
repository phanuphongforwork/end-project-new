<template>
  <div>
    <v-container fluid>
      <AccountStep @create="CreateAccount()" />
    </v-container>
  </div>
</template>

<script>
import AccountStep from "@/components/accounts/Stepper";
export default {
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
