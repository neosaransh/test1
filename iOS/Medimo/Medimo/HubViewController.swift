//
//  HubViewController.swift
//  Medimo
//
//  Created by Sam Essery on 2017-07-27.
//  Copyright © 2017 Sam Essery. All rights reserved.
//

import UIKit
import Parse

class HubViewController: UIViewController {
    //put label on top of message bubble
    
    @IBOutlet var labelMood: UILabel!
    @IBOutlet var imageViewMood: UIImageView!
    @IBOutlet var imageViewPatient: UIImageView!
    @IBOutlet var imageViewGoals: UIImageView!
    @IBOutlet var imageViewSettings: UIImageView!
    @IBOutlet var imageViewMediPedia: UIImageView!
    @IBOutlet var imageViewMessageNotification: UIImageView!
    @IBOutlet var labelNotifications: UILabel!
    @IBOutlet var imageViewGoalNotification: UIImageView!
    
    @IBOutlet var labelLastMessage: UILabel!
    @IBOutlet var labelGoalNotifications: UILabel!
    var messageNotifs = 0
    var goalNotifs = 0
    
    var setToReply = false
    var setToOffline = true
    
    var lastMessageDate: Date!
    var lastGoalDate = Date(timeIntervalSince1970: 0)
    
    var messagesIsLoading = false
    var suggestedGoalsIsLoading = false
    var userIsLoading = false
    var historyDataIsLoading = false
    
    var historyDataPinned = false
    
    var timer: Timer!
    
