<template>
  <v-container
    fluid
    grid-list-sm
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        sm6
      >
        <Contact />
      </v-flex>
      <v-flex
        xs12
        sm6
      >
        <Contribute />
      </v-flex>
      <v-flex
        xs12
        sm6
      >
        <Donate />
      </v-flex>
      <v-flex
        sm12
        md6
      >
        <Links />
      </v-flex>
      <v-flex
        xs12
        md12
      >
        <Members />
      </v-flex>
      <v-flex
        xs12
        md12
      >
        <Changelog />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Changelog from "@/views/About/Changelog";
import Members from "@/views/About/Members";
import Contact from "@/views/About/Contact";
import Contribute from "@/views/About/Contribute";
import Donate from "@/views/About/Donate";
import Links from "@/views/About/Links";
export default {
  name: "Home",
  components: { Changelog, Contact, Contribute, Members, Donate, Links },
  data: () => ({})
};
</script>