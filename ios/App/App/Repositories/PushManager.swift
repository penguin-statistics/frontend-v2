//
//  ConfigManager.swift
//  App
//
//  Created by Galvin Gao on 2021/1/28.
//

import Foundation
import Alamofire

struct Preference: Codable {
    var locale: String
    var server: String
    var category: String
}

struct RegistrationRequest: Codable {
    var deviceToken: String
    var platform: String
    var preferences: [Preference]
}

class PushManager {
    public static let shared = PushManager()
    
    let lastSyncedDeviceTokenKey = "push.lastSuccessfullySyncedDeviceToken".withBundleIdentifier()
    let lastSyncedPushPreferencesKey = "push.lastSuccessfullySyncedPushPreferences".withBundleIdentifier()
    
    var stalePreferences: [Preference]?
    
    private func pushSubscriptionDidSucceeded(for token: String, with preferences: [Preference]) {
        UserDefaults.standard.set(token, forKey: lastSyncedDeviceTokenKey)
        
        do {
            let encoded = try JSONEncoder().encode(preferences).toString() ?? ""
            UserDefaults.standard.set(encoded, forKey: lastSyncedPushPreferencesKey)
        } catch { print(error) }
    }
    
    public func getLastSyncedPushPreferences() -> [Preference]? {
        guard let preferences = UserDefaults.standard.string(forKey: lastSyncedPushPreferencesKey)?.data(using: .utf8) else {
            return nil
        }
        
        do {
            let decoded = try JSONDecoder().decode([Preference].self, from: preferences)
            return decoded
        } catch { print(error) }
        
        return nil
    }
    
    public func register(with preferences: [Preference]) {
        let lastToken = UserDefaults.standard.string(forKey: lastSyncedDeviceTokenKey)
        if lastToken == nil {
            self.stalePreferences = preferences
            return
        }
        self.register(for: lastToken!, with: preferences)
    }
    
    private func register(for token: String, with preferences: [Preference]?) {
        let pref = preferences ?? []
        let params = RegistrationRequest.init(deviceToken: token, platform: "IOS", preferences: pref)
        
//        let jsonString = String(data: jsonData, encoding: .utf8)!
        
        #if DEBUG
        
        AF.request("http://10.6.6.150:8105/registration", method: .put, parameters: params.dictionary, encoding: JSONEncoding.default, headers: [HTTPHeader(name: "Content-Type", value: "application/json")]).response { (response) in
            if let error = response.error {
                print("registration error", error)
                return
            }
            print("registered with param", params, "with response", response.data?.toString() ?? "nil")
            self.pushSubscriptionDidSucceeded(for: token, with: pref)
        }
        
        #endif
    }
    
    private func revokeToken(for token: String) {
        AF.request("http://10.6.6.150:8105/registration/" + token, method: .delete).response { (response) in
            print("revoked token", response)
        }
    }
    
    public func didRegisterForRemoteNotificationsWithDeviceToken(deviceToken: Data) {
        let lastToken = UserDefaults.standard.string(forKey: lastSyncedDeviceTokenKey)
        let currentToken = deviceToken.hexEncodedString()
        
        print("lastToken", lastToken ?? "nil", "currentToken", currentToken)
        
        #if DEBUG
        
        if lastToken != currentToken {
            // token changed. revoke last one if have any, and start registering for new one
            if lastToken != nil {
                self.revokeToken(for: lastToken!)
            }
            
            self.register(for: currentToken, with: self.stalePreferences)
        }
        
        #endif
    }
}
