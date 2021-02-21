//
//  PenguinWidget.swift
//  PenguinWidget
//
//  Created by Galvin Gao on 2020/12/20.
//

import WidgetKit
import SwiftUI
import Intents

struct SmallWidgetView : View {
    var stats: SiteStats

    var body: some View {
        VStack(alignment: .center, spacing: 0) {
            Text("SiteStatsWidgetTitle")
                .font(.caption)
                .foregroundColor(Color("Gray4"))
            Spacer()
            StageView(stage: stats.stages[0])
            ItemStatsView(item: stats.stages[0].items[0])
//                .frame(minHeight: 0, maxHeight: 28)
            Spacer()
            WidgetFooter(server: stats.server)
        }
        .padding()
        .background(Color("Background"))
        .widgetURL(Routes.generate(
                    zoneId: stats.stages[0].zoneId,
                    stageId: stats.stages[0].stageId))
    }
}

struct SmallWidgetView_Previews: PreviewProvider {
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
    
        SmallWidgetView(
            stats: SiteStats.demo(.zhRegular)
        )
            .previewContext(WidgetPreviewContext(family: .systemSmall))
            .environment(\.colorScheme, ColorScheme.dark)
            .environment(\.locale, .init(identifier: "zh"))
            .previewDisplayName("Small")

    }
}
