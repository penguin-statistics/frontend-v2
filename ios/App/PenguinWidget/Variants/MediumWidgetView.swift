//
//  MediumWidgetView.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import SwiftUI
import WidgetKit

struct MediumWidgetView: View {
    var entry: SiteStatsProvider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("SiteStatsWidgetTitle")
                .font(.caption)
                .foregroundColor(Color("Gray4"))
                .unredacted()
            
            Spacer()
            
            TwoColumnStageStats(stages: entry.stats.stages)
                .padding(.horizontal, 8)
            
            Spacer()
            WidgetFooter(server: entry.stats.server)
        }
        .environmentObject(entry.preferences)
        .padding()
        .background(
            HStack {
                Spacer()
                entry.preferences.theme.adornmentView
                    // fill height
                    .unredacted()
                    .frame(maxHeight: .infinity)
                    .aspectRatio(1, contentMode: .fit)
                    .fadeMasked()
                    
            }
        )
        .background(entry.preferences.theme.backgroundColor)
    }
}

struct MediumWidgetView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            MediumWidgetView(
                entry: .demo(.zhRegular)
            )
                .environment(\.locale, .init(identifier: "zh"))
                .previewDisplayName("Chinese")
            
            MediumWidgetView(
                entry: .demo(.zhRegular)
            )
                .environment(\.locale, .init(identifier: "ja"))
                .previewDisplayName("Japanese")
        }
        .previewContext(WidgetPreviewContext(family: .systemMedium))
    }
}

