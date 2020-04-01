pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('build-client') {
            steps {
                //sh 'npm --version'
                dir("${env.WORKSPACE}/client"){
//                    sh "pwd"
                    sh "rm -fr node_modules"
                    sh "node --version"
                    sh "npm --version"
                    sh "npm cache clean --force"
                    sh "npm install"
                }
                dir("${env.WORKSPACE}/server"){
  //                  sh "pwd"
                   // sh "npm cache clean --force"
                 //   sh "npm install"
                }
            }
        }
        /*
        stage('build-server') {
            steps {
                sh 'cd server'
                sh 'npm install'
            }
        }
        */
    }
}