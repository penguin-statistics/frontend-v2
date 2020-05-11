import Console from "@/utils/Console";

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`)
    .then (result => {
      Console.log("ServiceWorker", "successfully replaced to a no-op SW", result)
    })
    .catch (error => {
      Console.error("ServiceWorker", "failed to replace to a no-op SW", error)
    })
}
