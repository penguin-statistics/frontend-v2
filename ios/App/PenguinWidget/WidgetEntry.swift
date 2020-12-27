//
//  WidgetEntry.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import WidgetKit
import SwiftUI
import Intents

struct SiteStatsProvider: IntentTimelineProvider {
    func placeholder(in context: Context) -> WidgetTimelineEntry {
        
        return WidgetTimelineEntry(
            date: Date(),
            stats: SiteStats(stages: [StageStats(stageId: "---", stageCode: "---", items: [ItemStats(id: "---", name: "------", times: 1, quantity: 1)])], totalSanity: 0)
        )
    }

    func getSnapshot(for configuration: SelectServerIntent, in context: Context, completion: @escaping (WidgetTimelineEntry) -> ()) {
        print("serverSelection snapshot", configuration)
        print("serverSelection availableServers", ServerDetail.availableServers)
        
        let entry = WidgetTimelineEntry(
            date: Date(),
            stats: SiteStats.demo(.zhRegular)
        )
        completion(entry)
    }

    func getTimeline(for configuration: SelectServerIntent, in context: Context, completion: @escaping (Timeline<WidgetTimelineEntry>) -> ()) {
        print("serverSelection timeline", configuration)
        print("serverSelection availableServers", ServerDetail.availableServers)
        
        let entries: [WidgetTimelineEntry] = [
            WidgetTimelineEntry(
                date: Date(),
                stats: SiteStats.demo(.zhRegular)
            )
        ]

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct WidgetTimelineEntry: TimelineEntry {
    let date: Date
    let stats: SiteStats
}

struct WidgetEntry: View {
    @Environment(\.widgetFamily) private var widgetFamily
    var entry: SiteStatsProvider.Entry
    
    var body: some View {
        switch widgetFamily {
        case .systemSmall:
            SmallWidgetView(stats: entry.stats)
        case .systemMedium:
            MediumWidgetView(stats: entry.stats)
//        case .systemLarge:
//            LargeWidgetView(stats: entry.stats)
        default:
            MediumWidgetView(stats: entry.stats)
        }
    }
}

struct WidgetEntry_Previews: PreviewProvider {
    static var previews: some View {
        ForEach([
            WidgetFamily.systemSmall,
            WidgetFamily.systemMedium            
        ], id: \.self) { widgetFamily in
            WidgetEntry(entry: SiteStatsProvider.Entry(date: Date(), stats: SiteStats.demo(.zhRegular)))
                .environment(\.colorScheme, .dark)
                .environment(\.locale, .init(identifier: "zh"))
                .previewContext(WidgetPreviewContext(family: widgetFamily))
                .previewDisplayName("preview:" + widgetFamily.description)
        }
    }
}
