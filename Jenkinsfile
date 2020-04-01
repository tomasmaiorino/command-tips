pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('build-client') {
            steps {
                //sh 'npm --version'
                dir("${env.WORKSPACE}/client"){
                    sh "npm install --no-package-lock"
                }
                dir("${env.WORKSPACE}/server"){
                    sh "npm install --no-package-lock"
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