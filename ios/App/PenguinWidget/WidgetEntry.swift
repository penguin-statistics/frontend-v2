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
    func demoStats(with language: String? = Locale.current.languageCode, in server: PenguinServer = .cn) -> SiteStats {
        var demo = SiteStats.demo(language == "zh" ? .zhRegular : .enRegular)
        demo.server = server
        return demo
    }
    
    func placeholder(in context: Context) -> WidgetTimelineEntry {
        return WidgetTimelineEntry(
            date: Date(),
            stats: demoStats()
        )
    }

    func getSnapshot(for configuration: SelectServerIntent, in context: Context, completion: @escaping (WidgetTimelineEntry) -> ()) {
        let demoEntry = WidgetTimelineEntry(
            date: Date(),
            stats: demoStats(in: configuration.server)
        )
        
        getStats(for: configuration.server, timeout: TimeInterval(5.0)) { (stats) in
            if stats != nil {
                completion(WidgetTimelineEntry(
                    date: Date(),
                    stats: stats!
                ))
            } else {
                // nothing...
                completion(demoEntry)
                return
            }
        }
    }

    func getTimeline(for configuration: SelectServerIntent, in context: Context, completion: @escaping (Timeline<WidgetTimelineEntry>) -> ()) {
        print("serverSelection timeline with configured server:", configuration.server)
        
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
