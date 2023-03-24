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
    @EnvironmentObject var originalConfiguration: WidgetUserOriginalConfiguration
    @Environment(\.widgetFamily) var widgetFamily: WidgetFamily
    
    var serverText: some View {
        Text(server.string())
            .font(.system(size: 10, design: .monospaced))
            .foregroundColor(preferences.theme.secondaryColor)
    }
    
    var body: some View {
        HStack(spacing: 0) {
            Link(destination: Routes.generate(path: "/statistics")) {
                HStack(spacing: 4) {
                    Text("WidgetViewMore")
                        .bold()
                    Image(systemName: "arrow.up.forward.app")
                }
                .font(.system(size: 10))
                .foregroundColor(preferences.theme.secondaryColor)
                .if(widgetFamily != .systemSmall, transform: { view in
                    // the whole systemSmall is one interactable element so we do not show an indicator
                    // for the systemSmall widget
                    view
                        .padding(4)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(4.0)
                        .overlay(
                            RoundedRectangle(cornerRadius: 4.0)
                                .stroke(preferences.theme.secondaryColor.opacity(0.15), lineWidth: 1)
                        )
                })
                .lineLimit(1)
                .unredacted()
            }
            
            Spacer()
            
            if originalConfiguration.dynamicServer?.identifier != "synced" {
                // definitely pinned
                HStack(alignment: .center, spacing: 2) {
                    Image(systemName: "pin")
                        .resizable()
                        .frame(width: 8, height: 8, alignment: .center)
                        .offset(y: 0.5) // visually center the icon
                        .foregroundColor(preferences.theme.secondaryColor)
                    
                    serverText
                }
                .padding(4)
                .background(Color.gray.opacity(0.05))
                .cornerRadius(4.0)
                
            } else {
                // default / auto sync
                serverText
                    .padding(4)
            }

            Image("Logo")
                .resizable()
                .frame(width: 20, height: 20, alignment: .center)
                .padding(.leading, 4)
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
