//
//  PasswordResetViewController.swift
//  Medimo
//
//  Created by Sam Essery on 2017-07-27.
//  Copyright © 2017 Sam Essery. All rights reserved.
//

import UIKit
import Parse

class PasswordResetViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet var textFieldEmail: UITextField!
    @IBOutlet var btnPasswordReset: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        textFieldEmail.delegate = self
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func btnResetTouched(_ sender: UIButton) {
        submitUser()
    }
    func submitUser() {
        //activityIndicator.startAnimating()
        
        PFUser.requestPasswordResetForEmail(inBackground: textFieldEmail.text!, block: { succeeded, error in
            //self.activityIndicator.stopAnimating()
            
            if succeeded {
                let alert = UIAlertController(title: "Email Sent", message: "A password reset email has been sent. Please check your spam inbox if you cannot find the email.", preferredStyle: UIAlertControllerStyle.alert)
                alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: nil))
                self.present(alert, animated: true, completion: {
                    self.navigationController?.popViewController(animated: true)
                })
            } else {
                if let error = error {
                    self.showErrorView(error as NSError)
                }
            }
        })
    }

}
