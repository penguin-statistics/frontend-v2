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
    
    @Environment(\.widgetFamily) var family

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("SiteStatsWidgetTitle")
                .font(.caption)
                .foregroundColor(entry.preferences.theme.secondaryColor)
                .unredacted()
            
            Spacer()
            
            TwoColumnStageStats(stages: entry.stats.stages)
                .padding(.horizontal, 8)
            
            Spacer()
            WidgetFooter(server: entry.stats.server)
        }
        .environmentObject(entry.preferences)
        .environmentObject(entry.originalConfiguration)
        .padding()
        .background(
            entry.preferences.theme.backgroundView(widgetFamily: family),
            alignment: .bottomTrailing
        )
        .overlay(
            entry.preferences.theme.overlayView(widgetFamily: family),
            alignment: .bottom
        )
        .background(entry.preferences.theme.backgroundColor)
        .if(entry.preferences.theme.forcedColorScheme != nil) { view in
            view.environment(\.colorScheme, entry.preferences.theme.forcedColorScheme!)
        }
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

