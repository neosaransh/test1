//
//  SignUpViewController.swift
//  Medimo
//
//  Created by Sam Essery on 2017-07-26.
//  Copyright © 2017 Sam Essery. All rights reserved.
//

import UIKit
import Parse

class SignUpViewController: UIViewController, UITextFieldDelegate {
    @IBOutlet var textFieldFirstName: UITextField!
    @IBOutlet var textFieldLastName: UITextField!
    @IBOutlet var textFieldEmail: UITextField!
    @IBOutlet var textFieldConfirmEmail: UITextField!
    @IBOutlet var textFieldPassword: UITextField!
    @IBOutlet var textFieldPasswordConfirm: UITextField!
    @IBOutlet var segmentControlGender: UISegmentedControl!
    @IBOutlet var datePickerBirthday: UIDatePicker!
    @IBOutlet var btnSignUp: UIButton!
    
    let medModel = MedimoModel.singleInstance
    
    override func viewDidLoad() {
        super.viewDidLoad()

        //registerForKeyboardNotifications()
        
        textFieldFirstName.delegate = self
        textFieldLastName.delegate = self
        textFieldEmail.delegate = self
        textFieldConfirmEmail.delegate = self
        textFieldPassword.delegate = self
        textFieldPasswordConfirm.delegate = self

    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    @IBAction func signUpPressed(_ sender: UIButton) {
        if textFieldFirstName.text!.characters.count == 0 {
            showErrorWithMessage("Enter first name")
        } else if textFieldLastName.text!.characters.count == 0 {
            showErrorWithMessage("Enter last name")
        } else if textFieldEmail.text!.characters.count == 0 {
            showErrorWithMessage("Enter Email")
        } else if textFieldEmail.text != textFieldConfirmEmail.text {
            showErrorWithMessage("Emails do not match")
        } else if segmentControlGender.selectedSegmentIndex < 0 {
            showErrorWithMessage("Select gender")
        } else if textFieldPassword.text!.characters.count < 6 {
            showErrorWithMessage("Password must be at least 6 characters")
        } else if textFieldPassword.text != textFieldPasswordConfirm.text {
            showErrorWithMessage("Passwords do not match")
        } else {
            let user = PFUser()
            let lastName = textFieldLastName.text
            let firstName = textFieldFirstName.text
            let genderMale = segmentControlGender.selectedSegmentIndex == 0
            let birthDay = datePickerBirthday.date
            
            user.username = textFieldEmail.text
            user.email = textFieldEmail.text
            user.password = textFieldPassword.text
            
            //signupActivityIndicator.startAnimating()
            user.signUpInBackground { succeeded, error in
                if succeeded {
                    self.medModel.parseFunctions.ParsePushUserAssign()
                    
                    // Set user privacy
                    let acl = PFACL(user: user)
                    acl.setReadAccess(true, forRoleWithName: PF_ROLE_ADMIN_NAME)
                    user.acl = acl
                    
                    user[PF_USER_FIRST_NAME] = firstName
                    user[PF_USER_LAST_NAME] = lastName
                    user[PF_USER_GENDER_MALE] = genderMale
                    user[PF_USER_BIRTHDAY] = birthDay
                    user[PF_USER_COMPLETED_DEMOGRAPHICS] = false
                    
                    user[PF_USER_CURRENT_MOOD] = 2
                    
                    user.saveEventually()
                    
                    //The registration was successful, go to welcome
                    self.performSegue(withIdentifier: "Mood", sender: self)
                } else if let error = error {
                    //Something bad has occurred
                    self.showErrorView(error as NSError)
                }
                //self.signupActivityIndicator.stopAnimating()
            }
        }
    }

}
