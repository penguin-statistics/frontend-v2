//
//  UserPreferences.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 3/18/23.
//

import Foundation
import SwiftUI

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

    // adornment view
    var adornmentView: AnyView {
        switch self {
        case .default:
            return AnyView(EmptyView())
        case .miku2021:
            return AnyView(Image("Adornment_Miku2021").resizable().scaledToFill())
        case .seaborn:
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
//    var server: PenguinServer
    public var theme: PenguinTheme
    
    init(theme: PenguinTheme = .default) {
        self.theme = theme
    }
}

extension WidgetUserPreferences {
    static func getLatest() -> WidgetUserPreferences {
        let preference = WidgetUserPreferences()

        guard let sharedState = UserDefaults(suiteName: "group.io.penguinstats.app.public-shared") else {
            return preference
        }

//        if let server = sharedState.string(forKey: "server") {
//            self.server = server
//        }

        if let themeStyle = sharedState.string(forKey: "themeStyle") {
            preference.theme = PenguinTheme(rawValue: themeStyle) ?? .default
        }

        return preference
    }
}
