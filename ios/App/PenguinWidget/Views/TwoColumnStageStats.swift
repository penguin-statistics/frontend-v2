//
//  TwoColumnStageStats.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/27.
//

import SwiftUI
import WidgetKit

struct TwoColumnStageStats: View {
    var stages: [StageStats]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            ForEach(stages, id: \.stageId) {stage in
                HStack(alignment: .center, spacing: 16) {
                    StageView(stage: stage, showRecentTimes: true)
                        .frame(width: 125, alignment: .leading)
                        .fixedSize(horizontal: true, vertical: false)
                        
                    ItemStatsView(item: stage.items[0], showName: true)
                }
            }
        }
    }
}

struct TwoColumnStageStats_Previews: PreviewProvider {
    static var previews: some View {
        TwoColumnStageStats(
            stages: SiteStats.demo(.zhRegular).stages
        )
            .previewContext(WidgetPreviewContext(family: .systemMedium))
            .environment(\.colorScheme, .dark)
            .environment(\.locale, .init(identifier: "zh"))
    }
}
