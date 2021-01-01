//
//  WhatsNew.swift
//  App
//
//  Created by Galvin Gao on 2020/12/28.
//

import SwiftUI

struct WhatsNew: Hashable {
    var icon: String
    var title: String
    var subtitle: String
}

@available(iOS 13.0, *)
struct WhatsNewView: View {
    var info: WhatsNew
    
    var body: some View {
        HStack {
            Image(systemName: info.icon)
                .font(.largeTitle)
                .foregroundColor(.blue)
            
            VStack(alignment: .leading) {
                Text(info.title)
                    .bold()
                
                Text(info.subtitle)
                    .foregroundColor(.secondary)
            }
            .frame(width: 240, alignment: .leading)
            .padding()
        }
    }
}

@available(iOS 13.0, *)
struct WhatsNewView_Previews: PreviewProvider {
    static var previews: some View {
        WhatsNewView(
            info: WhatsNew(
                icon: "bubble.left.and.bubble.right",
                title: "Share your name and photo",
                subtitle: "Get creative and send messages with your name and photo, or a Memoji."
            )
        )
//        WhatsNew(
//            icon: "bubble.left.and.bubble.right",
//            title: "short",
//            subtitle: "short"
//        )
    }
}
