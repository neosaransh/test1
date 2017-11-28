//
//  LoginViewController.swift
//  
//
//  Created by Sam Essery on 2017-07-26.
//
//

import UIKit
import Parse

class LoginViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet var textFieldUserName: UITextField!
    @IBOutlet var textFieldPassword: UITextField!//change to hidden
    @IBOutlet var btnLogIn: UIButton!
    @IBOutlet var btnSignUp: UIButton!
    
    let showHomeSegue = "loginSuccessful"
    let showWelcomeSegue = "loginToWelcome"
    let showSurveySegue = "loginToSurvey"
    
    let medModel = MedimoModel.singleInstance
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        textFieldPassword.delegate = self
        textFieldUserName.delegate = self
        
        //Check if user exists and logged in
        if let user = PFUser.current() {
            if user.isAuthenticated {
                if user[PF_USER_COMPLETED_DEMOGRAPHICS] as! Bool {
                    performSegue(withIdentifier: showHomeSegue, sender: nil)
                } else {
                    performSegue(withIdentifier: showSurveySegue, sender: nil)
                    performSegue(withIdentifier: showWelcomeSegue, sender: nil)
                }
            }
        }


        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func loginPressed(_ sender: UIButton) {
        loginUser()
    }

    @IBAction func signUpTouched(_ sender: UIButton) {
        self.performSegue(withIdentifier: "Security", sender: self)
    }
    
    
    // MARK: Functions
    
    func loginUser() {
        //loginActivityIndicator.startAnimating()
        PFUser.logInWithUsername(inBackground: textFieldUserName.text!, password: textFieldPassword.text!) { user, error in
            if user != nil {
                ParsePushUserAssign()
                
                if user![PF_USER_COMPLETED_DEMOGRAPHICS] as! Bool {
                    self.performSegue(withIdentifier: self.showHomeSegue, sender: nil)
                } else {
                        self.performSegue(withIdentifier: "Mood", sender: self)
                }
            } else if let error = error {
                self.showErrorView(error as NSError)
            }
            //self.loginActivityIndicator.stopAnimating()
        }
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
