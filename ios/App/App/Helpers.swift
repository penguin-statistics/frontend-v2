//
//  Helpers.swift
//  App
//
//  Created by Galvin Gao on 2020/12/28.
//

import Foundation
import SwiftUI
import CoreHaptics

@available(iOS 13.0, *)
struct StatefulPreviewWrapper<Value, Content: View>: View {
    @State var value: Value
    var content: (Binding<Value>) -> Content
    
    var body: some View {
        content($value)
    }
    
    init(_ value: Value, content: @escaping (Binding<Value>) -> Content) {
        self._value = State(wrappedValue: value)
        self.content = content
    }
}

extension Data {
    struct HexEncodingOptions: OptionSet {
        let rawValue: Int
        static let upperCase = HexEncodingOptions(rawValue: 1 << 0)
    }
    
    func hexEncodedString(options: HexEncodingOptions = []) -> String {
        let format = options.contains(.upperCase) ? "%02hhX" : "%02hhx"
        return map { String(format: format, $0) }.joined()
    }
    
    func toString(_ encoding: String.Encoding = .utf8) -> String? {
        return String(data: self, encoding: encoding)
    }
}

@available(iOS 13.0, *)
struct BlurModifierSimple: ViewModifier {
    @Binding var showOverlay: Bool
    @State var blurRadius: CGFloat = 10
    
    func body(content: Content) -> some View {
        Group {
            content
                .blur(radius: showOverlay ? blurRadius : 0)
                .animation(.easeInOut)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

public extension String {
    func withBundleIdentifier() -> String {
        return (Bundle.main.bundleIdentifier ?? "io.penguinstats.app") + "." + self
    }
}

public class Routes {
    public static let defaultBaseString = "https://penguin-stats.io/"
    public static let defaultBaseURL = URL(string: defaultBaseString)!
//    public static let defaultBaseURLComponent = URLComponents(string: defaultBaseString)!
    
    public static func generate(zoneId: String, stageId: String) -> URL {
        guard var component = URLComponents(string: defaultBaseString) else { return defaultBaseURL }
        component.path = "/result/stage/\(zoneId)/\(stageId)"
        print(component.url ?? defaultBaseURL)
        return component.url ?? defaultBaseURL
    }
    
    public static func generate(itemId: String) -> URL {
        guard var component = URLComponents(string: defaultBaseString) else { return defaultBaseURL }
        component.path = "/result/item/\(itemId)"
        
        return component.url ?? defaultBaseURL
    }
    
    public static func generate(path: String) -> URL {
        guard var component = URLComponents(string: defaultBaseString) else { return defaultBaseURL }
        component.path = path
        
        return component.url ?? defaultBaseURL
    }
}

@available(iOS 13.0, *)
public extension View {
    func Print(_ vars: Any...) -> some View {
        for v in vars { print(v) }
        return EmptyView()
    }
}

@available(iOS 12.0, *)
public extension PenguinServer {
    func string() -> String {
        switch self {
        case .cn:
            return "CN"
        case .us:
            return "US"
        case .jp:
            return "JP"
        case .kr:
            return "KR"
        default:
            return "CN"
        }
    }
    
    static func fromString(_ string: String) -> PenguinServer {
        switch string {
        case "CN":
            return .cn
        case "US":
            return .us
        case "JP":
            return .jp
        case "KR":
            return .kr
        default:
            return .cn
        }
    }
}

public extension PenguinDynamicServer {
    // synced property is PenguinDynamicServer(identifier: "synced", display: "PenguinDynamicServerTitleSyncWithApp"),
    static func createSynced() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "synced", display: "PenguinDynamicServerTitleSyncWithApp")
    }
    
    static func createCN() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "CN", display: "PenguinDynamicServerTitleCN")
    }
    
    static func createUS() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "US", display: "PenguinDynamicServerTitleUS")
    }
    
    static func createJP() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "JP", display: "PenguinDynamicServerTitleJP")
    }
    
    static func createKR() -> PenguinDynamicServer {
        return PenguinDynamicServer(identifier: "KR", display: "PenguinDynamicServerTitleKR")
    }
    
    static func createDefault() -> PenguinDynamicServer {
        return self.createSynced()
    }
}

extension Optional where Wrapped: PenguinDynamicServer {
    var unwrapped: PenguinDynamicServer {
        switch self {
        case .some(let server):
            return server
        case .none:
            return PenguinDynamicServer(identifier: "synced", display: "PenguinDynamicServerTitleSyncWithApp")
        }
    }
}

public class Localizer {
    static let currentLocale = String(Bundle.main.preferredLocalizations.first?.split(separator: "-")[0] ?? "")
    static let defaultLocale = "en"
    
    public static func localized(from i18nMessage: [String: String]) -> String? {
        return i18nMessage[currentLocale] ?? i18nMessage[defaultLocale]
    }
}

struct JSON {
    static let encoder = JSONEncoder()
}
extension Encodable {
    subscript(key: String) -> Any? {
        return dictionary[key]
    }
    var dictionary: [String: Any] {
        return (try? JSONSerialization.jsonObject(with: JSON.encoder.encode(self))) as? [String: Any] ?? [:]
    }
}
