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
                HStack(spacing: 16) {
                    StageView(stage: stage)
                        .frame(width: 140, alignment: .leading)
                        .fixedSize(horizontal: true, vertical: false)
                        
                    ItemStatsView(item: stage.items[0], showName: false)
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
