//
//  PenguinPlugin.swift
//  App
//
//  Created by Galvin Gao on 2020/9/28.
//

import Capacitor
import CoreSpotlight
//import RxBus
//import RxSwift
import CoreHaptics
import WidgetKit

@objc(PenguinPlugin)
public class PenguinPlugin: CAPPlugin {
    let currentUserActivityKey = "CurrentUserActivity"

    @objc func listenerReady(_ call: CAPPluginCall) {
//        RxBus.shared.asObservable(event: Events.NetworkPathChanged.self, sticky: true).subscribe { event in
//            print("got NetworkPathChanged event", event)
//            let jsonData = try! JSONEncoder().encode(event.element!)
//            self.emitPenguinEvent(on: "networkPathChanged", with: jsonData.toString())
//        }
    }

    @objc func emitPenguinEvent(on listener: String, with content: String?) {
        print("emitting penguin event to listener", listener, "with content", content ?? "null")
        self.notifyListeners(listener, data: [
            "value": content ?? "null"
        ])
    }

    @objc func hapticsGeneral(_ call: CAPPluginCall) {
        let intensity = call.getFloat("intensity") ?? 0.85
        if #available(iOS 13.0, *) {
            UIImpactFeedbackGenerator(style: .light).impactOccurred(intensity: CGFloat(intensity))
        } else {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        }
        call.resolve()
    }

    @objc func getLocalizationEnvironment(_ call: CAPPluginCall) {
        call.resolve([
            "locale": NSLocale.current.identifier
        ])
    }

    @objc func getRegion(_ call: CAPPluginCall) {
        call.resolve([
            "region": Locale.current.regionCode
        ])
    }

    @objc func updateSpotlightItems(_ call: CAPPluginCall) {
        guard let items = call.getArray("items", [String: Any].self) else {
            call.reject("Missing required parameter `items`")
            return
        }

        let indexName = call.getString("spotlightIndexName") ?? "penguinDefault"

        let queue = DispatchQueue.init(label: "SpotlightDispatchQueue", qos: .utility, attributes: .initiallyInactive, autoreleaseFrequency: .inherit, target: .main)

        queue.async {
            let spotlightIndex = CSSearchableIndex.init(name: indexName)
            spotlightIndex.deleteAllSearchableItems { error in
                spotlightIndex.beginBatch()

                for (index, item) in items.enumerated() {
                    guard let id = item["id"] as? String else {
                        call.reject("Missing required parameter `id` on item index \(index)")
                        return
                    }
                    guard let title = item["title"] as? String else {
                        call.reject("Missing required parameter `title` on item index \(index)")
                        return
                    }
                    guard let description = item["description"] as? String else {
                        call.reject("Missing required parameter `description` on item index \(index)")
                        return
                    }
                    guard let path = item["path"] as? String else {
                        call.reject("Missing required parameter `path` on item index \(index)")
                        return
                    }

                    var url = URLComponents(string: "https://penguin-stats.io/")
                    url?.path = path

                    let attrs = CSSearchableItemAttributeSet()
                    attrs.url = url?.url
                    attrs.title = title
                    attrs.contentDescription = description
                    attrs.domainIdentifier = "https://penguin-stats.io"
                    attrs.downloadedDate = Date()

                    spotlightIndex.indexSearchableItems([CSSearchableItem(uniqueIdentifier: id, domainIdentifier: id.withBundleIdentifier(), attributeSet: attrs)])
                }

                spotlightIndex.endBatch(withClientState: Data()) { error in
                    print("Failed to endBatch with error \(String(describing: error))")
                }
            }

            call.resolve()
        }
    }

    @objc func updateCurrentUserActivity(_ call: CAPPluginCall) {
        let id = call.getString("id") ?? "io.penguinstats.app.UndefinedUserActivity"
        let title = call.getString("title")
        let description = call.getString("description")
        let path = call.getString("path") ?? "/"
        var urlComponent = URLComponents(string: "https://penguin-stats.io/")
        urlComponent?.path = path
        let url = urlComponent?.url

        let last = PersistenceManager.shared.getItem(key: currentUserActivityKey) as? NSUserActivity
        if last != nil {
            last!.invalidate()
        }

        // MARK: CSSearchableItemAttributeSet for NSUserActivity
        var userActivityAttributeSet: CSSearchableItemAttributeSet
        if #available(iOS 14.0, *) {
            userActivityAttributeSet = CSSearchableItemAttributeSet(contentType: .url)
        } else {
            userActivityAttributeSet = CSSearchableItemAttributeSet()
        }
        userActivityAttributeSet.url = url
        userActivityAttributeSet.title = title
        userActivityAttributeSet.contentDescription = description
        userActivityAttributeSet.domainIdentifier = id
        userActivityAttributeSet.contentModificationDate = Date()

        // MARK: NSUserActivity
        let activity = NSUserActivity(activityType: id)
        activity.isEligibleForHandoff = true
        if #available(iOS 12.0, *) {
            activity.isEligibleForPrediction = true
        }
        activity.webpageURL = url
        activity.requiredUserInfoKeys = Set([])
        activity.contentAttributeSet = userActivityAttributeSet
        activity.title = title
        
        PersistenceManager.shared.setItem(activity, forKey: currentUserActivityKey)
        activity.becomeCurrent()

        call.resolve()
    }

    @objc func openBundleSettings(_ call: CAPPluginCall) {
        guard let settingsUrl = URL(string: UIApplication.openSettingsURLString) else {
            call.reject("failed to initialize url instance")
            return
        }

        DispatchQueue.main.async {
            UIApplication.shared.open(settingsUrl) { (success) in
                print("Bundle settings opened?: \(success)")
                if success {
                    call.resolve()
                } else {
                    call.reject("failed to open bundle settings")
                }
            }
        }
    }

    @objc func getLastSyncedPushPreferences(_ call: CAPPluginCall) {
        guard let preferences = PushManager.shared.getLastSyncedPushPreferences() else {
            call.resolve([
                "preferences": []
            ])
            return
        }
        print(preferences)
        do {
            let json = try JSONEncoder().encode(preferences).toString() ?? ""
            print(json)
            call.resolve([
                "preferences": json
            ])
        } catch {
            call.reject("failed to serialize message", error.localizedDescription)
            print("failed to serialize message", error)
            return
        }
    }

    @objc func submitNewPushPreferences(_ call: CAPPluginCall) {
        guard let preferences = call.getArray("preferences", [String: Any].self) else {
            call.reject("Missing required parameter `preferences`")
            return
        }

        var unmarshalled: [Preference] = []

        for (index, preference) in preferences.enumerated() {
            guard let locale = preference["locale"] as? String else {
                call.reject("Missing required parameter `locale` on item index \(index)")
                return
            }
            guard let server = preference["server"] as? String else {
                call.reject("Missing required parameter `server` on item index \(index)")
                return
            }
            guard let category = preference["category"] as? String else {
                call.reject("Missing required parameter `category` on item index \(index)")
                return
            }

            unmarshalled.append(Preference(locale: locale, server: server, category: category))
        }

        PushManager.shared.register(with: unmarshalled)
        call.resolve()
    }

    @objc func updateSharedState(_ call: CAPPluginCall) {
        guard let server = call.getString("server") else {
            call.reject("Missing required parameter `server`")
            return
        }

        guard let themeStyle = call.getString("themeStyle") else {
            call.reject("Missing required parameter `themeStyle`")
            return
        }

        // put shared state into group.io.penguinstats.app.public-shared
        guard let sharedState = UserDefaults(suiteName: "group.io.penguinstats.app.public-shared") else {
            call.reject("failed to initialize shared state")
            return
        }

        var needUpdate = false
        if let lastServer = sharedState.string(forKey: "server") {
            needUpdate = lastServer != server
        } else {
            needUpdate = true
        }
        if let lastThemeStyle = sharedState.string(forKey: "themeStyle") {
            needUpdate = lastThemeStyle != themeStyle
        } else {
            needUpdate = true
        }

        sharedState.set(server, forKey: "server")
        sharedState.set(themeStyle, forKey: "themeStyle")

        if needUpdate {
            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
            
            var alternateIconName: String? = nil
            if themeStyle == "seaborn" {
                // randomly choose Seaborn0 and Seaborn1
                alternateIconName = "Seaborn\(Int.random(in: 0...1))"
            }

            DispatchQueue.main.async {
                let currentAlternateIconName = UIApplication.shared.alternateIconName
                if currentAlternateIconName != alternateIconName && currentAlternateIconName?.hasSuffix("Seaborn") != alternateIconName?.hasSuffix("Seaborn") {
                    UIApplication.shared.setAlternateIconName(alternateIconName)
                }
            }
        }
        call.resolve()
    }
}
