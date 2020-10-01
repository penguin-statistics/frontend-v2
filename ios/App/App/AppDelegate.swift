import UIKit
import CoreSpotlight
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?
  var shortcutItemToProcess: UIApplicationShortcutItem?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    
    CAPLog.print("application launched with launchOptions")
    CAPLog.print(launchOptions?[UIApplication.LaunchOptionsKey.shortcutItem] ?? "(launchOptions is empty)")
    
    if let shortcutItem = launchOptions?[UIApplication.LaunchOptionsKey.shortcutItem] as? UIApplicationShortcutItem {
        shortcutItemToProcess = shortcutItem
    }
    
    NotificationCenter.default.post(name: NSNotification.Name("PenguinTriggerJSEvent"), object: [], userInfo: ["type": "debug", "value": launchOptions?[UIApplication.LaunchOptionsKey.shortcutItem] ?? "(launchOptions is empty)"])
    
//    CAPBridge.triggerWindowJSEvent(eventName: "applicationDidLaunch", data: json)
    
    // Override point for customization after application launch.
    return true
  }
    
    func application(_ application: UIApplication, performActionFor shortcutItem: UIApplicationShortcutItem, completionHandler: @escaping (Bool) -> Void) {
        CAPLog.print("application launched with shortcutItem", shortcutItem)
        // Alternatively, a shortcut item may be passed in through this delegate method if the app was
        // still in memory when the Home screen quick action was used. Again, store it for processing.
        shortcutItemToProcess = shortcutItem
    }

  func applicationWillResignActive(_ application: UIApplication) {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
  }

  func applicationDidEnterBackground(_ application: UIApplication) {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
  }

  func applicationWillEnterForeground(_ application: UIApplication) {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
  }

  func applicationDidBecomeActive(_ application: UIApplication) {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    
    CAPLog.print("application did become active. shortcutItemToProcess: ", shortcutItemToProcess ?? "")
    
    if let shortcutItem = shortcutItemToProcess {
            // In this sample an alert is being shown to indicate that the action has been triggered,
            // but in real code the functionality for the quick action would be triggered.
//            let message = "\(shortcutItem.type) triggered"
//            let alertController = UIAlertController(title: "Quick Action", message: message, preferredStyle: .alert)
//            alertController.addAction(UIAlertAction(title: "Close", style: .default, handler: nil))
//            window?.rootViewController?.present(alertController, animated: true, completion: nil)

        if shortcutItem.type == "DateAction" {
            let url = "/result/stage/act13d0_zone1/act13d0_01"
            CAPLog.print("shortcutItem DateAction matched. handling as redirection to url", url)
//            CAPBridge.handleOpenUrl(URL.init(string: url)!, [:] as [UIApplication.OpenURLOptionsKey :
            NotificationCenter.default.post(name: NSNotification.Name("PenguinTriggerJSEvent"), object: [], userInfo: ["type": "navigate", "value": url])
        }
        
            // Reset the shortcut item so it's never processed twice.
            shortcutItemToProcess = nil
     }
    
    
  }

  func applicationWillTerminate(_ application: UIApplication) {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
  }

  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    // Called when the app was launched with a url. Feel free to add additional processing here,
    // but if you want the App API to support tracking app url opens, make sure to keep this call
    CAPLog.print("application launched with url ", url, " and options", options)
    CAPLog.print(url)
    CAPLog.print(options)
    return CAPBridge.handleOpenUrl(url, options)
  }
  
  func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    // Called when the app was launched with an activity, including Universal Links.
    // Feel free to add additional processing here, but if you want the App API to support
    // tracking app url opens, make sure to keep this call
    CAPLog.print("application launched with userActivity ", userActivity)
    
    return CAPBridge.handleContinueActivity(userActivity, restorationHandler)
  }

  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    super.touchesBegan(touches, with: event)

    let statusBarRect = UIApplication.shared.statusBarFrame
    guard let touchPoint = event?.allTouches?.first?.location(in: self.window) else { return }

    if statusBarRect.contains(touchPoint) {
      NotificationCenter.default.post(CAPBridge.statusBarTappedNotification)
    }
  }

  #if USE_PUSH

  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidRegisterForRemoteNotificationsWithDeviceToken.name()), object: deviceToken)
  }

  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidFailToRegisterForRemoteNotificationsWithError.name()), object: error)
  }

#endif

}

