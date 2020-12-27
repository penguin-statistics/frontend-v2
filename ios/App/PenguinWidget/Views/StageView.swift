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
    
    var body: some View {
        HStack(alignment: .center, spacing: 4) {
            Image(systemName: "cube")
                .font(.headline)
                .foregroundColor(Color("Gray4"))
                .unredacted()
                
            Text(stage.stageCode)
                .font(.title)
                .bold()
                .frame(minHeight: 0, maxHeight: 36)
                .minimumScaleFactor(0.3)
                .lineLimit(3)
        }
    }
}

struct StageView_Previews: PreviewProvider {
    static var previews: some View {
        StageView(stage: StageStats(stageId: "main_01-07", stageCode: "1-7", items: []))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
