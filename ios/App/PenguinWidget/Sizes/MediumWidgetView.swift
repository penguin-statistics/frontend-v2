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
                .unredacted()
            
            Spacer()
            
            TwoColumnStageStats(stages: stats.stages)
                .padding(.horizontal, 8)
            
            Spacer()
            WidgetFooter(server: stats.server)
        }
        .padding()
        .background(Color("Background"))
    }
}

struct MediumWidgetView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            MediumWidgetView(
                stats: SiteStats.demo(.zhRegular)
            )
                .environment(\.locale, .init(identifier: "zh"))
                .previewDisplayName("Chinese")
            
            MediumWidgetView(
                stats: SiteStats.demo(.zhRegular)
            )
                .environment(\.locale, .init(identifier: "ja"))
                .previewDisplayName("Japanese")
        }
        .previewContext(WidgetPreviewContext(family: .systemMedium))
    }
}

