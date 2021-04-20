import UIKit
import CoreSpotlight
import Capacitor
import SwiftUI
import Network

import RxBus
import RxSwift
import os

let alreadyLaunchedKey = "alreadyLaunched"

@available(iOS 13.0, *)
class SheetDismisserProtocol: ObservableObject {
    weak var host: UIHostingController<AnyView>? = nil

    func dismiss() {
        host?.dismiss(animated: true)
        UserDefaults.standard.set(true, forKey: alreadyLaunchedKey)
    }
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    var shortcutItemToProcess: UIApplicationShortcutItem?
    
    func navigateTo(_ path: String) {
        guard var components = URLComponents(string: "https://penguin-stats.io/") else { return }
        
        components.path = path
        CAPLog.print("navigating to path", path)
        
        let options: [UIApplication.OpenURLOptionsKey : Any] = [:]
        _ = CAPBridge.handleOpenUrl(components.url!, options)
    }
    
    #if DEBUG    
    @objc @available(iOS 13.0, *)
    func openDebugger(_ sender: UITapGestureRecognizer) {
        let debuggerView = Debugger()
        let host = UIHostingController(rootView: debuggerView)
        
        window?.rootViewController?.present(host, animated: true, completion: nil)
    }
    #endif
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // common controllers
        let root = window?.rootViewController
        let rootView = root?.view
        
        // MARK: Capacitor enhancements on WebView
        
        // set background to black to retain visual consistancy
        rootView?.backgroundColor = UIColor.black
        
        // enable bounces since Capacitor seems to disabled it
        rootView?.scrollView.bounces = true
        
        // disable pinch gesture
        rootView?.scrollView.pinchGestureRecognizer?.isEnabled = false
        
        // disable long-press selection haptic feedback
//        let fakedLongPress: UILongPressGestureRecognizer = UILongPressGestureRecognizer(target: nil, action: nil)
//        fakedLongPress.minimumPressDuration = 0.1
//
//        rootView?.addGestureRecognizer(fakedLongPress)
        
        // MARK: ask for notifications permission
//        let center = UNUserNotificationCenter.current()
//        center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
//            if granted {
//                DispatchQueue.main.async(execute: UIApplication.shared.registerForRemoteNotifications)
//            }
//        }
        
        
        // MARK: save shortcut to process
        if let shortcutItem = launchOptions?[UIApplication.LaunchOptionsKey.shortcutItem] as? UIApplicationShortcutItem {
            shortcutItemToProcess = shortcutItem
        }
        
        // MARK: add debugger
        #if DEBUG
        
        if #available(iOS 13.0, *) {
            let debuggerBtn = UIButton(frame: CGRect(
                                        x: UIScreen.main.bounds.maxX - 80 - 18,
                                        y: UIScreen.main.bounds.maxY - 36 - 108,
                                        width: 80,
                                        height: 36
            ))
            debuggerBtn.backgroundColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.8)
            debuggerBtn.setTitle("Debugger", for: .normal)
            debuggerBtn.setTitleColor(UIColor.blue, for: .normal)
            debuggerBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 12.0)
            debuggerBtn.layer.cornerRadius = 4
            debuggerBtn.layer.shadowRadius = 8
            debuggerBtn.layer.shadowOffset = CGSize(width: 0, height: 0)
            debuggerBtn.layer.shadowColor = CGColor.init(gray: 0.0, alpha: 1.0)
            debuggerBtn.layer.shadowOpacity = 0.6
            debuggerBtn.layer.shouldRasterize = true
            debuggerBtn.layer.rasterizationScale = UIScreen.main.scale

            let gesture = UITapGestureRecognizer(target: self, action: #selector(self.openDebugger))
            debuggerBtn.addGestureRecognizer(gesture)

            root?.view.addSubview(debuggerBtn)
        }
        
        #endif
        
        if #available(iOS 12.0, *) {
            let monitor = NWPathMonitor()
            
            monitor.pathUpdateHandler = { path in
                var isConstrained = false
                
                if #available(iOS 13.0, *) {
                    isConstrained = path.isConstrained
                }
                
                RxBus.shared.post(event: Events.NetworkPathChanged(
                    isConstrained: isConstrained,
                    isIPv4Supported: path.supportsIPv4,
                    isIPv6Supported: path.supportsIPv6
                ), sticky: true)
            }

            monitor.start(queue: DispatchQueue.global(qos: .background))
        }
        
        if let options = launchOptions {
            let notif = options[UIApplication.LaunchOptionsKey.remoteNotification] as? [NSDictionary]
            print("remote notification launch option", notif ?? "null")
        }
        
        #if DEBUG
        
        // MARK: CSSearchableItemAttributeSet for CSSearchableItem
        
