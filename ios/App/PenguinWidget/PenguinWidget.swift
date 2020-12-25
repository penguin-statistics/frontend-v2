//
//  PenguinWidget.swift
//  PenguinWidget
//
//  Created by Galvin Gao on 2020/12/20.
//

import WidgetKit
import SwiftUI
import Intents

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        var entries: [SimpleEntry] = []

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
}

struct PenguinWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .center, spacing: 0) {
            Text("24huploads")
                .font(.caption)
                .foregroundColor(Color("Gray4"))
            
            Spacer()
            HStack(alignment: .center, spacing: 6) {
                Image(systemName: "cube")
                    .font(.headline)
                    .foregroundColor(Color("Gray4"))
                    
                Text("MB-7")
                    .font(.title)
                    .bold()
                    .lineLimit(1)
            }
            .padding(.bottom, 4)
            
            ItemStats(itemId: "30053", name: "酮凝集组", percentage: "66.1%")
            Spacer()
//            Divider()
//                .padding(.bottom, 6)
            HStack(alignment: .center, spacing: 2) {
                Text("查看详情")
                    .font(.caption)
                    .foregroundColor(Color("Gray4"))
                Image(systemName: "arrow.up.right")
                    .font(.caption)
                    .padding(0)
                    .foregroundColor(Color("Gray4"))
                    .scaleEffect(0.8)
                Spacer()
                Image("Logo")
                    .resizable()
                    .frame(width: 24, height: 24, alignment: .center)
            }
        }
        .padding()
        .background(Color("Background"))
    }
}

@main
struct PenguinWidget: Widget {
    let kind: String = "PenguinWidget"
    let name: LocalizedStringKey = "widgetName"
    let description: LocalizedStringKey = "widgetDesc"

    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: kind,
            provider: Provider()
        ) { entry in
            PenguinWidgetEntryView(entry: entry)
        }
        .configurationDisplayName(name)
        .description(description)
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct PenguinWidget_Previews: PreviewProvider {
    static var previews: some View {
//        PenguinWidgetEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent()))
//            .previewContext(WidgetPreviewContext(family: .systemSmall))
        
        
//    ForEach(ColorScheme.allCases, id: \.self) { colorScheme in
//        PenguinWidgetEntryView(entry: SimpleEntry(date: Date()))
//            .previewContext(WidgetPreviewContext(family: .systemSmall))
//            .environment(\.colorScheme, colorScheme)
//            .environment(\.locale, .init(identifier: "zh"))
//            .previewDisplayName(colorScheme == ColorScheme.dark ? "dark" : "light")
//
//        }
//    }
    
    PenguinWidgetEntryView(entry: SimpleEntry(date: Date()))
        .previewContext(WidgetPreviewContext(family: .systemSmall))
        .environment(\.colorScheme, ColorScheme.dark)
        .environment(\.locale, .init(identifier: "zh"))
        .previewDisplayName("dark")

    }
}
