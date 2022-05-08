//
//  WidgetEntry.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import WidgetKit
import SwiftUI
import Intents
import Alamofire

struct SiteStatsProvider: IntentTimelineProvider {
    func placeholder(in context: Context) -> WidgetTimelineEntry {
        return WidgetTimelineEntry(
            date: Date(),
            stats: SiteStats.demo(.zhRegular)
        )
    }

    func getSnapshot(for configuration: StatisticsOverviewIntent, in context: Context, completion: @escaping (WidgetTimelineEntry) -> ()) {
        let entry = WidgetTimelineEntry(
            date: Date(),
            stats: SiteStats.demo(.zhRegular)
        )
        completion(entry)
    }

    func getTimeline(for configuration: StatisticsOverviewIntent, in context: Context, completion: @escaping (Timeline<WidgetTimelineEntry>) -> ()) {
        print("serverSelection timeline with configured server:", configuration.server.string())
        
        print("doing network request")
        getStats(for: configuration.server) { (stats) in
            
            if stats != nil {
                print("got stats", stats ?? "undefined")
                let entries: [WidgetTimelineEntry] = [
                    WidgetTimelineEntry(
                        date: Date(),
                        stats: stats!
                    )
                ]
                let timeline = Timeline(entries: entries, policy: .atEnd)
                completion(timeline)
            } else {
                // nothing...
                completion(Timeline(entries: [], policy: .atEnd))
                return
            }
            
        }
        
        
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
