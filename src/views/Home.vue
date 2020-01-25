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
  animation: light-blink 5s infinite ease-in-out;
}

.theme--dark .animation-blink {
  animation: dark-blink 5s infinite ease-in-out;
}

@keyframes light-blink {
  from {
    background: rgba(255, 230, 230, 0.9);
    text-shadow: 0 0 5px rgba(0, 0, 0, .0);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .5);
  }
  50% {
    background: rgba(255, 255, 130, 0.9);
    text-shadow: 0 0 5px rgba(0, 0, 0, .5);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, .5);
  }
  to {
    background: rgba(255, 230, 230, 0.9);
    text-shadow: 0 0 5px rgba(0, 0, 0, .0);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .5);
  }
}

@keyframes dark-blink {
  from {
    background: rgba(97, 97, 80, 0.9);
    text-shadow: 0 0 5px rgba(0, 0, 0, .0);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, .5);
  }
  50% {
    background: rgb(140, 140, 73);
    text-shadow: 0 0 5px rgba(0, 0, 0, .5);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, .5);
  }
  to {
    background: rgba(97, 97, 80, 0.9);
    text-shadow: 0 0 5px rgba(0, 0, 0, .0);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, .5);
  }
}
</style>