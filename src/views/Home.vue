<template>
  <v-container>
    <v-row dense>
      <v-col
        cols="12"
      >
        <Intro data-aos="fade" />
      </v-col>
      <v-col
        cols="12"
      >
        <Bulletin
          data-aos="fade"
          data-aos-offset="100"
        />
      </v-col>
      <!--      <v-flex-->
      <!--        xs12-->
      <!--        sm6-->
      <!--      >-->
      <!--        <Contact-->
      <!--          data-aos="fade"-->
      <!--        />-->
      <!--      </v-flex>-->
      <v-col
        cols="12"
        md="6"
      >
        <Contribute
          data-aos="fade"
          data-aos-offset="100"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <Donate
          data-aos="fade"
          data-aos-offset="100"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Contribute from "@/views/About/Contribute";
import Donate from "@/views/About/Donate";
import Intro from "@/views/About/Intro";
import Bulletin from "@/views/About/Bulletin";
export default {
  name: "Home",
  components: { Contribute, Donate, Intro, Bulletin },
  data: () => ({}),
  methods: {
    goToPage(name) {
      this.$router.push({ name: name })
    }
  }
};
</script>

<style scoped>
.home-card {
  height: 100%;
}
</style>