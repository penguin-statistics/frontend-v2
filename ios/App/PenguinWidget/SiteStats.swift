//
//  SiteStats.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import Foundation
import SwiftUI

struct ItemStats {
    let id: String
    let name: String
    
    let times: Int
    let quantity: Int
    
    func image() -> Image {
        return Image("item_" + self.id)
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
    let server: Servers
    
    static func demo(_ type: DemoType) -> SiteStats {
        switch type {
        case .zhRegular:
            return SiteStats(
                stages: [
                    StageStats(
                        stageId: "main-01_07",
                        zoneId: "unknown",
                        stageCode: "1-7",
                        items: [
                            ItemStats(
                                id: "30012",
                                name: "固源岩",
                                times: 329752,
                                quantity: 265096
                            )
                        ],
                        recentTimes: 300
                    ),
                    StageStats(
                        stageId: "main-04_0112",
                        zoneId: "unknown",
                        stageCode: "1-8",
                        items: [
                            ItemStats(
                                id: "30012",
                                name: "固源岩",
                                times: 324534,
                                quantity: 3425234
                            )
                        ],
                        recentTimes: 300
                    ),
                    StageStats(
                        stageId: "main-08_0421",
                        zoneId: "unknown",
                        stageCode: "4-8",
                        items: [
                            ItemStats(
                                id: "30012",
                                name: "固源岩",
                                times: 454532,
                                quantity: 462256
                            )
                        ],
                        recentTimes: 300
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
                    recentTimes: 300
                ), count: 3),
                server: .cn
            )
        case .enRegular:
            return SiteStats(
                stages: Array(repeating: StageStats(
                    stageId: "main-01_07",
                    zoneId: "unknown",
                    stageCode: "4-8",
                    items: [
                        ItemStats(
                            id: "30094",
                            name: "Grindstone Pentahydrate",
                            times: 2343433,
                            quantity: 1234123
                        )
                    ],
                    recentTimes: 300
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
                    recentTimes: 300
                ), count: 3),
                server: .cn
            )
        }
    }
}
