pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('build-client') {
            steps {
                //sh 'npm --version'
                dir("${env.WORKSPACE}/client"){
                    sh "npm install"
                }
                dir("${env.WORKSPACE}/server"){
                    sh "npm install"
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