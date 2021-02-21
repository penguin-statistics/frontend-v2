//
//  PersistenceManager.swift
//  App
//
//  Created by Galvin Gao on 2021/1/27.
//

import Foundation

class PersistenceManager {
    public static let shared = PersistenceManager()
    
    var values: [Any]
    var namedValues: [String: Any]
    
    init() {
        self.values = []
        self.namedValues = [:]
    }
    
    public func addItem(_ item: Any) {
        self.values.append(item)
    }
    
    public func setItem(_ value: Any, forKey key: String) {
        self.namedValues[key] = value
    }
    
    public func removeItem(_ at: Int) {
        self.values.remove(at: at)
    }
    
    public func getItem(key: String) -> Any {
        return self.namedValues[key] ?? ""
    }
}
