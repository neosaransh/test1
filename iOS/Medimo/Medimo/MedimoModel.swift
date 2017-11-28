//
//  MedimoModel.swift
//  Medimo
//
//  Created by Sam Kent on 2017-07-27.
//  Copyright © 2017 Sam Essery. All rights reserved.
//

import Foundation

class MedimoModel: NSObject {
    
    static let singleInstance = MedimoModel()
    
    var currentMood: Int = 0
    var firstTimeLogin = Bool()
    
    var parseFunctions: ParseFunctions!
    
}
