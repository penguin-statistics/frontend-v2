//
//  ItemStats.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import SwiftUI
import WidgetKit
import UIKit

struct ItemStatsView: View {
    var item: ItemStats
    var showName: Bool = true
    
    var body: some View {
        HStack(alignment: .center, spacing: 4) {
            item.image()
                .resizable()
                .frame(width: 20, height: 20, alignment: .center)
            
            if showName {
                Text(item.name)
                    .font(.caption)
                    .bold()
                    .lineLimit(2)
                    .minimumScaleFactor(0.6)
                    .foregroundColor(Color("Gray5"))
            }
            
            
            Text(item.percentage())
                .font(.custom("Bender", size: 12, relativeTo: .body))
                .baselineOffset(-1.0)
                .lineLimit(1)
                .foregroundColor(Color("Gray5"))
            
        }
    }
}

struct ItemStatsView_Previews: PreviewProvider {
    static var previews: some View {
        //itemId: "31024", name: "Incandescent Alloy Block", percentage: "66.1%"
        ItemStatsView(item: ItemStats(id: "31024", name: "Incandescent Alloy Block", times: 39874, quantity: 23784))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
