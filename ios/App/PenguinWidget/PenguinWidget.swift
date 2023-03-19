//
//  PenguinWidget.swift
//  PenguinWidgetExtension
//
//  Created by Galvin Gao on 2020/12/26.
//

import WidgetKit
import SwiftUI

@main
struct PenguinWidgets: WidgetBundle {
    var body: some Widget {
        PenguinWidget()
    }
}

struct PenguinWidget: Widget {
    let kind: String = "PenguinWidget"
    let name: LocalizedStringKey = "SiteStatsWidgetName"
    let description: LocalizedStringKey = "SiteStatsWidgetDesc"

    var body: some WidgetConfiguration {
        IntentConfiguration(
            kind: kind,
            intent: SelectServerIntent.self,
            provider: SiteStatsProvider()
        ) { entry in
            WidgetEntry(entry: entry)
        }
        .configurationDisplayName("SiteStatsWidgetName")
        .description("SiteStatsWidgetDesc")
        .adaptedSupportedFamilies()
    }
}

extension WidgetConfiguration {
    func adaptedSupportedFamilies() -> some WidgetConfiguration {
        if #available(iOSApplicationExtension 16, *) {
            return self.supportedFamilies([
                .systemSmall,
                .systemMedium,
                .accessoryRectangular
            ])
        } else {
            return self.supportedFamilies([
                .systemSmall,
                .systemMedium
            ])
        }
    }
}

extension View {
    @ViewBuilder func `if`<Content: View>(_ condition: Bool, transform: (Self) -> Content) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }
}

struct FadeMasked: ViewModifier {
    let maxOpacity: Double
    
    func body(content: Content) -> some View {
        content
            .mask(
                LinearGradient(
                    gradient: Gradient(
                        stops: [
                            .init(color: .clear, location: 0.0),
                            .init(color: .black.opacity(maxOpacity), location: 1.0)
                        ]
                    ),
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
    }
}

extension View {
    func fadeMasked(maxOpacity: Double = 0.5) -> some View {
        self.modifier(FadeMasked(maxOpacity: maxOpacity))
    }
}

