//
//  IntentHandler.swift
//  PenguinWidgetConfigurationIntentExtension
//
//  Created by Galvin Gao on 3/23/23.
//

import Intents

class IntentHandler: INExtension, SelectServerIntentHandling {
    func provideDynamicServerOptionsCollection(for intent: SelectServerIntent) async throws -> INObjectCollection<PenguinDynamicServer> {
        // Iterate the available servers, creating
        // a PenguinDynamicServer for each one.
        let servers: [PenguinDynamicServer] = [
            .createSynced(),
            .createCN(),
            .createUS(),
            .createJP(),
            .createKR(),
        ]

        print("providing dynamic server options collection: \(servers)")

        // Create a collection with the array of servers.
        return INObjectCollection(items: servers)
    }
    
    func defaultDynamicServer(for intent: SelectServerIntent) -> PenguinDynamicServer? {
        return PenguinDynamicServer.createSynced()
    }
}

