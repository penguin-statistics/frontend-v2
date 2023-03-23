//
//  IntentHandler.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 3/22/23.
//

import Foundation
import Intents

extension PenguinDynamicServer {
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
