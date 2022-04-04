import { Capacitor } from "@capacitor/core";
import Console from "@/utils/Console";
import PenguinPlugin from "../plugins/PenguinPlugin";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

function invoke(method, ...args) {
  if (Capacitor.isPluginAvailable("Haptics")) {
    Console.info("Haptics", "invoking haptics", method, args);
    try {
      Haptics[method](...args);
    } catch (e) {
      Console.warn("Haptics", "failed to invoke haptics", e);
    }
  }
}

export default {
  light() {
    invoke("impact", {
      style: ImpactStyle.Heavy,
    });
  },

  error() {
    invoke("notification", {
      style: NotificationType.Error,
    });
  },

  warning() {
    invoke("notification", {
      style: NotificationType.Warning,
    });
  },

  success() {
    invoke("notification", {
      style: NotificationType.Success,
    });
  },

  general() {
    if (Capacitor.isPluginAvailable("PenguinPlugin")) {
      PenguinPlugin.hapticsGeneral();
    }
  },

  notification(type) {
    invoke("notification", type);
  },
  impact(style) {
    invoke("impact", style);
  },
};
