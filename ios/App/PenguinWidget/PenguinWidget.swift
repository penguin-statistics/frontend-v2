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
            intent: SelectServerIntent.self,
            provider: SiteStatsProvider()
        ) { entry in
            WidgetEntry(entry: entry)
        }
        .configurationDisplayName("SiteStatsWidgetName")
        .description("SiteStatsWidgetDesc")
        .adaptedSupportedFamilies()
    }
}

extension WidgetConfiguration {
    func adaptedSupportedFamilies() -> some WidgetConfiguration {
        if #available(iOSApplicationExtension 16, *) {
            return self.supportedFamilies([
                .systemSmall,
                .systemMedium,
                .accessoryRectangular
            ])
        } else {
            return self.supportedFamilies([
                .systemSmall,
                .systemMedium
            ])
        }
    }
}
