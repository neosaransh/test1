//
//  ParseFunctions.swift
//  Medimo
//
//  Created by Sam Kent on 2017-07-27.
//  Copyright © 2017 Sam Essery. All rights reserved.
//

import Foundation
import Parse

class ParseFunctions: NSObject {
    
    let medModel = MedimoModel.singleInstance
    
    func pushMoodToParse(mood: Int) {
        if PFUser.current() != nil {
            let user = PFUser()
            user[PF_USER_CURRENT_MOOD] = mood
            user.saveInBackground()
        }else {
            //error
        }
    }
    
    func pullUserProfileInformation() {
        let user: PFUser! = PFUser.current()
        let query = PFQuery()
        query.whereKey(PF_USER_FIRST_NAME, equalTo: user)
        query.whereKey(PF_USER_LAST_NAME, equalTo: user)
        query.whereKey(PF_USER_BIRTHDAY, equalTo: user)
        query.whereKey(PF_USER_HEIGHT, equalTo: user)
        query.whereKey(PF_USER_WEIGHT, equalTo: user)
        query.whereKey(PF_USER_ETHNICITY, equalTo: user )
        query.whereKey(PF_USER_ALLERGIES, equalTo: user)
        query.whereKey(PF_USER_FAMILY_HISTORY, equalTo: user)
        query.whereKey(PF_USER_ALC_PER_WEEK, equalTo: user)
        query.whereKey(PF_USER_DOES_SMOKE, equalTo: user)
        query.whereKey(PF_USER_CIGS_PER_WEEK, equalTo: user)
        
        
        
    }
    
    func ParsePushUserAssign() {
        var installation = PFInstallation.current()
        installation?[PF_INSTALLATION_USER] = PFUser.current()
        installation?.saveEventually()
    }
    
    func ParsePushUserResign() {
        let installation = PFInstallation.current()
        installation?.remove(forKey: PF_INSTALLATION_USER)
        installation?.saveEventually()
    }
    
    func SendNotifToAdmin(_ text: String) {
        let user: PFUser! = PFUser.current()
        
        let firstName = user[PF_USER_FIRST_NAME] as! String
        let lastName = user[PF_USER_LAST_NAME] as! String
        let message = "\(firstName) \(lastName): " + text
        
        let roleQuery: PFQuery! = PFRole.query()
        
        roleQuery.whereKey(PF_ROLE_NAME, equalTo: PF_ROLE_ADMIN_NAME)
        roleQuery.limit = 1
        
        roleQuery.findObjectsInBackground { objects, error in
            if error == nil {
                let adminRole = objects!.first as! PFRole
                let adminRelations: PFRelation = adminRole.users
                
                let adminQuery: PFQuery! = adminRelations.query()
                
                adminQuery.findObjectsInBackground { objects, error in
                    if error == nil {
                        let admins = objects as! [PFUser]
                        
                        let queryInstallation: PFQuery! = PFInstallation.query()
                        queryInstallation.whereKey(PF_INSTALLATION_USER, containedIn: admins)
                        
                        
                        let data = [
                            "alert" : message,
                            "badge" : "Increment",
                            ]
                        
                        let push = PFPush()
                        push.setData(data)
                        push.setQuery(queryInstallation)
                        
                        push.sendInBackground()
                    }
                }
            }
        }
    }
}
