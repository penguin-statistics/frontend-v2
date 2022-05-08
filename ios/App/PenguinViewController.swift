//
//  PenguinViewController.swift
//  App
//
//  Created by Galvin Gao on 2022/5/4.
//

import Foundation
import Capacitor
import UIKit

class PenguinViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
    }
}

extension UIImagePickerController {
     open override func viewDidLoad() {
         super.viewDidLoad()
         self.sourceType = .photoLibrary
         self.modalPresentationStyle = .popover
     }
}
