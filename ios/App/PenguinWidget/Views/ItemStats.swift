//
//  ItemStats.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import SwiftUI
import WidgetKit

struct ItemStats: View {
    var itemId: String
    var name: String
    var percentage: String
    
    var body: some View {
        HStack(alignment: .center, spacing: 6) {
            Image("item_" + itemId)
                .resizable()
                .frame(width: 20, height: 20, alignment: .center)
            Text(name + " " + percentage)
                .font(.custom("Bender", size: 12, relativeTo: .body))
                .lineLimit(1)
                .foregroundColor(Color("Gray5"))
        }
    }
}

struct ItemStats_Previews: PreviewProvider {
    static var previews: some View {
        ItemStats(itemId: "30053", name: "酮凝集组", percentage: "66.1%")
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
