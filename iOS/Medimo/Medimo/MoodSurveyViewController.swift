//
//  MoodSurveyViewController.swift
//  Medimo
//
//  Created by Sam Essery on 2017-07-27.
//  Copyright © 2017 Sam Essery. All rights reserved.
//

import UIKit

class MoodSurveyViewController: UIViewController {
    
    @IBOutlet weak var imageViewFace1: UIImageView!
    @IBOutlet weak var imageViewFace2: UIImageView!
    @IBOutlet weak var imageViewFace3: UIImageView!
    @IBOutlet weak var imageViewFace4: UIImageView!
    @IBOutlet weak var imageViewFace5: UIImageView!
    @IBOutlet var labelQuestion: UILabel!
    @IBOutlet var btnSubmit: UIButton!

    let gestureFaceOne = UITapGestureRecognizer()
    let gestureFaceTwo = UITapGestureRecognizer()
    let gestureFaceThree = UITapGestureRecognizer()
    let gestureFaceFour = UITapGestureRecognizer()
    let gestureFaceFive = UITapGestureRecognizer()
    
    var mood: Int = 0
    let medModel = MedimoModel.singleInstance
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        gestureFaceOne.addTarget(self, action: "selectFaceOne")
        imageViewFace1.addGestureRecognizer(gestureFaceOne)
        
        gestureFaceTwo.addTarget(self, action: "selectFaceTwo")
        imageViewFace2.addGestureRecognizer(gestureFaceTwo)
        
        gestureFaceThree.addTarget(self, action: "selectFaceThree")
        imageViewFace3.addGestureRecognizer(gestureFaceThree)
        
        gestureFaceFour.addTarget(self, action: "selectFaceFour")
        imageViewFace4.addGestureRecognizer(gestureFaceFour)
        
        gestureFaceFive.addTarget(self, action: "selectFaceFive")
        imageViewFace5.addGestureRecognizer(gestureFaceFive)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func selectFaceOne(){
        
        let imageOne = UIImage(named: "images/FACE 1.png")
        // Change highlight
        mood = 1
        //highlight image
        gestureFaceOne.image = UIImage(named: "FACE 1.png")
        gestureFaceOne.image = imageOne
        //very sad
    }
    
    func selectFaceTwo(){
        
        let imageTwo = UIImage(named: "images/FACE 2.png")
        mood = 2
        //highlight image
        gestureFaceTwo.image = UIImage(named: "FACE 2.png")
        gestureFaceTwo.image = imageTwo
        //sad
    }
    
    func selectFaceThree(){
        
        let imageThree = UIImage(named: "images/FACE 3.png")
        mood = 3
        //highlight image
        gestureFaceThree.image = UIImage(named: "FACE 3.png")
        gestureFaceThree.image = imageThree
        //neutral
    }
    
    func selectFaceFour(){
        
        let imageFour = UIImage(named: "images/FACE 4.png")
        mood = 4
        //highlight image
        gestureFaceFour.image = UIImage(named: "FACE 4.png")
        gestureFaceFour.image = imageFour
        //happy
    }
    
    func selectFaceFive(){
        
        let imageFive = UIImage(named: "images/FACE 5.png")
        mood = 5
        //highlight image
        gestureFaceFive.image = UIImage(named: "FACE 5.png")
        gestureFaceFive.image = imageFive
        //very happy
    }

    @IBAction func submitBtnTouched(_ sender: UIButton) {
        medModel.parseFunctions.pushMoodToParse(mood: mood)
        self.performSegue(withIdentifier: "Hub", sender: self)
    }
    
}

