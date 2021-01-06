//
//  MediumWidgetView.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import SwiftUI
import WidgetKit

struct MediumWidgetView: View {
    var stats: SiteStats

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("SiteStatsWidgetTitle")
                .font(.caption)
                .foregroundColor(Color("Gray4"))
            Spacer()
            
            TwoColumnStageStats(stages: stats.stages)
                .padding(.horizontal, 8)
            
            
            Spacer()
            WidgetFooter()
        }
        .padding()
        .background(Color("Background"))
    }
}

struct MediumWidgetView_Previews: PreviewProvider {
    static var previews: some View {
        MediumWidgetView(
            stats: SiteStats.demo(.zhRegular)
        )
            .previewContext(WidgetPreviewContext(family: .systemMedium))
            .environment(\.colorScheme, ColorScheme.dark)
            .environment(\.locale, .init(identifier: "zh"))
            .previewDisplayName("Medium")
    }
}