//        var searchableItemAttributeSet: CSSearchableItemAttributeSet
//        if #available(iOS 14.0, *) {
//            searchableItemAttributeSet = CSSearchableItemAttributeSet(contentType: .url)
//        } else {
//            searchableItemAttributeSet = CSSearchableItemAttributeSet()
//        }
//
//
//        let url = URL(string: "https://penguin-stats.io/report")
//        searchableItemAttributeSet.url = url
//        searchableItemAttributeSet.title = "PenguinTestReport"
//        searchableItemAttributeSet.contentDescription = "Penguin Test Report!"
//
//        // MARK: CSSearchableItem
//
//        let item = CSSearchableItem(uniqueIdentifier: "PenguinTest", domainIdentifier: "io.penguinstats.app.PenguinTest", attributeSet: searchableItemAttributeSet)
//
//        CSSearchableIndex.default().deleteAllSearchableItems()
//        CSSearchableIndex.default().indexSearchableItems([item]) { error in
//            if let error = error {
//                print("Indexing error: \(error.localizedDescription)")
//            } else {
//                print("Search item successfully indexed!")
//            }
//        }
        
        #endif
        
        
        
        
        
        return true
    }
    
    func application(_ application: UIApplication, performActionFor shortcutItem: UIApplicationShortcutItem, completionHandler: @escaping (Bool) -> Void) {
        CAPLog.print("application launched with shortcutItem", shortcutItem)
        // Alternatively, a shortcut item may be passed in through this delegate method if the app was
        // still in memory when the Home screen quick action was used. Again, store it for processing.
        shortcutItemToProcess = shortcutItem
        
        completionHandler(true)
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
        UIApplication.shared.applicationIconBadgeNumber = 0
        
        let root = window?.rootViewController
        
        // MARK: process shortcutItem
        CAPLog.print("application did become active. shortcutItemToProcess: ", shortcutItemToProcess ?? "")
        
        if let shortcutItem = shortcutItemToProcess {
            if shortcutItem.type == ShortcutType.Search.rawValue {
                CAPLog.print("shortcutItem Search matched.")
                self.navigateTo("/search")
            }
            // Reset the shortcut item so it's never processed twice.
            shortcutItemToProcess = nil
        }
        
        // MARK: show welcome screen & ask for notification authorizations
        
        let alreadyLaunched = UserDefaults.standard.bool(forKey: alreadyLaunchedKey)
        let alwaysShowWhatsNew = UserDefaults.standard.bool(forKey: "alwaysShowWhatsNew")
        
        if alwaysShowWhatsNew || !alreadyLaunched {
            if #available(iOS 13.0, *) {
                let delegate = SheetDismisserProtocol()
                let welcomeView = InitialLaunch(delegate: delegate)

                let host = UIHostingController(rootView: AnyView(welcomeView))
                host.isModalInPresentation = true

                delegate.host = host

                root?.present(host, animated: true, completion: nil)
            } else {
                let alertController = UIAlertController(
                    title: NSLocalizedString("welcomeDeprecatedTitle", value: "Deprecated iOS", comment: "Title for alerting user their iOS support is deprecated"),
                    message: NSLocalizedString("welcomeDeprecatedSubtitle", value: "Your iOS version is already deprecated and thus may experience problems when using this App.", comment: "Content for alerting user their iOS support is deprecated and may expericence problems"),
                    preferredStyle: .alert
                )
                
                let okAction = UIAlertAction(
                    title: NSLocalizedString("welcomeDeprecatedConfirm", value: "OK", comment: "Button for OK - dismissing dialog"), style: .default) { _ in
                    UserDefaults.standard.set(true, forKey: alreadyLaunchedKey)
                }
                alertController.addAction(okAction)
                root?.present(alertController, animated: true, completion: nil)
            }
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
        print("application launched with userActivity.debugDesc", userActivity.debugDescription, "type", userActivity.activityType, "contentAttributeSet", userActivity.userInfo, "userInfo", userActivity.userInfo)
        print("got userinfo", userActivity.userInfo)
        
        let options: [UIApplication.OpenURLOptionsKey : Any] = [:]
        if userActivity.activityType == CSSearchableItemActionType && (userActivity.webpageURL != nil) {
            return CAPBridge.handleOpenUrl(userActivity.webpageURL!, options)
        } else if userActivity.contentAttributeSet?.url != nil {
            return CAPBridge.handleOpenUrl((userActivity.contentAttributeSet?.url)!, options)
        } else {
            return CAPBridge.handleContinueActivity(userActivity, restorationHandler)
        }
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
        CAPLog.print("registered device with deviceToken", deviceToken.hexEncodedString())
        NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidRegisterForRemoteNotificationsWithDeviceToken.name()), object: deviceToken)
        PushManager.shared.didRegisterForRemoteNotificationsWithDeviceToken(deviceToken: deviceToken)
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidFailToRegisterForRemoteNotificationsWithError.name()), object: error)
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                             willPresent notification: UNNotification,
                             withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        print("received remote notification", notification)
        completionHandler(.alert)
    }
    
    #endif
    
}

