//
//  PenguinLive.swift
//  App
//
//  Created by Galvin Gao on 2022/8/22.
//

import Foundation
import SwiftUI
import ActivityKit
import WidgetKit

struct PenguinLiveAttributes: ActivityAttributes {
    public typealias PenguinLiveStatus = ContentState
    
    public struct ContentState: Codable, Hashable {
        var reportCount: Int
    }
    
    var sessionName: String
}
