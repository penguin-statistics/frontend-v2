//
//  PenguinPlugin.swift
//  App
//
//  Created by Galvin Gao on 2020/9/28.
//

import Capacitor
import CoreSpotlight
import RxBus
import RxSwift
import CoreHaptics

@objc(PenguinPlugin)
public class PenguinPlugin: CAPPlugin {
    
    public override func load() {
        RxBus.shared.asObservable(event: Events.NetworkPathChanged.self, sticky: true).subscribe { event in
            print("got NetworkPathChanged event", event)
//            let jsonData = try! JSONEncoder().encode(event.element!)
            self.emitPenguinEvent(on: "networkPathChanged", with: event.element!)
        }
    }
    
    @objc func emitPenguinEvent(on listener: String, with content: Any) {
        print("emitting penguin event to listener", listener, "with content", content)
        self.notifyListeners(listener, data: [
            "value": content
        ])
    }
    
    @objc func hapticsGeneral(_ call: CAPPluginCall) {
        let intensity = call.getFloat("intensity") ?? 0.85
        if #available(iOS 13.0, *) {
            UIImpactFeedbackGenerator(style: .light).impactOccurred(intensity: CGFloat(intensity))
        } else {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        }
        call.success()
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
