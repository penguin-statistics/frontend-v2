//
//  EventBus.swift
//  App
//
//  Created by Galvin Gao on 2021/1/5.
//

import Foundation
import RxBus
import RxSwift

//protocol MyEncodable: Encodable {
//    func toJSONData() -> Data
//}
//
//extension MyEncodable {
//    func toJSONData() -> Data{ try? JSONEncoder().encode(self) }
//}

struct Events {
    struct NetworkPathChanged: BusEvent, Encodable {
        let isConstrained: Bool
        let isIPv4Supported: Bool
        let isIPv6Supported: Bool
    }
}
