//
//  NotificationConsentItem.swift
//  App
//
//  Created by Galvin Gao on 2020/12/29.
//

import SwiftUI

@available(iOS 13.0.0, *)
struct ToggleNotificationPreference: View {
    var icon: String;
    var iconColor: Color;
    var title: String;
    var subtitle: String;
    
    @Binding var active: Bool
    
    var body: some View {
        Toggle(isOn: $active) {
            HStack(alignment: .top, spacing: 8) {
                Image(systemName: icon)
                    .font(Font.headline.weight(.bold))
                    .imageScale(.medium)
                    .padding(8)
                    .frame(width: 36, height: 36)
                    .background(iconColor)
                    .foregroundColor(Color.white)
                    .cornerRadius(8)
                    
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                    Text(subtitle)
                        .foregroundColor(Color.secondary)
                        .font(.caption)
                }
            }
        }
        .background(
            Rectangle()
                .fill(Color.green.opacity(active ? 0.2 : 0))
                .frame(maxHeight: 16)
                .padding(12)
                .blur(radius: 14)
                .animation(.easeInOut)
        )
    }
}

@available(iOS 13.0.0, *)
struct ToggleNotificationPreference_Previews: PreviewProvider {
    static var previews: some View {
        StatefulPreviewWrapper(false) {
            ToggleNotificationPreference(
                icon: "cube",
                iconColor: Color("NewStage"),
                title: "On New Stage",
                subtitle: "We will notify you when there's a new stage available for query and report",
                active: $0
            )
        }
    }
}
