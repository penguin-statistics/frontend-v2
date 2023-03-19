//
//  SiteStats.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import Foundation
import SwiftUI
import UIKit

struct ItemStats {
    let id: String
    let name: String
    
    let times: Int
    let quantity: Int
    
    func image() -> AnyView {
        let imageName = "item_" + self.id
        // if img does not exist, return a placeholder
        if let img = UIImage(named: imageName) {
            return AnyView(Image(uiImage: img).resizable())
        }
        return AnyView(Circle().fill(Color.gray.opacity(0.3)))
    }
    
    func percentage() -> String {
        let percentage = Double(self.quantity) / Double(self.times)
        return String(format: "%.1f%%", percentage * 100)
    }
}

struct StageStats {
    let stageId: String
    let zoneId: String
    let stageCode: String
    let items: [ItemStats]
    let recentTimes: Int
}

enum DemoType {
    case zhRegular
    case zhExtraLong
    case enRegular
    case enExtraLong
}

struct SiteStats {
    let stages: [StageStats]
    var server: PenguinServer
    
    static func demo(_ type: DemoType) -> SiteStats {
        switch type {
        case .zhRegular:
            return SiteStats(
                stages: [
                    StageStats(
                        stageId: "act18side_06",
                        zoneId: "act18side_zone1",
                        stageCode: "LE-6",
                        items: [
                            ItemStats(
                                id: "30093",
                                name: "研磨石",
                                times: 362279,
                                quantity: 244784
                            )
                        ],
                        recentTimes: 43007
                    ),
                    StageStats(
                        stageId: "act18side_07",
                        zoneId: "act18side_zone1",
                        stageCode: "LE-7",
                        items: [
                            ItemStats(
                                id: "31043",
                                name: "半自然溶剂",
                                times: 85254,
                                quantity: 59608
                            )
                        ],
                        recentTimes: 13131
                    ),
                    StageStats(
                        stageId: "act18side_05",
                        zoneId: "act18side_zone1",
                        stageCode: "LE-5",
                        items: [
                            ItemStats(
                                id: "30023",
                                name: "糖组",
                                times: 63165,
                                quantity: 52632
                            )
                        ],
                        recentTimes: 10265
                    )
                ],
                server: .cn
            )
        case .zhExtraLong:
            return SiteStats(
                stages: Array(repeating: StageStats(
                    stageId: "main-01_07",
                    zoneId: "unknown",
                    stageCode: "达拉崩吧班得贝迪苏打麻辣香锅卜多比鲁翁",
                    items: [
                        ItemStats(
                            id: "30011",
                            name: "超级长的名字他叫昆图库塔卡提考特苏瓦西拉松",
                            times: 453234,
                            quantity: 324523
                        )
                    ],
                    recentTimes: 53629
                ), count: 3),
                server: .cn
            )
        case .enRegular:
            return SiteStats(
                stages: Array(repeating: StageStats(
                    stageId: "unknown",
                    zoneId: "unknown",
                    stageCode: "PG-1",
                    items: [
                        ItemStats(
                            id: "30023",
                            name: "Sugar Pack",
                            times: .random(in: 10000..<50000),
                            quantity: .random(in: 10000..<50000)
                        )
                    ],
                    recentTimes: .random(in: 10000..<50000)
                ), count: 3),
                server: .cn
            )
        case .enExtraLong:
            return SiteStats(
                stages: Array(repeating: StageStats(
                    stageId: "main-01_07",
                    zoneId: "unknown",
                    stageCode: "Never gonna give you up",
                    items: [
                        ItemStats(
                            id: "30011",
                            name: "Never gonna let you down, Never gonna run around and desert you",
                            times: 453234,
                            quantity: 324523
                        )
                    ],
                    recentTimes: 53629
                ), count: 3),
                server: .cn
            )
        }
    }
}
