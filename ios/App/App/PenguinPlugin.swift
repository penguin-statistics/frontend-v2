//
//  PenguinPlugin.swift
//  App
//
//  Created by Galvin Gao on 2020/9/28.
//

import Capacitor
import CoreSpotlight

@objc(PenguinPlugin)
public class PenguinPlugin: CAPPlugin {
    
    public override func load() {
        NotificationCenter.default.addObserver(self, selector: #selector(handlePenguinTriggerJSEvent), name: Notification.Name("PenguinTriggerJSEvent"), object: nil)
    }
    
    @objc func handlePenguinTriggerJSEvent(noti: Notification) {
        CAPLog.print("triggering penguin js event with notification userInfo", noti.userInfo?["value"])
//        self.bridge.triggerWindowJSEvent(eventName: "penguinNativeNavigate", data: noti.userInfo?["value"] as? String ?? "")
        self.notifyListeners("eventBus", data: noti.userInfo as? [String : Any])
    }
    
  @objc func getLocalizationEnvironment(_ call: CAPPluginCall) {
    let jsonEncoder = JSONEncoder()
    let jsonData = try! jsonEncoder.encode(NSLocale.current.identifier)
    let json = String(data: jsonData, encoding: String.Encoding.utf8)
    
    call.success([
        "locale": json!
    ])
  }
    
    @objc func getRegion(_ call: CAPPluginCall) {
      let jsonEncoder = JSONEncoder()
        let jsonData = try! jsonEncoder.encode(Locale.current.regionCode)
      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      
      call.success([
          "region": json!
      ])
    }
    
//    @objc func addSearchableItem(_ call: CAPPluginCall) {
//        let item = call.getObject("item")
//
//        // create dummy data
//        let attributeSet = CSSearchableItemAttributeSet.init(itemContentType: item?["type"] as? String ?? "txt")
//        attributeSet.setValue(item?["displayName"], forKey: "displayName")
//        attributeSet.setValue(URL.init(string: "https://penguin-stats.cn"), forKey: "contentURL")
//        attributeSet.setValue(item?["keywords"] as? [String], forKey: "keywords")
//        let searchableItem = CSSearchableItem.init(uniqueIdentifier: item?["id"] as? String, domainIdentifier: item?["group"] as? String, attributeSet: attributeSet)
//
//        // add to on-device default index (for the app?)
//        CSSearchableIndex.default().indexSearchableItems([searchableItem]) { error in
//            if let error = error {
//                call.reject("Indexing error: \(error.localizedDescription)")
//            } else {
//                call.success()
//            }
//        }
//    }
}
