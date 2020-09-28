//
//  PenguinPlugin.swift
//  App
//
//  Created by Galvin Gao on 2020/9/28.
//

import Capacitor

@objc(PenguinPlugin)
public class PenguinPlugin: CAPPlugin {
  @objc func echo(_ call: CAPPluginCall) {
    let value = call.getString("value") ?? ""
    call.success([
        "value": value
    ])
  }
}
