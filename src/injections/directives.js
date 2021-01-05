import Vue from 'vue';
import strings from "@/utils/strings";
import haptics from "@/utils/native/haptics";

Vue.directive("marked", function (el) {
  el.innerHTML = strings.markdown(el.innerHTML);

  [...el.querySelectorAll('a')].forEach(a => {
    // avoid interferring with form input tab focus
    a.setAttribute('tabindex', '-1')
    const href = a.getAttribute('href')
    if (href && href.charAt(0) !== '#') {
      // make external links open in new tab
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noreferrer noopener')
    }
    a.onclick = haptics.light
  })
})

function useHaptics (el, {arg, modifiers}) {
  return function () {
    if (modifiers.notification) return haptics.notification(arg)
    if (arg) return haptics.impact(arg)
    return haptics.general()
  }
}

Vue.directive("haptic", {
  bind: (el, bindings) => el.addEventListener("click", useHaptics(el, bindings)),
  // update: el => el.addEventListener("click", hapticsCb),
  unbind: (el, bindings) => el.removeEventListener("click", useHaptics(el, bindings))
})