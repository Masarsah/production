self.addEventListener("push", (event) => {
    console.log("Push event received:", event);
  if (!event.data) return;
  const data = event.data.json();
  const title = data.title || "Notification";
  const options = {
    body: data.body || "",
    icon: "/logo.png", // change to your logo if you like
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});



<google className="com"></google>