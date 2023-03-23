//
//  IntentExtensions.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 3/23/23.
//

import Foundation
import Intents

public extension PenguinDynamicServer {
    // synced property is PenguinDynamicServer(identifier: "synced", display: "PenguinDynamicServerTitleSyncWithApp"),
    static func createSynced() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "synced", display: NSLocalizedString("PenguinDynamicServerTitleSyncWithApp", comment: ""))
    }
    
    static func createCN() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "CN", display: NSLocalizedString("PenguinDynamicServerTitleCN", comment: ""))
    }
    
    static func createUS() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "US", display: NSLocalizedString("PenguinDynamicServerTitleUS", comment: ""))
    }
    
    static func createJP() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "JP", display: NSLocalizedString("PenguinDynamicServerTitleJP", comment: ""))
    }
    
    static func createKR() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "KR", display: NSLocalizedString("PenguinDynamicServerTitleKR", comment: ""))
    }
    
    static func createDefault() -> PenguinDynamicServer {
        return self.createSynced()
    }
    
    func resolve() -> PenguinServer {
        switch self.identifier {
        case "synced":
            return self.resolveSynced()
        case "CN":
            return PenguinServer.cn
        case "US":
            return PenguinServer.us
        case "JP":
            return PenguinServer.jp
        case "KR":
            return PenguinServer.kr
        default:
            return self.resolveSynced()
        }
    }
    
    private func resolveSynced() -> PenguinServer {
        guard let sharedState = UserDefaults(suiteName: "group.io.penguinstats.app.public-shared") else {
            return .cn
        }
        
        guard let serverString = sharedState.string(forKey: "server") else {
            return .cn
        }
        
        return PenguinServer.fromString(serverString)
    }
}

