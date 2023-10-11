//
//  LargeWidgetView.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import SwiftUI
import WidgetKit

struct LargeWidgetView: View {
    var stats: SiteStats

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("SiteStatsWidgetTitle")
                .font(.caption)
                .foregroundColor(Color("Secondary"))
            Spacer()
            
            TwoColumnStageStats(stages: stats.stages)
                .padding(.horizontal, 8)
            
            Spacer()
            WidgetFooter(server: stats.server)
        }
        .padding()
        .widgetBackground(Color("Background"))
    }
}

struct LargeWidgetView_Previews: PreviewProvider {
    static var previews: some View {
        LargeWidgetView(
            stats: SiteStats.demo(.zhRegular)
        )
            .previewContext(WidgetPreviewContext(family: .systemLarge))
            .environment(\.colorScheme, ColorScheme.dark)
            .environment(\.locale, .init(identifier: "zh"))
            .previewDisplayName("Large")
    }
}

