<template>
  <v-container
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
      >
        <Intro />
      </v-flex>
      <!--      <v-flex-->
      <!--        xs12-->
      <!--        sm6-->
      <!--      >-->
      <!--        <Contact-->
      <!--          data-aos="fade"-->
      <!--        />-->
      <!--      </v-flex>-->
      <v-flex
        xs12
        md6
      >
        <Contribute
          class="home-card"
          data-aos="fade"
        />
      </v-flex>
      <v-flex
        xs12
        md6
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
                  {{ $t('menu.about.members') }}
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
                  {{ $t('menu.about.changelog') }}
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
                  {{ $t('menu.about.links') }}
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
import Contribute from "@/views/About/Contribute";
import Donate from "@/views/About/Donate";
import Intro from "@/views/About/Intro";
export default {
  name: "Home",
  components: { Contribute, Donate, Intro },
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