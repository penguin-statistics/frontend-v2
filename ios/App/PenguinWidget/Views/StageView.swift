//
//  StageStatsView.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import SwiftUI
import WidgetKit
import UIKit

struct StageView: View {
    var stage: StageStats
    var showRecentTimes: Bool = false
    
    @EnvironmentObject var preferences: WidgetUserPreferences
    
    var body: some View {
        Link(destination: Routes.generate(zoneId: stage.zoneId, stageId: stage.stageId)) {
            
            HStack(alignment: .center, spacing: 4) {
                Image(systemName: "cube")
                    .font(.headline)
                    .foregroundColor(preferences.theme.secondaryColor)
                    .unredacted()
                    
                HStack(alignment: .center, spacing: 6) {
                    Text(stage.stageCode)
                        .kerning(-0.4)
                        .font(.title2.monospacedDigit())
                        .bold()
                        .foregroundColor(preferences.theme.tintColor)
                        .frame(minHeight: 0, maxHeight: 36)
                        .minimumScaleFactor(0.3)
                        .lineLimit(3)
                    
                    if showRecentTimes {
                        Text("× " + String(stage.recentTimes))
                            .minimumScaleFactor(0.5)
                            .lineLimit(1)
                            .font(.caption.monospacedDigit())
                            .foregroundColor(preferences.theme.secondaryColor.opacity(0.8))
                    }
                }
            }
        }
        
    }
}

struct StageView_Previews: PreviewProvider {
    static var previews: some View {
        StageView(
            stage: StageStats(
                stageId: "main_01-07",
                zoneId: "unknown",
                stageCode: "1-7",
                items: [],
                recentTimes: 300),
            showRecentTimes: true)
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
