<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <Intro data-aos="fade" />
      </v-col>
      <v-col
        cols="12"
      >
        <Bulletin
          data-aos="fade"
          data-aos-offset="50"
          class="animation-blink"
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
          data-aos-offset="50"
        />
        <Contact
          class="mt-2"
          data-aos="fade"
          data-aos-offset="50"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <Donate
          data-aos="fade"
          data-aos-offset="50"
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
import Contact from "@/views/About/Contact";
export default {
  name: "Home",
  components: { Contribute, Donate, Intro, Bulletin, Contact },
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

.animation-blink {
  animation-play-state: running;
}

.animation-blink:hover{
  animation-play-state: paused;
}

.theme--light .animation-blink {
  background: repeating-linear-gradient(
      -45deg,
      rgba(240, 240, 240, 0.95),
      rgba(240, 240, 240, 0.95) 45px,
      rgba(255, 255, 255, 0.9) 45px,
      rgba(255, 255, 255, 0.9) 90px
  ) !important;
  animation: light-blink 3s infinite alternate ease-in-out;
}

.theme--dark .animation-blink {
  background: repeating-linear-gradient(
      -45deg,
      rgba(81, 81, 81, 0.95),
      rgba(81, 81, 81, 0.95) 45px,
      rgba(66, 66, 66, 0.9) 45px,
      rgba(66, 66, 66, 0.9) 90px
  ) !important;
  animation: dark-blink 3s infinite alternate ease-in-out;
}

@keyframes light-blink {
  from {
    text-shadow: 0 0 0 rgba(0, 0, 0, .3);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .5), 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);;
  }
  to {
    text-shadow: 0 0 5px rgba(0, 0, 0, .3);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, .5), 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);;
  }
}

@keyframes dark-blink {
  from {
    text-shadow: 0 0 0 rgba(255, 255, 255, .5);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, .5), 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);;
  }
  to {
    text-shadow: 0 0 5px rgba(255, 255, 255, .5);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, .5), 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);;
  }
}
</style>