import { Share } from "@capacitor/share";

export default function(content) {
  return Share.share(content);
}
