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
    var entry: SiteStatsProvider.Entry

    var body: some View {
        VStack(alignment: .center, spacing: 0) {
            Text("SiteStatsWidgetTitle")
                .font(.caption)
                .foregroundColor(Color("Gray4"))
                .unredacted()
            
            Spacer()
            
            StageView(stage: entry.stats.stages[0])
            
            ItemStatsView(item: entry.stats.stages[0].items[0])
            
            Spacer()
            
            WidgetFooter(server: entry.stats.server)
        }
        .environmentObject(entry.preferences)
        .padding()
        .background(
            entry.preferences.theme.adornmentView
                .unredacted()
                .frame(width: 100)
                .fadeMasked(),
            alignment: .bottomTrailing
        )
        .background(entry.preferences.theme.backgroundColor)
        .widgetURL(Routes.generate(
            zoneId: entry.stats.stages[0].zoneId,
            stageId: entry.stats.stages[0].stageId))
        .if(entry.preferences.theme.forcedColorScheme != nil) { view in
            view.environment(\.colorScheme, entry.preferences.theme.forcedColorScheme!)
        }
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
            entry: .demo(.zhRegular, theme: .default)
        )
            .previewContext(WidgetPreviewContext(family: .systemSmall))
            .environment(\.locale, .init(identifier: "zh"))
            .previewDisplayName("Small (theme: default)")
        
        SmallWidgetView(
            entry: .demo(.zhRegular, theme: .miku2021)
        )
            .previewContext(WidgetPreviewContext(family: .systemSmall))
            .environment(\.locale, .init(identifier: "zh"))
            .previewDisplayName("Small (theme: miku2021)")
        
        SmallWidgetView(
            entry: .demo(.zhRegular, theme: .seaborn)
        )
            .previewContext(WidgetPreviewContext(family: .systemSmall))
            .environment(\.colorScheme, ColorScheme.dark)
            .environment(\.locale, .init(identifier: "zh"))
            .previewDisplayName("Small (theme: seaborn)")

    }
}
