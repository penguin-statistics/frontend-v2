//
//  Debugger.swift
//  App
//
//  Created by Galvin Gao on 2020/12/29.
//

import SwiftUI

#if DEBUG

@available(iOS 13.0.0, *)
struct GenericButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 16.0, weight: .bold))
            .padding()
            .background(Color.blue)
            .foregroundColor(Color.white)
            .cornerRadius(10.0)
            .opacity(configuration.isPressed ? 0.35 : 1)
            .padding()
    }
}

func reset() {
    let defaults = UserDefaults.standard
    let dictionary = defaults.dictionaryRepresentation()
    dictionary.keys.forEach { key in
        defaults.removeObject(forKey: key)
    }
    exit(0)
}

var apfsToken: String = ""
var userDefaults: [String] = []
func update() {
    apfsToken = UserDefaults.standard.string(forKey: "apfsToken") ?? "not defined"
    let defaults = UserDefaults.standard
    let dictionary = defaults.dictionaryRepresentation()
    dictionary.keys.forEach { key in
        let o = defaults.object(forKey: key) ?? "undefined"
        userDefaults.append("\(key): \(o)")
    }
}

@available(iOS 13.0, *)
struct Debugger: View {
    init() {
        update()
    }
    
    var body: some View {
        NavigationView {
            VStack {
                Button("Update", action: {
                    update()
                })
                    .buttonStyle(GenericButtonStyle())
                
                List {
                    ForEach(userDefaults, id: \.self) { item in
                        Text(item)
                    }
                }
                
                
                Button("Reset and Quit", action: {
                    reset()
                })
                    .buttonStyle(GenericButtonStyle())
            }
            .navigationBarTitle("Debugger")
        }
    }
}

@available(iOS 13.0.0, *)
struct Debugger_Previews: PreviewProvider {
    static var previews: some View {
        Debugger()
    }
}

#endif
