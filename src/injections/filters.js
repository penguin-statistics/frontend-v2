import Vue from 'vue'
import formatter from '@/utils/formatter'
import timeFormatter from "@/utils/timeFormatter";

Vue.filter('thousandSeparator', formatter.thousandSeparator)
Vue.filter('timeAbsolute', val => timeFormatter.date(val, true, true))
Vue.filter('timeRelative', val => timeFormatter.dayjs(val).fromNow())
