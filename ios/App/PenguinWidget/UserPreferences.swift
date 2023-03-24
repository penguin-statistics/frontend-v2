//
//  UserPreferences.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 3/18/23.
//

import Foundation
import SwiftUI
import WidgetKit

enum PenguinTheme: String {
    case `default` = "default"
    case miku2021 = "miku2021"
    case seaborn = "seaborn"
    
    var name: String {
        switch self {
        case .default:
            return "Default"
        case .miku2021:
            return "Miku 2021"
        case .seaborn:
            return "Seaborn"
        }
    }
    
    // background color
    var backgroundColor: Color {
        switch self {
        case .default:
            return Color("Background_Default")
        case .miku2021:
            return Color("Background_Miku2021")
        case .seaborn:
            return Color("Background_Seaborn")
        }
    }
    
    var secondaryColor: Color {
        switch self {
        case .seaborn:
            return Color("Secondary_Seaborn")
        default:
            return Color("Secondary")
        }
    }
    
    // tint color
    var tintColor: Color {
        switch self {
        case .default:
            return Color("Tint_Default")
        case .miku2021:
            return Color("Tint_Miku2021")
        case .seaborn:
            return Color("Tint_Seaborn")
        }
    }
    
    // background view
    func backgroundView(widgetFamily: WidgetFamily) -> AnyView {
        switch widgetFamily {
        case .systemSmall:
            switch self {
            case .default:
                return AnyView(EmptyView())
            case .miku2021:
                return AnyView(
                    Image("Adornment_Miku2021")
                        .resizable()
                        .unredacted()
                        .scaledToFill()
                        .frame(width: 100)
                        .fadeMasked())
            case .seaborn:
                return AnyView(
                    Image("WidgetBackground_Seaborn")
                        .resizable()
                        .unredacted()
                        .scaledToFill()
                        .frame(maxWidth: .infinity, maxHeight: .infinity))
            }
        case .systemMedium:
            switch self {
            case .default:
                return AnyView(EmptyView())
            case .miku2021:
                return AnyView(
                    Image("Adornment_Miku2021")
                        .resizable()
                        .unredacted()
                        .scaledToFill()
                        .frame(maxHeight: .infinity)
                        .aspectRatio(1, contentMode: .fit)
                        .fadeMasked())
            case .seaborn:
                return AnyView(
                    Image("WidgetBackground_Seaborn")
                        .resizable()
                        .unredacted()
                        .scaledToFill()
                        .frame(maxWidth: .infinity, maxHeight: .infinity))
            }
        default:
            return AnyView(EmptyView())
        }
        
    }
    
    // overlay view
    func overlayView(widgetFamily: WidgetFamily) -> AnyView {
        switch widgetFamily {
        case .systemSmall:
            switch self {
            case .seaborn:
                return AnyView(
                    Image("Mist_Seaborn")
                        .resizable()
                        .unredacted()
                        .scaledToFill()
                        .frame(maxWidth: .infinity, maxHeight: 40, alignment: .bottomLeading))
                
            default:
                return AnyView(EmptyView())
            }
        case .systemMedium:
            switch self {
            case .seaborn:
                return AnyView(
                    Image("Mist_Seaborn")
                        .resizable()
                        .unredacted()
                        .scaledToFill()
                        .frame(maxWidth: .infinity, maxHeight: 40, alignment: .bottomLeading))
            default:
                return AnyView(EmptyView())
            }
        default:
            return AnyView(EmptyView())
        }
        
    }
    
    var forcedColorScheme: ColorScheme? {
        switch self {
        case .default:
            return nil
        case .miku2021:
            return nil
        case .seaborn:
            return .dark
        }
    }
}

class WidgetUserPreferences: ObservableObject {
    public var server: PenguinServer
    public var theme: PenguinTheme
    
    init(server: PenguinServer = .cn, theme: PenguinTheme = .default) {
        self.server = server
        self.theme = theme
    }
}

extension WidgetUserPreferences {
    static func getLatest() -> WidgetUserPreferences {
        let preference = WidgetUserPreferences()
        
        guard let sharedState = UserDefaults(suiteName: "group.io.penguinstats.app.public-shared") else {
            return preference
        }
        
        if let server = sharedState.string(forKey: "server") {
            preference.server = PenguinServer.fromString(server)
        }
        
        if let themeStyle = sharedState.string(forKey: "themeStyle") {
            preference.theme = PenguinTheme(rawValue: themeStyle) ?? .default
        }
        
        return preference
    }
}
