//
//  PenguinWidget.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import WidgetKit
import SwiftUI

@main
struct PenguinWidgets: WidgetBundle {
    var body: some Widget {
        PenguinWidget()
        PenguinLiveActivityWidget()
    }
}

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


@available(iOS 16.0, iOSApplicationExtension 16.0, *)
struct PenguinLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(attributesType: PenguinLiveAttributes.self) { context in
            VStack {
                Text("Name: \(context.attributes.sessionName)")
                Text("Report: \(context.state.reportCount)")
            }.activityBackgroundTint(.cyan)
        }
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
