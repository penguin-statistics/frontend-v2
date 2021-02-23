//
//  InitialLaunch.swift
//  App
//
//  Created by Galvin Gao on 2020/12/29.
//

import SwiftUI

@available(iOS 13.0, *)
struct InitialLaunch: View {
    @ObservedObject var delegate: SheetDismisserProtocol
    @State var route: String?
    
    @State var notificationPreferences: NotificationPreferences = NotificationPreferences(onNewStage: false, onMaintainance: false, onClientUpdate: false)
    
    var body: some View {
        NavigationView {
            WelcomeView(delegate: delegate, route: $route, notificationPreferences: $notificationPreferences)
                .navigationBarTitle("Welcome")
                .navigationBarHidden(true)
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

@available(iOS 13.0, *)
struct InitialLaunch_Previews: PreviewProvider {
    @State static var route: String? = "welcome"
    @State static var preferences: NotificationPreferences = NotificationPreferences(onNewStage: false, onMaintainance: false, onClientUpdate: false)
    static var previews: some View {
        InitialLaunch(delegate: SheetDismisserProtocol(), route: route, notificationPreferences: preferences)
    }
}
