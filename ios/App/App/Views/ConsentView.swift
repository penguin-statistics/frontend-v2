//
//  ConsentView.swift
//  App
//
//  Created by Galvin Gao on 2020/12/28.
//

import SwiftUI
import UserNotifications
import CoreHaptics

@available(iOS 13.0, *)
struct ConsentView: View {
    @ObservedObject var delegate: SheetDismisserProtocol
    
    @Binding var onNewStage: Bool
    @Binding var onMaintainance: Bool
    @Binding var onClientUpdate: Bool
    
    @State private var showDetails = false
    
    let notificationColor = Color(red: 254/255, green: 59/255, blue: 48/255)
    
    var body: some View {
        VStack {
            Spacer()
            
            VStack(alignment: .center) {
                Image(systemName: "app.badge")
                    .resizable()
                    .frame(width: 36, height: 36)
                    .padding(EdgeInsets(top: 10, leading: 12, bottom: 12, trailing: 10))
                    .background(notificationColor)
                    .cornerRadius(12.0)
//                    .renderingMode(.template)
                    .foregroundColor(Color.white)
                    .onTapGesture {
                        UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
                    }
                
                Text("Push Notification Preferences")
                    .font(.system(size: 32, weight: .bold))
                    .padding(.top)
            }
                .padding()
            
            List {
                ToggleNotificationPreference(
                    icon: "cube",
                    iconColor: Color("NewStage"),
                    title: "New Stage",
                    subtitle: "We will notify you when there's a new stage available for query and report",
                    active: $onNewStage
                )
                ToggleNotificationPreference(
                    icon: "server.rack",
                    iconColor: Color("Maintainance"),
                    title: "Maintainance",
                    subtitle: "We will notify you when there's a server maintainance scheduled",
                    active: $onMaintainance
                )
                ToggleNotificationPreference(
                    icon: "arrow.down.circle",
                    iconColor: Color("ClientUpdate"),
                    title: "Game Client Update",
                    subtitle: "We will notify you when there's a mandatory game client update that requires you to update before you could enter the game again",
                    active: $onClientUpdate
                )
            }
            .listStyle(PlainListStyle())
            .cornerRadius(8)
            
            VStack(spacing: 12) {
                Image(systemName: "hand.raised.slash.fill")
                    .imageScale(.large)
                    .foregroundColor(Color.blue.opacity(0.5))
                
                Text("We would only use the notification service to provide you assistance information that you may need and can be disabled anytime either within app or through the system notifications settings.")
                    .foregroundColor(Color.secondary)
                    .font(.caption)
                    .padding(.horizontal, 8)
            }
            .padding()
            
//            VStack(alignment: .leading) {
//                Toggle("On New Stage", isOn: $onNewStage)
//                Toggle("On Maintainance", isOn: $onMaintainance)
//                Toggle("On Forced Client Update", isOn: $onClientUpdate)
//            }
//            .padding()
            
            Spacer()
            HStack {
//                Button(action: {
//                    self.step = 1
//                }) {
//                    Image(systemName: "chevron.left.circle")
//                        .resizable()
//                        .frame(width: 28, height: 28)
//                        .padding(14)
//                        .background(Color.blue.saturation(0.8))
//                        .foregroundColor(Color.white)
//                        .cornerRadius(10)
//                }
                HapticButton(action: {
                    self.delegate.dismiss()
                }) {
                    Text("Done")
                        .font(.system(size: 20))
                        .bold()
                        .foregroundColor(.white)
                        .padding()
                        .frame(minWidth: 0, maxWidth: .infinity, minHeight: 56, maxHeight: 56)
                        .background(Color.blue)
                }
                .cornerRadius(10)
            }
            .padding()
        }
//        .navigationBarTitle("")
        .navigationBarHidden(true)
    }
}

@available(iOS 13.0, *)
struct ConsentView_Previews: PreviewProvider {
    
    static var previews: some View {
        StatefulPreviewWrapper(false) {
            ConsentView(delegate: SheetDismisserProtocol(), onNewStage: $0, onMaintainance: $0, onClientUpdate: $0)
        }
    }
}
