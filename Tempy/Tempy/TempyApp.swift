//
//  TempyApp.swift
//  Tempy
//
//  Created by Romanos Hiliarhopoulos on 18/12/24.
//

import SwiftUI
import Firebase

@main
struct TempyApp: App {
    init(){
        FirebaseApp.configure()
        print("Configured Firebase")
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
            
        }
    }
}
