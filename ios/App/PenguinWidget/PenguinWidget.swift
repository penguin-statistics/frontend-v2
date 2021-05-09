//
//  PenguinWidget.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import WidgetKit
import SwiftUI

@main
struct PenguinWidget: Widget {
    let kind: String = "PenguinWidget"
    let name: LocalizedStringKey = "SiteStatsWidgetName"
    let description: LocalizedStringKey = "SiteStatsWidgetDesc"

    var body: some WidgetConfiguration {
        IntentConfiguration(
            kind: kind,
            intent: StatisticsOverviewIntent.self,
            provider: SiteStatsProvider()
        ) { entry in
            WidgetEntry(entry: entry)
        }
        .configurationDisplayName("SiteStatsWidgetName")
        .description("SiteStatsWidgetDesc")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