    var user: PFUser! = PFUser.current()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        timer.invalidate()
    }
    
    func setMood() {
        let mood = 0 // Change this and everything becomes executable
        switch (mood){
        case 0:
            break
        case 1:
            imageViewMood.image = #imageLiteral(resourceName: "Mood Face 1")
            break
        case 2:
            imageViewMood.image = #imageLiteral(resourceName: "Mood Face 2")
            break
        case 3:
            imageViewMood.image = #imageLiteral(resourceName: "Mood Face 3")
            break
        case 4:
            imageViewMood.image = #imageLiteral(resourceName: "Mood Face 4")
            break
        case 5:
            imageViewMood.image = #imageLiteral(resourceName: "Mood Face 5")
            break
        default:
            break
        }
    }
    
    func reloadView() {
        if messageNotifs > 0 {
            labelNotifications.text = (messageNotifs < 10 ? "\(messageNotifs)" : "9+")
            imageViewMessageNotification.isHidden = false
            labelNotifications.isHidden = false
        } else {
            imageViewMessageNotification.isHidden = true
            labelNotifications .isHidden = true
        }
        
        if goalNotifs > 0 {
            labelGoalNotifications.text = (goalNotifs < 10 ? "\(goalNotifs)" : "9+")
            imageViewGoalNotification.isHidden = false
            labelGoalNotifications.isHidden = false
        } else {
            imageViewGoalNotification.isHidden = true
            labelGoalNotifications.isHidden = true
        }
        
        if setToReply {
            labelMood.text = "Reply"
        } else {
            labelMood.text = "View Messages"
        }
        
        if setToOffline {
            labelMood.text! += " (Offline)"
        }
    }
    func loadInitialMessages() {
        messagesIsLoading = true
        
        if user.isAuthenticated {
            let query = PFQuery(className: PF_MESSAGE_CLASS_NAME)
            query.whereKey(PF_MESSAGE_FOR_USER, equalTo: user)
            query.order(byDescending: PF_MESSAGE_CREATED_AT)
            query.limit = 1
            query.fromLocalDatastore()
            
            query.findObjectsInBackground { objects, error in
                if let lastMessage = objects!.last as PFObject! {
                    let sender = lastMessage[PF_MESSAGE_SENDER] as? PFUser
                    
                    let messageText = lastMessage[PF_MESSAGE_TEXT] as! String
                    
                    self.lastMessageDate = lastMessage.createdAt
                    
                    if sender == self.user {
                        self.labelLastMessage.text = "Me: " + messageText
                        self.setToReply = false
                    } else {
                        self.labelLastMessage.text = "Medi: " + messageText
                        self.setToReply = true
                    }
                    
                    self.reloadView()
                    self.view.setNeedsDisplay()
                }
                self.messagesIsLoading = false
                self.loadData()
            }
            
            user.fetchInBackground()
        }
    }
    
    func loadInitialGoals() {
        suggestedGoalsIsLoading = true
        
        if user.isAuthenticated {
            let query = PFQuery(className: PF_GOAL_CLASS_NAME)
            query.whereKey(PF_GOAL_USER, equalTo: user)
            query.order(byDescending: PF_GOAL_CREATED_AT)
            query.limit = 1
            query.fromLocalDatastore()
            
            query.findObjectsInBackground { objects, error in
                if let lastGoal = objects!.last as PFObject! {
                    self.lastGoalDate = lastGoal.createdAt!
                    
                    self.reloadView()
                    self.view.setNeedsDisplay()
                }
                
                self.suggestedGoalsIsLoading = false
                self.loadData()
            }
        }
    }
    
    func loadData() {
        loadMessages()
        
        loadUser()
        
        loadSuggestedGoals()
        
        if !historyDataPinned {
            loadHistoryData()
        }
    }
    
    func loadMessages() {
        if !messagesIsLoading {
            messagesIsLoading = true
            
            let query = PFQuery(className: PF_MESSAGE_CLASS_NAME)
            query.whereKey(PF_MESSAGE_FOR_USER, equalTo: user)
            
            if lastMessageDate != nil {
                query.whereKey(PF_MESSAGE_CREATED_AT, greaterThan: lastMessageDate)
                query.limit = 10
            } else {
                query.limit = messagesToLoad
            }
            
            query.order(byDescending: PF_MESSAGE_CREATED_AT)
            
            let prevOffline = setToOffline
            
            query.findObjectsInBackground { objects, error in
                var reload = false
                
                if error == nil {
                    let messages = objects as! [PFObject]
                    
                    if messages.count > 0 {
                        let lastMessage = messages.first![PF_MESSAGE_TEXT] as! String
                        let sender = messages.first![PF_MESSAGE_SENDER] as? PFUser
                        
                        if sender == self.user {
                            self.messageText.text = "Me: " + lastMessage
                            self.setToReply = false
                        } else {
                            self.messageText.text = "Medi: " + lastMessage
                            self.setToReply = true
                        }
                        
                        PFObject.pinAll(inBackground: messages)
                        
                        if self.lastMessageDate == nil {
                            self.messageNotifs = 0
                        } else {
                            for _ in messages {
                                if self.user != sender {
                                    self.messageNotifs += 1
                                }
                            }
                        }
                        
                        reload = true
                        self.lastMessageDate = messages.first!.createdAt
                    }
                    self.setToOffline = false
                } else {
                    self.setToOffline = true
                }
                
                if self.setToOffline != prevOffline || reload {
                    self.reloadView()
                    self.view.setNeedsDisplay()
                }
                
                self.messagesIsLoading = false
            }
        }
    }
    
    func loadSuggestedGoals() {
        if !suggestedGoalsIsLoading {
            suggestedGoalsIsLoading = true
            
            let query = PFQuery(className: PF_GOAL_CLASS_NAME)
            
            if lastGoalDate.compare(lastCompletedGoalDate as Date) == .orderedAscending {
                query.whereKey(PF_GOAL_CREATED_AT, greaterThan: lastCompletedGoalDate)
            } else {
                query.whereKey(PF_GOAL_CREATED_AT, greaterThan: lastGoalDate)
            }
            query.whereKey(PF_GOAL_USER, equalTo: user)
            query.order(byDescending: PF_GOAL_CREATED_AT)
            
            query.findObjectsInBackground { objects, error in
                if error == nil {
                    let goals = objects as! [PFObject]
                    
                    if goals.count > 0 {
                        PFObject.pinAll(inBackground: goals)
                        
                        self.lastGoalDate = goals.first!.createdAt!
                        
                        if self.lastMessageDate == nil {
                            self.goalNotifs = 0
                        } else {
                            self.goalNotifs += goals.count
                        }
                        
                        self.reloadView()
                        self.view.setNeedsDisplay()
                    }
                }
                
                self.suggestedGoalsIsLoading = false
            }
        }
    }
    
    func loadUser() {
        user.fetchIfNeededInBackground { object, error in
            self.user.pinInBackground()
        }
    }
    
    func loadHistoryData() {
        if !historyDataIsLoading {
            historyDataIsLoading = true
            let testQuery = PFQuery(className: PF_HISTORY_CLASS_NAME)
            testQuery.whereKey(PF_HISTORY_USER, equalTo: user)
            testQuery.limit = 1
            testQuery.fromLocalDatastore()
            
            testQuery.findObjectsInBackground { objects, error in
                if let data = objects as? [PFObject] {
                    if data.count == 0 {
                        self.pinHistoryData(Date())
                    } else {
                        self.historyDataPinned = true
                    }
                }
            }
        }
    }
    
    func pinHistoryData(_ lastDatePinned: Date) {
        let query = PFQuery(className: PF_HISTORY_CLASS_NAME)
        query.whereKey(PF_HISTORY_USER, equalTo: self.user)
        query.whereKey(PF_HISTORY_CREATED_AT, lessThan: lastDatePinned)
        query.order(byDescending: PF_HISTORY_CREATED_AT)
        query.limit = 100
        
        query.findObjectsInBackground { objects, error in
            if error == nil {
                let data = objects as? [PFObject]
                
                PFObject.pinAll(inBackground: data, block: { succeeded, error in
                    if succeeded {
                        if data!.count >= 100 {
                            if let lastObject = data!.last {
                                self.pinHistoryData(lastObject.createdAt!)
                            }
                        } else {
                            self.historyDataPinned = true
                            self.historyDataIsLoading = false
                        }
                    } else {
                        self.historyDataIsLoading = false
                    }
                })
            } else {
                self.historyDataIsLoading = false
            }
        }
        
    }
    
}
