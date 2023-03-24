//
//  WidgetFooter.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import SwiftUI
import WidgetKit

struct WidgetFooter: View {
    let server: PenguinServer
    
    @EnvironmentObject var preferences: WidgetUserPreferences
    
    var body: some View {
        HStack(spacing: 4) {
            Link(destination: Routes.generate(path: "/statistics")) {
                HStack(spacing: 4) {
                    Text("WidgetViewMore")
                        .bold()
                    Image(systemName: "arrow.up.forward.app")
                }
                .font(.system(size: 11))
                .foregroundColor(preferences.theme.secondaryColor)
                .padding(4)
                .background(Color.gray.opacity(0.1))
                .cornerRadius(4.0)
                .unredacted()
            }
            
            Spacer()
            Text(server.string())
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(preferences.theme.secondaryColor)

            Image("Logo")
                .resizable()
                .frame(width: 20, height: 20, alignment: .center)
                .unredacted()
        }
    }
}

struct WidgetFooter_Previews: PreviewProvider {
    static var previews: some View {
        WidgetFooter(server: .cn)
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
