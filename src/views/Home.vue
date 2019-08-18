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
        <Intro
          class="home-card"
          data-aos="fade"
        />
      </v-flex>
      <v-flex
        xs12
        sm6
      >
        <Contact
          class="home-card"
          data-aos="fade"
        />
      </v-flex>
      <v-flex
        xs12
        sm6
      >
        <Contribute
          class="home-card"
          data-aos="fade"
        />
      </v-flex>
      <v-flex
        xs12
        sm6
      >
        <Donate
          class="home-card"
          data-aos="fade"
        />
      </v-flex>

      <v-flex
        xs4
        md4
      >
        <v-card
          class="mx-auto bkop-light"
          data-aos="fade"
        >
          <v-card-title>
            <v-layout
              align-center
              justify-center
              row
              fill-height
            >
              <span class="cursor-pointer">
                <v-chip
                  class="ma-2"
                  color="primary"
                  text-color="white"
                  @click="goToPage('AboutMembers')"
                >
                  团队成员
                  <v-icon right>
                    mdi-share
                  </v-icon>
                </v-chip>
              </span>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex
        xs4
        md4
      >
        <v-card
          class="mx-auto bkop-light"
          data-aos="fade"
        >
          <v-card-title>
            <v-layout
              align-center
              justify-center
              row
              fill-height
            >
              <span class="cursor-pointer">
                <v-chip
                  class="ma-2"
                  color="primary"
                  text-color="white"
                  @click="goToPage('AboutChangelog')"
                >
                  更新日志
                  <v-icon right>
                    mdi-share
                  </v-icon>
                </v-chip>
              </span>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex
        xs4
        md4
      >
        <v-card
          class="mx-auto bkop-light"
          data-aos="fade"
        >
          <v-card-title>
            <v-layout
              align-center
              justify-center
              row
              fill-height
            >
              <span class="cursor-pointer">
                <v-chip
                  class="ma-2"
                  color="primary"
                  text-color="white"
                  @click="goToPage('AboutLinks')"
                >
                  友情链接
                  <v-icon right>
                    mdi-share
                  </v-icon>
                </v-chip>
              </span>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Contact from "@/views/About/Contact";
import Contribute from "@/views/About/Contribute";
import Donate from "@/views/About/Donate";
import Intro from "@/views/About/Intro";
export default {
  name: "Home",
  components: { Contact, Contribute, Donate, Intro },
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