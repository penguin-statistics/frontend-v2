import Vue from 'vue';
import formatter from "@/utils/formatter";

Vue.filter('thousandSeparator', formatter.thousandSeparator)