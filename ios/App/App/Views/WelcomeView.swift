//
//  WelcomeView.swift
//  App
//
//  Created by Galvin Gao on 2020/12/28.
//

import SwiftUI

@available(iOS 13.0, *)
struct WelcomeView: View {
    @ObservedObject var delegate: SheetDismisserProtocol
    @Binding var route: String?
    @Binding var notificationPreferences: NotificationPreferences
    
    let features = [
        WhatsNew(
            icon: "apps.iphone.badge.plus",
            title: NSLocalizedString("feature.widget.title", comment: ""),
            subtitle: NSLocalizedString("feature.widget.subtitle", comment: "")),
        WhatsNew(icon: "hand.tap", title: NSLocalizedString("feature.haptics.title", comment: ""), subtitle: NSLocalizedString("feature.haptics.subtitle", comment: "")),
        WhatsNew(icon: "bolt", title: NSLocalizedString("feature.performance.title", comment: ""), subtitle: NSLocalizedString("feature.performance.subtitle", comment: ""))
    ]
    
    var body: some View {
        VStack {
            Spacer()
            VStack(alignment: .leading) {
                Text(NSLocalizedString("welcome.title", comment: ""))
                    .font(.system(size: 28, weight: .black))
                    .padding(.bottom, 0)
                
                Text(NSLocalizedString("welcome.subtitle", comment: ""))
                    .font(.system(size: 32, weight: .black))
                    .foregroundColor(.blue)
            }
            .padding()
            
            ForEach(features, id: \.self) { feature in
                WhatsNewView(info: feature)
            }
            
            Spacer()
            
//            Divider()
//            Spacer()
//
//            VStack(alignment: .leading) {
//                Text("Found Problems?")
//                    .font(.title)
//                    .bold()
//                    .padding(.bottom, 4)
//                Text("You can report them by simply taking a screenshot.")
//            }
//            .padding()
//
//
//            Spacer()
            
            NavigationLink(
                destination: ConsentView(
                    delegate: delegate,
                    onNewStage: $notificationPreferences.onNewStage,
                    onMaintainance: $notificationPreferences.onMaintainance,
                    onClientUpdate: $notificationPreferences.onClientUpdate)
                    .transition(.move(edge: .trailing)),
                tag: "consent",
                selection: $route
            ) {
                EmptyView()
            }
            
            HapticButton(action: {
                withAnimation {
                    self.delegate.dismiss()
                }
            }) {
                HStack {
                    Text("Get Started")
                        .font(.system(size: 20))
                        .bold()
                        
                    Image(systemName: "chevron.right")
                }
                .foregroundColor(.white)
                .padding()
                .frame(minWidth: 0, maxWidth: .infinity, minHeight: 56, maxHeight: 56)
                .background(Color.blue)
            }
            .cornerRadius(10)
//            .buttonStyle(HapticsButtonStyle())
            .padding()
            
        }
//        .padding(.all, 16)
    }
}

@available(iOS 13.0, *)
struct WelcomeView_Previews: PreviewProvider {
    @State static var route: String? = "welcome"
    @State static var preferences: NotificationPreferences = NotificationPreferences(onNewStage: false, onMaintainance: false, onClientUpdate: false)
    static var previews: some View {
        WelcomeView(delegate: SheetDismisserProtocol(), route: $route, notificationPreferences: $preferences)
    }
}
