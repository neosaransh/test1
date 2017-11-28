//
//  Constants.swift
//  ModoMe
//
//  Created by Jeremy Eichhorn on 2015-08-27.
//  Copyright (c) 2015 Medmodo. All rights reserved.
//

import Foundation
import UIKit

let messagesToLoad = 20
var showMessagePending = false

var lastUserMood = 0

var lastCompletedGoalDate = Date(timeIntervalSince1970: 0)

let initialMessages: [String] = [
    "Hello there!",
    "Welcome to Medimo!",
    "Our staff’s top priority is to help maintain your health based on your feedback!",
    "To start off, is there anything you’d like to tell us?" ]


let PF_ROLE_NAME = "name"
let PF_ROLE_ADMIN_NAME = "admin"

let PF_INSTALLATION_USER = "user"

let PF_USER_FIRST_NAME = "firstName"
let PF_USER_LAST_NAME = "lastName"
let PF_USER_GENDER_MALE = "genderMale"
let PF_USER_BIRTHDAY = "birthDay"
let PF_USER_PROFILE_ITEMS = "profileItems"
let PF_USER_MY_GOALS = "myGoals"
let PF_USER_COMPLETED_DEMOGRAPHICS = "completedDemographics"
let PF_USER_CURRENT_MOOD = "currentMood"

let PF_USER_HEIGHT = "height"
let PF_USER_WEIGHT = "weight"
let PF_USER_ETHNICITY = "ethnicity"
let PF_USER_DOES_SMOKE = "doesSmoke"
let PF_USER_CIGS_PER_WEEK = "cigsPerWeek"
let PF_USER_YEARS_SMOKED = "yearsSmoked"
let PF_USER_ALC_PER_WEEK = "alcPerWeek"
let PF_USER_FAMILY_HISTORY = "familyHistory"
let PF_USER_ALLERGIES = "allergies"


let PF_MESSAGE_CLASS_NAME = "Message"
let PF_MESSAGE_FOR_USER = "forUser"
let PF_MESSAGE_SENDER = "sender"
let PF_MESSAGE_TEXT = "text"
let PF_MESSAGE_CREATED_AT = "createdAt"

let PF_GOAL_CLASS_NAME = "Goal"
let PF_GOAL_USER = "user"
let PF_GOAL_TEXT = "text"
let PF_GOAL_CREATED_AT = "createdAt"

let PF_HISTORY_CLASS_NAME = "History"
let PF_HISTORY_USER = "user"
let PF_HISTORY_TYPE = "type"
let PF_HISTORY_INT = "number"
let PF_HISTORY_TEXT = "text"
let PF_HISTORY_CREATED_AT = "createdAt"

enum HistoryType: Int {
    case mood
    case goal
    case height
    case weight
    case cigsPerWeek
    case alcPerWeek
}
