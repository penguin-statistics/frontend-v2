//
//  AccessoryRectangularView.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2022/6/19.
//

import SwiftUI
import WidgetKit

@available(iOSApplicationExtension 16.0, *)
struct AccessoryRectangularView: View {
    var stats: SiteStats
    
    var stage: StageStats {
        stats.stages.first!
    }
    
    var item: ItemStats {
        stage.items.first!
    }
    
    var body: some View {
        VStack(spacing: 4) {
            HStack {
                Text(stage.stageCode)
                    .font(.system(size: 20, weight: .bold, design: .rounded))
                    .lineLimit(2)
                    .minimumScaleFactor(0.35)
                
                Text("× " + String(stage.recentTimes))
                    .minimumScaleFactor(0.35)
                    .lineLimit(1)
                    .font(.body.monospacedDigit())
                    .foregroundColor(Color("Secondary").opacity(0.8))
            }
            
            HStack {
                Text(item.name)
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .lineLimit(1)
                    .minimumScaleFactor(0.1)
                
                Text(item.percentage())
                    .minimumScaleFactor(0.5)
                    .lineLimit(1)
                    .font(.body.monospacedDigit())
                    .foregroundColor(Color("Secondary").opacity(0.8))
            }
        }
        .widgetURL(Routes.generate(
            zoneId: stage.zoneId,
            stageId: stage.stageId))
        .widgetBackground(Color.clear)
    }
}

@available(iOSApplicationExtension 16.0, *)
struct AccessoryRectangularView_Previews: PreviewProvider {
    static var previews: some View {
        AccessoryRectangularView(stats: SiteStats.demo(.zhRegular))
            .previewContext(WidgetPreviewContext(family: .accessoryRectangular))
    }
}
