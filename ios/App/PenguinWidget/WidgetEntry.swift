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
    
    func demoStats(with language: String? = Locale.current.languageCode, in server: PenguinDynamicServer? = .createDefault()) -> SiteStats {
        var demo = SiteStats.demo(language == "zh" ? .zhRegular : .enRegular)
        demo.server = (server ?? .createDefault()).resolve()
        return demo
    }
    
    func placeholder(in context: Context) -> WidgetTimelineEntry {
        return WidgetTimelineEntry(
            date: Date(),
            stats: demoStats(),
            preferences: WidgetUserPreferences.getLatest(),
            originalConfiguration: WidgetUserOriginalConfiguration()
        )
    }

    func getSnapshot(for configuration: SelectServerIntent, in context: Context, completion: @escaping (WidgetTimelineEntry) -> ()) {
        let demoEntry = WidgetTimelineEntry(
            date: Date(),
            stats: demoStats(in: configuration.dynamicServer),
            preferences: WidgetUserPreferences.getLatest(),
            originalConfiguration: WidgetUserOriginalConfiguration.fromIntent(configuration)
        )
        
        getStats(for: configuration.dynamicServer, timeout: TimeInterval(5.0)) { (stats) in
            if stats != nil {
                completion(WidgetTimelineEntry(
                    date: Date(),
                    stats: stats!,
                    preferences: WidgetUserPreferences.getLatest(),
                    originalConfiguration: WidgetUserOriginalConfiguration.fromIntent(configuration)
                ))
            } else {
                // nothing...
                completion(demoEntry)
                return
            }
        }
    }

    func getTimeline(for configuration: SelectServerIntent, in context: Context, completion: @escaping (Timeline<WidgetTimelineEntry>) -> ()) {
        print("serverSelection timeline with configured server:", configuration.dynamicServer)
        
        getStats(for: configuration.dynamicServer) { (stats) in
            if stats != nil {
                print("got stats", stats ?? "undefined")
                let entries: [WidgetTimelineEntry] = [
                    WidgetTimelineEntry(
                        date: Date(),
                        stats: stats!,
                        preferences: WidgetUserPreferences.getLatest(),
                        originalConfiguration: WidgetUserOriginalConfiguration.fromIntent(configuration)
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

class WidgetUserOriginalConfiguration: ObservableObject {
    var dynamicServer: PenguinDynamicServer?
    
    init() {
        self.dynamicServer = nil
    }
    
    init(dynamicServer: PenguinDynamicServer?) {
        self.dynamicServer = dynamicServer
    }
    
    static func fromIntent(_ intent: SelectServerIntent) -> WidgetUserOriginalConfiguration {
        return .init(dynamicServer: intent.dynamicServer)
    }
}

struct WidgetTimelineEntry: TimelineEntry {
    let date: Date
    let stats: SiteStats
    let preferences: WidgetUserPreferences
    let originalConfiguration: WidgetUserOriginalConfiguration
}

extension WidgetTimelineEntry {
    static func demo(_ type: DemoType, theme: PenguinTheme = .default) -> WidgetTimelineEntry {
        return WidgetTimelineEntry(
            date: .distantFuture,
            stats: SiteStats.demo(type),
            preferences: WidgetUserPreferences(server: .cn, theme: theme),
            originalConfiguration: WidgetUserOriginalConfiguration())
    }
}

struct WidgetEntry: View {
    @Environment(\.widgetFamily) private var widgetFamily
    var entry: SiteStatsProvider.Entry
    
    var fallback: some View {
        MediumWidgetView(entry: entry)
    }
    
    @ViewBuilder var body: some View {
        switch widgetFamily {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .accessoryRectangular:
            if #available(iOSApplicationExtension 16.0, *) {
                AccessoryRectangularView(stats: entry.stats)
            } else {
                fallback
            }
        default:
            fallback
        }
    }
}

struct WidgetEntry_Previews: PreviewProvider {
    static var previews: some View {
        ForEach([
            WidgetFamily.systemSmall,
            WidgetFamily.systemMedium            
        ], id: \.self) { widgetFamily in
            WidgetEntry(entry: .demo(.zhRegular))
                .environment(\.colorScheme, .dark)
                .environment(\.locale, .init(identifier: "zh"))
                .previewContext(WidgetPreviewContext(family: widgetFamily))
                .previewDisplayName("preview:" + widgetFamily.description)
        }
    }
}
