//
//  ProfileViewController.swift
//  Medimo
//
//  Created by Sam Essery on 2017-08-08.
//  Copyright © 2017 Sam Essery. All rights reserved.
//

import UIKit

class ProfileViewController: UIViewController {

    @IBOutlet var imgViewProfilePicture: UIImageView!
    @IBOutlet var imgViewGender: UIImageView!
    @IBOutlet var lblName: UILabel!
    @IBOutlet var lblDOB: UILabel!
    @IBOutlet var lblPhysician: UILabel!
    @IBOutlet var lblHeight: UILabel!
    @IBOutlet var lblWeight: UILabel!
    @IBOutlet var lblSmoker: UILabel!
    @IBOutlet var lblEthnicity: UILabel!
    @IBOutlet var lblCigs: UILabel!
    @IBOutlet var lblAlcohol: UILabel!
    @IBOutlet var lblAllergies: UILabel!
    @IBOutlet var lblFamilyHistory: UILabel!
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        DispatchQueue.main.async {
            self.lblName.layer.borderWidth = 2
            self.lblDOB.layer.borderWidth = 2
            self.lblPhysician.layer.borderWidth = 2
            self.lblHeight.layer.borderWidth = 2
            self.lblWeight.layer.borderWidth = 2
            self.lblSmoker.layer.borderWidth = 2
            self.lblEthnicity.layer.borderWidth = 2
            self.lblCigs.layer.borderWidth = 2
            self.lblAlcohol.layer.borderWidth = 2
            
            self.lblName.layer.borderColor = UIColor.blue.cgColor
            self.lblDOB.layer.borderColor = UIColor.blue.cgColor
            self.lblPhysician.layer.borderColor = UIColor.blue.cgColor
            self.lblHeight.layer.borderColor = UIColor.blue.cgColor
            self.lblWeight.layer.borderColor = UIColor.blue.cgColor
            self.lblSmoker.layer.borderColor = UIColor.blue.cgColor
            self.lblEthnicity.layer.borderColor = UIColor.blue.cgColor
            self.lblCigs.layer.borderColor = UIColor.blue.cgColor
            self.lblAlcohol.layer.borderColor = UIColor.blue.cgColor
            
            self.lblName.layer.cornerRadius = 10
            self.lblDOB.layer.cornerRadius = 10
            self.lblPhysician.layer.cornerRadius = 10
            self.lblHeight.layer.cornerRadius = 10
            self.lblWeight.layer.cornerRadius=10
            self.lblSmoker.layer.cornerRadius = 10
            self.lblEthnicity.layer.cornerRadius = 10
            self.lblCigs.layer.cornerRadius = 10
            self.lblAlcohol.layer.cornerRadius = 10
            self.lblAllergies.layer.cornerRadius = 10
            self.lblFamilyHistory.layer.cornerRadius = 10
            
            
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
