//
//  HapticButton.swift
//  App
//
//  Created by Galvin Gao on 2020/12/30.
//

import SwiftUI
import CoreHaptics

@available(iOS 13.0, *)
struct HapticButton<Content: View> : View {
    let content : ()-> Content
    let action: () -> Void
    
    init(action: @escaping () -> Void, @ViewBuilder content: @escaping () -> Content) {
        self.content = content
        self.action = action
    }
    
    var body: some View {
        Button(action: {
            UIImpactFeedbackGenerator.init(style: .rigid).impactOccurred()
            self.action()
        }) {
            content()
        }
    }
    
//    func prepareHaptics() {
//        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }
//
//        do {
//            self.engine = try CHHapticEngine()
//            try engine?.start()
//        } catch {
//            print("There was an error creating the engine: \(error.localizedDescription)")
//        }
//    }
//
//    func complexSuccess() {
//
//        // make sure that the device supports haptics
//        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }
//        var events = [CHHapticEvent]()
//
//        // create one intense, sharp tap
//        let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.9)
//        let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.0)
//        let event = CHHapticEvent(eventType: .hapticTransient, parameters: [intensity, sharpness], relativeTime: 0)
//        events.append(event)
//
//        // convert those events into a pattern and play it immediately
//        do {
//            let pattern = try CHHapticPattern(events: events, parameters: [])
//            let player = try engine?.makePlayer(with: pattern)
//            try player?.start(atTime: 0)
//        } catch {
//            print("Failed to play pattern: \(error.localizedDescription).")
//        }
//    }
}

@available(iOS 13.0, *)
struct HapticButton_Previews: PreviewProvider {
    static var previews: some View {
        HapticButton(action: {
            
        }) {
            Text("Hello, World")
        }
    }
}
